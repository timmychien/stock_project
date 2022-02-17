var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('vendor/workListing', {
        title: 'Home',
        email: req.session.email,
        role: req.session.role,
        walletaddress: req.session.walletaddress
    });
});
module.exports = router;
