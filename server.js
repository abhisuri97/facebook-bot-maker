var express   = require('express');
var app       = express();
var port      = process.env.PORT || 8080;
var mongoose  = require('mongoose');
var passport  = require('passport');
var flash     = require('connect-flash');
var morgan    = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require ('body-parser');
var session = require('express-session');
var login = require('facebook-chat-api')
var configDB = require('./config/database.js');
require('./config/passport')(passport);
var trigger  = require('./config/trigger');
var User = require('./app/models/user');
var Recipe = require('./app/models/recipes');

mongoose.connect(configDB.url);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.set('view engine', 'ejs');

app.use(session({
  secret: 'SECRET'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport, trigger);

app.listen(port);
console.log('ITS HAPPENING (on port ' + port);