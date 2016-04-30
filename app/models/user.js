var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  facebook    : {
    id        : String,
    token     : String,
    email     : String,
    name      : String,
    password  : String,
    bots      : []
  },
  twitter     : {
    id        : String,
    token     : String,
    tokenSecret: String,
    displayName: String,
    username   : String
  }
});

module.exports = mongoose.model('User', userSchema);