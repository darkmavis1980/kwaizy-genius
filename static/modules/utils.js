export const getCurrentChatName = () => localStorage.getItem('name') || undefined;

export const emitName = (socket, value) => {
  const data = {
    action: 'setName',
    payload: {
      name: value,
    }
  }
  socket.emit('message', JSON.stringify(data));
};
