const{check,body}=require("express-validator");
const slugify=require("slugify");

const bcrypt=require("bcryptjs");

const validatorMiddleware=require("../../middelwares/validatorMiddleware");

const User =require("../../models/userModel");

exports.createUserValidator=[
    check('username')
        .notEmpty().withMessage('User name is required')
        .isLength({min:3}).withMessage('Too short User name ')
        .custom((val,{req})=>{
            req.body.slug=slugify(val);
            return true;
        }),
        check('email')
        .notEmpty().withMessage('Email required')
        .isEmail().withMessage('Invalid email address')
        .custom((val) =>
            User.findOne({ email: val }).then((user) => {
            if (user) {
                return Promise.reject(new Error('E-mail already in user'));
                }
            })
        ),

    check('phone')
        .optional()
        .isMobilePhone("ar-EG").withMessage('Invalid EGYPT phone number'),
    
    check('password')
        .notEmpty().withMessage('password is required')
        .isLength({min:6}).withMessage('Too short User password ')
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error('Password Confirmation incorrect');
            }
            return true;
        }),
    check("passwordConfirm")
        .notEmpty().withMessage('password confirm is required'),
        
    check('profileImage')
        .optional(),
    check('role')
        .optional()
    
    ,validatorMiddleware
];

exports.getUserValidator=[
    check('id').notEmpty().withMessage("id is required")
                .isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
];


exports.updateUserValidator=[
    check('id')
                .notEmpty().withMessage("id is required")
                .isMongoId().withMessage('Invalid User id format'),
    body("username")
                .optional()
                .custom((val,{req})=>{
                        req.body.slug=slugify(val);
                        return true;
                    }),
    
    check('email')
            .notEmpty().withMessage('Email required')
            .isEmail().withMessage('Invalid email address')
            .custom((val) =>
                User.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error('E-mail already in user'));
                    }
                })
            ),

    check('phone')
            .notEmpty().withMessage('User phone is required')
            .isMobilePhone("ar-EG").withMessage('Invalid EGYPT phone number'),
    validatorMiddleware,
];



exports.updateLoggedUserValidator=[
    body("username")
                .optional()
                .custom((val,{req})=>{
                        req.body.slug=slugify(val);
                        return true;
                    }),
    
    check('email')
            .notEmpty().withMessage('Email required')
            .isEmail().withMessage('Invalid email address')
            .custom((val) =>
                User.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error('E-mail already in user'));
                    }
                })
            ),

    check('phone')
            .notEmpty().withMessage('User phone is required')
            .isMobilePhone("ar-EG").withMessage('Invalid EGYPT phone number'),
    validatorMiddleware,
];

exports.changeUserPasswordValidator=[
    check('id')
                .notEmpty().withMessage("id is required")
                .isMongoId().withMessage('Invalid User id format'),
    check("currentPassword")
                .notEmpty().withMessage('Current password is required')
                .custom(async (val, { req }) => {
                    // 1) Verify current password
                    const user = await User.findById(req.params.id);
                    if (!user) {
                        throw new Error('There is no user for this id');
                    }
                    const isCorrectPassword = await bcrypt.compare(
                        req.body.currentPassword,
                        user.password
                    );
                    if (!isCorrectPassword) {
                        throw new Error('Incorrect current password');
                    }
                    return true;
                }),
    check("passwordConfirm")
                .notEmpty().withMessage('Current password is required'),

    check('password')
                .notEmpty().withMessage('password is required')
                .isLength({min:6}).withMessage('Too short User password ')
                .custom((password, { req }) => {
                    if (password !== req.body.passwordConfirm) {
                        throw new Error('Password Confirmation incorrect');
                    }
                    return true;
                })

    ,validatorMiddleware,
];

exports.deleteUserValidator=[
    check('id')
                .notEmpty().withMessage("id is required")
                .isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
];