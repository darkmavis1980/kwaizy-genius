const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});
const { dispatcher } = require('./lib/actions');
const port = process.env.PORT || 3000
const path = require('path');

require('dotenv').config();

app.use(cors());
app.use(
  express.static(path.join(__dirname, '/static'))
);

app.get('/', (req, res) => {
  res.json({hello: 'world'});
});

// Hold the list of players in memory
const players = new Map();

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  players.set(socket.id, {
    id: socket.id,
  });

  console.log('Active players', players);

  socket.on('message', async (message) => {
    const data = JSON.parse(message);
    await dispatcher(socket, data);
  });

  socket.on('disconnect', async () => {
    console.log('user disconnected', socket.id);

    players.delete(socket.id);

    console.log('Active players', players);

    socket.emit('message', {
      action: 'playersList',
      payload: players,
    });

    socket.emit('message', {
      action: 'userDisconnected',
      payload: {
        id: socket.id,
      }
    })
  });
});


server.listen(port, () => {
  console.log('listening on *: ', port);
});