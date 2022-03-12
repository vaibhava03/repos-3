//routes
const path=require('path');

const express=require('express');
const productsController=require('../controllers/admin.js');

const router=express.Router();

router.get('/add-product', productsController.getAddProduct);

router.post('/add-product',productsController.postAddProduct);


router.get('/edit-product/:productId', productsController.getEditProduct)
router.post('/edit-product',productsController.postEditProduct);
router.post('/delete-product/:productId',productsController.postDeleteProducts);
router.get('/admin-products',productsController.getProducts);
module.exports=router;
