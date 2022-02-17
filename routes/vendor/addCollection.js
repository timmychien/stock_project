var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('vendor/addCollection', {
        title: '新增商品集',
        email: req.session.email,
        role: req.session.role,
        walletaddress: req.session.walletaddress
    });
});
router.post('/', function (req, res) {
    var name=req.body['name'];
    var symbol=req.body['symbol'];
})
module.exports = router;