var express = require('express');
var router = express.Router();
router.get('/',function(req,res){
    res.render('works/workbought',{
        topic:'已購買作品'
    })
})
module.exports = router;