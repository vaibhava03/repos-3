const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Expense=sequelize.define('expense',{
    id:
    {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
        MoneySpent:Sequelize.DOUBLE,
        Description:Sequelize.STRING,
        Category:Sequelize.STRING
    }
);


module.exports=Expense;
