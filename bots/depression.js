var watson = require('watson-developer-cloud');
var config = require('../config.json');

var alchemy_language = watson.alchemy_language({
  api_key: config.alchemy
});

var params = {};

module.exports = function (data, cb) {
  params.text = data;
  alchemy_language.sentiment(params, function (err, response) {
  if (err)
    console.log('error:', err);
  else
    console.log(response);
    var score = response.docSentiment.score;
    //var type = response.docSentiment.type;
    if (score < -0.5) {
      cb('Our semantic analysis has concluded that your previous messages are somewhat negative in nature.');
    } else if (score > 0.5) {
      cb('Our semantic analysis has concluded that your previous messages are mostly positive in nature.');
    } else {
      cb('Our semantic analysis has concluded that your previous messages are neutral in nature.');
    }
});
}