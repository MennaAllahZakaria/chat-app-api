const express=require('express');

const router=express.Router();
const {
    signupValidator,
    loginValidator

}=require("../utils/validators/authValidator")

const {
    signup,
    login,
    forgotPassword,
    verifyPassResetCode,
    resetPassword
    
}=require("../services/authService");


router.post('/signup',
                    signupValidator,
                    signup
                );

router.post('/login',
                    loginValidator,
                    login
                );

router.post('/forgotPassword',forgotPassword);   
router.post('/verifyResetCode',verifyPassResetCode)
router.put("/resetPassword",resetPassword)

module.exports=router;