module.exports = (socket, io) => {
    // Event for when a user starts typing
    socket.on('typing:start', ({ roomId }) => {
      // Broadcast to other users in the room that someone is typing
      socket.broadcast.to(roomId).emit('typing', {
        userId: socket.user._id,
        username: socket.user.username,
        typing: true,
      });
      console.log(`${socket.user.username} is typing in room ${roomId}`);
    });
  
    // Event for when a user stops typing
    socket.on('typing:stop', ({ roomId }) => {
      // Broadcast to other users in the room that typing has stopped
      socket.broadcast.to(roomId).emit('typing', {
        userId: socket.user._id,
        username: socket.user.username,
        typing: false,
      });
      console.log(`${socket.user.username} stopped typing in room ${roomId}`);
    });
  };
  