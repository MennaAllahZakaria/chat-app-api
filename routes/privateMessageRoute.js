const express=require('express');

const router=express.Router();
const {
    createPrivateMessageValidator,
    getPrivateMessageValidator,
    updatePrivateMessageValidator,
    deletePrivateMessageValidator,
}=require("../utils/validators/privateMessageValidator")


const {
    createPrivateMessage,
    getPrivateMessage,
    getPrivateMessages,
    updatePrivateMessage,
    deletePrivateMessage,    
}=require("../services/messageService");

const{
    protect,
    allowedTo
}=require("../services/authService");

router.use(protect);



router.route('/')
                .get(
                    getPrivateMessages
                )
                .post(
                    allowedTo('user'),
                    createPrivateMessageValidator,
                    createPrivateMessage
                );

router.route('/:id')
                    .get(
                        getPrivateMessageValidator,
                        getPrivateMessage
                    )
                    .put(
                        allowedTo('user'),  
                        updatePrivateMessageValidator,
                        updatePrivateMessage
                    )
                    .delete(
                        allowedTo('user'),
                        deletePrivateMessageValidator,
                        deletePrivateMessage
                    );


module.exports=router;