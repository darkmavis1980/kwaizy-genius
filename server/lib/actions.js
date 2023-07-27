const handleMessage = (socket, payload) => {
  socket.emit('message', payload);
}

const dispatcher = (socket, message) => {
  const { action, payload } = message;

  const dispatcherMap = {
    chatMessage: (payload) => {
      socket.emit('message', {
        action: 'chatMessage',
        payload,
      });
    }
  }

  if (dispatcherMap[action]) {
    dispatcherMap[action](payload);
  }
}

module.exports = {
  handleMessage,
  dispatcher,
}