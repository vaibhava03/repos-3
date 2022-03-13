   const path=require('path');

    const express=require('express');
  
   
   const app=express();
    const dotenv=require('dotenv');
    dotenv.config({ path: path.resolve(__dirname, 'util/.env') })
    app.set('view engine', 'ejs');

    const adminRoutes=require('./routes/admin');
    const shopRoutes=require('./routes/shop');
    const contactRoutes=require('./routes/contact');
    const productsController=require('./controllers/error.js');


    const bodyParser=require('body-parser');

    const sequelize=require('./util/database');
    const Product=require('./models/Product');
    const User=require('./models/User');
    const Cart=require('./models/Cart');
    const CartItem=require('./models/CartItem');
    const Order=require('./models/Order');
    const cors=require('cors');


    app.use(cors());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname,'public')));

    app.use((req, res, next) =>
    {
      User.findByPk(1)
      .then(user  =>
        {
          req.user=user;
          next();
        })
        .catch(err => console.log(err));
    });



    app.use(adminRoutes);
    app.use(shopRoutes);
    app.use(contactRoutes);

  //  app.use(productsController.get404);
const cart_ord=[];
const cart_items=[];
  app.get('/getorders', (req, res) =>
   {
    req.user.
    getOrders()
    .then(orders =>
    {
      orders.forEach(order => {
      cart_ord.push(order.cartId);
    });
    return cart_ord;
    }).then(cart =>
    {
      for(var i=0;i<cart.length;i++)
     {
      req.user.getCart({where:{id:cart[i]}})
      .then(data =>
        {

         return data.getProducts()
        })
      .then( products =>
      {
        console.log(products);
        res.json(products);
      }).catch( err => console.log(err));

     }

    })
        
      .catch(err=> console.log(err));
  });


app.get('/getproducts-count',(req, res) =>
{

  Product.findAndCountAll()
  .then(numProducts =>
   {
     res.json(numProducts.count);
   })
});

  app.post('/getproducts', (req, res) =>{
    let page=req.body.page||1;
    let items_per_page=2;
    let totalItems;
    Product.findAndCountAll()
    .then(numProducts =>
     {
       totalItems=numProducts.count;
      return Product.findAll({offset:(page-1)*items_per_page,limit:items_per_page});
     })
     .then(response =>{
      app.get('/getproducts',(req, res) =>
      {
        console.log(response);
        res.json(response);
      })
    })
     .catch(err => console.log(err));
  })


  app.post('/getcart', (req, res) =>
   {
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
      }
      return Product.findByPk(prodId);
    })
    .then(product =>
      {
       fetchedCart.addProduct(product, { through: { quantity: newQuantity} });
      })
    .catch(err => console.log(err));
  });

  app.get('/getcart', (req, res) =>
{
    CartItem.findAll()
    .then(products =>{
      res.json(products);
    })
    .catch(err => console.log(err));
  });
    

app.use((req, res) =>
        {
   res.sendFile(path.join(__dirname, `${req.url}`));
});

    Product.belongsTo(User,{constraints: true, onDelete:'CASCADE'});
    User.hasMany(Product);
    User.hasOne(Cart);
    Cart.belongsTo(User);
    Order.belongsTo(User,{constraints: true, onDelete:'CASCADE'});
    User.hasMany(Order);
    Cart.hasMany(Order);
    Order.belongsTo(User,{constraints: true, onDelete:'CASCADE'});
    Cart.belongsToMany(Product, {through:CartItem});
    Product.belongsToMany(Cart, {through:CartItem});


    sequelize
    .sync()
    .then(result =>{
     return User.findByPk(1);
    })
    .then(user =>
      {
        if(!user)
        {
          return User.create({name:'max',email:'test@gmail.com'});
        }
        return user;
      })
      .then(user =>
        {
          return user.createCart();
        })
        .then(cart =>
          {
            app.listen(3000);
          })
    .catch(err =>{
        console.log(err);
    });



