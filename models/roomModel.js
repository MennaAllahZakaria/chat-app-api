const mongoose=require("mongoose");

const roomSchema=new mongoose.Schema({
    name:{
        type:String
        ,required:true
    },
    description:{
        type:String,

    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    
    lastMessage:{type:String},
    createdAt:{type:Date,default:Date.now}
},{timestamps:true}
);

module.exports=mongoose.model("Room",roomSchema);