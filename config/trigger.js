var Recipe = require('../app/models/recipes');

var addTrigger = function(req, data, done) {
    process.nextTick(function() {
      Recipe.findOne({
        'name' : data.name
      }, function(err, recipe) {
        if (err)
          return done(err);
        if (recipe) {
          return done(null, false, req.flash('triggerMessage', 'Name is taken'))
        } else {
          var newRecipe = new Recipe();
          newRecipe.name = data.name;
          newRecipe.call = data.call;
          newRecipe.desc = data.desc;
          newRecipe.type = data.type;
          newRecipe.params = data.params;
          newRecipe.action_type = data.optradio;
          newRecipe.action = [data.req_type, data.url, data.select]
          newRecipe.save(function(err) {
            if(err)
              throw err;
            return done(null, true, req.flash('triggerMessageSuccess', 'Added trigger successfully'));
          });
        }
      });
    });
  };
module.exports = addTrigger;