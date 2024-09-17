const { createMessage } = require('../services/messageService');

module.exports = (socket, io) => {
  socket.on('message:send', async ({ roomId, message }) => {
    try {
      const newMessage = await createMessage({
        roomId,
        userId: socket.user._id,
        message,
      });

      // Broadcast the message to the room
      io.to(roomId).emit('message:receive', {
        roomId,
        userId: socket.user._id,
        content,
        username: socket.user.username,
        timestamp: newMessage.timestamp,
      });
    } catch (error) {
      socket.emit('error', 'An error occurred while sending the message');
    }
  });
};
