const{check}=require("express-validator");

const validatorMiddleware=require("../../middelwares/validatorMiddleware");

const Room=require('../../models/roomModel');

exports.createRoomValidator=[
    check('name')
            .notEmpty()
            .withMessage('Name is required'),
    check('description')
            .optional(),

    validatorMiddleware
];

exports.updateRoomValidator=[
    check('id')
            .notEmpty().withMessage("id is required")
            .isMongoId().withMessage('Invalid Room id format'),
    check('name')
            .optional(),

    check('description')
            .optional()
        
    ,validatorMiddleware
];

exports.getRoomValidator=[
    check('id')
            .notEmpty().withMessage("id is required")
            .isMongoId().withMessage('Invalid Room id format')

    ,validatorMiddleware
];

exports.deleteRoomValidator=[
    check('id')
            .notEmpty().withMessage("id is required")
            .isMongoId().withMessage('Invalid Room id format')
        
    ,validatorMiddleware];