
import player from './modules/player.js';
import User from './modules/user.js';
import canvas from './modules/canvas.js';
import { eventDispatcher } from './modules/event.js';
import { getCurrentChatName, emitName, emitPosition, emitSkin } from "./modules/utils.js";

const users = [];
const socket = io();
window.socket = socket;
document.getElementById('map').addEventListener('keydown', function (e) {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
      e.preventDefault();
  }
}, false);

const gameOverlay = document.getElementById('game-overlay');
const chatLogin = document.getElementById('chat-login');
const chatWindow = document.getElementById('chat-container');
const chatLoginForm = document.getElementById('chat-login-form');
const chatForm = document.getElementById('chat-form');
const questionField = document.getElementById('question');
const genieContainer = document.getElementById('genie-container');

const genie = canvas.create('div', {
  class: 'genie'
});
genieContainer.appendChild(genie);

player.set('socket', socket);


player.setMoveHandler(() => {
  let { value } = questionField;
  if (player.genieHitCollision) {
    chatForm.classList.add('player-ask-genie');
    chatForm.querySelector('#question').setAttribute('placeholder', 'Chat with genie');
  }

  if (!player.genieHitCollision) {
    chatForm.classList.remove('player-ask-genie');
    chatForm.querySelector('#question').setAttribute('placeholder', 'Chat with players');
  }
});

const getIndex = id => users.findIndex(user => user.id === id);
socket.on('message', message => {
  eventDispatcher(socket, message);
});

socket.emit('user-connected', onlineUsers => {
  onlineUsers.forEach(user => {
    console.log('Client emit user-connected', socket.id)
    const id = user.id
    if (id === socket.id) return;
    const instance = new User(id)
    emitSkin(socket, instance.skin)
    users.push({id, instance});
  });
});

socket.on('user-connected', id => {
  console.log('Client ON user-connected')
  if (id === socket.id) return;
  const user = new User(id);
  users.push({ id, instance: user });
});

socket.on('user-disconnected', id => {
  console.log('Client user-disconnected')
  const user = document.querySelector(`[data-id="${id}"]`)
  if (user) {
    user.remove();
  }
  const index = getIndex(id);
  users.splice(index, 1);
});

socket.on('user-move', user => {
  console.log('client user-move')
  const index = getIndex(user.id);
  if (users[index]) {
    const instance = users[index].instance;
    emitPosition(socket, user.coordinates);
    emitSkin(socket, user.skin)
    instance.setPosition(user.coordinates);
  }
});

chatForm.onsubmit = (e) => {
  e.preventDefault();
  let { value } = questionField;
  if (value.trim() !== '') {
    let askToGenius = false;
    if (e.target.classList.contains('player-ask-genie')) {
      askToGenius = true;
      console.log('asking to genius');
    }

    const questionObj = {
      action: 'chatMessage',
      payload: value,
    };

    socket.emit('message', JSON.stringify(questionObj));

    if (askToGenius) {
      const geniusRequest = {
        action: 'askGenius',
        payload: value,
      };
      socket.emit('message', JSON.stringify(geniusRequest));
    }
  }

  questionField.value = '';
}

chatLoginForm.onsubmit = (e) => {
  e.preventDefault();
  const nameField = document.getElementById('name');
  const { value } = nameField;
  if (value !== '') {
    localStorage.setItem('name', value);
    emitName(socket, value);
    chatLogin.style.display = 'none';
    chatWindow.style.display = 'block';
  }
}

gameOverlay.addEventListener('click', () => {
  gameOverlay.classList.remove('active');
})

const init = () => {
  const name = getCurrentChatName();

  if (name || true) {
    chatLogin.style.display = 'none';
    chatWindow.style.display = 'block';
    emitName(socket, name);
    return;
  }
  gameOverlay.classList.add('active');
  chatLogin.style.display = 'block';
  chatWindow.style.display = 'none';
};

init();
