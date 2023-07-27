const chatLog = document.getElementById('chat-log');

const createChatMessage = (message, type = 'question') => {
  const msg = document.createElement('li');
  msg.classList.add('chat-message', type);
  const span = document.createElement('span');
  span.textContent = 'From:';
  msg.appendChild(span);
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  msg.appendChild(paragraph);
  chatLog.append(msg);
}

export const eventDispatcher = (socket, message) => {
  const { action, payload } = message;
  console.log(action, payload);

  const eventsMap = {
    playersList: () => {
      console.log('player list', payload);
    },
    geniusReply: () => {
      const { message: { content }} = payload;
      createChatMessage(content, 'answer');
    },
    chatMessage: () => {
      console.log('message', payload);
      createChatMessage(payload, 'question');
    },
    // your other messages
  }

  if (eventsMap[action]) {
    eventsMap[action](message);
  }
}

