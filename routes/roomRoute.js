const express=require('express');

const router=express.Router();
const {
    createRoomValidator,
    getRoomValidator,
    updateRoomValidator,
    deleteRoomValidator,

}=require("../utils/validators/roomValidator")


const {
    createRoom,
    getRoom,
    getRooms,
    updateRoom,
    deleteRoom,
    
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
                    



module.exports=router;