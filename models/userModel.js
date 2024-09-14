const mongoose=require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required :[true, 'User name required'],
        unique:[true,'User name must be unique'],
        minlenght :[3,"Too short user name"],
        maxlenght:[32,"Too long user name"],
    },
    slug:{
        type:String,
        lowercase:true,
    },
    email:{
        type:String,
        trim:true,
        required :[true, 'User email required'],
        unique:[true,'User email must be unique'],
        lowercase:true,
        minlenght :[3,"Too short user email"],
        maxlenght:[32,"Too long user email"],
    },
    phone:{
        type:String,

    },
    profileImage:{
        type:String,
    },
    password:{
        type:String,
        trim:true,
        required :[true, 'User password required'],
        minlenght :[6,"Too short user password"],
    },
    passwordChangedAt:Date,
    passwordResetCode:String,
    passwordResetExpiresAt:Date,
    passwordResetVerified:Boolean,
    role:{
        type:String,
        enum:["user","manager","admin"],
        default:"user",
    },
    active:{
        type:Boolean,
        default:true,
    },
    
    
    


},
{timestamps:true});

userSchema.pre('save',async function(next){
    if (!this.isModified("password")) return next();
    
    this.password=await bcrypt.hash(this.password,12);
    next();
})

// eslint-disable-next-line new-cap
const UserModel= new mongoose.model("User",userSchema);
module.exports=UserModel;