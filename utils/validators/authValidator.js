const{check}=require("express-validator");
const slugify=require("slugify");


const validatorMiddleware=require("../../middelwares/validatorMiddleware");

const User =require("../../models/userModel");

exports.signupValidator=[
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
        .notEmpty().withMessage('password confirm is required')
        

    
    ,validatorMiddleware
];


exports.loginValidator=[
        
        check('email')
        .notEmpty().withMessage('Email required')
        .isEmail().withMessage('Invalid email address'),

    check('password')
        .notEmpty().withMessage('password is required')
        .isLength({min:6}).withMessage('Too short User password ')
        
    ,validatorMiddleware
];
