const { createMessageSocket, createPrivateMessageSocket } = require('../services/messageService');
const userSocketMap = require('../utils/userSocketMap'); 

module.exports = (socket, io) => {
  // 🟢 Message to Room
  socket.on('message:send', async ({ roomId, content }, callback) => {
    try {
      const newMessage = await createMessageSocket({
        roomId,
        userId: socket.user._id,
        content,
      });

      io.to(roomId).emit('message:receive', {
        roomId,
        userId: socket.user._id,
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
      const userId = socket.user._id;
      console.log(`Sending private message from ${userId} to ${recipientId}`);
  
      // تحقق من الاتصال قبل إرسال الرسالة
      const recipientSocketId = userSocketMap[recipientId];
      if (recipientSocketId) {
        console.log(`Recipient is connected: ${recipientId}`);
        
        const newMessage = await createPrivateMessageSocket({
          senderId: userId,
          recipientId,
          content,
        });
  
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
        console.log(`Recipient ${recipientId} is not connected`);
        callback({ success: false, message: 'Recipient not connected' });
      }
    } catch (error) {
      console.error('Private message error:', error);
      callback({ success: false, message: 'An error occurred while sending the private message' });
    }
  });
};