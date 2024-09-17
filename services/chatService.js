const asyncHandler=require("express-async-handler");

const ApiError = require("../utils/ApiError");

const Room = require('../models/roomModel');
const User = require('../models/userModel');
const Message= require('../models/messageModel');
const PrivateMessage= require('../models/privateMessageModel');
const {sanitizeMessages,sanitizePrivateMessages}=require('../utils/sanitizeData');

// @desc    Get chat history of room chat
// @route   GET  /api/v1/chats
// @access  Private(user)

exports.getChatstHistoryOfRoom=asyncHandler(async(req,res,next)=>{

    const roomId=req.body.roomId;
    const room=await Room.findById(roomId);
    if(!room) return next(new ApiError('Room not found',404));

    const messages=await Message.find({roomId}).sort({createdAt:-1});

    if (!messages.length){
        return next(
            new ApiError('No messages found for this room', 404)
        );
    }
    res.status(200).json({
            success:true,
            result:messages.length,
            data:sanitizeMessages(messages)
    });

});

// @desc    Get chat history of private 
// @route   GET  /api/v1/chats/private
// @access  Private(user)

exports.getChatstHistoryOfPrivateChat=asyncHandler(async(req,res,next)=>{

    const userId=req.body.usererId;
    const loggedUserId=req.User._id;

    if(userId===loggedUserId){
        return next(new ApiError('You can not chat with yourself',400));
    }
    const user=await User.findById(userId);
    if(!user) return next(new ApiError('User not found',404));

    const messages=PrivateMessage.find({
        $or: [
            { $and: [{ senderId: loggedUserId }, { recipientId: userId }] },
            { $and: [{ senderId: userId }, { recipientId: loggedUserId }] }
        ]
        }).sort({ timestamp: 1 });
    

    if (!messages.length){
        return next(
            new ApiError('No messages found for this private chat', 404)
        );
    }
    res.status(200).json({
            success:true,
            result:messages.length,
            data: sanitizePrivateMessages(messages)
    });
    
});