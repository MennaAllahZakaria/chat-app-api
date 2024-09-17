const joinRoom = require('./joinRoomService');
const sendMessage = require('./sendMessageServise');
const receiveMessage = require('./receiveMessageService');
const typingIndicator = require('./typingIndicatorService');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle different events
    joinRoom(socket);           
    sendMessage(socket, io);    
    receiveMessage(socket, io); 
    typingIndicator(socket, io);  

    // Disconnect event
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
