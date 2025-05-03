const jwt = require('jsonwebtoken');
const joinRoom = require('./joinRoomService');
const sendMessage = require('./sendMessageServise');
const typingIndicator = require('./typingIndicatorService');
const connectedUsers = require('../utils/userSocketMap');

module.exports = (io) => {
  io.use((socket, next) => {
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

  io.on('connection', (socket) => {
    const userId = socket.user._id;
    connectedUsers.set(userId, socket.id);
    console.log(`✅ Connected: ${userId} -> ${socket.id}`);

    joinRoom(socket);
    sendMessage(socket, io);
    typingIndicator(socket, io);

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`❌ Disconnected: ${userId}`);
    });
  });
};
