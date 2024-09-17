module.exports = (socket, io) => {
    // Receive message event for rooms
    socket.on('message:receive', ({ roomId, userId, content, username, timestamp }) => {
      // Send the received message to the room
      io.to(roomId).emit('message:new', {
        roomId,
        userId,
        content,
        username,
        timestamp,
      });
      console.log(`Message received in room ${roomId} from user ${userId}`);
    });
  
    socket.on('private:receive', ({ senderId, recipientId, content, username, timestamp }) => {
      // Send the received message to the recipient's private room
      io.to(recipientId).emit('private:new', {
        senderId,
        recipientId,
        content,
        username,
        timestamp,
      });
      console.log(`Private message received from ${senderId} to ${recipientId}`);
    });
  

  };
  