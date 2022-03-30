var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login');
    }
    if (req.session.isverified == 0) {
        console.log('need verify')
        res.redirect('/emailverify');
    }
    res.render('personal/myinfo', {
        title: '我的個人資料',
        email:req.session.email,
        name:req.session.name,
        walletaddress:req.session.walletaddress,
        address:req.session.home_address,
        cellphone:req.session.cellphone,
        privkey:req.session.pk,
        role: req.session.role
    });

});

module.exports = router;