var weather = require('weather-js');

var parseWeatherData = function (data) {
  data = data[0];
  return 'It is ' + data.current.temperature + ' degrees and ' + data.current.skytext + ' in ' + data.location.name + '.';
};

module.exports = function (query, cb) {
  weather.find({
    search: query,
    degreeType: 'F'
  }, function(err, data) {
    if (err) console.log(err);
    cb(parseWeatherData(data));
  });
};