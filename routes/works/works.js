var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('works/works', {
        title: 'Works',
        email: req.session.email,
        role: req.session.role,
        walletaddress: req.session.walletaddress
    });
            
})

module.exports = router;
