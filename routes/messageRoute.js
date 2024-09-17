const express=require('express');

const router=express.Router();
const {
    createMessageValidator,
    getMessageValidator,
    updateMessageValidator,
    deleteMessageValidator,
}=require("../utils/validators/messageValidator")


const {
    createMessage,
    getMessage,
    getMessages,
    updateMessage,
    deleteMessage,    
}=require("../services/messageService");

const{
    protect,
    allowedTo
}=require("../services/authService");

router.use(protect);



router.route('/')
                .get(
                    getMessages
                )
                .post(
                    allowedTo('user'),
                    createMessageValidator,
                    createMessage
                );

router.route('/:id')
                    .get(
                        getMessageValidator,
                        getMessage
                    )
                    .put(
                        allowedTo('user'),  
                        updateMessageValidator,
                        updateMessage
                    )
                    .delete(
                        allowedTo('user'),
                        deleteMessageValidator,
                        deleteMessage
                    );


module.exports=router;