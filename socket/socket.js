const jwt = require('jsonwebtoken');
const joinRoom = require('./joinRoomService');
const sendMessage = require('./sendMessageServise');
const receiveMessage = require('./receiveMessageService');
const typingIndicator = require('./typingIndicatorService');

module.exports = (io) => {
  // Authentication middleware
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

  // Connection handling
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id} (${socket.user.username})`);

    // Send connection verification
    socket.emit('connection:verified', {
      status: 'connected',
      userId: socket.user._id,
      username: socket.user.username
    });

    // Handle different events
    joinRoom(socket);           
    sendMessage(socket, io);    
    receiveMessage(socket, io); 
    typingIndicator(socket, io);  

    // Disconnect event
    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.id} (${socket.user.username}) - Reason: ${reason}`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.user.username}:`, error);
      socket.emit('error', error.message);
    });
  });
};
