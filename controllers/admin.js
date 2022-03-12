
//controllers
const Product = require('../models/Product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-products', {
    pageTitle: 'Add Product',
    path: '/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
 Product.create( {
  title: title, 
  price: price,
  imageUrl: imageUrl,
  description: description,
  
  }).then(result =>{
    res.redirect('/admin-products');
  })
  .catch(err =>{
    console.log(err);
  })
  
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
  .then(products =>{
    console.log(products);
    if (!products) {
     
      return res.redirect('/');
    }
      res.render('admin/edit-products', {
      pageTitle: 'Edit Product',
      path:'/edit-product',
      editing: editMode,
      product: products
  });
  })
  .catch(err => console.log(err));
};

exports.postEditProduct=(req, res, next) =>
{
  const prodId=req.body.productId;
  const updatedTitle=req.body.title;
  const updatedimageUrl=req.body.imageUrl;
  const updatedPrice=req.body.price;
  const updatedDescription=req.body.description;
  Product.findByPk(prodId)
  .then(product =>
  {
    product.title=updatedTitle;
    product.price=updatedPrice;
    product.imageUrl=updatedimageUrl;
    product.description=updatedDescription;
    return product.save();
  })
  .then(result =>{
    res.redirect('/admin-products');
  })
  .catch(err => console.log(err));
  
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products =>{
      res.render('admin/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path:'/admin-products'
    });
  })
    .catch((err) => {
      console.log(err);
    });
  };

exports.postDeleteProducts=(req, res, next) =>
{
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  .then(product =>
    {
      return product.destroy();
    })
    .then(result =>
      {
        console.log("deleted");
      })
      .catch(err => console.log(err));
 
    res.redirect('/admin-products');
  };
