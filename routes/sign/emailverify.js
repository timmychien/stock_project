var express=require('express');
var router=express.Router();
router.get('/',function(req,res){
    res.render('sign/emailverify',{
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
                    connection.query('UPDATE member_info SET isverified =? WHERE email =?',[1,req.session.email],function(err,rows){
                        if (err) {
                            console.log(err)
                        } else {
                            req.session.destroy();
                            res.render('sign/verify_redirect');
                        }
                    })
                }
            }
        })
        connection.release()
    })
})
module.exports=router;