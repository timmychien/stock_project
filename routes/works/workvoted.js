var express = require('express');
var router = express.Router();
router.get('/',function(req,res){
    res.render('works/workted',{
        topic:'已投票作品'
    })
})
module.exports = router;