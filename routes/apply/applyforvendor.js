var express = require('express');
var router = express.Router();
router.get('/',function(req,res){
    res.render('apply/applyforvendor',{
        title:'申請成為商家',
        email: req.session.email,
        role: req.session.role,
        walletaddress: req.session.walletaddress
    })
})
router.post('/',function(req,res){
    var pool=req.connection;
    var email=req.session.email;
    pool.getConnection(function(err,connection){
        connection.query('UPDATE member_info SET role=? WHERE email=?',['vendor',email],function(err,rows){
            res.render('apply/apply_redirect');
        })
    })
})

module.exports = router;