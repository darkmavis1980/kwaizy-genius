const chatLog = document.getElementById('chat-window');

const createChatMessage = (message, type = 'question') => {
  const msg = document.createElement('li');

  chatLog.append(msg);
}

export const eventDispatcher = (socket, message) => {
  const { action, payload } = message;

  const eventsMap = {
    playersList: () => {
      console.log('player list', payload);
    },
    geniusReply: () => {
      console.log('reply', payload);
    },
    chatMessage: () => {
      console.log('message', payload);
    },
    // your other messages
  }

  if (eventsMap[action]) {
    eventsMap[action](message);
  }
}

