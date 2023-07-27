import player from './modules/player.js';
import User from './modules/user.js';

const users = [];
const socket = io('ws://localhost:3000');

const chatLogin = document.getElementById('chat-login');
const chatWindow = document.getElementById('chat-container');

socket.on('connect', () => {
    const { id } = socket;
    const user = new User(id)
    users.push({id, instance: user})
    // socket.emit('message', JSON.stringify({
    //     action: 'setName',
    //     payload: {
    //         name: 'Denis'
    //     }
    // }))
});

socket.on('message', async (message) => {
    const { action, payload } = message;
    const { id } = socket;
    const user = new User(socket.id)

    if (action === 'playersList') {
        payload.forEach(eachPlayer => {
            const [ playerId, playerData] = eachPlayer;
            if (playerId === id) {
                console.log(payload)
            }
        });
    }
});

const getCurrentChatName = () => localStorage.getItem('name') || undefined;

const init = () => {
  const name = getCurrentChatName();

  if (name) {
    chatLogin.style.display = 'none';
    chatWindow.style.display = 'block';
    emitName(name);
    return;
  }

  chatLogin.style.display = 'block';
  chatWindow.style.display = 'none';
};

const emitName = (value) => {
  const data = {
    action: 'setName',
    payload: {
      name: value,
    }
  }
  socket.emit('message', JSON.stringify(data));
}

const chatLoginForm = document.getElementById('chat-login-form');
chatLoginForm.onsubmit = (e) => {
  e.preventDefault();
  const nameField = document.getElementById('name');
  const { value } = nameField;
  localStorage.setItem('name', value);
  emitName(value);
  chatLogin.style.display = 'none';
  chatWindow.style.display = 'block';
}



init();