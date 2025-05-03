module.exports = (socket, io) => {
  socket.on('typing:start', ({ contextId, type }) => {
    if (!contextId || !type) return;

    const typingData = {
      userId: socket.user._id,
      username: socket.user.username,
      typing: true,
    };

    if (type === 'room') {
      socket.broadcast.to(contextId).emit('typing', { ...typingData, contextId, type: 'room' });
      console.log(`${socket.user.username} is typing in room ${contextId}`);
    } else if (type === 'private') {
      socket.to(contextId).emit('typing', { ...typingData, contextId, type: 'private' });
      console.log(`${socket.user.username} is typing privately to ${contextId}`);
    }
  });

  socket.on('typing:stop', ({ contextId, type }) => {
    if (!contextId || !type) return;

    const typingData = {
      userId: socket.user._id,
      username: socket.user.username,
      typing: false,
    };

    if (type === 'room') {
      socket.broadcast.to(contextId).emit('typing', { ...typingData, contextId, type: 'room' });
      console.log(`${socket.user.username} stopped typing in room ${contextId}`);
    } else if (type === 'private') {
      socket.to(contextId).emit('typing', { ...typingData, contextId, type: 'private' });
      console.log(`${socket.user.username} stopped typing privately to ${contextId}`);
    }
  });
};
