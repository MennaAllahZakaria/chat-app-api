const jwt = require('jsonwebtoken');
const joinRoom = require('./joinRoomService');
const sendMessage = require('./sendMessageServise');
const typingIndicator = require('./typingIndicatorService');
const connectedUsers = require('../utils/userSocketMap');
const { getUnsentMessagesForUser, markMessagesAsSent } = require('../services/messageService'); 

module.exports = async (io) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Token is required'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user._id;
    connectedUsers.set(userId, socket.id);
    console.log(`✅ Connected: ${userId} -> ${socket.id}`);

    // تحقق إذا كان هناك رسائل غير مرسلة لهذا المستخدم
    try {
      const unsentMessages = await getUnsentMessagesForUser(userId);

      if (unsentMessages.length > 0) {
        // إرسال الرسائل غير المرسلة للمستقبل عند الاتصال
        unsentMessages.forEach((message) => {
          socket.emit('private:new', {
            senderId: message.senderId,
            recipientId: message.recipientId,
            content: message.content,
            username: message.username,
            timestamp: message.timestamp,
          });
        });

        // بمجرد إرسال الرسائل، قم بحذفها من قائمة الرسائل غير المرسلة
        await markMessagesAsSent(unsentMessages);
      }
    } catch (error) {
      console.error('Error fetching unsent messages:', error);
    }

    // خدمات أخرى مثل الانضمام إلى الغرف، إرسال الرسائل، وغيرها
    joinRoom(socket);
    sendMessage(socket, io);
    typingIndicator(socket, io);

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`❌ Disconnected: ${userId}`);
    });
  });
};
