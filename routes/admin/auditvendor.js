var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
    res.render('admin/auditvendor', {
        topic: '審核'
    })
})
module.exports = router;