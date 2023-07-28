const chatLog = document.getElementById('chat-log');

const CHAT_DIRECTION = 'UP';

const createChatMessage = (payload, type = 'question') => {
  const msg = document.createElement('li');
  msg.classList.add('chat-message');

  const span = document.createElement('p');
  const spanClass = type === 'question' ? 'username' : 'genius';
  span.classList.add(spanClass)
  span.textContent = `${payload.userName}`;

  msg.appendChild(span);
  const paragraph = document.createElement('p');
  paragraph.classList.add(type);
  paragraph.textContent = payload.message;

  msg.appendChild(paragraph);
  const injectMethod = CHAT_DIRECTION === 'UP' ? 'prepend' : 'append';
  chatLog[injectMethod](msg);
}

export const eventDispatcher = (socket, message) => {
  const { action, payload } = message;
  console.log(action, payload);

  const eventsMap = {
    playersList: () => {
      console.log('client player list', payload);
    },
    geniusReply: () => {
      const { message: { message: { content }}, userName} = payload;
      createChatMessage({
        message: content,
        userName,
      }, 'answer');
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
