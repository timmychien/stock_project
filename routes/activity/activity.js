var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('activity/activity', {
        title: '活動總覽',
        email: req.session.email,
        role: req.session.role,
    });

});

module.exports = router;