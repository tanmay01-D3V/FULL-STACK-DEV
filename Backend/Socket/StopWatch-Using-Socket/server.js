const express = require ('express');
const http = require ('http');
const {Server} = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let hours = 0;
let minutes = 0;
let seconds = 0;
let interval = null;

function startTimer() {
    interval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
        io.emit('time', { hours, minutes, seconds });
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    stopTimer();
    hours = 0;
    minutes = 0;
    seconds = 0;
    io.emit('time', { hours, minutes, seconds });
}   

io.on('connection', (socket)=>{
    console.log("User with ID: "+socket.id+" has connected");

    socket.on('disconnect',()=>{
        console.log("User with ID: "+socket.id+" has disconnected");
    })
    socket.on('start', ()=>{
        console.log("start event received");
        startTimer();
        io.emit('start');
    })
    socket.on('stop',()=>{
        console.log("stop event received");
        stopTimer();
        io.emit('stop');
    })
    socket.on('reset',()=>{
        console.log("reset event received");
        resetTimer();
        io.emit('reset');
    })
})  

server.listen(4000,()=>{
    console.log("http://localhost:4000/");
    
})