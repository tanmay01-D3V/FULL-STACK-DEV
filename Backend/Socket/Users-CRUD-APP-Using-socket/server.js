const express = require ('express');
const http = require ('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let users = [
    {id:1, name:"Amit", email:"amit@gmail.com", password:"amit@123"},
    {id:2, name:"samit", email:"samit@gmail.com", password:"samit@123"},
]

io.on('connection', (socket) => {
    console.log("user with ID :- " + socket.id + "is connected");

    io.emit('users', users);

    socket.on('add-user',(data)=> {
        const newUser = {
            id:users.length+1,
            name:data.name,
            email:data.email,
            password:data.password,
        };
        users.push(newUser);
        io.emit('users', users);
    })

    socket.on('update-user',(data)=> {
        const index = users.findIndex(u => u.id === data.id);
        if(index !== -1){
            users[index] = data;
        }
        io.emit('users', users);
    })

    socket.on('delete-user',(id)=>{
         let userIndex = users.findIndex((user)=> user.id == id);
            users.splice(userIndex,1);
            io.emit('users',users);
         })

    socket.on('disconnect', () => {
        console.log("user with ID :- " + socket.id + "is disconnected");
    })

})

server.listen(3000,()=>{
    console.log("http://localhost:3000/");
})