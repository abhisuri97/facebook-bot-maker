var User = require('../app/models/user');

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
    res.render('profile.ejs', {
      user: req.user
    });
  });

  // app.get('/add-trigger', isLoggedIn, function(req, res) {
  //   res.render('addmodule.ejs', {
  //     user: req.user,
  //     message: req.flash('triggerMessage'),
  //     success: req.flash('triggerMessageSuccess')
  //   });
  // });

  // app.post('/add-trigger', isLoggedIn, function(req, res) {
  //   trigger(req, req.body, function(err, pass, trigger) {
  //     if (err || (pass === false)) {
  //       res.redirect('/add-trigger');
  //     } else {
  //       res.redirect('/add-trigger');
  //     }
  //   });
  // });


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
  

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) 
    return next();

  res.redirect('/');
}