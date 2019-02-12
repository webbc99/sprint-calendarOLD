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


var oktaSignIn = new OktaSignIn({
  baseUrl: "{{ https://dev-534730.oktapreview.com }}",
  clientId: "{{ 0oajcja6b9pvkD6yI0h7 }}",
  authParams: {
    issuer: "{{ https://dev-534730.oktapreview.com }}/oauth2/default",
    responseType: ["token", "id_token"],
    display: "page"
  }
});

if (oktaSignIn.token.hasTokensInUrl()) {
  oktaSignIn.token.parseTokensFromUrl(
    // If we get here, the user just logged in.
    function success(res) {
      var accessToken = res[0];
      var idToken = res[1]

      oktaSignIn.tokenManager.add("accessToken", accessToken);
      oktaSignIn.tokenManager.add("idToken", idToken);

      window.location.hash = "";
      document.getElementById("messageBox").innerHTML = "Hello, " + idToken.claims.email + "! You just logged in! :)";
    },
    function error(err) {
      console.error(err);
    }
  );
} else {
  oktaSignIn.session.get(function (res) {
    // If we get here, the user is already signed in.
    if (res.status === 'ACTIVE') {
      document.getElementById("messageBox").innerHTML = "Hello, " + res.login + "! You are *still* logged in! :)";
      return;
    }

    // If we get here, the user is not logged in, so we should show the sign-in form.
    oktaSignIn.renderEl(
      { el: '#sign-in-container' },
      function success(res) {},
      function error(err) {
        console.error(err);
      }
    );
  });
}