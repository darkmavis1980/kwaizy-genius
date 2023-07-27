const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.json({hello: 'world'});
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('message', (message) => {
    const { action, payload } = JSON.parse(message);
    console.log(action, payload);
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});