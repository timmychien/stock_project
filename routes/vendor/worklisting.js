var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var pool=req.connection;
    var vendor=req.session.walletaddress;
    pool.getConnection(function(err,connection){
        connection.query('SELECT name FROM collectionlist WHERE vendor=?',[vendor],function(err,rows){
            var names=rows;
            res.render('vendor/collectionListing', {
                title: '商品上架',
                names:names,
                email: req.session.email,
                role: req.session.role,
                walletaddress: req.session.walletaddress
            });
        })
    })
});
router.post('/', function (req, res) {
    var collection= req.body['select_collection'];
    res.redirect('/workListing/' + collection);
})
router.get('/:collection',function(req,res){
    var collection=req.params.collection;
    res.render('vendor/workListing',{
        title: '商品上架',
        collection_name:collection,
        email: req.session.email,
        role: req.session.role,
        walletaddress: req.session.walletaddress
    })
})
module.exports = router;
