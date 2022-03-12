
//routes
const path=require('path');
const express=require('express');

const routeDir=require('../util/path');
const router=express.Router();
const productsController=require('../controllers/contact.js');

router.get('/contactus', productsController.getContacts);

router.post('/contactus',productsController.postContacts);
router.get('/success',productsController.getSuccess);
module.exports=router;