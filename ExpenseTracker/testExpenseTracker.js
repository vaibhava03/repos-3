   const path=require('path');
   const express=require('express');
   const app=express();
   const dotenv=require('dotenv');
   dotenv.config({ path: path.resolve(__dirname, 'util/.env') })
   const bodyParser=require('body-parser');
   const sequelize=require('./util/database');
   const Expense=require('./models/expense');
   const User=require('./models/user');
   const FPReq=require('./models/ForgotPasswordRequests');
   const cors=require('cors');
   const bcrypt = require('bcrypt');
   const jwt = require('jsonwebtoken');
   const Order=require('./models/order');
   const Razorpay=require('razorpay');
   const instance = new Razorpay({ key_id: 'rzp_test_PEFKbA3GQ0O6x9', key_secret: 'iadpASiQ052e0z1SuvrFSTlR' });
   const sgMail = require('@sendgrid/mail');
   const { v4: uuidv4 } = require('uuid');



   sgMail.setApiKey(process.env.SENDGRID_API_KEY)
   app.use(cors());
   app.use(bodyParser.json());

   User.hasMany(Expense);
   Expense.belongsTo(User);
   User.hasMany(Order);
   Order.belongsTo(User);
   User.hasMany(FPReq);
   FPReq.belongsTo(User);

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
User.findOne({where:{email:req.body.email}})
.then(user =>{
   const FP_id=uuidv4();
   user.createFPReq({id:FP_id,isActive:true});
const msg={
   to:req.body.email,
   from:"vaibhavavarikilla@gmail.com",
   subject:"create new password",
   text: "hi we received a reset password request",
   html:`<strong>click the link to reset password</strong><a href=http://localhost:3000/password/resetpassword/${FP_id}>click here</a>`
}
sgMail.send(msg)
.then((response) =>{
   // console.log(response);
})
})
})

app.use('/password/resetpassword/:passwordId', (req, res) =>{
   FPReq.findOne({where:{id:req.params.passwordId}})
   .then(data =>{
      if(data&&data.isActive){

     res.status(200).send(`<html>
   
     <form action="/updatepassword/${req.params.passwordId}" method="GET">
     <label for="password">Enter a new password</label>
     <input type="password" name="password">
     <button type="submit">SUBMIT</button>
     </form>
  
     </html>`);
     console.log(req.body);
     data.update({ isActive: false});
     res.end()

      }
      else console.log(res.status);
   })
   .catch(err => console.log(err));
  
   // res.redirect('/updatepassword/${req.body}')
});

app.use('/updatepassword/:resetpasswordid', (req, res) =>{
   console.log(req.query.password);
   console.log(req.params.resetpasswordid);
const password=req.query.password;
const Id=req.params.resetpasswordid;
FPReq.findOne({where:{id:Id}})
.then(Frequest =>{
   if(Frequest)
   {
      console.log(Frequest.userId)
      User.findOne({where:{id:Frequest.userId}})
      then(user =>{
         console.log(user);
         bcrypt.genSalt()
         .then(salt =>{
               bcrypt.hash(password, salt).then(hash =>{
               user.update({
               password:hash
      })
})

})
      })
   }
   return res.status(404).json('No user Exists');
})
.catch(err => {
   return res.status(403);
})

});

   sequelize
    .sync()
    .then(() =>{
    })
    .catch(err => console.log(err));

    app.listen(3000);
