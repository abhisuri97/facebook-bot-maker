// Simple echo bot. He'll repeat anything that you say. 
// Will stop when you say '/stop' 
var config = require('./config.json');
var login = require('facebook-chat-api');
var express = require('express');
var Flutter = require('flutter');
var Twitter = require('twitter');
 
login({email: config.username, password: "hackprinceton"}, function callback (err, api) {
    if(err) return console.error(err);
 
    api.setOptions({listenEvents: true});

    var client = new Twitter({
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
      access_token_key: '716080817836072960-NT3HVHLPMzvcVWhLWhid85nUn86HWl2',
      access_token_secret: 'SbcjlL2uYeLL0kdFyTdoICJznVhNIEtjz8ZoB3blb6wQQ'
    });
 
    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);
 
        switch(event.type) {
          case "message":

            if (event.body.startsWith('/twitter-status:')) {

              var status = event.body.split(':')[1];

              client.post('statuses/update', {status: status}, function(error, tweet, response) {
              if (error) {
                console.log(error);
              } else {
                api.sendMessage("sent: " + status, event.threadID);
              }
                //console.log(tweet);  // Tweet body. 
                //console.log(response);  // Raw response object. 
              });

            }
            api.markAsRead(event.threadID, function(err) {
              if(err) console.log(err);
            });
            api.sendMessage("TEST BOT: " + event.body, event.threadID);
            break;

          /*
          case "event":
            console.log(event);
            break;
          */
        }
    });
});