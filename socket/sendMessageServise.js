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
      // تحقق من وجود recipientId و content
      if (!recipientId || !content || content.trim() === '') {
        return callback({ success: false, message: 'Recipient ID and content are required' });
      }

      const userId = socket.user._id;

      // تخزين الرسالة في الداتا بيز
      const newMessage = await createPrivateMessageSocket({
        senderId: userId,
        recipientId,
        content,
        isSent: false, 
      });

      const recipientSocketId = connectedUsers.get(recipientId);

      // إذا كان المستقبل متصلًا، أرسل له الرسالة فورًا
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('private:new', {
          senderId: userId,
          recipientId,
          content: content.trim(),
          username: socket.user.username,
          timestamp: newMessage.timestamp,
        });
        await newMessage.updateOne({ isSent: true });
      }

      // رد للمُرسل بأن الرسالة تم حفظها بنجاح
      callback({
        success: true,
        message: 'Message saved successfully',
        data: newMessage,
      });
    } catch (error) {
      console.error('Error in private:send:', error);
      callback({ success: false, message: 'Error sending message' });
    }
  });
};
