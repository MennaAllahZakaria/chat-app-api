const Room = require('../models/roomModel');

module.exports = (socket) => {
  socket.on('room:join', async ({ roomId }) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        socket.emit('error', 'Invalid Room ID');
        return;
      }
      const room = await Room.findById(roomId);
      if (room) {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
      } else {
        socket.emit('error', 'Room not found');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', error.message || 'An error occurred while joining the room');
    }
  });
};
