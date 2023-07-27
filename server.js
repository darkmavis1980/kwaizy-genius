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

app.use(cors());
app.use(
  express.static( path.join(__dirname, '/static') )
)

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

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});


server.listen(port, () => {
  console.log('listening on *: ', port);
});