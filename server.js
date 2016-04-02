var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();
// Serve static pages

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home', {
    appName: 'This is my App'
  });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port %d', server.address().port);
});
