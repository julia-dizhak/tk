define(['underscore', 'backbone','collections/tasks', 'views/item', 'select2'],
    function(_, Backbone, TaskCollection, ItemView){
      var PageView = Backbone.View.extend({
        el: 'body',
        events: {
          'change .filter select': 'filterTasks'
        },
        initialize: function(){
          this.$('select').select2();
        },
        filterTasks: function(event){
          console.log('filtering tasks ...');
          var status = $(event.target).val(), filteredCollection;

          if (status==='all'){
            console.log('selecting all tasks ...');
            filteredCollection = this.collection.models;
          } else {
            filteredCollection = this.collection.filter(function(item){
              return item.get('status') === status;
            })
          }

          // delete current tasks
          $('.task-list').html('');
          console.log(filteredCollection);
  
          _.each(filteredCollection, function(task){
            console.log(task);
            var itemView = new ItemView({
              model: task
            });
            itemView.render();
            $('.task-list').prepend(itemView.$el);
          });
        }

      });
      return PageView;
     }
);