var express=require('express');
var router=express.Router();
router.get('/',function(req,res){
    res.render('forgetpw/resetpw');
})
router.post('/',function(req,res){
    var email=req.body['email'];
    var userpass=req.body['userpass'];
    var passcheck=req.body['passcheck'];
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT * from member_info WHERE email=?',[email],function(err,rows){
            if(rows==0){
                res.render('forgetpw/resetpw',{
                    warn1:'此信箱尚未註冊'
                })
            }
            if(userpass!=passcheck){
                res.render('forgetpw/resetpw', {
                    warn2: '密碼不符'
                })
            }
            else{
                connection.query('UPDATE member_info SET password=? where email=?',[userpass,email],function(err,rows){
                    if (err) {
                        console.log(err)
                    }else{
                        res.render('forgetpw/resetpw_redirect');
                    }
                    
                })
            }
        })
        connection.release();
    })
})
module.exports=router;