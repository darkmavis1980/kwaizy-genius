
import player from './modules/player.js';
import User from './modules/user.js';
import { eventDispatcher } from './modules/event.js';
import { getCurrentChatName, emitName, emitPosition } from "./modules/utils.js";

const users = [];
const socket = io();
window.socket = socket;
document.getElementById('map').addEventListener('keydown', function (e) {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
      e.preventDefault();
  }
}, false);

const chatLogin = document.getElementById('chat-login');
const chatWindow = document.getElementById('chat-container');
const chatLoginForm = document.getElementById('chat-login-form');
const chatForm = document.getElementById('chat-form');
const questionField = document.getElementById('question');
const regexGeniusQuestion = /\/genius\s.+/gm;

player.set('socket', socket);

player.setMoveHandler(() => {
  let { value } = questionField;
  if (player.genieHitCollision) {
    chatForm.classList.add('player-ask-genie');
    if (!regexGeniusQuestion.test(value) && value === '') {
      questionField.value = `/genius ${value}`;
    }
  }

  if (!player.genieHitCollision) {
    chatForm.classList.remove('player-ask-genie');
    questionField.value = value.replace('/genius', '').trim();
  }
});

const getIndex = id => users.findIndex(user => user.id === id);
socket.on('message', message => {
  eventDispatcher(socket, message);
});

socket.emit('user-connected', onlineUsers => {
  onlineUsers.forEach(user => {
    const id = user.id
    const instance = new User(id)
    instance.setPosition(user.coordinates)
    users.push({
        id, instance
    });
  });
});

socket.on('user-connected', id => {
  if (id === socket.id) return;
  const user = new User(id);
  users.push({ id, instance: user });
});

socket.on('user-disconnected', id => {
  const user = document.querySelector(`[data-id="${id}"]`)
  if (user) {
    user.remove();
  }
  const index = getIndex(id);
  users.splice(index, 1);
});

socket.on('user-move', user => {
  console.log('client user-move')
  emitPosition(socket, user.coordinates);
  const index = getIndex(user.id);
  if (users[index]) {
    const instance = users[index].instance;
    instance.setPosition(user.coordinates);
  }
});

chatForm.onsubmit = (e) => {
  e.preventDefault();

  let { value } = questionField;
  if (value.trim() !== '') {
    let askToGenius = false;
    if (regexGeniusQuestion.test(value)) {
      askToGenius = true;
      console.log('asking to genius');
      value = value.replace(/\/genius\s/gm, '');
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
