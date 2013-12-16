$(function(){
   var Tasks = window.Tasks || [];
  /*
  window.Tasks =  [
           { id: 1, name: 'Listen music from Ennio Morricone', desc: ' is an Italian composer, orchestrator, conductor and former trumpet player, who has written music for more than 500 motion pictures and television series, as well as contemporary classical works. His career includes a wide range of composition genres, making him one of the world\'s most versatile, prolific and influential film composers of all time', status: 'todo' },
           { id: 2, name: 'Read book about Javascript', desc: 'JavaScript is the scripting language of the Web.', status: 'inprogress' },
           { id: 3, name: 'Run a half-marathon', desc: 'A half marathon is a road running event of 21.0975 kilometres (13.1094 mi). It is half the distance of a marathon and usually run on roads. Participation in half marathons has grown steadily', status: 'done'},
           { id: 4, name: 'Check email', desc: 'form previous week', status: 'todo'},
           { id: 5, name: 'Read the documentation about Underscore JS', desc: 'Underscore is a utility-belt library for JavaScript that provides a lot of the functional programming support that you would expect in Prototype.js (or Ruby), but without extending any of the built-in JavaScript objects. It\'s the tie to go along with jQuery\'s tux, and Backbone.js\'s suspenders.', status: 'inprogress'},
           { id: 6, name: 'Communication ', desc: 'in english', status: 'inprogress'}
      ];
  */

  $.ajax({
    url: 'https://api.mongolab.com/api/1/databases/tasks/collections/tasks/?apiKey=Ju3FZxiia5y2QvDT14KcUp7TwO_JceQA',
    async: true
    })
  .success(function(data){
    window.Tasks = data;
  })
  .error(function(data){
    window.Tasks = {};
  });


});