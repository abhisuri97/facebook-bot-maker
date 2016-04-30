# facebook-bot-maker
Make all the facebook bots!
![Demo of features](http://i.imgur.com/yfBaONg.png)
This project was created at HackPrinceton 2016 (spring).

#Premise
Currently facebook bots are limited in their functionality in that they can only be used to respond to messages sent by Facebook pages. This project is set up in order to make bots that are **personal bots** i.e. bots that you can use in your group or regular chats. 

These bots are fake accounts that are created by users who wish to have a bot. The bots can be enabled with certain *triggers* which allow users to send a message to a bot (either in regular or group chat) and cause the bot to perform some service. The results from this service are then returned to the user in a form of a message. 

#Set Up
The project can be set up as follows:
- Run `npm install` to install all the dependencies of the project.
- Open `auth.js` and replace all the configuration variables with their appropriate text. This project relies upon Facebook, Twitter, and Watson Alchemy API credentials. Additionally a callback URL is used for OAuth requests. 
- Deploy the application to heroku. Fill in the callback URLs in `auth.js` with the appropriate heroku domain name.
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

#Running the project
- Run `npm start` or `node server.js` to start the project. This sets up an express server running on Port 8080 if on localhost.
- On the index page, log in via OAuth with your fake account
- Add a bot password by clicking the `Add your bot password` button ![Add Password](http://i.imgur.com/mAIPZKw.png)
- **Optional**: Add a twitter account (real account) via OAuth to enable usage of the `/tweet: Message here` command

#Adding Triggers
Triggers enable the bot to look for certain keywords and respond with results you specify on the **Add a Trigger** page. All triggers created on the system are available to all accounts. 
![Add Trigger page](http://i.imgur.com/hW59q9b.png)
- Click on **Add a Trigger**
- Fill in all the appropriate fields
- Click the **Request web URL** to initiate a GET or POST request with a URL to send the request to. Specify parameters within the URL itself and Specify Body parameters to send within the 'Body of Request' field. You can also specify a JSON selector to look for and click the `Test` button to see an example response. **The JSON Selector will parse the entire JSON response and return any values with the key matching your input**. 
- The last field is optional and can be used if you wish append anything to your response.

#Adding Triggers/Bots to your Facebot

- All bots created as triggers can be added to your bot for increased functionality.
- Upon adding a trigger to your bot, you must return to the homepage and add this trigger to your bot. 
- **CLICK THE RESET BOT BUTTON TO UPDATE YOUR BOT/INITIATE YOUR BOT**

#Default Triggers
- `/weather CITY_NAME` will return the weather
- `/news` will return the top news story for Google news
- `/sentiment` will analyze the general mood of the chat
- `/tweet: MESSAGE` will tweet a message to your twitter account linked via OAuth

#Thank you
This was a CIS197 final project for the University of Pennsylvania course on Javascript. Thank you to Jared Winograd for creating the default bots on this system. 
