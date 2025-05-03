const jwt = require('jsonwebtoken');
const joinRoom = require('./joinRoomService');
const sendMessage = require('./sendMessageServise');
const typingIndicator = require('./typingIndicatorService');
const userSocketMap = require('../utils/userSocketMap'); 

module.exports = (io) => {
  // ✅ Authentication middleware
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

  // ✅ Connection handling
  io.on('connection', (socket) => {
    const userId = socket.user._id;
    userSocketMap[userId] = socket.id; // ✅ حفظ socket.id للمستخدم

    console.log(`✅ User connected: ${socket.id} (${socket.user.username})`);

    // ✅ Emit connection verified
    socket.emit('connection:verified', {
      status: 'connected',
      userId,
      username: socket.user.username,
    });

    // ✅ Handle different events
    joinRoom(socket);           
    sendMessage(socket, io);    
    typingIndicator(socket, io);  

    // 🔴 Disconnect
    socket.on('disconnect', (reason) => {
      delete userSocketMap[userId]; // ✅ إزالة socket.id عند فصل الاتصال
      console.log(`❌ User disconnected: ${socket.id} (${socket.user.username}) - Reason: ${reason}`);
    });

    // 🛑 Error handling
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.user.username}:`, error);
      socket.emit('error', error.message);
    });
  });
};
