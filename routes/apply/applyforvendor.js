var express = require('express');
var router = express.Router();
router.get('/',function(req,res){
    res.render('applyforvendor',{
        title:'申請成為商家'
    })
})

module.exports = router;