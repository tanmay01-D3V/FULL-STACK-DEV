const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
let users = new Map();

io.on('connection', (socket) => {
    console.log("User with ID: " + socket.id + " has connected");

    io.emit('users-count',users.size);

    socket.on('disconnect', () => {
        console.log("User with ID: " + socket.id + " has disconnected");
    }); 

    socket.on('new-user-joined', (username)=>{
        users.set(socket.id,username);
        socket.emit('users-count',users.size);
    })

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});