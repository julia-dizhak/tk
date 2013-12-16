define(['jquery', 'underscore', 'backbone'],
    function($, _, Backbone){
      var ItemView = Backbone.View.extend({
        tagName: 'div',
        className: 'task-container',
        events: {
          'blur .task-name': 'editTask',
          'blur .task-desc': 'editTask',
          'click .btn-delete': 'deleteTask',
          'click .choice a': 'updateStatus'
          // 'focusout .task-name, .task-desc': 'focusOutFromEditor'
        },
        template: _.template(
            '<div data-id="<%= id %>" class=\'task-item\'>' +
                '<div class=\'cube\'>' +
                  '<i class=\'cube-top\'></i>'+
                  '<div class=\'task-layout\'>' +  
                    '<div class=\'task-name\' contentEditable="true"> <%= name %> </div>' +
                    '<div class=\'task-desc\' contentEditable="true"> <%= desc %>  </div>' +
                    '<div class=\'task-status <%= status %>\'>' + '<p><%= status %></p>' + '</div>' +
                    '<a href="javascript:;" class=\'btn-delete\'>' + 'delete task' + '</a>' +
                    '<div class=\'change-status\' >' + 
                    '<span class=\'btn-change-status\'>' + 'change status' + '</span>' +
                    '<div class=\'choice\' >' + 
                      '<a href="javascript:;" class=\'status-todo\'>' + 'todo' + '</a>' +
                      '<a href="javascript:;" class=\'status-inprogress\'>' + 'inprogress' + '</a>' +
                      '<a href="javascript:;" class=\'status-done\'>' + 'done' + '</a>' +
                    '</div>' +
                    '</div>' +
                  '</div>' +
                  '<i class=\'cube-bottom-shadow\'></i>'+
                '</div>' +
            '</div>'
          ),
        initialize: function(){
        },
        deleteTask: function(event){
          console.log('deleting model');
          this.model.destroy();
          this.$el.hide('slow', function(){ $(this).closest('.task-item').remove(); });
        },
        updateStatus: function(event){
          var target = $(event.target),
              status = target.text();
          this.model.set({'status': status});
          this.model.save();
          this.$('.task-status')
            .removeClass()
            .addClass('task-status')
            .addClass(status)
            .find('p').text(status);
        },
        editTask: function(event){
          console.log('editing task ...')
          window.history.pushState({}, 'Edit event', '/task/'+this.model.get('id'));
          var target = $(event.target);
          this.model.set(
            {
              'name': this.$('.task-name').text(),
              'desc': this.$('.task-desc').text()
            }
          )
          this.model.save()

        },
        focusOutFromEditor: function(event){
          window.history.pushState({}, '', '/');
        },
        render: function(){
          this.$el.html(this.template(this.model.toJSON()));
          return this;
        }
      });
      return ItemView;
     }
);