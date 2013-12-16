$(function(){
  
  // Convert form data to JS object with jQuery
  $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
  };
  
  var generateUUID = function() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x7|0x8)).toString(16);
      });
      return uuid;
  };
  
  Task = {};
  Task.el = $('.wrapper .project');
  Task.form = $('.project-form')
  
  Task.addTaskHead = function(head) {
    head = '<h3 class=\'task-head\'>' + 'Tasks for today' + '</h3>';
    Task.el.append(head);
  } 
  
  Task.addTaskForm = function addTaskForm(form) {
    form = '<div class=\'form-task-add\'>' +
              '<div class=\'wrap\'>' +
                '<form method="post" class=\'form-task-add-form\'>' +  
                '<label>' + 'Please enter name' + '</label>' +
                '<input name="name" id="task-name" type="text" />' +
                // '<label>' + 'Status' + '</label>' +
//                 '<select name="status" id="task-status" class=\"select-js\">' +
//                  '<option value="todo">todo</option>'+
//                  '<option value="inprogress">inprogress</option>'+
//                  '<option value="done">done</option>'+
//                 '</select>' +
                '<label>' + 'Please enter description' + '</label>' +
                '<textarea id="task-desc" name="desc" type="text" rows="4" cols="30">' + '</textarea>' + 
                '<input class="btn-add" type="submit" value="create task" />'+
                '</form>' +
              '</div>' +
          '</div>';
    
    Task.form.append(form);
    $('.select-js').select2();
  };
  
  Task.submitForm = function(event){
    event.preventDefault();
    var form = $(event.target);
    var task_data = form.serializeObject();
    task_data.status  = 'new';
    task_data.id = generateUUID();
    
    form.find('#task-name').val('');
    form.find('#task-desc').val('');
    

  
    // push data to server
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: 'https://api.mongolab.com/api/1/databases/tasks/collections/tasks/?apiKey=Ju3FZxiia5y2QvDT14KcUp7TwO_JceQA',
      dataType: 'json',
      data: JSON.stringify(task_data)
      }).done(
        function(data){
          // push task item to window.Tasks
          Tasks.push(data);
          Task.renderItem(data);
        }
      )
  };

  Task.editContent = function(event){
    // update Tasks list data
    _target = $(event.target);

    var task_id = _target.closest('div[data-id]').data('id'),
    _task = _.findWhere(Tasks, {id: task_id});

    // update url with corresponding task_id
    window.history.pushState({}, 'Edit task', _task.id)

    // get access for element of array by position
    var name = $('div[data-id='+task_id+']').find('.task-name').text();
    var desc = $('div[data-id='+task_id+']').find('.task-desc').text();
    Tasks[Tasks.indexOf(_task)].name = name;
    Tasks[Tasks.indexOf(_task)].desc = desc;

    var data = Tasks[Tasks.indexOf(_task)]
    // push data to server
    $.ajax({
      type: 'PUT',
      contentType: 'application/json',
      url: 'https://api.mongolab.com/api/1/databases/tasks/collections/tasks/?apiKey=Ju3FZxiia5y2QvDT14KcUp7TwO_JceQA&q={\'id\':\''+data.id+'\'}',
      dataType: 'json',
      data: JSON.stringify(data)
      }).done(
        function(data){

        }
      )

  }

  Task.template = _.template(
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
              '<a href="javascript:;" class=\'status-inprogress\'>' + 'inporgress' + '</a>' +
              '<a href="javascript:;" class=\'status-done\'>' + 'done' + '</a>' +
            '</div>' +
            '</div>' +
          '</div>' +
          '<i class=\'cube-bottom-shadow\'></i>'+
        '</div>' +
    '</div>'
  );

  Task.renderItem = function(item){
    var res = Task.template(item);
    $(res).insertAfter('.filter');
    //$(".project").html($(res));

    $('.btn-delete').on('click', Task.removeItem);
    $('.task-name').on('blur', Task.editContent);
    $('.task-desc').on('blur', Task.editContent);
    $('.choice a').on('click', Task.changeStatus);
  };

  Task.removeItem = function(event){
     event.preventDefault();
     event.stopPropagation();
     var button = $(event.target),
     task_id = button.closest('div[data-id]').data('id');

     button.unbind('click');

     var task = _.findWhere(Tasks, {id: task_id});

     $.ajax({
       type: 'DELETE',
       url: 'https://api.mongolab.com/api/1/databases/tasks/collections/tasks/'+task._id['$oid']+'?apiKey=Ju3FZxiia5y2QvDT14KcUp7TwO_JceQA&codekitCB=408204034.041171',
       async: true
       }).done(function(data){
         Tasks.pop(task);
         button.closest('.task-item').hide('slow', function(){ $(this).closest('.task-item').remove(); });
       });
  }


  Task.changeStatus = function(event){
    event.preventDefault();
    
    var _target = $(event.target),
    status = _target.attr('class').replace('status-', '');
    
    var task_id = _target.closest('div[data-id]').data('id'),
    _task = _.findWhere(Tasks, {id: task_id});

    // get access for element of array by position


    _task.status = status;
    _target.parents('.change-status').siblings('.task-name').trigger('blur');
    _target.parents('.change-status')
      .siblings('.task-status')
      .removeClass()
      .addClass('task-status')
      .addClass(status)
      .find('p').text(status);
  
    // $(_target).next('.choice').fadeToggle( "slow", "linear" );
    
    
  }
  
  Task.filterSort = function(event) {
    var filter = $('.filter .select-js');
    
    filter.on('change', function(event) {
      var _target = $(event.target),
          val =  
      console.log(_target);
       
    }); 
    
  }


  Task.init = function(){
    
    
   
    Task.addTaskForm();
    //$(Task.addTaskHead()).insertBefore('.form-task-add');
    $('.form-task-add-form').on('submit', Task.submitForm);
    
    // initial render of all tasks
    _.each(Tasks, this.renderItem);
    
    $('.btn-change-status').on('click', Task.changeStatus);
     
    //Task.filterSort(); 
    Task.offlineEvent();
  }
  
  
  //local storage хранение в local storage (потом хранение на сервере )
  //имя пользователя
  //
  
  
  Task.offlineEvent = function(){
    
    //Invalidate cache
    window.addEventListener('load', function(e) {
      if (window.applicationCache) {
        window.applicationCache.addEventListener('updateready', function(e) {
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
              // Browser downloaded a new app cache.
              // Swap it in and reload the page to get the new hotness.
              window.applicationCache.swapCache();
              if (confirm('A new version of this site is available. Load it?')) {
                window.location.reload();
              }
            } else {
              // Manifest didn't changed. Nothing new to server.
            }
        }, false);
      }
    }, false);

    $(document).on('offline online', function (event) {
        alert('You are ' + event.type + '!');
    });
  }
  
  // filter
  // url навигация (filter, редактирование) до пятницы
  // из offline в online 
  // login
  
  
  
  
  Task.init();

});