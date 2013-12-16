define(['backbone'], function(Backbone){
  var Router = Backbone.Router.extend({
      routes: {
        "": "index",
        "task/:id": "selectTask"
      },

      index: function() {

      },
      selectTask: function(){
        
      }
    });

    return Router;
});