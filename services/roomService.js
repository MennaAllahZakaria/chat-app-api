
const Room = require('../models/roomModel');
const handlerFactory=require("./handlerFactory");



// @desc    Create Room
// @route   POST  /api/v1/Rooms
// @access  Private
exports.createRoom=handlerFactory.createOne(Room);


// @desc    Get specific Room by id
// @route   GET /api/v1/Rooms/:id
// @access  Private/admin
exports.getRoom =handlerFactory.getOne(Room);

// @desc    Get list of Rooms
// @route   GET /api/v1/Rooms
// @access  Private/admin
exports.getRooms = handlerFactory.getAll(Room);

// @desc    Update specific Room
// @route   PUT /api/v1/Rooms/:id
// @access  Private/admin
exports.updateRoom =handlerFactory.updateOne(Room);


// @desc    Delete specific Room
// @route   DELETE /api/v1/Rooms/:id
// @access  Private/admin
exports.deleteRoom =handlerFactory.deleteOne(Room);

