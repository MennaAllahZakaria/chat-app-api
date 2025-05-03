const path = require('path');
const express = require("express");
const cors = require('cors');
const compression = require('compression');
const http = require('http');
const socketIo = require('socket.io');
const socketHandlers = require('./socket/socket');

const dotenv = require("dotenv");
const morgan = require("morgan");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "config.env") });

const dbConnection = require('./config/database');
const ApiError = require("./utils/ApiError");
const globalError = require('./middelwares/errorMiddleware');
const mountRoutes = require('./routes/index');

// Express app
const app = express();

// CORS configuration: Allow requests from development and production environments
const corsOptions = {
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',  // التطوير
    process.env.REACT_APP_API_URL  // الإنتاج على Railway
  ],
  credentials: true,  // السماح باستخدام الكوكيز
};

// Use CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('dev'));

// Create HTTP server
const server = http.createServer(app);

// Socket.IO configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Connect to DB
console.log('Attempting to connect to database...');
dbConnection();

const Verification = require("./models/codeModel");

const deleteExpiredVerifications = async () => {
  const now = new Date();

  try {
    // Find all expired records
    const expiredVerifications = await Verification.find({
      expiresAt: { $lt: now },
    });

    // Delete all expired records
    await Verification.deleteMany({
      _id: { $in: expiredVerifications.map((v) => v._id) },
    });

    console.log(
      `${expiredVerifications.length} expired verifications deleted.`
    );
  } catch (err) {
    console.error("Error deleting expired verifications:", err);
  }
};

// Call the function to clean up expired verification codes
deleteExpiredVerifications();

// Mount routes
mountRoutes(app);

// Initialize socket handlers
socketHandlers(io);

// Error handling middleware
app.use(globalError);

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

const PORT = process.env.PORT || 5000;
console.log(`Starting server on port ${PORT}...`);
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Database URI: ${process.env.DB_URI ? 'Set' : 'Not set'}`);

server.listen(PORT, () => {
  console.log(`App Running on port ${PORT}`);
  console.log(`Server is ready to accept connections`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.log(`UnhandledRejection Errors: ${err}`);
  server.close(() => {
    console.error('Shutting Down...');
    process.exit(1);
  });
});
