const sequelize=require('../util/database');
const User=require('../models/user');
const FPReq=require('../models/ForgotPasswordRequests');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const { v4: uuidv4 } = require('uuid');
const saltRounds=10;
   sgMail.setApiKey(process.env.SENDGRID_API_KEY)


exports.postSignup= (req, res) =>{
    User.findOne({where:{email:req.body.email}})
    .then(user =>{
       if(!user){
        bcrypt.hash(req.body.password, saltRounds, (err, hash) =>{
        User.create({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        password:hash
        })
        })
        res.sendStatus(201);
     }
     else 
      res.sendStatus(208);
    })
    .catch(err => console.log(err));
};


exports.postLogin= (req, res) =>{
 User.findOne({where:{email:req.body.email}})
 .then(user =>{
     if(!user)
     {
        res.sendStatus(404);
     }
     else{
    bcrypt.compare(req.body.password, user.password, function(err, response) {
    
    if (err) {
          console.log(err);
    } 
    else if(!response)
    {
        res.sendStatus(401)

    }
    else {
        var token=jwt.sign({id:user.id}, "secret");
        res.json(token);
        console.log(token);
       }
    })
}
})
};

exports.postForgetPassword=(req, res) =>{
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
};
    
exports.useResetPassword=(req, res) =>{
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
};
     
exports.useUpdatePassword= (req, res) =>{
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
           .then(user =>{
            bcrypt.hash(password,saltRounds, (err, hash =>{
            user.update({
            password:hash
            })
           }));
            });
        return res.status(404).json('No user Exists');
        }
    }).catch(err => {
        return res.status(403);
     })
};

     
