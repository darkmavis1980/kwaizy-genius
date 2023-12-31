const axios = require('axios');

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

const handleMessage = async (socket, payload) => {
  socket.emit('message', payload);
}

const dispatcher = async (io, socket, message) => {
  const { action, payload } = message;

  const dispatcherMap = {
    setName: async (payload) => {
      const { id } = socket;
      const { players } = io;
      const player = players.get(id);

      const playerData = {...player, ...payload};
      players.set(id, playerData);
      io.players = players;

      console.log(players);

      io.emit('message', {
        action: 'playersList',
        payload: Array.from(players),
      });
    },
    setPosition: async (payload) => {
      const { id } = socket;
      const { players } = io;
      const player = players.get(id);

      const playerData = {...player, ...payload};
      players.set(id, playerData);
      io.players = players;
      io.emit('message', {
        action: 'playersList',
        payload: Array.from(players),
      });
    },
    setSkin: async (payload) => {
      const { id } = socket;
      const { players } = io;
      const player = players.get(id);

      const playerData = {...player, ...payload};
      players.set(id, playerData);
      io.players = players;
      socket.emit('message', {
        action: 'playersList',
        payload: Array.from(players),
      });
    },
    playersList: async (payload) => {
      socket.emit('message', {
        action: 'playersList',
        payload: Array.from(players),
      });
    },
    chatMessage: async (payload) => {
      const currentPlayer = io.players.get(socket.id);
      io.emit('message', {
        action: 'chatMessage',
        payload: {
          message: payload,
          userId: socket.id,
          userName: currentPlayer.name,
          date: new Date(),
        },
      });
    },
    askGenius: async (payload) => {
      const {
        OPENAI_KEY,
      } = process.env;

      const OPENAI_HEADERS = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`
      }

      const openAIRequest = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: payload,
          }
        ],
    }
      const { data } = await axios.post(OPENAI_ENDPOINT, openAIRequest, {
        headers: OPENAI_HEADERS,
      });
      const { choices } = data;

      io.emit('message', {
        action: 'geniusReply',
        payload: {
          message: choices[0],
          userName: 'Genius',
          date: new Date(),
        }
      });
    },
    userMove: async (payload) => {
      console.log('userMove',payload)
    }
  }

  if (dispatcherMap[action]) {
    await dispatcherMap[action](payload);
  }
}

module.exports = {
  handleMessage,
  dispatcher,
}