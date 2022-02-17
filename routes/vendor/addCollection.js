var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/991b420c343949d991d7de33d4d75717"));
var vendorAddress = "0xB00275b367A087243Bdcc91c4B1C8318c4B9a49F";
var abi = require('../vendorABI');
var abi = abi.vendorABI;
var contract = web3.eth.contract(abi).at(vendorAddress);
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
    var pool = req.connection;
    var name=req.body['name'];
    var symbol=req.body['symbol'];
    var vendor=req.session.walletaddress;
    var address = process.env.PLATFORM_ADDR;
    var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
    var data = contract.createNFT.getData(name,symbol,vendor);
    var count = web3.eth.getTransactionCount(address);
    var gasPrice = web3.eth.gasPrice.toNumber()*2;
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
    setTimeout(function () {
        var nftaddress = contract.getaddress.call(vendor, name);
        pool.getConnection(function(err,connection){
            connection.query('INSERT INTO collectionList(name,symbol,vendor,contract)VALUES(?,?,?,?)', [name, symbol, vendor, nftaddress],function(err,rows){
                if (err) {
                    res.render('error', {
                        message: err.message,
                        error: err
                    })
                }else{
                    res.redirect('/');
                }
            })
            connection.release()
        })
    },8000)
})
module.exports = router;