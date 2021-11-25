var express = require('express');
var router = express.Router();
require('dotenv').config();
/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login');
    }
    res.render('personal/workupload', {
        title: '作品上傳',
        email: req.session.email,
        role: req.session.role,
    });

});
router.post('/',function(req,res){
    //res.send(req.file)
    var author=req.session.userfirstname+req.session.userlastname;
    var authoraddress=req.session.walletaddress;
    var name=req.body['name'];
    var symbol=req.body['symbol'];
    var uri=req.body['ipfsuri'];
    console.log(uri)
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM art_works WHERE name=? AND,symbol=?',[name,symbol],function(err,rows){
            if (err) {
                console.log(err)
            }
            if(rows==1){
                res.render('personal/workupload',{
                    warn:"此名稱與代號已被使用！"
                })
            }
            else{
                connection.query('INSERT INTO art_works (votingId,participantId,name,symbol,author,uri,authoraddress,available)VALUES(?,?,?,?,?,?,?,?)', [0,0, name, symbol, author, uri, authoraddress, 0], function (err, rows) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('upload success')
                        res.render('personal/workupload_redirect',{
                            uri:uri
                        })
                    }
                })
            }
        })
        connection.release();
    })
})
module.exports = router;