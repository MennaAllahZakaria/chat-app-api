const mongoose=require("mongoose");

const messageSchema=new mongoose.Schema({
    
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room'
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

module.exports=mongoose.model("Message",messageSchema);