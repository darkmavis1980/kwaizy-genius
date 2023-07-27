const axios = require('axios');

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

const handleMessage = async (socket, payload) => {
  socket.emit('message', payload);
}

const dispatcher = async (socket, message) => {
  const { action, payload } = message;

  const dispatcherMap = {
    chatMessage: async (payload) => {
      socket.emit('message', {
        action: 'chatMessage',
        payload,
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
      console.log(choices);
      socket.emit('message', {
        action: 'geniusReply',
        payload: choices[0],
      })
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