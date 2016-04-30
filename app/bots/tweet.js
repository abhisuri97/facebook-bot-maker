var Twitter = require(twitter);
var User = require('../models/user');
var config =  require('../../config/auth')

module.exports = function (message, cb, req) {
  var client = new Twitter({
    consumer_key: config.twitterAuth.consumerKey,
    consumer_secret: config.twitterAuth.consumerSecret,
    access_token_key: req.user.twitter.token,
    access_token_secret: req.user.twitter.tokenSecret
  })
  client.post('statuses/update', {status: message}, function (error, tweet, response) {
    if (error) {
      console.log(error);
    } else {
      cb('Success',response);
    }
  });
}