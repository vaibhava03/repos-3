   const path=require('path');
   const express=require('express');
   const app=express();
   const dotenv=require('dotenv');
   dotenv.config({ path: path.resolve(__dirname, 'util/.env') })
   const bodyParser=require('body-parser');
   const sequelize=require('./util/database');
   const Expense=require('./models/expense');
   const User=require('./models/user');
   const cors=require('cors');
   const bcrypt = require('bcrypt');
   const jwt = require('jsonwebtoken');
   const Order=require('./models/order');
   const Razorpay=require('razorpay');
const { default: axios } = require('axios');
   const instance = new Razorpay({ key_id: 'rzp_test_PEFKbA3GQ0O6x9', key_secret: 'iadpASiQ052e0z1SuvrFSTlR' });


   app.use(cors());
   app.use(bodyParser.json());

   User.hasMany(Expense);
   Expense.belongsTo(User);
   User.hasMany(Order);
   Order.belongsTo(User);

   function parseJwt(token) {
      var base64Payload = token.split('.')[1];
      let payload = Buffer.from(base64Payload, 'base64');
      return JSON.parse(payload.toString());
    }

   app.post('/user/signup', (req, res) =>{
      console.log(req.body);
      User.findOne({where:{email:req.body.email}})
      .then(user =>{
         if(!user){
            return  User.findOne({where:{phone:req.body.phone}})
         }
         else {
            app.get('/user/signup', (req, res) =>{
            res.json(false);
            });
            return user;
         }
      })
      .then(user =>{
         if(!user){
         return bcrypt.genSalt()
         }
         else {
            app.get('/user/signup', (req, res) =>{
            res.json(false);
         })
            return null;
         }
      })
      .then(salt =>{
         if(salt){
            bcrypt.hash(req.body.password, salt).then(hash =>{
            User.create({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:hash
         })
         })
         app.get('/user/signup',(req, res) =>{
         res.json(true);
         })
         }
         else 
         {
            console.log(false);
         }
   });
});

app.post('/user/login', (req, res) =>{
   User.findOne({where:{email:req.body.email}})
   .then(user =>{
      bcrypt.compare(req.body.password, user.password, function(err, response) {
         if (err) {
            console.log(err);
            app.get('/user/login',(req, res) =>{
            res.sendStatus(404);
            });
         } 
         else if (!response) {
            app.get('/user/login',(req, res) =>{
            res.sendStatus(401);
            });
         } 
         else {
            app.get('/user/login',(req, res) =>{
            var token=jwt.sign({id:user.id}, "secret");
            res.json(token);
            console.log(token);
            });
         }
      })
})
})

app.post('/user/expense', (req, res) =>{
 
    let payload= parseJwt(req.headers.authorization);
    User.findByPk(payload.id)
    .then(user =>{
       if(user)
       {
          user.createExpense({
            MoneySpent:req.body.money,
            Description:req.body.description,
            Category:req.body.category,
            userId:payload.id
         });
       }
    })
    .catch(err => console.log(err));
})

app.post('/user/pay',(req, res) =>{
 let payload= parseJwt(req.headers.authorization);
res.sendStatus(200);
   instance.orders.create({  
      "amount":req.body.amount,
      "currency":"INR",
      "receipt":"recp1"
   },
   (err, order)=>{
   if(!err){
      User.findByPk(payload.id)
      .then(user =>{
         user.createOrder({orderid:order.id});
      });
      app.get('/user/pay', (req, res) =>{
         const obj={
         "orderId":order.id,
         "keyId":instance.key_id
         }
      res.json(obj);
   })
   }
      else console.log(err);
   });

   });


   const data=[];
  User.findAll()
  .then(users =>{
     users.forEach(user => {
        Order.findAndCountAll({where:{userId:user.id}})
        .then(nums =>{
           if(nums.count>0){
           const obj={
              expenses:nums.count,
              userName:user.name
           }
           data.push(obj);
         }        

        })
     });
  })

app.get('/user/leaderboard', (req, res) =>{
   setTimeout(() =>{
   res.json(data.sort(function(x,y){return y.expenses-x.expenses}));

},500);
})

app.post('/user/password/forgotpassword',(req, res) =>{
console.log(req.body.email);
})

   sequelize
    .sync()
    .then(() =>{
    })
    .catch(err => console.log(err));

    app.listen(3000);

