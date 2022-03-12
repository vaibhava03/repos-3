
//controllers

const Product = require('../models/Product');
const Cart = require('../models/Cart');
const cartItem=require('../models/CartItem');
const CartItem = require('../models/CartItem');
const { append } = require('express/lib/response');

exports.getProducts = (req, res, next) => {
  let page=+req.query.page || 1;
  let items_per_page=2;
  let totalItems;
  Product.findAndCountAll()
  .then(numProducts =>
   {
     totalItems=numProducts.count;
     return   Product.findAll({offset:(page-1)*items_per_page,limit:items_per_page})
   })
  .then(products =>{
    res.render('shop/product-list', {
      prods:products,
      pageTitle:'All Products',
      path: '/products',
      currentPage:page,
      hasNextPage:items_per_page*page<totalItems,
      hasPreviousPage:page>1,
      nextPage:page+1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/items_per_page)
  });
})
.catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({where:{id: prodId}})
  .then(product =>
    {
      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: product[0].title,
        path: '/products'
      });
    })
  .catch(err => console.log(err));
  Product.findByPk(prodId)
  .then(product =>
  {
    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: product[0].title,
      path: '/products'
    });
  })
  .catch(err => console.log(err));
};


exports.getIndex = (req, res, next) => {
 let page=+req.query.page || 1;
 let items_per_page=2;
 let totalItems;
 Product.findAndCountAll()
 .then(numProducts =>
  {
    totalItems=numProducts.count;
    return   Product.findAll({offset:(page-1)*items_per_page,limit:items_per_page})
  })
  .then(products =>{
    res.render('shop/index', {
      prods:products,
      pageTitle:'All Products',
      path: '/',
      currentPage:page,
      hasNextPage:items_per_page*page<totalItems,
      hasPreviousPage:page>1,
      nextPage:page+1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/items_per_page)
  });

}).catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
  let page=+req.query.page || 1;
  let items_per_page=2;
  let totalItems;
  
  req.user.getCart()
  .then(cart =>
  {
    return cart
    .getProducts()  
    .then(products =>
    {
      totalItems=products.length;
      return cart.getProducts({offset:(page-1)*items_per_page,limit:items_per_page})
    })
    .then(products =>
      {
      res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products:products,
      currentPage:page,
      hasNextPage:items_per_page*page<totalItems,
      hasPreviousPage:page>1,
      nextPage:page+1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/items_per_page)
    });
    })
    .catch(err => console.log(err));
    })

    .catch(err => console.log(err));
 
};

 exports.postCart = (req, res, next) => {

const prodId=req.body.productId;
let fetchedCart;
let newQuantity=1;
req.user
.getCart() 
.then(cart =>
  {
    fetchedCart=cart;
    return cart.getProducts({where:{id:prodId}});
  })
  .then(products =>
    {
      let product;
      if(products.length>0)
      {
        product=products[0];
      }
      if(product)
      {
        const oldQuantity=product.cartItem.quantity;
        newQuantity=oldQuantity+1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product =>
      {
        return fetchedCart.addProduct(product, { through: { quantity: newQuantity} });
      })

    .then(() =>
    {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};



exports.postCartDeleteProduct=(req, res, next) =>
{

const prodId=req.body.productId;
req.user.getCart()
.then(cart =>
  {

    return cart.getProducts({where:{id:prodId}});
  })
  .then(products =>
    {
     console.log("products are ");

     const product=products[0];
      return product.cartItem.destroy();
    })
    .then(result =>
      {
        res.redirect('/cart');
      })
      .catch(err =>console.log(err));
};



exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

