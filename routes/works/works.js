var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if(!req.session.email){
        res.redirect('/login')
    }
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM art_works',function(err,rows){
            var data=rows;
            res.render('works/works', {
                data:data,
                title: 'Works',
                email: req.session.email,
                role: req.session.role,
                walletaddress: req.session.walletaddress
            });
        })
    })
                
})

module.exports = router;
