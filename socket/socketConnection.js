const io = require('socket.io-client');
const jwt = require('jsonwebtoken');

class SocketConnection {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.token = null;
  }

  // Initialize socket connection
  connect(token) {
    if (!token) {
      throw new Error('Token is required for socket connection');
    }

    this.token = token;

    // Create socket connection with authentication
    this.socket = io('http://localhost:5000', {
      auth: {
        token: token
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
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

    // Authentication error
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Message events
    this.socket.on('message:new', (message) => {
      console.log('New message received:', message);
    });

    this.socket.on('private:new', (message) => {
      console.log('New private message received:', message);
    });

    // Typing indicator events
    this.socket.on('typing', (data) => {
      console.log('Typing indicator:', data);
    });
  }

  // Join a room
  joinRoom(roomId) {
    if (!this.isConnected) {
      throw new Error('Socket is not connected');
    }
    this.socket.emit('room:join', { roomId });
  }

  // Send a message to a room
  sendMessage(roomId, content) {
    if (!this.isConnected) {
      throw new Error('Socket is not connected');
    }
    this.socket.emit('message:send', { roomId, content });
  }

  // Send a private message
  sendPrivateMessage(recipientId, content, callback) {
    if (!this.isConnected) {
      throw new Error('Socket is not connected');
    }
    this.socket.emit('private:send', { recipientId, content }, (response) => {
      if (callback) callback(response); 
    });
  }
  

  // Start typing indicator
  startTyping(roomId) {
    if (!this.isConnected) {
      throw new Error('Socket is not connected');
    }
    this.socket.emit('typing:start', { roomId });
  }

  // Stop typing indicator
  stopTyping(roomId) {
    if (!this.isConnected) {
      throw new Error('Socket is not connected');
    }
    this.socket.emit('typing:stop', { roomId });
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

module.exports = new SocketConnection(); 