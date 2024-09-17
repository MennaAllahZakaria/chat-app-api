const express=require('express');

const router=express.Router();

const{
    getChatstHistoryOfRoom,
    getChatstHistoryOfPrivateChat,

}=require('../services/chatService');

const{
    protect,
    allowedTo
}=require("../services/authService");

router.use(
    protect, 
    allowedTo('user','admin')
);

router.route('/').get(getChatstHistoryOfRoom);

router.route('/private').get(getChatstHistoryOfPrivateChat);

module.exports=router;
