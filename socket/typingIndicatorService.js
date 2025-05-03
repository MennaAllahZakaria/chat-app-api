const userSocketMap = require('../utils/userSocketMap');

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
    } else if (type === 'private') {
      const recipientSocketId = userSocketMap[contextId]; // contextId = recipientId in private
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('typing', { ...typingData, contextId, type: 'private' });
      }
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
    } else if (type === 'private') {
      const recipientSocketId = userSocketMap[contextId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('typing', { ...typingData, contextId, type: 'private' });
      }
    }
  });
};
