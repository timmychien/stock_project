var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login');
    }
    var pool=req.connection;
    //var name=req.session.userfirstname+req.session.userlastname;
    var walletaddress=req.session.walletaddress;
    var now = parseInt(Date.now() / 1000);
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM art_works WHERE authoraddress=? AND available=?', [walletaddress,0],function(err,rows){
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            }else{
                var data=rows;
                connection.query('SELECT * FROM voting WHERE startAddstamp<? AND endAddstamp>?', [now, now], function (err, rows) {
                    if (err) {
                        res.render('error', {
                            message: err.message,
                            error: err
                        })
                    } else {
                        var topics = rows;
                        res.render('personal/mywork', {
                            title: '我的作品',
                            data: data,
                            email: req.session.email,
                            role: req.session.role,
                            topics: topics,
                        });
                    }
                })
                /*
                res.render('personal/mywork', {
                    title: '我的作品',
                    data:data,
                    email: req.session.email,
                    role: req.session.role,
                });*/
            }
        })
        connection.release();
    })
    

});

module.exports = router;