fetch('http://localhost:5006/api/todos/', {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify({userId: 600, "id": 1, title: "something", completed: false})
})

fetch('http://localhost:5006/api/todos/5', {
    method: "DELETE",
}).then(response => response.text()).then(data => console.log(data));

fetch('http://localhost:5006/api/todos/2', {
    method: "PUT",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify({userId: 600, id: 1, title: "Updated Todo", completed: true})
}).then(response => response.json()).then(data => console.log(data));

fetch('http://localhost:5006/api/todos/3', {
    method: "PATCH",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify({title: "Updated Title"})
}).then(response => response.json()).then(data => console.log(data));

