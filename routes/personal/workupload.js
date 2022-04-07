var express = require('express');
var router = express.Router();
require('dotenv').config();
/* GET home page. */
router.get('/', function (req, res) {
    var pool=req.connection;
    if (!req.session.email) {
        res.redirect('/login');
    }
    if (req.session.isverified == 0) {
        console.log('need verify')
        res.redirect('/emailverify');
    }
    else{
        var vendor = req.session.walletaddress;
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM collectionlist WHERE vendor=?', [vendor], function (err, rows) {
                if (err) {
                    console.log(err)
                }
                else{
                    var collections=rows
                    res.render('personal/workupload', {
                        title: '我的商品集',
                        email: req.session.email,
                        role: req.session.role,
                        collections:collections
                    })
                }
                
            });
            connection.release();
        })
        
    }
    
});
router.post('/',function(req,res){
    //res.send(req.file)
    var author=req.session.name;
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
                connection.query('INSERT INTO art_works (votingId,participantId,name,symbol,author,uri,authoraddress,available,promote)VALUES(?,?,?,?,?,?,?,?,?)', [0,0, name, symbol, author, uri, authoraddress, 0,0], function (err, rows) {
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