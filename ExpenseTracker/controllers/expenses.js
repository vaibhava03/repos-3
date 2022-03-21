const path=require('path');
const sequelize=require('../util/database');
const User=require('../models/user');
const Expense=require('../models/expense');
const Order=require('../models/order');
const dotenv=require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../util/.env') })
const jwt = require('jsonwebtoken');
const Razorpay=require('razorpay');
const { Console } = require('console');
const instance = new Razorpay({ key_id: 'rzp_test_PEFKbA3GQ0O6x9', key_secret: process.env.SECRET});

function parseJwt(token) {
    var base64Payload = token.split('.')[1];
    let payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
  }

exports.postExpenses=(req, res) =>{
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
};

exports.postPay=(req, res) =>{
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
         exports.getPay= (req, res) =>{
            const obj={
            "orderId":order.id,
            "keyId":instance.key_id
            }
         res.json(obj);
      };
      }
         else console.log(err);
      });
   
};

const data=[];
User.findAll()
.then(users =>{
   users.forEach(user => {
       const id=user.id;
    Order.findOne({where:{userId:id}})
    .then(order =>{
        if(order) {
            return Expense.findAll({where:{userId:id}});
        }
       })
    .then(expenses =>{
        if(expenses){
        var total=0;
       expenses.forEach(expense=> {
        total=total+expense.MoneySpent;
        });
        myObj={
            userName:user.name,
            expenses:total
        }
        data.push(myObj);
    }
        })
    })
   });

exports.getLeaderBoard=(req, res) =>{
    res.json(data.sort(function(x,y){return y.expenses-x.expenses}));
};

exports.postDaily=(req, res) =>{
    let payload= parseJwt(req.body.headers.Authorization);
    const Daily_expense=[];
    Expense.findAll({where:{userId:payload.id}})
    .then(expenses =>{
    expenses.forEach(expense=> {
        var nowDate = new Date(); 
        var date = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();         
        var updated=expense.updatedAt.getFullYear()+'-'+(expense.updatedAt.getMonth()+1)+'-'+expense.updatedAt.getDate();
        if(date===updated)
        {
            Daily_expense.push(expense);
        }
})
res.json(Daily_expense);
})
};

exports.postWeekly=(req, res) =>{
    let payload= parseJwt(req.body.headers.Authorization);
    Expense.findAll({where:{userId:payload.id}})
    .then(expenses =>{
    const weekly_expense=[];
    const Category=['food', 'health', 'transport', 'utilities', 'insurance', 'clothing', 'others'];
    for(let i=0;i<Category.length;i++)
    {
    var money=0;
    const Catag=Category[i];
    expenses.forEach(expense =>{
        var nowDate = new Date(); 
        var updated=expense.updatedAt;
        nowDate.setDate(nowDate.getDate() - 6);
        if(updated>nowDate&&expense.Category===Category[i])
        {
            money=money+expense.MoneySpent;
        }
    })
    const arr={
    category:Catag,
    money:money
    }
    weekly_expense.push(arr);
    }
    res.json(weekly_expense);
    })   
};

exports.postMonthly=(req, res) =>{
    let payload= parseJwt(req.body.headers.Authorization);
    Expense.findAll({where:{userId:payload.id}})
    .then(expenses =>{
    const Monthly_expense=[];
    const Category=['food', 'health', 'transport', 'utilities', 'insurance', 'clothing', 'others'];
    for(let i=0;i<Category.length;i++)
    {
    var money=0;
    const Catag=Category[i];
    expenses.forEach(expense =>{
        var nowDate = new Date(); 
        var date = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1);         
        var updated=expense.updatedAt.getFullYear()+'-'+(expense.updatedAt.getMonth()+1);
        if(date===updated&&expense.Category===Category[i]){ 
        money=money+expense.MoneySpent;
        }
    })
    const arr={
    category:Catag,
    money:money
    }
    Monthly_expense.push(arr);
    }
    res.json(Monthly_expense);
    })   
};