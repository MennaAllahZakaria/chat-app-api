const jwt = require('jsonwebtoken');
const joinRoom = require('./joinRoomService');
const sendMessage = require('./sendMessageServise');
const typingIndicator = require('./typingIndicatorService');
const connectedUsers = require('../utils/userSocketMap'); // استيراد Map

module.exports = (io) => {
  // ✅ Middleware للتحقق من المصادقة
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: Token is required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  // ✅ التعامل مع الاتصال
  io.on('connection', (socket) => {
    const userId = socket.user._id;
    
    // حفظ socket.id للمستخدم في الـ Map
    connectedUsers.set(userId, socket.id); 

    console.log(`✅ User connected: ${socket.id} (${socket.user.username})`);

    // ✅ Emit connection verified
    socket.emit('connection:verified', {
      status: 'connected',
      userId,
      username: socket.user.username,
    });

    // ✅ التعامل مع الأحداث المختلفة
    joinRoom(socket);           
    sendMessage(socket, io);    
    typingIndicator(socket, io);  

    // 🔴 عند انقطاع الاتصال
    socket.on('disconnect', (reason) => {
      // إزالة socket.id من الـ Map عند انقطاع الاتصال
      connectedUsers.delete(userId); 
      console.log(`❌ User disconnected: ${socket.id} (${socket.user.username}) - Reason: ${reason}`);
    });

    // 🛑 التعامل مع الأخطاء
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.user.username}:`, error);
      socket.emit('error', error.message);
    });
  });
};
