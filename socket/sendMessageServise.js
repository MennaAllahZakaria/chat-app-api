const { createMessageSocket, createPrivateMessageSocket } = require('../services/messageService');

// خريطة لتخزين socket.id مقابل userId
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

  // 🟢 Message to Room
  socket.on('message:send', async ({ roomId, content }, callback) => {
    try {
      const newMessage = await createMessageSocket({
        roomId,
        userId,
        content,
      });

      io.to(roomId).emit('message:receive', {
        roomId,
        userId,
        content,
        username: socket.user.username,
        timestamp: newMessage.timestamp,
      });

      if (callback) {
        callback({
          success: true,
          message: 'Message sent successfully',
          data: newMessage,
        });
      }
    } catch (error) {
      console.error('Error while sending message:', error);
      socket.emit('error', 'An error occurred while sending the message');
    }
  });

  // 🟣 Private Message
  socket.on('private:send', async ({ recipientId, content }, callback) => {
    try {
      if (!recipientId || !content || content.trim() === '') {
        return callback({ success: false, message: 'Recipient ID and content are required' });
      }

      const newMessage = await createPrivateMessageSocket({
        senderId: userId,
        recipientId,
        content,
      });

      const recipientSocketId = userSocketMap[recipientId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('private:receive', {
          senderId: userId,
          recipientId,
          content: content.trim(),
          username: socket.user.username,
          timestamp: newMessage.timestamp,
        });

        callback({
          success: true,
          message: 'Message sent successfully',
          data: newMessage,
        });
      } else {
        callback({ success: false, message: 'Recipient not connected' });
      }
    } catch (error) {
      console.error('Private message error:', error);
      callback({ success: false, message: 'An error occurred while sending the private message' });
    }
  });


  // 🔴 Handle disconnect
  socket.on('disconnect', () => {
    delete userSocketMap[userId];
    console.log(`❌ User disconnected: ${userId}`);
  });
};
