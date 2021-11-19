var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('forgetpk', {
        title: '遺失私鑰',
    });

});
router.post('/',function(req,res){
    var email=req.body['email'];
    var password=req.body['password'];
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM member_info WHERE email=? AND password=?',[email,password],function(err,rows){
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            }else{
                var pk=rows[0].privkey;
                res.render('pk_redirect',{
                    pk:pk,
                })
            }
        })
    })
})
module.exports = router;
