const jwt = require('jsonwebtoken');
const joinRoom = require('./joinRoomService');
const sendMessage = require('./sendMessageServise');
const typingIndicator = require('./typingIndicatorService');
const connectedUsers = require('../utils/userSocketMap');
const { getAllMessagesBetweenUsers } = require('../services/messageService');

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

  io.on('connection', async (socket) => {
    const user = socket.user?.user; 
    const userId = user?.id;        

    if (!userId) {
      console.log(token);
      console.error('❌ Connection failed: Missing user ID from token payload');
      return socket.disconnect();
    }

    connectedUsers.set(userId, socket.id);
    console.log(`✅ Connected: ${userId} -> ${socket.id}`);

    try {
      const allMessages = await getAllMessagesBetweenUsers(userId);

      allMessages.forEach((message) => {
        socket.emit('private:new', {
          senderId: message.senderId,
          recipientId: message.recipientId,
          content: message.content,
          username: message.username || 'Unknown',
          timestamp: message.timestamp,
        });
      });
    } catch (error) {
      console.error('❌ Error fetching all messages:', error);
    }

    joinRoom(socket);
    sendMessage(socket, io);
    typingIndicator(socket, io);

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`❌ Disconnected: ${userId}`);
    });
  });
};
