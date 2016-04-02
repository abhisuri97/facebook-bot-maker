var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../app/models/user');

var configAuth = require('./auth');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({
        'local.email' : email
      }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'Email is taken'))
        } else {
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if(err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, email, password, done) {
    User.findOne({ 'local.email' : email }, function(err, user) {
      if (err) 
        return done(err);
      if (!user) 
        return done(null, false, req.flash('loginMessage', 'No User has been found.'));
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Wrong password'));

      return done(null, user);
    });
  }));

  passport.use(new FacebookStrategy ({
    clientID : configAuth.facebookAuth.clientID,
    clientSecret : configAuth.facebookAuth.clientSecret,
    callbackURL : configAuth.facebookAuth.callbackURL,
    passReqToCallback : true,
    profileFields: ['id', 'name', 'photos', 'emails']
  }, 
  function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if(!req.user) {
      User.findOne({ 'facebook.id' : profile.id} , function (err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = token;
          newUser.facebook.name = profile.name.givenName  + ' ' + profile.name.familyName;
          newUser.facebook.email = profile.emails[0].value // facebook can return multiple emails so we'll take the first
          newUser.save(function(err) {
            if(err) 
              throw err;
            return done(null, newUser);
          });
        } 
      });
    } else {
          var user = req.user;
          user.facebook.id = profile.id;
          user.facebook.token = token;
          user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
          user.facebook.email = profile.emails[0].value

          user.save(function(err) {
            if (err)
              throw err;
            return done(null, user);
          });
        }
    });
  }));
};