var Twitter = require('node-twitter-api');
var secret = require('./secret.json');
var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

var twitter = new Twitter({
  consumerKey: secret.twitter.consumer_key,
  consumerSecret: secret.twitter.consumer_secret,
  callback: secret.twitter.callback_URL
});

var _requestSecret;
app.get('/request-token', function(req, res) {
  twitter.getRequestToken(function(err, requestToken, requestSecret) {
    if (err) {
    } else {
      _requestSecret = requestSecret;
      res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
    }
  });
});

app.get("/access-token", function(req, res) {
  var requestToken = req.query.oauth_token;
  var verifier = req.query.oauth_verifier;

  twitter.getAccessToken(requestToken, _requestSecret, verifier, function(err, accessToken, accessSecret) {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log("access: " + accessToken);
      console.log("secret: " + accessSecret);
      twitter.verifyCredentials(accessToken, accessSecret, function(err, user) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(user);
        }
      });
    }
  });
});

app.get('/redir', function(req, res) {
  res.render('home', {
    appName: 'This is my App'
  });
});

app.get('/', function(req, res) {
  res.render('signin');
})

app.set('port', process.env.PORT || 3000);



var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d', server.address().port);
});