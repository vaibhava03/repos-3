
//controllers

const path=require('path');
const Product=require('../models/product');
exports.getContacts=(req, res, next) =>{
       
    res.sendFile(path.join(__dirname,'../', 'views', 'contact', 'contactUS.html'));
        };
        
exports.postContacts=(req, res, next) =>{
    console.log(req.body);
    res.redirect('/success');
    };

exports.getSuccess=(req, res, next) =>
{
    res.sendFile(path.join(__dirname, '../', 'views', 'contact', 'success.html'));

};
