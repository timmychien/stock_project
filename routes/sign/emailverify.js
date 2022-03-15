var express=require('express');
var router=express.Router();
router.get('/',function(req,res){
    res.render('emailverify',{
        title:'信箱驗證'
    })
})
router.post('/',function(req,res){
    var emailcode=req.body['emailcode'];
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM member_info WHERE email=?', [req.session.email, emailcode],function(err,rows){
            if(err){
                console.log(err)
            }else{
                if(emailcode!=rows[0].verifycode){
                    res.render('sign/emailverify',{
                        warn:'驗證碼錯誤，請重新輸入。'
                    })
                }else{
                    res.render('sign/sign_redirect',{pk:rows[0].privkey});
                }
            }
        })
        connection.release()
    })
})
module.exports=router;