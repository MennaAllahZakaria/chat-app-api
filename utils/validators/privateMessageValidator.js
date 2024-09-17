const{check}=require("express-validator");

const validatorMiddleware=require("../../middelwares/validatorMiddleware");

const Message=require('../../models/messageModel');
const User=require('../../models/userModel');

exports.createPrivateMessageValidator=[
    check('senderId')
            .notEmpty().withMessage('User id is required')
            .isMongoId().withMessage('Invalid User id format')
            .custom(async (userId, {req})=>{
                const user=await User.findById(userId);
                if(!user){
                    throw new Error('There is no user for this id');
                }

            }),
            check('recipientId')
            .notEmpty().withMessage('User id is required')
            .isMongoId().withMessage('Invalid User id format')
            .custom(async (userId, {req})=>{
                const user=await User.findById(userId);
                if(!user){
                    throw new Error('There is no user for this id');
                }

            }),

    check('content')
            .notEmpty().withMessage('Content is required'),
    validatorMiddleware
];


exports.updatePrivateMessageValidator=[
    check('id')
                .notEmpty().withMessage("id is required")
                .isMongoId().withMessage('Invalid Message id format'),
    
    validatorMiddleware,
];
exports.getPrivateMessageValidator=[
    check('id')
            .notEmpty().withMessage("id is required")
            .isMongoId().withMessage('Invalid Message id format')

    ,validatorMiddleware
];

exports.deletePrivateMessageValidator=[
    check('id')
            .notEmpty().withMessage("id is required")
            .isMongoId().withMessage('Invalid Message id format')
        
    ,validatorMiddleware
];
