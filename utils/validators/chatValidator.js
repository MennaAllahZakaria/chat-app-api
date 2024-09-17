const{check}=require("express-validator");

const validatorMiddleware=require("../../middelwares/validatorMiddleware");

exports.getRoomChatHistoryValidator=[
    check('roomId')
        .notEmpty().withMessage('Room id is required')
        .isMongoId().withMessage('Invalid Room id format')
    ,validatorMiddleware
];

exports.getPrivateChatHistoryValidator=[
    check('userId')
        .notEmpty().withMessage('User id is required')
        .isMongoId().withMessage('Invalid User id format')
    ,validatorMiddleware
];