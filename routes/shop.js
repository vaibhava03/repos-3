

//routes
const path=require('path');
const express=require('express');

const shopController=require('../controllers/shop.js');
const router=express.Router();

router.get('/products', shopController.getProducts);
router.get('/products/:productId',shopController.getProduct);
router.get('/', shopController.getIndex);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart-delete-item/:productId', shopController.postCartDeleteProduct);
router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports=router;
