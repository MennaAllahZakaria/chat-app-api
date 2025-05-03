const asyncHandler=require("express-async-handler");

const Message= require('../models/messageModel');
const PrivateMessage= require('../models/privateMessageModel');
const handlerFactory=require("./handlerFactory");

//---------------------------------CREATE--------------------------------

// @desc    Create Message
// @route   POST  /api/v1/messages
// @access  Private
exports.createMessage=asyncHandler(async(req, res, next) => {
    req.body.userId=req.user._id;
    const newMessage = await Message.create(req.body);
    res.status(201).json({ data: newMessage });

});

// @desc    Create Private Message
// @route   POST  /api/v1/messages/private
// @access  Private
exports.createPrivateMessage=asyncHandler(async(req, res, next) => {
    req.body.senderId=req.user._id;
    const newMessage = await PrivateMessage.create(req.body);
    res.status(201).json({ data: newMessage });

});
//---------------------------------CREATE SOCKET--------------------------------
// @desc    Create Message Socket

exports.createMessageSocket = async ({ roomId, userId, content }) => {
    const message = await Message.create({
        roomId,
        userId,
        content,
        timestamp: Date.now()
    });
    return message;
};

// @desc    Create Private Message Socket
exports.createPrivateMessageSocket = async ({ senderId, recipientId, content }) => {
    const privateMessage = await Message.create({
        senderId,
        recipientId,
        content,
        isPrivate: true,
        timestamp: Date.now()
    });
    return privateMessage;
};

    // خدمة للحصول على الرسائل غير المرسلة للمستقبل
    exports.getUnsentMessagesForUser = async (recipientId) => {
        try {
        const unsentMessages = await Message.find({
            recipientId: recipientId,
            isSent: false, // التأكد أن الرسائل لم تُرسل بعد
        });
        return unsentMessages;
        } catch (error) {
        console.error("Error fetching unsent messages:", error);
        return [];
        }
    };
    // خدمة لتحديث الرسائل لتصبح مرسلة بعد إرسالها
    exports.markMessagesAsSent = async (messages) => {
        try {
        const messageIds = messages.map(msg => msg._id);
        await Message.updateMany(
            { _id: { $in: messageIds } },
            { $set: { isSent: true } } // تحديث الحالة إلى "تم الإرسال"
        );
        } catch (error) {
        console.error("Error marking messages as sent:", error);
        }
    };
    
exports.getAllMessagesBetweenUsers = async (userId) => {
    return PrivateMessage.find({
      $or: [
        { senderId: userId },
        { recipientId: userId }
      ],
    }).sort({ createdAt: 1 });  // ترتيب الرسائل حسب وقت الإنشاء
  };
//---------------------------------GET ONE--------------------------------

// @desc    Get specific Message by id
// @route   GET /api/v1/messages/:id
// @access  Private/admin-user
exports.getMessage =handlerFactory.getOne(Message);

// @desc    Get specific Private Message by id
// @route   GET /api/v1/messages/private/:id
// @access  Private/admin-user
exports.getPrivateMessage =handlerFactory.getOne(PrivateMessage);

//---------------------------------GET ALL--------------------------------

// @desc    Get list of Messages
// @route   GET /api/v1/messages
// @access  Private/admin-user
exports.getMessages = handlerFactory.getAll(Message);


// @desc    Get list of Messages Private
// @route   GET /api/v1/messages/private
// @access  Private/admin-user
exports.getPrivateMessages = handlerFactory.getAll(Message);

//---------------------------------UPDATE--------------------------------

// @desc    Update specific Message
// @route   PUT /api/v1/messages/:id
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
});

// @desc    Update specific Private Message 
// @route   PUT /api/v1/messages/private/:id
// @access  Private/admin
exports.updatePrivateMessage =asyncHandler(async(req, res, next) => {
    const message = await PrivateMessage.findByIdAndUpdate(req.params.id,
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
});

//---------------------------------DELETE--------------------------------
// @desc    Delete specific Message
// @route   DELETE /api/v1/messages/:id
// @access  Private/admin
exports.deleteMessage =handlerFactory.deleteOne(Message);

// @desc    Delete specific Private Message
 // @route   DELETE /api/v1/messages/private/:id
 // @access  Private/admin
exports.deletePrivateMessage = handlerFactory.deleteOne(PrivateMessage);

