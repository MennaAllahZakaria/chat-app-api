const io = require('socket.io-client');

class SocketConnection {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.token = null;
  }

  connect(token) {
    if (!token) {
      throw new Error('Token is required for socket connection');
    }

    this.token = token;

    this.socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
      this.isConnected = true;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      this.isConnected = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('message:new', (message) => {
      console.log('New message received:', message);
    });

    this.socket.on('private:new', (message) => {
      console.log('New private message received:', message);
    });

    this.socket.on('typing', (data) => {
      console.log('Typing indicator:', data);
    });
  }

  joinRoom(roomId) {
    if (!this.isConnected) throw new Error('Socket is not connected');
    this.socket.emit('room:join', { roomId });
  }

  sendMessage(roomId, content, callback) {
    if (!this.isConnected) throw new Error('Socket is not connected');
    this.socket.emit('message:send', { roomId, content }, (response) => {
      if (callback) callback(response);
    });
  }

  sendPrivateMessage(recipientId, content, callback) {
    if (!this.isConnected) throw new Error('Socket is not connected');
    this.socket.emit('private:send', { recipientId, content }, (response) => {
      if (callback) callback(response);
    });
  }

  // Start typing indicator (room or private)
  startTyping(contextId, type = 'room') {
    if (!this.isConnected) {
      throw new Error('Socket is not connected');
    }
    this.socket.emit('typing:start', { contextId, type });
  }

  // Stop typing indicator (room or private)
  stopTyping(contextId, type = 'room') {
    if (!this.isConnected) {
      throw new Error('Socket is not connected');
    }
    this.socket.emit('typing:stop', { contextId, type });
  }


  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

module.exports = new SocketConnection();
