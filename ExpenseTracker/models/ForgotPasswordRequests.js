const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const ForgetPassWordRequests=sequelize.define('FPReq',{
    id:{
        type:Sequelize.STRING,
        primaryKey:true,
        allowNull:false
    },
    isActive:Sequelize.BOOLEAN

})
module.exports=ForgetPassWordRequests;