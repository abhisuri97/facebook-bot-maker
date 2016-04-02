var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

// fb stuff
var config = require('./config.json');
var login = require('facebook-chat-api');

/*
we have a map of string to api call



// bots
var weatherBot = require('./bots/weather');
var newsBot = require('./bots/news');
var depressionBot = require('./bots/depression');

// text collection
var depressionText = '';

login({
  email: config.username,
  password: config.password
}, function callback(err, api) {
  if (err) return console.error(err);

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

        /*
        case "event":
          console.log(event);
          break;
        */
    }
  });
});

app.listen(port);
console.log('ITS HAPPENING (on port ' + port + ')');