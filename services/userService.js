const sharp= require('sharp')
const {v4:uuidv4}= require('uuid')
const bcrypt= require('bcryptjs')


const asyncHandler=require("express-async-handler");
const User = require('../models/userModel');
const handlerFactory=require("./handlerFactory");
const {uploadSingleImage}=require("../middelwares/uploadImageMiddleware");
const ApiError = require("../utils/ApiError")

const createToken=require('../utils/createToken');


exports.resizeImage = asyncHandler(async (req, res, next) => { //image processing to best preofrmance (buffer need memory storage not disckstorage)
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    if ( req.file){
    await sharp(req.file.buffer)//sharp library image processing for nodejs   sharp is a promise need a awit
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 }) //to decreae size
        .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.profileImage = filename;
    }
    next();
    });


exports.uploadUserImage=uploadSingleImage("profileImage");


// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private
exports.createUser=handlerFactory.createOne(User);


// @desc    Get specific User by id
// @route   GET /api/v1/users/:id
// @access  Private/admin
exports.getUser =handlerFactory.getOne(User);

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/admin
exports.getUsers = handlerFactory.getAll(User);

// @desc    Update specific User
// @route   PUT /api/v1/users/:id
// @access  Private/admin
exports.updateUser =asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id,
        {
            username: req.body.username,
            slug: req.body.slug,
            email: req.body.email,
            phone: req.body.phone,
            profileImage:req.body.profileImage,
            role:req.body.role,
    }
    , {
        new: true,
    });

    if (!user) {
        return next(
        new ApiError(`No user for this id ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ data: user });
})
// @desc    Change user password
// @route   DELETE /api/v1/users/changePassword/:id
// @access  Private/user

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id,
        {
            password:bcrypt.hash(req.body.password, process.env.SALT),
            passwordChangedAt:Date.now()
    
        }
    ,   {
        new: true,
    });

    if (!user) {
        return next(
        new ApiError(`No user for this id ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ data: user });
});

// @desc    Delete specific User
// @route   DELETE /api/v1/users/:id
// @access  Private/admin
exports.deleteUser =handlerFactory.deleteOne(User);


// Logged user 


// @desc    Get logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/protect

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();

    });

// @desc    Update user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/protect


exports.updateLoggedUserPassword=asyncHandler(async(req,res,next)=>{
    const user=await User.findByIdAndUpdate(
        req.user._id,{
            password:await bcrypt.hash(req.body.password,process.env.SALT),
            passwordChangedAt:Date.now(),
        },
        {
            new:true,
        }
    );


    const token = createToken(user._id) 
    res.status(200).json({data:user,token});
});


// @desc    Update logged user data without [password,role]
// @route   PUT /api/v1/users/updateMe
// @access  Private/protect

exports.updateLoggedUserData=asyncHandler(async(req,res,next)=>{
    const updatedUser=await User.findByIdAndUpdate(
        req.user._id,{
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            profileImage:req.body.profileImage,
        },
        {
            new:true,
        }
    );

    res.status(200).json({data:updatedUser});

});


// @desc    Deactvate logged user 
// @route   PUT /api/v1/users/deleteMe
// @access  Private/protect

exports.deleteLoggedUserData=asyncHandler(async(req,res,next)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            active:false,
        },
        {
            new:true,
        }
    );

    res.status(204).json({msg:"Success"});

});

