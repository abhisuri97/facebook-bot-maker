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
    try {
      var score = response.docSentiment.score;
    } catch(err) {
      console.log(err);
    }
    if (score < -0.5) {
      cb('Our semantic analysis has concluded that your previous messages are somewhat negative in nature. Score:' + score + '. Values run from -1 (negative) to 1 (positive).');
    } else if (score > 0.5) {
      cb('Our semantic analysis has concluded that your previous messages are mostly positive in nature. Score:' + score + '. Values run from -1 (negative) to 1 (positive).');
    } else {
      cb('Our semantic analysis has concluded that your previous messages are neutral in nature. Score:' + score + '. Values run from -1 (negative) to 1 (positive).');
    }
  });
};