const express=require('express');

const router=express.Router();
const {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    changeUserPasswordValidator,
    deleteUserValidator,
    updateLoggedUserValidator

}=require("../utils/validators/userValidator")


const {
    createUser,
    getUser,
    getUsers,
    updateUser,
    changeUserPassword,
    deleteUser,
    uploadUserImage,
    resizeImage,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserData
    
}=require("../services/userService");

const{
    protect,
    allowedTo
}=require("../services/authService");

router.use(protect);

router.get('/getMe',getLoggedUserData,getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe',updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe',deleteLoggedUserData);

router.use(allowedTo('admin','manager'));
router.put('/changePassword/:id',
            changeUserPasswordValidator,
            changeUserPassword
        );


router.route('/')
                .get(
                    getUsers
                )
                .post(
                    uploadUserImage,
                    resizeImage,
                    createUserValidator,
                    createUser
                );

router.route('/:id')
                    .get(
                        getUserValidator,
                        getUser
                    )
                    .put(
                        uploadUserImage,
                        resizeImage,
                        updateUserValidator,
                        updateUser
                    )
                    .delete(
                        deleteUserValidator,
                        deleteUser
                    );
                    



module.exports=router;