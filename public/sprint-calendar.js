// var endpoint = "http://localhost:3000";
var endpoint = "http://calendar.chriswebb.online";

$(document).ready(function(){
  $.getJSON(endpoint + "/todos")
  .then(function(data){
    console.log(data);
    for(var i = 0; i < data.length; i++){
      console.log(data[i]["title"]);
      var todo = $("<div id='" + data[i]["id"] + "' class='todo_item' tabindex='0' draggable='true' ondragstart='drag(event)'></div>").text(data[i]["title"])
      var elem = "#" + data[i]["start"];
      console.log(elem);
      var deleteBtn = $("<button class='delete_button'>Delete</button>");
      $(elem).append(todo);
      $(todo).append(deleteBtn);
      createDeleteButton();
    }
  })
});


function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.append(document.getElementById(data));
  $.post({ url: endpoint + "/todos", data: { title: data, start: ev.target.id }, success: function(response){
    var responseId = response["id"].toString();
    console.log(responseId);
    document.getElementById(data).id = responseId;
  }})
}

$("#create").unbind().click(function(){
  var jiraId = $("#jira_id").val();
  createTodo(jiraId);
})


function createDeleteButton() {
  $(".delete_button").unbind().click(function(){
    var parent = $(this).parent();
    console.log(parent);
    var parentId = parent[0]["id"];
    console.log(parentId);
    // jira = jira.slice(0, -6);
    deleteTodo(parentId);
    $(parent).remove();
  });
}

function deleteTodo(parentId) {
  $.getJSON(endpoint + "/todos")
  .then(function(data){
    for(var i = 0; i < data.length; i++){
      if(data[i]["id"] == parentId){
        $.ajax({
          url: endpoint + "/todos/" + data[i]["id"],
          type: "DELETE",
          success: alert(endpoint + "/todos/" + data[i]["id"] + " deleted successfully")
        });
        return;
      }
    }
  });    
}

function createTodo(jira) {
  var todo = $("<div id='" + jira + "' class='todo_item' tabindex='0' draggable='true' ondragstart='drag(event)'></div>").text(jira);
  $("#creation_area").after(todo);
  var deleteBtn = $("<button class='delete_button'>Delete</button>");
  $(todo).append(deleteBtn);
  createDeleteButton();
}

$("#delete_all_button").click(function(){
  $(".todo_item").remove();
  $.getJSON("http://localhost:3000/todos")
  .then(function(data){
    console.log(data);
    for(var i = 0; i < data.length; i++){
      console.log(endpoint + "/todos/" + data[i]["id"])
      $.ajax({
        url: endpoint + "/todos/" + data[i]["id"],
        type: "DELETE"
      });
    }
  });
});