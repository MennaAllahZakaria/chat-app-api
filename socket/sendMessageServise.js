const { createMessageSocket, createPrivateMessageSocket } = require('../services/messageService');
const connectedUsers = require('../utils/userSocketMap'); // استيراد Map

module.exports = (socket, io) => {
  // 🟢 إرسال رسالة إلى الغرفة
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

  // 🟣 إرسال رسالة خاصة
  socket.on('private:send', async ({ recipientId, content }, callback) => {
    try {
      if (!recipientId || !content || content.trim() === '') {
        return callback({ success: false, message: 'Recipient ID and content are required' });
      }
      const userId = socket.user._id;
      console.log(`Sending private message from ${userId} to ${recipientId}`);

      // تحقق من الاتصال قبل إرسال الرسالة
      const recipientSocketId = connectedUsers.get(recipientId); // استخدام Map بدلاً من userSocketMap
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

  // عند الاتصال، إضافة المستخدم إلى الـ Map
  io.on('connection', (socket) => {
    const userId = socket.user._id;
    connectedUsers.set(userId, socket.id); // حفظ الـ socket.id للمستخدم في الـ Map

    console.log(`User connected: ${userId} -> ${socket.id}`);

    // عند الانقطاع، حذف الـ socket.id من الـ Map
    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`User disconnected: ${userId}`);
    });
  });
};
