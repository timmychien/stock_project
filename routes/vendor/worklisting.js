var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/991b420c343949d991d7de33d4d75717"));
var vendorAddress = "0x34051C6c13957064C77A256b9ea7EE5F6684f4A8";
var abi = require('../vendorABI');
var abi = abi.vendorABI;
var contract = web3.eth.contract(abi).at(vendorAddress);
/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login')
    }
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
router.post('/:collection',function(req,res){
    //var uriArr = new Array();
    var collectionName=req.params.collection;
    var uri = req.body['ipfsuri'];
    //uriArr.push(uri.join())
    //console.log(uriArr)
    //const obj = Array.from(uriArr)
    //console.log(Array.from(uriArr))
    var vendor = req.session.walletaddress;
    var address = process.env.PLATFORM_ADDR;
    var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
    var collectionAddr=contract.getaddress.call(vendor,collectionName);
    //console.log(collectionAddr)
    var data = contract.singleMint.getData(collectionAddr,vendor,uri);
    var count = web3.eth.getTransactionCount(address);
    var gasPrice = web3.eth.gasPrice.toNumber() * 2;
    var gasLimit = 3000000;
    var rawTx = {
        "from": address,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": vendorAddress,
        "value": 0x0,
        "data": data,
        "chainId": 0x04
    }
    var tx = new Tx(rawTx, { chain: 'rinkeby' });
    tx.sign(privkey);
    var serializedTx = tx.serialize();
    var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    console.log(hash)
    //res.redirect('/');
    res.render('vendor/list_redirect');
})
module.exports = router;
