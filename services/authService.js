const crypto = require('crypto');
const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs");
const ApiError = require("../utils/ApiError")
const sendEmail=require("../utils/sendEmail")

const User = require('../models/userModel');
const createToken=require('../utils/createToken');
const {sanitizeUser}=require('../utils/sanitizeData');


// @desc    Signup
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    const token = createToken(user._id);

    res.status(201).json({ data: sanitizeUser(user), token });
});

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public

exports.login = asyncHandler(async(req, res, next)=>{
    const user= await User.findOne({email: req.body.email});
    const isCorrectPassword=await bcrypt.compare( req.body.password,user.password);
    if (!user|| !isCorrectPassword){
        return next(new ApiError("Invalid email or password",401))
    }

    const token=createToken(user._id);

    res.status(200).json({data:sanitizeUser(user),token});
});

// @desc    Make sure the user is logged in 
exports.protect=asyncHandler(async(req,res,next)=>{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        token=req.headers.authorization.split(" ")[1];
    }

    if (!token){
        return next(new ApiError("Not Authorized",401))
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    const user=await User.findById(decoded.userId);
    if (!user){
        return next(new ApiError("The user that beloge to this token does no longer exist ",401))
    } 

    if (user.passwordChangedAt){
        const passwordChangedTimeStamp=parseInt( user.passwordChangedAt.getTime()/1000, 10);
        if (passwordChangedTimeStamp>decoded.iat){
            return next(new ApiError("User recently changed password",401))
        }
        
    }

    req.user=user;
    next();


});


// @desc    Authorization

exports.allowedTo=(...roles)=>
    asyncHandler(async (req,res,next)=>{
        if (!roles.includes(req.user.role)){
            return next(new ApiError(`You are not allowed to access this route`,403))
        }
        next();
    

});


// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public

exports.forgotPassword=asyncHandler(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if (!user){
        return next(new ApiError("No user with this email",404))
    }

    const resetCode=Math.floor(100000+Math.random()*900000).toString();
    const hashedResetCode=crypto
                            .createHash('sha256')
                            .update(resetCode)
                            .digest('hex');
    //Expire the reset code
    user.passwordResetExpiresAt=Date.now()+10*60*1000;
    user.passwordResetCode=hashedResetCode;
    user.passwordResetVerified=false;

    await user.save();

    const message=`Hi ${user.name} ,
                    \n We recived a request to reset the password on your ${process.env.EMAIL_FROM} account. 
                    \n ${resetCode}\n Enter this code to complete the reset 
                    \n Thanks for helping us keep your account secure.`
    
    try{
        await sendEmail({
            email:user.email,
            subject:"Password reset valid for 10 min ",
            message,
    });
    }catch(e){
        user.passwordResetExpiresAt=undefined
        user.passwordResetCode=undefined;
        user.passwordResetVerified=undefined;
        await user.save();
        return next(new ApiError("Error sending email",500))
}
    
    res.status(200).json({status:"Success",
        message:`An email has been sent to ${user.email} `
    });
    
    

});

// @desc    verify Password Reset Code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public

exports.verifyPassResetCode=asyncHandler(async(req,res,next)=>{
    const hashedResetCode=crypto
                            .createHash('sha256')
                            .update(req.body.resetCode)
                            .digest('hex');

    const user=await User.findOne({passwordResetCode:hashedResetCode,
                                    passwordResetExpiresAt:{$gt:Date.now()}
                                });
                                
    if (!user){
        return next(new ApiError(" reset code invalid or expire",404))
    }
    user.passwordResetVerified=true;
    await user.save();

    res.status(200).json({
        status:"Success",
        message:`Password reset code is valid`
    });


});


// @desc     Reset Password
// @route   POST /api/v1/auth/resetPassword
// @access  Public

exports.resetPassword=asyncHandler(async(req,res,next)=>{

    const user=await User.findOne({email:req.body.email});
    if (!user){
        return next(new ApiError(`No user with this email`,404));
    }

    if (!user.passwordResetVerified){
        return next ( new ApiError(`Reset code not verfied`,400));
    }
    
    user.password=req.body.password;


    user.passwordResetCode=undefined;
    user.passwordResetExpiresAt=undefined;
    user.passwordResetVerified=undefined;


    await user.save();


    const token = createToken(user._id);

    res.status(200).json({token});


});
