var User = require('../app/models/user');
var Recipe = require('../app/models/recipes');
var login = require('facebook-chat-api');
var weatherBot = require('./bots/weather');
var newsBot = require('./bots/news');
var depressionBot = require('./bots/depression');

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
        req.user.facebook.bots.forEach(function(bot){
          console.log(String(recipe._id), String(bot));
          if(String(recipe._id) === bot) {
            if(common.indexOf(recipe._id) < 0) {
              var id = recipe._id;
              var name = recipe.name;
              var desc = recipe.desc;
              common.push({id, name, desc});
            }
          }
        })
        var id = recipe._id;
        var name = recipe.name;
        var desc = recipe.desc;
        recipesList.push({id, name, desc})
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

  app.get('/start/:id', function(req, res) {
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

        if (!event.body.startsWith('/')) {
          depressionText += event.body + ' ';
        }
        

        if (event.body.startsWith('/weather:')) {
          var query = event.body.split(':')[1];
          weatherBot(query, function (result) {
            api.sendMessage(result, event.threadID);
          })
        }

        if (event.body.startsWith('/news:')) {
          var query = event.body.split(':')[1];
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