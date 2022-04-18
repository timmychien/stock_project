var express = require("express");
var router = express.Router();
//require("dotenv").config();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nft-f1da896e4e-node-f6ee1078.baas.twcc.ai"));
var vendorAddress = "0x7fDd60Cb32A4Db94EFfFe1611c588695f6e9E65b";
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
    var pool = req.connection;
    if (!req.session.email) {
        res.redirect('/login');
    }
    if (req.session.isverified == 0) {
        console.log('need verify')
        res.redirect('/emailverify');
    }
    else {
        var vendor = req.session.walletaddress;
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM collectionlist WHERE vendor=?', [vendor], function (err, rows) {
                if (err) {
                    console.log(err)
                }
                else {
                    var collections = rows;
                    res.render('vendor/goodupload', {
                        title: '我的商品集',
                        email: req.session.email,
                        role: req.session.role,
                        collections: collections
                    })
                }

            });
            connection.release();
        })

    }

});
router.post("/", function (req, res) {
    var pool = req.connection;
    var name = req.body['name'];
    var symbol = req.body['symbol'];
    var description=req.body['description'];
    var uri=req.body['ipfsuri'];
    //var nftaddress=req.body['addr'];
    var address = req.session.walletaddress;
    var vendor = req.session.walletaddress;
    var vendorname=req.session.name;
    var privkey = Buffer.from(req.session.pk, 'hex');
    var data = contract.createNFT.getData(name, symbol, vendor);
    var count = web3.eth.getTransactionCount(address);
    var gasPrice = 0;
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
    //var nftaddress = contract.getaddress.call(vendor, name);
    //console.log(nftaddress)
    setTimeout(function () {
        pool.getConnection(function (err, connection) {
            var nftaddress = contract.getaddress.call(vendor, name);
            console.log(nftaddress)
            connection.query('INSERT INTO collectionList(name,symbol,vendor,contract,description,uri,vendorname)VALUES(?,?,?,?,?,?,?)', [name, symbol, vendor, nftaddress,description,uri,vendorname], function (err, rows) {
                if (err) {
                    res.render('error', {
                        message: err.message,
                        error: err
                    })
                } else {
                    res.render('vendor/add_redirect');
                }
            })
            connection.release()
        })
    }, 15000)

});
module.exports = router;
/*
var collections = [
    {
        uri: "https://dummyimage.com/350x350/8b9091/fff",
        title: "Black collection",
        description: "yummy",
    },
    {
        uri: "https://dummyimage.com/350x350/8b9091/fff",
        title: "Blue collection",
        description: "ocean",
    },
];*/