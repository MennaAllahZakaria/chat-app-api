const{check}=require("express-validator");

const validatorMiddleware=require("../../middelwares/validatorMiddleware");

const Message=require('../../models/messageModel');
const User=require('../../models/userModel');
const Room=require('../../models/roomModel');

exports.createMessageValidator=[
    check('userId')
            .notEmpty().withMessage('User id is required')
            .isMongoId().withMessage('Invalid User id format')
            .custom(async (userId, {req})=>{
                const user=await User.findById(userId);
                if(!user){
                    throw new Error('There is no user for this id');
                }

            }),

    check('roomId')
            .notEmpty().withMessage('Room id is required')
            .isMongoId().withMessage('Invalid Room id format')
            .custom(async (roomId, {req})=>{
                const room=await Room.findById(roomId);
                if(!room){
                    throw new Error('There is no room for this id');
                }
            }),
    check('content')
            .notEmpty().withMessage('Content is required'),
    validatorMiddleware
];


exports.updateMessageValidator=[
    check('id')
                .notEmpty().withMessage("id is required")
                .isMongoId().withMessage('Invalid Message id format'),
    
    validatorMiddleware,
];
exports.getMessageValidator=[
    check('id')
            .notEmpty().withMessage("id is required")
            .isMongoId().withMessage('Invalid Message id format')

    ,validatorMiddleware
];

exports.deleteMessageValidator=[
    check('id')
            .notEmpty().withMessage("id is required")
            .isMongoId().withMessage('Invalid Message id format')
        
    ,validatorMiddleware
];
