define(['backbone', 'models/task_model'],
    function(Backbone, TaskModel){
      var TaskCollection = Backbone.Collection.extend({
        model: TaskModel
      });
      return TaskCollection;
     }
);