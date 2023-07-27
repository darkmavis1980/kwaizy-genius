
import player from './modules/player.js';
import User from './modules/user.js';
const users = [];
const socket = io('ws://localhost:3000');

const chatLogin = document.getElementById('chat-login');
const chatWindow = document.getElementById('chat-container');

player.set('socket', socket)

const getIndex = id => users.findIndex(user => user.id === id);

window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

socket.emit('user-connected', onlineUsers => {
    onlineUsers.forEach(user => {
        const id = user.id
        const instance = new User(id)
        instance.setPosition(user.coordinates)
        users.push({
            id, instance
        })
    })
});

socket.on('user-connected', id => {
    if (id === socket.id) return
    const user = new User(id)
    users.push({ id, instance: user })
});

socket.on('user-disconnected', id => {
    document.querySelector(`[data-id="${id}"]`).remove();
    const index = getIndex(id);
    users.splice(1, index);
});

socket.on('user-move', user => {
    const index = getIndex(user.id);
    console.log(users)
    // if (users[index]) {
        const instance = users[index].instance;
        instance.setPosition(user.coordinates);
    // }
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
