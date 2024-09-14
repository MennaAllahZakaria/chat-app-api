const ApiError=require('../utils/ApiError');
const asyncHandler=require("express-async-handler");

const Room = require('../models/roomModel');
const User = require('../models/userModel');
const handlerFactory=require("./handlerFactory");
const {sanitizeUsers}=require('../utils/sanitizeData');




// @desc    Create Room
// @route   POST  /api/v1/rooms
// @access  Private/urer-admin
exports.createRoom=handlerFactory.createOne(Room);


// @desc    Get specific Room by id
// @route   GET /api/v1/rooms/:id
// @access  Private/user-admin
exports.getRoom =handlerFactory.getOne(Room);

// @desc    Get list of Rooms
// @route   GET /api/v1/rooms
// @access  Private/user-admin
exports.getRooms = handlerFactory.getAll(Room);

// @desc    Update specific Room
// @route   PUT /api/v1/rooms/:id
// @access  Private/user-admin
exports.updateRoom =handlerFactory.updateOne(Room);


// @desc    Delete specific Room
// @route   DELETE /api/v1/rooms/:id
// @access  Private/user-admin
exports.deleteRoom =handlerFactory.deleteOne(Room);


// @desc    Join specific Room
// @route   POST /api/v1/rooms/join/:id
// @access  Private/user

exports.joinRoom = asyncHandler(async (req, res, next) => {

    const room = await Room.findByIdAndUpdate(
        req.params.id, 
                        { $addToSet: { users: req.user._id } 
                }, { new: true }
            );

    if (!room) return next(new ApiError('Couldn\'t find this room.'),404);

    res.status(200).json({ success: true, data: room, message: "Joining to room sucessfully" });
});

// @desc    leave specific Room
// @route   POST /api/v1/rooms/leave/:id
// @access  Private/admin

exports.leaveRoom = asyncHandler(async (req, res, next) => {
    
    const room = await Room.findByIdAndUpdate(
        req.params.id, 
        { $pull: { users: req.user._id } 
    }, { new: true });

    if (!room) return next(new ApiError('Couldn\'t find this room.'),404);

    res.status(200).json({ success: true,  message: "Leaving room sucessfully" });

});

// @desc    Get Users In Room
// @route   GET /api/v1/rooms/getUsers/:id
// @access  Private

exports.getUsersInRoom = asyncHandler(async (req, res, next) => {
    
    const room = await Room.findById(req.params.id);

    if (!room) return next(new ApiError('Couldn\'t find this room.'),404);

    const users = await User.find({ _id: { $in: room.users } });

    res.status(200).json({  success: true,
                            results:users.length,
                            data: sanitizeUsers(users),
                            message: "Get users in room successfully" 
    });

});




