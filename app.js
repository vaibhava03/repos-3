   const path=require('path');
   const express=require('express');
   const app=express();
   const dotenv=require('dotenv');
   dotenv.config({ path: path.resolve(__dirname, 'util/.env') })
   const bodyParser=require('body-parser');
   const sequelize=require('./util/database');
   const User=require('./models/user');
   const Expense=require('./models/expense');
   const Order=require('./models/order');
   const FPReq=require('./models/ForgotPasswordRequests');
   const FileUrl=require('./models/FileUrl')
   const cors=require('cors');
   app.use(cors());
   app.use(bodyParser.urlencoded({extended:false}));
   app.use(bodyParser.json());

   const loginRoutes=require('./routes/login');
   const expensesRoutes=require('./routes/expenses');
   app.use(loginRoutes);
   app.use(expensesRoutes);

   User.hasMany(Expense);
   Expense.belongsTo(User);
   User.hasMany(Order);
   Order.belongsTo(User);
   User.hasMany(FPReq);
   FPReq.belongsTo(User);
   User.hasMany(FileUrl);
   FileUrl.belongsTo(User);
   sequelize
    .sync()
    .then(() =>{
    })
    .catch(err => console.log(err));

    app.listen(3000);
