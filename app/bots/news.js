var GoogleNews, googleNews, track;

var GoogleNews = require('google-news');
var googleNews = new GoogleNews({
  pollInterval: Number.MAX_VALUE
});

module.exports = function(query, cb) {
  googleNews.stream(query, function(stream) {
    stream.once(GoogleNews.DATA, function(data) {
      cb(data);
    });
  });
};
