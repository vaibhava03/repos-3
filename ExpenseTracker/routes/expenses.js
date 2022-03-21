const path=require('path');
const express=require('express');
const router=express.Router();
const ExpenseController=require('../controllers/expenses.js');

router.post('/user/expense', ExpenseController.postExpenses);
router.post('/user/pay',ExpenseController.postPay);


router.get('/user/leaderboard', ExpenseController.getLeaderBoard);
router.post('/user/daily-expense', ExpenseController.postDaily);

router.post('/user/weekly-expense', ExpenseController.postWeekly);

router.post('/user/monthly-expense', ExpenseController.postMonthly);

 

module.exports=router;