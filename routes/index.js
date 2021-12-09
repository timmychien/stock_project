var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if(req.session){
    res.render('index', {
      title: 'Home',
      email: req.session.email,
      role: req.session.role,
      walletaddress: req.session.walletaddress
    });
  }
  else{
    es.render('index', {
      title: 'Home',
    });
  }
  
});

module.exports = router;
