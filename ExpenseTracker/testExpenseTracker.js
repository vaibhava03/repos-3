   const path=require('path');
   const express=require('express');
   const app=express();
   const bodyParser=require('body-parser');
   const cors=require('cors');
   const Sequelize= require('sequelize');
   const bcrypt = require('bcrypt');
   const dotenv=require('dotenv');
const { getMaxListeners } = require('process');
const { default: axios } = require('axios');
   dotenv.config({ path: path.resolve(__dirname, 'util/.env') })

   app.use(cors());
   app.use(bodyParser.urlencoded({extended:false}));
   app.use(bodyParser.json());

   const sequelize=new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME,process.env.DB_PASSWORD, {
    dialect:'mysql', 
    host:process.env.DB_HOST,
});


   const User=sequelize.define('user',{
      id:
      {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey:true
      },
          name:Sequelize.STRING,
          email:{
             type:Sequelize.STRING,
             unique:true
            },
          phone:{
             type:Sequelize.STRING,
             unique:true
            },
          password:Sequelize.STRING
      }
);

   app.post('/getusers', (req, res) =>{
      User.findOne({where:{email:req.body.email}})
      .then(user =>{
         if(!user){
            return  User.findOne({where:{phone:req.body.phone}})
         }
         else {

            app.get('/getusers', (req, res) =>{
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
            app.get('/getusers', (req, res) =>{
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
         app.get('/getusers',(req, res) =>{
            res.json(true);
         })
      }
      else 
      {
         console.log(false);
      }
   });
});



   sequelize
    .sync()
    .catch(err => console.log(err));

   app.listen(3000);
