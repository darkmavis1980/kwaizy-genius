const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { dispatcher } = require('./lib/actions');

app.get('/', (req, res) => {
  res.json({hello: 'world'});
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('message', (message) => {
    const data = JSON.parse(message);
    dispatcher(socket, data);
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});