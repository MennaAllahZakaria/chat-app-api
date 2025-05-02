const express=require('express');

const router=express.Router();

const{
    getRoomChatstHistory,
    getPrivateChatstHistory,

}=require('../services/chatService');

const {
    getRoomChatHistoryValidator,
    getPrivateChatHistoryValidator
}=require('../utils/validators/chatValidator');

const{
    protect,
    allowedTo
}=require("../services/authService");

router.use(
    protect, 
    allowedTo('user','admin')
);

router.route('/:roomId').get(
    getRoomChatHistoryValidator,
    getRoomChatstHistory
);

router.route('/private/:userId').get(
    getPrivateChatHistoryValidator,
    getPrivateChatstHistory
);

module.exports=router;
