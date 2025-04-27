const express=require('express');

const router=express.Router();
const {
    signupValidator,
    loginValidator

}=require("../utils/validators/authValidator")

const {
    signup,
    verifyEmailUser,
    protectforget,
    protectCode,
    login,
    forgotPassword,
    verifyPassResetCode,
    resetPassword
    
}=require("../services/authService");


router.post('/signup',
                    signupValidator,
                    signup
                );
router.post("/verifyEmailUser", protectCode, verifyEmailUser);

router.post('/login',
                    loginValidator,
                    login
                );

router.post('/forgotPassword',forgotPassword);   
router.post('/verifyResetCode', protectforget,verifyPassResetCode)
router.put("/resetPassword", protectforget, resetPassword)

module.exports=router;