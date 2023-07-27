import player from './modules/player.js'

const socket = io('ws://localhost:3000');

socket.on('message', data => {
  console.log(data);
});