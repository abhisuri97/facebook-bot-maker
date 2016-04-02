// Simple echo bot. He'll repeat anything that you say. 
// Will stop when you say '/stop' 
var config = require('./config.json');
var login = require("facebook-chat-api");
 
login({email: config.username, password: "hackprinceton"}, function callback (err, api) {
    if(err) return console.error(err);
 
    api.setOptions({listenEvents: true});
 
    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);
 
        switch(event.type) {
          case "message":
            if(event.body === '/tweet') {
              api.sendMessage("Goodbye...", event.threadID);
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