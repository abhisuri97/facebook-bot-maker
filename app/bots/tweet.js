var Twitter = require('twitter');
var User = require('../models/user');
var config =   
  {
      'consumerKey'       : 'xzWiUTlSulJAlfnMbI16X60Wk',
      'consumerSecret'    : 'pEKMP5ZuNHPuoPF44xLC1IBkgUvFLosZPsSAPVD1XJhFnXwTpd',
      'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
  }

module.exports = function (message, cb, req) {
  var client = new Twitter({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token_key: req.user.twitter.token,
    access_token_secret: req.user.twitter.tokenSecret
  })
  console.log(config.consumerKey);
  console.log(config.consumerSecret);
  console.log(req.user.twitter.token);
  console.log(req.user.twitter.tokenSecret);
  client.post('statuses/update', {status: message}, function(error, tweet, response) {
    if (error) {
      console.log(error);
    } else {
      cb('Success',response);
      console.log(response)
    }
  });
}