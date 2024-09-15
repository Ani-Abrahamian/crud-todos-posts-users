const http = require('http')
const fs = require('fs')
const todoDB = require('./json/todos.json')
const postDB = require('./json/posts.json')
const usersDB = require('./json/users.json')

const server = http.createServer((req, res) => {
    if(req.url === "/" && req.method === "GET"){
        fs.promises.readFile('./index.html','utf-8')
            .then(data => {
                res.writeHead(200, {statusMessage : "OK", "Content-Type" : "text/html"})
                res.write(data)
                res.end()
            })
            .catch(err => {
                res.writeHead(404, {statusMessage: "html not found", "Content-Type" : "text/plain"})
                res.write("html not found")
                res.end()
            })
    }
    //todos
    else if(req.url === "/api/todos" && req.method === "GET"){
       res.write(JSON.stringify(todoDB))
        res.end()
    }
    else if(req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === "GET"){
        let id = req.url.split('/')[3]
        let newData = todoDB.find((todo) => todo.id === +id)

        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.write(JSON.stringify(newData) || {})
        res.end()
    }
    else if(req.url.includes('?') && req.method === 'GET'){
        let val = req.url.split("/")[2].slice(0, req.url.split("/")[2].indexOf('?'))
        if(val === "todos"){
            let key = req.url.slice(req.url.indexOf('?') + 1).split("=")[0]
            let value = req.url.slice(req.url.indexOf('?') + 1).split("=")[1]

            if(key === "id"){
                let todos = todoDB.filter(todo => todo.id == value)
                if(todos){
                res.writeHead(200, {"Content-Type" : "application/json"})
                res.write(JSON.stringify(todos))
                res.end()
                } else {
                res.writeHead(404, {"Content-Type" : "text/plain"})
                res.write("page not found")
                res.end()
                }
            }else if(key === "userId"){
                let todos = todoDB.filter(todo => todo.userId == value)
                if(todos){
                res.writeHead(200, {"Content-Type" : "application/json"})
                res.write(JSON.stringify(todos))
                res.end()
                } else {
                res.writeHead(404, {"Content-Type" : "text/plain"})
                res.write("page not found")
                res.end()
                }
            }
            
        }
        else if(val === "posts"){
            let key = req.url.slice(req.url.indexOf('?') + 1).split("=")[0]
            let value = req.url.slice(req.url.indexOf('?') + 1).split("=")[1]

            if(key === "id"){
                let posts = postDB.filter(post => post.id == value)
                if(posts){
                    res.writeHead(200, {"Content-Type" : "application/json"})
                    res.write(JSON.stringify(posts))
                    res.end()
                } else {
                    res.writeHead(404, {"Content-Type" : "text/plain"})
                    res.write("page not found")
                    res.end()
                }
            }else if(key === "userId"){
                let posts = postDB.filter(post => post.userId == value)
                if(posts){
                    res.writeHead(200, {"Content-Type" : "application/json"})
                    res.write(JSON.stringify(posts))
                    res.end()
                } else {
                    res.writeHead(404, {"Content-Type" : "text/plain"})
                    res.write("page not found")
                    res.end()
                }
            }
            res.end()
        }
        else if(val === "users"){
            let indexParams = req.url.indexOf('?')
            let getParams = req.url.slice(indexParams + 1)
            let newData = []
            if(getParams.includes('&')){
                let value1 = getParams.slice(getParams.indexOf('=') + 1, getParams.indexOf('&'))
                let value2 = getParams.slice(getParams.lastIndexOf('=') + 1)
                let key1 = getParams.slice(0, getParams.indexOf('='))
                let key2 = getParams.slice(getParams.indexOf('&') + 1, getParams.lastIndexOf('='))
                if(key1 === "name"){
                    newData.push(usersDB.filter((u) => u.name.toLowerCase().indexOf(value1.toLowerCase()) > -1))
                }else if(key1 === "username"){
                    newData.push(usersDB.filter((u) => u.username.toLowerCase().indexOf(value1.toLowerCase()) > -1))
                }

                if(key2 === "name"){
                    newData.push(usersDB.filter((u) => u.name.toLowerCase().indexOf(value2.toLowerCase()) > -1))
                }else if(key2 === "username"){
                    newData.push(usersDB.filter((u) => u.username.toLowerCase().indexOf(value2.toLowerCase()) > -1))
                }
                res.writeHead(200, { "Content-Type": "application/json" })
                    res.write(JSON.stringify(newData))
                    res.end()
            }else {
                let value = getParams.split('=')[1]
                let key = getParams.split('=')[0]
                if(key === "name"){
                    let newData =
                    usersDB.filter((u) => u.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
                    res.writeHead(200, { "Content-Type": "application/json" })
                    res.write(JSON.stringify(newData))
                    res.end()
                }
                if(key === "username"){
                    let newData =
                    usersDB.filter((u) => u.username.toLowerCase().indexOf(value.toLowerCase()) > -1)
                    res.writeHead(200, { "Content-Type": "application/json" })
                    res.write(JSON.stringify(newData))
                    res.end()
                }
            }
            res.end()
        }else {
            res.writeHead(404, {"Content-Type" : "text/plain"})
            res.write("page not found")
            res.end()
        }
        res.end()
    }
    else if(req.url === '/api/todos' && req.method === "POST"){
        
        let body = [];
       
        req.on('data', chunk => body.push(chunk));
        
        req.on('end', () => {
            body = JSON.parse(body[0].toString());
            console.log(body); 
        })
        
        res.end()
    }
    else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === 'PUT') {
        let id = req.url.split('/')[3];
        let body = [];
    
        req.on('data', chunk => body.push(chunk));
        
        req.on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());
            let todoIndex = todoDB.findIndex(todo => todo.id === +id);
    
            if (todoIndex !== -1) {
                todoDB[todoIndex] = { ...body }; 
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(todoDB[todoIndex]));
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write("Todo not found");
            }
            res.end();
        });
    }
    else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === 'PATCH') {
        let id = req.url.split('/')[3];
        let body = [];
    
        req.on('data', chunk => body.push(chunk));
        
        req.on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());
            let todoIndex = todoDB.findIndex(todo => todo.id === +id);
    
            if (todoIndex !== -1) {
                todoDB[todoIndex] = { ...todoDB[todoIndex], ...body }; 
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(todoDB[todoIndex]));
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write("Todo not found");
            }
            res.end();
        });
    }
    else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === 'DELETE') {
        let id = req.url.split('/')[3];
        let todoIndex = todoDB.findIndex(todo => todo.id === +id);
    
        if (todoIndex !== -1) {
            todoDB.splice(todoIndex, 1);  
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write("Todo deleted");
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write("Todo not found");
        }
        res.end();
    }
    //posts
    else if(req.url === "/api/posts" && req.method === "GET"){
       res.write(JSON.stringify(postDB))
        res.end()
    }
    else if(req.url.match(/\/api\/posts\/([0-9]+)/) && req.method === "GET"){
        let id = req.url.split('/')[3]
        let newData = postDB.find((post) => post.id === +id)

        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.write(JSON.stringify(newData))
        res.end()
    }
    else if(req.url === '/api/posts' && req.method === "POST"){
        
        let body = [];
       
        req.on('data', chunk => body.push(chunk));
        
        req.on('end', () => {
            body = JSON.parse(body[0].toString());
            console.log(body); 
        })
        
        res.end()
    }
    else if (req.url.match(/\/api\/posts\/([0-9]+)/) && req.method === 'PUT') {
        let id = req.url.split('/')[3];
        let body = [];
    
        req.on('data', chunk => body.push(chunk));
        
        req.on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());
            let postIndex = postDB.findIndex(post => post.id === +id);
    
            if (postIndex !== -1) {
                postDB[postIndex] = { ...body }; 
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(postDB[postIndex]));
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write("Post not found");
            }
            res.end();
        });
    }
    else if (req.url.match(/\/api\/posts\/([0-9]+)/) && req.method === 'PATCH') {
        let id = req.url.split('/')[3];
        let body = [];
    
        req.on('data', chunk => body.push(chunk));
        
        req.on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());
            let postIndex = postDB.findIndex(post => post.id === +id);
    
            if (postIndex !== -1) {
                postDB[postIndex] = { ...postDB[postIndex], ...body }; 
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(postDB[postIndex]));
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write("Post not found");
            }
            res.end();
        });
    }
    else if (req.url.match(/\/api\/posts\/([0-9]+)/) && req.method === 'DELETE') {
        let id = req.url.split('/')[3];
        let postIndex = postDB.findIndex(post => post.id === +id);
    
        if (postIndex !== -1) {
            postDB.splice(postIndex, 1);  
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write("Post deleted");
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write("Post not found");
        }
        res.end();
    }
    //users
    else if(req.url === "/api/users" && req.method === "GET"){
       res.write(JSON.stringify(usersDB))
        res.end()
    }
    else if(req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "GET"){
        let id = req.url.split('/')[3]

        let newData = usersDB.find((post) => post.id === +id)

        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.write(JSON.stringify(newData))
        res.end()
    }
    else if(req.url === '/api/users' && req.method === "POST"){
        
        let body = [];
       
        req.on('data', chunk => body.push(chunk));
        
        req.on('end', () => {
            body = JSON.parse(body[0].toString());
            console.log(body); 
        })
        
        res.end()
    }
    else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === 'PUT') {
        let id = req.url.split('/')[3];
        let body = [];
    
        req.on('data', chunk => body.push(chunk));
        
        req.on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());
            let postIndex = usersDB.findIndex(post => post.id === +id);
    
            if (postIndex !== -1) {
                usersDB[postIndex] = { ...body }; 
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(usersDB[postIndex]));
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write("Post not found");
            }
            res.end();
        });
    }
    else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === 'PATCH') {
        let id = req.url.split('/')[3];
        let body = [];
    
        req.on('data', chunk => body.push(chunk));
        
        req.on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());
            let postIndex = usersDB.findIndex(post => post.id === +id);
    
            if (postIndex !== -1) {
                usersDB[postIndex] = { ...usersDB[postIndex], ...body }; 
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(usersDB[postIndex]));
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write("Post not found");
            }
            res.end();
        });
    }
    else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === 'DELETE') {
        let id = req.url.split('/')[3];
        let postIndex = usersDB.findIndex(post => post.id === +id);
    
        if (postIndex !== -1) {
            usersDB.splice(postIndex, 1);  
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write("Post deleted");
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write("Post not found");
        }
        res.end();
    }

    else {
        res.end()
    }
})

server.listen('5006', () => console.log('server is running'))