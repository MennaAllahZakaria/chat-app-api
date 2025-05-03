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
  socket.on('message:send', async ({ roomId, content }, callback) => {
    try {
      console.log(`Message sending... Room ID: ${roomId}, Content: ${content}`);
  
      const newMessage = await createMessageSocket({
        roomId,
        userId: socket.user._id,
        content,
      });
  
      console.log(`New message created:`, newMessage);
  
      // Broadcast the message to the room
      io.to(roomId).emit('message:receive', {
        roomId,
        userId: socket.user._id,
        content,
        username: socket.user.username,
        timestamp: newMessage.timestamp,
      });
  
      // ✅ Send success callback to sender
      if (callback) {
        callback({
          success: true,
          message: 'Message sent successfully',
          data: newMessage,
        });
      } else {
        console.error('No callback function provided');
      }
  
    } catch (error) {
      console.error('Error while sending message:', error);
      socket.emit('error', 'An error occurred while sending the message');
    }
  });
  

  socket.on('private:send', async ({ recipientId, content }, callback) => {
    try {
      console.log('🔥 Received private:send from:', socket.user._id);
      if (!recipientId || !content || content.trim() === '') {
        return callback({ success: false, message: 'Recipient ID and content are required' });
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
  
      // ✅ Send success callback to sender
      callback({
        success: true,
        message: 'Message sent successfully',
        data: newMessage,
      });
  
    } catch (error) {
      console.error('Private message error:', error);
  
      // ✅ Send error callback to sender
      callback({ success: false, message: 'An error occurred while sending the private message' });
    }
  });
  
  

};
