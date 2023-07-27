import player from './modules/player.js'
import User from './modules/user.js'

const users = []
const socket = io('ws://localhost:3000')

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
})

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
