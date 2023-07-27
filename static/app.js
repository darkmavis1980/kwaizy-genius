
import player from './modules/player.js';
import User from './modules/user.js';
import { eventDispatcher } from './modules/event.js';
import { getCurrentChatName, emitName } from "./modules/utils.js";

const users = [];
const socket = io('ws://localhost:3000');
window.socket = socket;

const chatLogin = document.getElementById('chat-login');
const chatWindow = document.getElementById('chat-container');
const chatLoginForm = document.getElementById('chat-login-form');
const chatForm = document.getElementById('chat-form');

const getIndex = id => users.findIndex(user => user.id === id);

window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

socket.on('message', message => {
  eventDispatcher(socket, message);
});

// socket.on('connect', () => {
//     const { id } = socket;
//     const user = new User(id)
//     users.push({id, instance: user})
//     // socket.emit('message', JSON.stringify({
//     //     action: 'setName',
//     //     payload: {
//     //         name: 'Denis'
//     //     }
//     // }))
// })

// socket.on('message', async (message) => {
//     const { action, payload } = message;
//     const { id } = socket;
//     const user = new User(socket.id)

//     if (action === 'playersList') {
//         payload.forEach(eachPlayer => {
//             const [ playerId, playerData] = eachPlayer;
//             if (playerId === id) {
//                 console.log(payload)
//             }
//         });
//     }
// });


socket.emit('user-connected', onlineUsers => {
  onlineUsers.forEach(user => users.push({
    id: user.id,
    instance: new User(user.id)
  }))
});

socket.on('user-connected', id => {
  if (id === socket.id) return
  const user = new User(id)
  users.push({id, instance: user})
});

socket.on('user-disconnected', id => {
  document.querySelector(`[data-id="${id}"]`).remove()
  const index = getIndex(id)
  users.splice(1, index)
});

chatForm.onsubmit = (e) => {
  e.preventDefault();
  const questionField = document.getElementById('question');
  const { value } = questionField;
  if (value.trim() !== '') {
    const questionObj = {
      action: 'chatMessage',
      payload: value,
    };

    socket.emit('message', JSON.stringify(questionObj));

    const geniusRequest = {
      action: 'askGenius',
      payload: value,
    };
    socket.emit('message', JSON.stringify(geniusRequest));
  }

  questionField.value = '';
}

chatLoginForm.onsubmit = (e) => {
  e.preventDefault();
  const nameField = document.getElementById('name');
  const { value } = nameField;
  localStorage.setItem('name', value);
  emitName(socket, value);
  chatLogin.style.display = 'none';
  chatWindow.style.display = 'block';
}

const init = () => {
  const name = getCurrentChatName();

  if (name) {
    chatLogin.style.display = 'none';
    chatWindow.style.display = 'block';
    emitName(socket, name);
    return;
  }

  chatLogin.style.display = 'block';
  chatWindow.style.display = 'none';
};

init();
