var GoogleNews, googleNews, track;

var GoogleNews = require('google-news');
var googleNews = new GoogleNews();

module.exports = function (query, cb) {
  googleNews.stream(query, function (stream, err) {
    cb(null, err);
    stream.once(GoogleNews.DATA, function (data) {
      cb(data);
    });
  });
};
