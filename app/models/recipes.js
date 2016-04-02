var mongoose = require('mongoose');
// trigger: 
// If _____ then...
// if trigger type is text then we only need the string to match with
// if trigger type is web then we need to do more specifications: 
// execute a script 
// 
var recipeSchema = mongoose.Schema({
  name      : String, // name of the recipe
  call      : String, // what is used to call the recipe
  desc      : String, // description of the recipe
  type      : String, // chat or web
  params    : String,  // parameters i.e. /cmd-name :param1 :param2 or a script to execute
  action_type : String, // chat or web
  action    : String  // parameters i.e. /cmd-name :param1 :param2 or a script to execute
});

module.exports = mongoose.model('Recipe', recipeSchema);