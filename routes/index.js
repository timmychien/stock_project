var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var pool = req.connection;
  pool.getConnection(function(err,connection){
    connection.query('SELECT * FROM art_works WHERE promote=1',function(err,rows){
      if (err) {
        res.render('error', {
          message: err.message,
          error: err
        })
      }else{
        var promote_data=rows;
        res.render('index', {
          title: 'Home',
          promote_data:promote_data,
          email: req.session.email,
          role: req.session.role,
          walletaddress: req.session.walletaddress
        });
      }
    })
    connection.release();
  })
});

module.exports = router;
