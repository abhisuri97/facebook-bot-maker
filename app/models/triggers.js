var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
// trigger: 
// If _____ then...
// if trigger type is text then we only need the string to match with
// if trigger type is web then we need to do more specifications: 
// execute a script 
// 
var triggerSchema = mongoose.Schema({
  name      : String,
  call      : String,    
  desc      : String,
  type      : String, // chat or web
  params    : String  // parameters i.e. /cmd-name :param1 :param2 or a script to execute
});

module.exports = mongoose.model('Trigger', triggerSchema);