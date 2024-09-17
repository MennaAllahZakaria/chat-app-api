module.exports = (socket, io) => {
    // Receive message event for rooms
    socket.on('message:receive', ({ roomId, userId, message, username, timestamp }) => {
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
  

  };
  