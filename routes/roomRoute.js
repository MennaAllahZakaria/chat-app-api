const express=require('express');

const router=express.Router();
const {
    createRoomValidator,
    getRoomValidator,
    updateRoomValidator,
    deleteRoomValidator,
    joinRoomValidator,
    leaveRoomValidator,
    getUsersInRoomValidator

}=require("../utils/validators/roomValidator")


const {
    createRoom,
    getRoom,
    getRooms,
    updateRoom,
    deleteRoom,
    joinRoom,
    leaveRoom,
    getUsersInRoom,
    
}=require("../services/roomService");

const{
    protect,
    allowedTo
}=require("../services/authService");

router.use(protect);



router.route('/')
                .get(
                    getRooms
                )
                .post(
                    createRoomValidator,
                    createRoom
                );

router.route('/:id')
                    .get(
                        getRoomValidator,
                        getRoom
                    )
                    .put(
                        updateRoomValidator,
                        updateRoom
                    )
                    .delete(
                        deleteRoomValidator,
                        deleteRoom
                    );
router.route('/join/:id').post(allowedTo('user'),joinRoomValidator,joinRoom);

router.route('/leave/:id').post(allowedTo('user'),leaveRoomValidator,leaveRoom);

router.route('/getUsers/:id').get(getUsersInRoomValidator,getUsersInRoom);



module.exports=router;