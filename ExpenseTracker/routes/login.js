const path=require('path');
const express=require('express');
const router=express.Router();
const LoginController=require('../controllers/login.js');

router.post('/user/signup', LoginController.postSignup);
router.post('/user/login',LoginController.postLogin);

router.post('/user/password/forgotpassword',LoginController.postForgetPassword);
router.use('/password/resetpassword/:passwordId',LoginController.useResetPassword);
router.use('/updatepassword/:resetpasswordid',LoginController.useUpdatePassword);



module.exports=router;
