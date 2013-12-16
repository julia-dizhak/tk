define(['jquery', 'backbone', 'models/task_model', 'views/item'], function($, Backbone, TaskModel, ItemView){
  var FormView = Backbone.View.extend({
    saveUrl: '/api/v1/task/',
    el: '.project-form',
    events: {
      'submit form.form-task-add-form': 'saveTask'
    },
    render: function(){
      var form = '<div class=\'form-task-add\'>' +
                '<div class=\'wrap\'>' +
                  '<form class=\'form-task-add-form\'>' +  
                  '<label>' + 'Please enter name' + '</label>' +
                  '<input name="name" id="task-name" type="text" />' +
                  '<label>' + 'Please enter description' + '</label>' +
                  '<textarea id="task-desc" name="desc" type="text" rows="4" cols="30">' + '</textarea>' + 
                  '<input class="btn-add" type="submit" value="create task" />'+
                  '</form>' +
                '</div>' +
            '</div>';
      this.$el.append(form);
    },
    saveTask: function(event){
      event.preventDefault();
      console.log("saving task data ...");

      var url = this.saveUrl, form=this.$('form'),
      _this = this,
      task_data = form.serializeObject();
      console.log('posting tasks data to url '+url+'...')
      $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: url,
        dataType: 'json',
        data: JSON.stringify(task_data),
        async: false
      })
      .done(
        function(data){
          // flush content of inputs
          form.find('input[type=text], textarea').val('');
          var model = new TaskModel(data);
          _this.collection.add(model);
          var itemView = new ItemView({
            model: model
          });
          $('.task-list').prepend(itemView.render().$el);
        }
      );
    }
    //end saveTask
  });
  return FormView;
});