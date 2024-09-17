const Room = require('../models/roomModel');

module.exports = (socket) => {
  socket.on('room:join', async ({ roomId }) => {
    try {
      const room = await Room.findById(roomId);
      if (room) {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
      } else {
        socket.emit('error', 'Room not found');
      }
    } catch (error) {
      socket.emit('error', 'An error occurred while joining the room');
    }
  });
};
