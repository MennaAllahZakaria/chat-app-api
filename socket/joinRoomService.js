const userSocketMap = require('../utils/userSocketMap');

module.exports = (socket) => {
  socket.on('room:join', ({ roomId }) => {
    if (!roomId) return socket.emit('error', 'Room ID is required');

    socket.join(roomId);
    console.log(`${socket.user.username} joined room ${roomId}`);

    // ممكن تبعتي إشعار للأونلاين يوزرز (اختياري)
    const userId = socket.user._id;
    const socketId = userSocketMap[userId];

    socket.to(roomId).emit('room:userJoined', {
      userId,
      username: socket.user.username,
      socketId,
    });

    socket.emit('room:joined', { roomId });
  });
};
