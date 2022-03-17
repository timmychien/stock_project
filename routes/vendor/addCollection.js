var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nft-f1da896e4e-node-f6ee1078.baas.twcc.ai"));
var vendorAddress = "0x749cc91223ECe3E2F533eA52760A9D3072da2165";
var abi = require('../vendorABI');
var abi = abi.vendorABI;
var contract = web3.eth.contract(abi).at(vendorAddress);
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nft',
    chainId: 13144,
    networkId: 13144

}, 'petersburg')
/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login')
    }
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
    //var nftaddress=req.body['addr'];
    var address = req.session.walletaddress;
    var vendor=req.session.walletaddress;
    
    var address = process.env.PLATFORM_ADDR;
    var privkey = Buffer.from(req.session.pk, 'hex');
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
    var tx = new Tx(rawTx, { common: customCommon});
    tx.sign(privkey);
    var serializedTx = tx.serialize();
    var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    console.log(hash)
    //var nftaddress = contract.getaddress.call(vendor, name);
    //console.log(nftaddress)
    res.render('vendor/add_redirect');
    setTimeout(function(){
        pool.getConnection(function (err, connection) {
            var nftaddress = contract.getaddress.call(vendor, name);
            console.log(nftaddress)
            connection.query('INSERT INTO collectionList(name,symbol,vendor,contract)VALUES(?,?,?,?)', [name, symbol, vendor,nftaddress], function (err, rows) {
                if (err) {
                    res.render('error', {
                        message: err.message,
                        error: err
                    })
                } else {
                    
                }
            })
            connection.release()
        })
    },15000)
    
    
})
module.exports = router;