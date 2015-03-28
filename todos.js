Todos = new Meteor.Collection('TodoList');

if (Meteor.isClient) {
  todoSub = Meteor.subscribe('todos');
  Template.TodoPanel.helpers({
    items: function() {
      return Todos.find({}, {sort: {createdOn: -1}})
    },
    isDone: function() {
      return this.isDone ? 'done' : '';
    },
    isChecked: function() {
      return this.isDone;
    }    
  });
  Template.TodoPanel.events({
    'mouseover .todoItem': function() {
      console.log('mouse over');
    },
    'click [class=delete]': function(event, tmpl) {
      var id = this._id;
      Meteor.call('remove', id);
    },
    'click [name=isDone]': function(event, tmpl) {
      var id = this._id;
      var isDone = tmpl.find('input').checked;
      Meteor.call('setDone', id, isDone);
    }    
  });
  Template.TodoForm.events({
    'submit form': function(event, tmpl) {
      event.preventDefault();
      var item = event.target.todoItem.value;
      Meteor.call('addItem', item);
      var form = tmpl.find('form');
      form.reset();
    }
  });
/*  Template.TodoItem.events({

  }); */
 Template.TodoCount.helpers({
    completedItems: function() {
      return Todos.find( {isDone: true} ).count();
    },
    totalItems: function() {
      return Todos.find({}).count();
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish('todos', function(){
    return Todos.find({createdBy: this.userId});
  });
  Meteor.methods({
    addItem: function(item) {
      var today = new Date();
      var user = Meteor.userId();
      Todos.insert({
        todoItem: item,
        isDone: false,
        createdBy: user,
        createdOn: today
      });
    },
    setDone: function(id, isDone) {
      Todos.update({_id: id}, {
        $set: {
          isDone: isDone
        }
      });
    },
    remove: function(id) {
      Todos.remove({_id: id});
    }
  });
}
