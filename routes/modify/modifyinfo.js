var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
    res.render('modify/modifyinfo', {
        title: '修改資料',
        email: req.session.email,
        role: req.session.role,
        walletaddress: req.session.walletaddress
    })
})
module.exports = router;