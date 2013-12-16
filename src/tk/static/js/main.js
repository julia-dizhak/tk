require.config({
  paths: {
    backbone: 'vendor/backbone',
    jquery: 'vendor/jquery-1.9.0',
    underscore: 'vendor/underscore',
    select2: 'vendor/select2',
    obj_serialize: 'vendor/obj_serialize'
  },
  shim: {
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    underscore: {
      exports: '_'
    },
    select2: {
      deps: ['jquery']
    },
    obj_serialize: {
      deps: ['jquery']
    }
  }
});

require(
  ['jquery', 'underscore', 'backbone', 'views/page', 'views/form', 'views/item', 'models/task_model','collections/tasks', 'route', 'select2', 'obj_serialize'],
  function($, _, Backbone, PageView, FormView, ItemView, TaskModel, TaskCollection, Router){
  console.log("starting application...");

  console.log("fetch tasks data from server ...")
  $.ajax({
    type: 'GET',
    url: '/api/v1/task/',
    async: false
  })
  .done(function(data){
    var taskCollection = new TaskCollection(data.objects);
    console.log(taskCollection);

    taskCollection.each(function(task){
      var itemView = new ItemView({
        model: task
      });
      itemView.render();
      $('.task-list').prepend(itemView.$el);
    });

    var formView = new FormView({
      'collection': taskCollection
    });

    console.log("initializing default page view ...")
    var pageView = new PageView({
      'collection': taskCollection
    });

    console.log("render FormView ...")
    formView.render();

    

  });

});