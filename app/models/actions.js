var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
// trigger: 
// If _____ then...
// if trigger type is text then we only need the string to match with
// if trigger type is web then we need to do more specifications: 
// execute a script 
// 
var actionsSchema = mongoose.Schema({
  trigger    : {
    id        : String,
    name      : String,
    type      : String, // chat or web
    action    : String  // parameters i.e. /cmd-name :param1 :param2 or a script to execute
  }
});

module.exports = mongoose.model('Action', actionSchema);