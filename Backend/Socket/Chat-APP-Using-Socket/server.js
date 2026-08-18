const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
let users = new Map();

io.on("connection", (socket) => {
  console.log("User with ID: " + socket.id + " has connected");

  socket.on("new-user-joined", (username) => {
    if (!username || !username.trim()) return;
    users.set(socket.id, username.trim());
    io.emit("users-count", users.size);
    io.emit("user-joined", username.trim());
  });

  socket.on("send-message", (message) => {
    let username = users.get(socket.id);
    if (!username) return;
    io.emit("receive-message", { username, message });
  });

  socket.on("start-typing", () => {
    let username = users.get(socket.id);
    socket.broadcast.emit("user-typing", username);
  });

  socket.on("stop-typing", () => {
    let username = users.get(socket.id);
    if (username) io.emit("user-stopped-typing", username);
  });

  socket.on("disconnect", () => {
    if (users.has(socket.id)) {
      let username = users.get(socket.id);
      users.delete(socket.id);
      io.emit("users-count", users.size);
      io.emit("user-left", username);
    }
    console.log("User with ID: " + socket.id + " has disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
