const mongoose=require("mongoose");

const privateMessageSchema=new mongoose.Schema({
    
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    recipientId:{
                type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

},{timestamps:true}
);

module.exports=mongoose.model("PrivateMessage",privateMessageSchema);