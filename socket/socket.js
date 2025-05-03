const jwt = require('jsonwebtoken');
const joinRoom = require('./joinRoomService');
const sendMessage = require('./sendMessageServise');
const typingIndicator = require('./typingIndicatorService');
const connectedUsers = require('../utils/userSocketMap');
const { getUnsentMessagesForUser, markMessagesAsSent, getAllMessagesBetweenUsers } = require('../services/messageService');

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

    

    try {
      // جلب الرسائل بين المستخدمين
      const allMessages = await getAllMessagesBetweenUsers(userId);

      // إرسال جميع الرسائل للمستخدم عند دخوله المحادثة
      allMessages.forEach(message => {
        socket.emit('private:new', {
          senderId: message.senderId,
          recipientId: message.recipientId,
          content: message.content,
          username: message.username,
          timestamp: message.timestamp,
        });
      });
    } catch (error) {
      console.error('Error fetching all messages:', error);
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
