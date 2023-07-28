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

const users = []
const getIndex = id => {
  return users.findIndex(user => user.id === id)
}

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  io.players = players;

  players.set(socket.id, {
    id: socket.id,
  });

  socket.emit('message', {
    action: 'playersList',
    payload: Array.from(players),
  });

  socket.on('message', async (message) => {
    const data = JSON.parse(message);
    await dispatcher(io, socket, data);
  });

  socket.on('user-connected', cb => {
    cb(users)
    users.push({id: socket.id})
    io.emit('user-connected', socket.id)
  })

  socket.on('user-move', coordinates => {
    if (coordinates) {
      console.log('user move');
      const index = getIndex(socket.id);
      if (users[index]) {
        users[index].coordinates = coordinates;
        io.emit('user-move', {id: socket.id, coordinates});
      }
    }
  });

  socket.on('disconnect', async () => {
    console.log('user disconnected', socket.id);
    players.delete(socket.id);

    socket.emit('message', {
      action: 'playersList',
      payload: Array.from(players),
    });

    socket.emit('message', {
      action: 'userDisconnected',
      payload: {
        id: socket.id,
      }
    })

    const index = getIndex(socket.id)
    users.splice(1, index)
    io.emit('user-disconnected', socket.id)
  });
});

app.get('/players', (req, res) => {
  res
    .status(200)
    .json({
      players: Array.from(players),
    })
    .end();
});

server.listen(port, () => {
  console.log('listening on *: ', port);
});