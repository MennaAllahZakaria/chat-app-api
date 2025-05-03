const userSocketMap = {};
module.exports = (socket, io) => {
    // Verify connection and authentication
    if (!socket.connected) {
      console.error('Socket is not connected');
      return;
    }
  
    if (!socket.user || !socket.user._id) {
      console.error('Socket is not authenticated');
      socket.emit('error', 'Authentication required');
      return;
    }
  
    const userId = socket.user._id;
    userSocketMap[userId] = socket.id;
  
    console.log(`✅ Socket connected for user: ${socket.user.username} (${userId})`);
  
    socket.emit('connection:verified', {
      status: 'connected',
      userId,
      username: socket.user.username,
    });
  
  
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

  
  // 🔴 Handle disconnect
  socket.on('disconnect', () => {
    delete userSocketMap[userId];
    console.log(`❌ User disconnected: ${userId}`);
  });
};
