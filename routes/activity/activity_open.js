var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (req.session) {
        res.render('activity/activity_open', {
            title: '開放中',
            email: req.session.email,
            role: req.session.role,
            walletaddress: req.session.walletaddress
        });
    }
    else {
       res.redirect('/login')
    }

});

module.exports = router;