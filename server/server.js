const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});
const { dispatcher } = require('./lib/actions');

require('dotenv').config();

app.get('/', (req, res) => {
  res.json({hello: 'world'});
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('message', async (message) => {
    const data = JSON.parse(message);
    await dispatcher(socket, data);
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});