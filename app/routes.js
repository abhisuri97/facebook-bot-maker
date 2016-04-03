var User = require('../app/models/user');
var Recipe = require('../app/models/recipes');
var login = require('facebook-chat-api');
var weatherBot = require('./bots/weather');
var newsBot = require('./bots/news');
var depressionBot = require('./bots/depression');
var request = require('request');
var http = require('http');
var async = require('async');

module.exports = function(app, passport, trigger) {
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    var common = [];
    var recipesList = [];
    Recipe.find({}, function(err, recipes) {
      recipes.forEach(function(recipe) {
        var used = false;
        req.user.facebook.bots.forEach(function(bot){
          console.log(String(recipe._id), String(bot));
          if(String(recipe._id) === bot) {
            if(common.indexOf(recipe._id) < 0) {
              var id = recipe._id;
              var name = recipe.name;
              var desc = recipe.desc;
              var usage = recipe.call + ' ' + recipe.params;
              common.push({id, name, desc, usage});
              used = true
            }
          }
        })
        var id = recipe._id;
        var name = recipe.name;
        var desc = recipe.desc;
        var usage = recipe.call + ' ' + recipe.params;
        recipesList.push({id, name, desc, usage, used})
      })
      res.render('profile.ejs', {
        user: req.user,
        bots: recipesList,
        common: common
      })
    })
  });

  app.get('/add-action', isLoggedIn, function(req, res) {
    res.render('addaction.ejs', {
      user: req.user,
      message: req.flash('triggerMessage'),
      success: req.flash('triggerMessageSuccess')
    });
  });

  app.post('/add-action', isLoggedIn, function(req, res) {
    trigger(req, req.body, function(err, pass, trigger) {
      if (err || (pass === false)) {
        res.redirect('/add-action');
      } else {
        res.redirect('/add-action');
      }
    });
  });

  app.get('/add-bot/:number', isLoggedIn, function(req, res) {
    User.findOne({
      'facebook.email' : req.user.facebook.email
    }, function(err, user) {
      if(err) {
        console.log(err);
        res.redirect('/profile');
      }
      var temp = user.facebook.bots;
      user.facebook.bots.push(req.params.number);
      user.save(function(err) {
        if(err) {
          res.redirect('/profile');
        }
        res.redirect('/profile')
      });
    })
  });
  app.get('/remove-bot/:number', isLoggedIn, function(req, res) {
    User.findOne({
      'facebook.email' : req.user.facebook.email
    }, function(err, user) {
      if(err) {
        console.log(err);
        res.redirect('/profile');
      }
      user.facebook.bots.pull(req.params.number)
      user.save(function(err) {
        if(err) {
          res.redirect('/profile');
        }
        res.redirect('/profile')
      });
    })
  });
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {scope : ['email'] }));

  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
      passport.authenticate('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/'
      }));
  app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
  app.get('/connect/twitter/callback',
    passport.authorize('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));
  app.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });


  app.post('/signup', function(req, res) {
    User.findOne({
      'facebook.email' : req.body.email
    }, function(err, user) {
      console.log(req.body.email)
      if(err || !user) {
        return res.redirect('/signup')
      }
      console.log(user);
      console.log(req.body.password);
      user.facebook.password = req.body.password;
      user.save(function(err) {
          if(err)  {
            return res.redirect('/');
          }
          else {
            return res.redirect('/profile');
          }
      });
    });
  });

  app.get('/start/:id', isLoggedIn, function(req, res) {
    User.findOne({'facebook.id': req.user.facebook.id}, function(err, user) {
      login({email: user.facebook.email, password: user.facebook.password}, function callback(err, api) {
        var depressionText = '';
        if(err) return res.redirect('/profile')
        console.log(user.facebook.email)
          api.setOptions({
            listenEvents: true
           });
        var stopListening = api.listen(function(err, event) {
          if (err) return console.error(err);

          switch (event.type) {
            case "message":
              for(var i = 0; i< user.facebook.bots.length; i++) {
                Recipe.findOne({'_id': user.facebook.bots[i]}, function(err, recipe) {
                  if(event.body.startsWith(recipe.call)) {
                    var params = [];
                    var query = [];
                    if(recipe.params.length >= 1) {
                      params = recipe.params.split(' ');
                      query = event.body.replace(recipe.call + ' ', '').split(' ');
                      console.log(event.body.replace(recipe.call, ''));
                    }
                    console.log('PARAMS:' + params);
                    console.log('QUERY:' + query);
                    var str = recipe.action.split(',');
                    var requestType = str[0];
                    // conditioning the url
                    var url = str[1];
                    url = url.replace('https://', '');
                    url = url.replace('http://', '');
                    url = url.replace('www.', '');
                    
                    url = url.split('/');
                    var host = url[0];
                    //
                    var path = ""
                    for (var i = 1; i < url.length; i++) {
                      if(params.indexOf(url[i].substring(url[i].indexOf('[')+1, url[i].indexOf(']'))) < 0) {
                                                console.log(url[i].substring(url[i].indexOf('['), url[i].indexOf(']')));

                        path += '/' + url[i];
                      } else {
                        console.log('hi');
                        var queryPos = params.indexOf(url[i].substring(url[i].indexOf('[')+1, url[i].indexOf(']')));
                        console.log(queryPos);
                        var rep = url[i].substring(url[i].indexOf('[')+1, url[i].indexOf(']'));
                        var finalString = url[i].replace('[' + rep + ']', query[queryPos]);
                        console.log(finalString);
                        path += '/' + finalString;
                        if (finalString.indexOf('[') > 0 && i < 0) {
                          i--;
                        }
                      }
                    }
                    console.log('PATH:' + path);
                    var spec = str[2];
                    if(url && spec && spec) {
                      if(requestType === 'GET') {
                        http.get({
                          host: host,
                          path: '/' + path,
                        }, function(res) {
                          var body = '';
                          res.on('data', function(d) {
                            body += d;
                          })
                          res.on('end', function() {
                            var parsed = JSON.parse(body);
                            console.log(parsed);
                            function getValues(obj, key) {
                                var objects = [];
                                for (var i in obj) {
                                    if (!obj.hasOwnProperty(i)) continue;
                                    if (typeof obj[i] == 'object') {
                                        objects = objects.concat(getValues(obj[i], key));
                                    } else if (i == key) {
                                        objects.push(obj[i]);
                                    }
                                }
                                return objects;
                            }
                            var results = getValues(parsed, spec);
                            console.log(results);
                            var count = 0;
                            for(var a in results) {
                              if(count <= 10) {
                                api.sendMessage(results[a], event.threadID);
                              } else {
                                api.sendMessage('The stream has been cut since this returned a large amount of data', event.threadID);
                                break;
                              }
                              count++;
                            }
                          });
                        });
                      } else {
                        // post request

                      }
                    }
                  }
                })
              }
              
              if (!event.body.startsWith('/')) {
                depressionText += event.body + ' ';
              }
              if (event.body.startsWith('/weather')) {
                var query = event.body.split(' ')[1];
                weatherBot(query, function (result) {
                  api.sendMessage(result, event.threadID);
                })
              }
              if (event.body.startsWith('/news ')) {
                var query = event.body.split(' ')[1];
                newsBot(query, function (data) {
                  api.sendMessage(data.title, event.threadID);
                })
              }
              if (event.body === '/news') {
                newsBot(null, function (data) {
                  api.sendMessage(data.title, event.threadID);
                })
              }
              if (event.body === '/sentiment') {
                var message = 'Your messages: ' + depressionText + '\n';

                depressionBot(depressionText, function (data) {
                  api.sendMessage(data, event.threadID);
                })
              }
              api.markAsRead(event.threadID, function(err) {
                if (err) console.log(err);
              });
              break;
          }
        });
            });
          });
          return res.redirect('/profile')
  });
  

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/', function(req, res) {
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) 
    return next();

  res.redirect('/');
}