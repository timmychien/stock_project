var express=require('express');
var router=express.Router();
router.get('/',function(req,res){
    res.render('forgetpw',{
        email:req.session.email,
        role:req.session.role
    })
})
router.post('/',function(req,res){
    res.redirect('/');
})
module.exports=router;