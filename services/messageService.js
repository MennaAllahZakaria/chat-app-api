const asyncHandler=require("express-async-handler");

const Message= require('../models/messageModel');
const handlerFactory=require("./handlerFactory");


// @desc    Create Message
// @route   POST  /api/v1/Messages
// @access  Private
exports.createMessage=asyncHandler(async(req, res, next) => {
    req.body.userId=req.user._id;
    const newMessage = await Message.create(req.body);
    res.status(201).json({ data: newMessage });

});

// @desc    Get specific Message by id
// @route   GET /api/v1/Messages/:id
// @access  Private/admin-user
exports.getMessage =handlerFactory.getOne(Message);

// @desc    Get list of Messages
// @route   GET /api/v1/Messages
// @access  Private/admin-user
exports.getMessages = handlerFactory.getAll(Message);

// @desc    Update specific Message
// @route   PUT /api/v1/Messages/:id
// @access  Private/admin
exports.updateMessage =asyncHandler(async(req, res, next) => {
    const message = await Message.findByIdAndUpdate(req.params.id,
        {
            content: req.body.content
    }
    , {
        new: true,
    });

    if (!message) {
        return next(
        new ApiError(`No Message for this id ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ data: message });
})

// @desc    Delete specific Message
// @route   DELETE /api/v1/Messages/:id
// @access  Private/admin
exports.deleteMessage =handlerFactory.deleteOne(Message);

