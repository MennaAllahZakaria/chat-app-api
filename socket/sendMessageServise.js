const { createMessageSocket,createPrivateMessageSocket } = require('../services/messageService');
const socketConnection = require('./socketConnection');

module.exports = (socket, io) => {
  // Verify connection and authentication
  if (!socket.connected) {
    console.error('Socket is not connected');
    return;
  }

  if (!socket.user || !socket.user._id) {
    console.error('Socket is not authenticated');
    socket.emit('error', 'Authentication required');
    return;
  }

  // Log successful connection
  console.log(`Socket connected for user: ${socket.user.username} (${socket.user._id})`);

  // Connection verification event
  socket.emit('connection:verified', { 
    status: 'connected',
    userId: socket.user._id,
    username: socket.user.username
  });

  socket.on('message:send', async ({ roomId, content }) => {
    try {
      const newMessage = await createMessageSocket({
        roomId,
        userId: socket.user._id,
        content,
      });

      // Broadcast the message to the room
      io.to(roomId).emit('message:receive', {
        roomId,
        userId: socket.user._id,
        content,
        username: socket.user.username,
        timestamp: newMessage.timestamp,
      });
    } catch (error) {
      socket.emit('error', 'An error occurred while sending the message');
    }
  });

  socket.on('private:send', async ({ recipientId, content }) => {
    try {
      if (!recipientId || !content || content.trim() === '') {
        return socket.emit('error', `Recipient ID and content are required ${recipientId} , ${content}`);
      }

      const newMessage = await createPrivateMessageSocket({
        senderId: socket.user._id,
        recipientId,
        content,
      });

      io.to(recipientId).emit('private:receive', {
        senderId: socket.user._id,
        recipientId,
        content: content.trim(),
        username: socket.user.username,
        timestamp: newMessage.timestamp,
      });
    } catch (error) {
      socket.emit('error', 'An error occurred while sending the private message');
    }
  });

  // When user logs in and gets a token
  const token = 'YOUR_JWT_TOKEN'; // Get this from your login response

  // Connect to socket
  try {
    socketConnection.connect(token);
  } catch (error) {
    console.error('Failed to connect to socket:', error);
  }

  // Join a room
  socketConnection.joinRoom('roomId');

  // Send a message
  socketConnection.sendMessage('roomId', 'Hello everyone!');

  // Send a private message
  socketConnection.sendPrivateMessage('recipientId', 'Hello!');

  // Typing indicators
  socketConnection.startTyping('roomId');
  // ... when user stops typing
  socketConnection.stopTyping('roomId');

  // Disconnect when needed
  socketConnection.disconnect();
};
