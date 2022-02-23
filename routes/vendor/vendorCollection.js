var express=require('express');
var router = express.Router();
router.get('/',function(req,res){
    res.render('vendor/vendorCollection',{
        
    })
})
module.exports=router;