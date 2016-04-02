require("./lib/globals");

var express = require("express"),

	controllers = include("controllers"),
	config = include("config");

var app = express();

controllers(app);

app.get('/', function (req, res) {
  res.render('signin');
})

app.listen(config.server.port, function () {
	console.log("Listening on " + config.server.port + "...");
});
