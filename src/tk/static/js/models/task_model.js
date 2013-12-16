define(['backbone'],
    function(Backbone){
      var TaskModel = Backbone.Model.extend({
        defaults: {
          'name': '',
          'desc': '',
          'status': 'new'
        },
        url: function(){
          return this.get('resource_uri');
        }
      });
      return TaskModel
     }
);