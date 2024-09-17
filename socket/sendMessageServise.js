const { createMessage,createPrivateMessage } = require('../services/messageService');

module.exports = (socket, io) => {
  socket.on('message:send', async ({ roomId, content }) => {
    try {
      const newMessage = await createMessage({
        roomId,
        userId: socket.user._id,
        content,
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

  socket.on('private:send', async ({ recipientId, content }) => {
    try {
      if (!recipientId || !content || content.trim() === '') {
        return socket.emit('error', 'Invalid recipient or content');
      }

      const newMessage = await createPrivateMessage({
        senderId: socket.user._id,
        recipientId,
        content,
      });

      io.to(recipientId).emit('private:receive', {
        senderId: socket.user._id,
        recipientId,
        content: content.trim(),
        username: socket.user.username,
        timestamp: newMessage.timestamp,
      });
    } catch (error) {
      socket.emit('error', 'An error occurred while sending the private message');
    }
  });

};
