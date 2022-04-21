var express = require("express");
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nft-f1da896e4e-node-f6ee1078.baas.twcc.ai"));
var vendorAddress = "0x7fDd60Cb32A4Db94EFfFe1611c588695f6e9E65b";
var abi = require('../collectionABI');
var abi = abi.collectionABI;
var vendorabi = require('../vendorABI');
var vendorabi = vendorabi.vendorABI;
var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nft',
    chainId: 13144,
    networkId: 13144

}, 'petersburg')
/* GET home page. */
router.get("/:title/:contractaddress", function (req, res) {
    if (!req.session.email) {
        res.redirect("/login");
    }
    // workaround in local
    var contractaddress=req.params.contractaddress;
    var title=req.params.title;
    var pool=req.connection;
    var contract = web3.eth.contract(abi).at(contractaddress);
    pool.getConnection(function(err,connection){
        connection.query("SELECT * FROM collectionlist WHERE contract=?",[contractaddress],function(err,rows){
            if(err){
                console.log(err)
            }
            var collectionuri=rows[0].uri;
            var description=rows[0].description;
            var amount=contract.totalSupply.call();
            var goods = new Array();
            for (var id = 1; id <=amount; id++) {
                var tokenuri = contract.tokenURI.call(id);
                goods.push([tokenuri,id]);
            }
            res.render("vendor/collection_detail", {
                //title: "商品集詳情",
                email: req.session.email,
                uri: collectionuri,
                title: title,
                data:rows,
                description: description,
                goods: goods,
            });
        })
        //connection.release();
    })
    
});

router.post("/:title/:contractaddress", function (req, res) {
    var tokenaddress = req.params.contractaddress;
    var ipfsuri=req.body['ipfsuri'];
    var name=req.body['name'];
    var description=req.body['description'];
    var price=req.body['price'];
    console.log(ipfsuri);
    var vendor = req.session.walletaddress;
    var address = req.session.walletaddress;
    var privkey = Buffer.from(req.session.pk, "hex");
    var data = vendorcontract.singleMint.getData(tokenaddress,vendor,ipfsuri,name,description,price);
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
        "chainId": 13144
    }
    var tx = new Tx(rawTx, { common: customCommon });
    tx.sign(privkey);
    var serializedTx = tx.serialize();
    var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    console.log(hash)
    //res.redirect('/');
    res.render('vendor/list_redirect');
});

module.exports = router;