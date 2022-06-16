var express = require("express");
var router = express.Router();
//require("dotenv").config();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var stockAddress = "0xebF8Ddd2bbC45E172461CF4117a97C0b7E3F41A5";
var abi = require('../stockABI');
var abi = abi.stockABI;
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
var contract = web3.eth.contract(abi).at(stockAddress);
var collectionabi = require('../collectionABI');
var collectionabi = collectionabi.collectionABI;
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nftproject',
    chainId: 13330,
    networkId: 13330

}, 'petersburg')
/* GET home page. */
router.get('/', function (req, res) {
    var pool = req.connection;
    if (!req.session.email) {
        res.redirect('/login');
    }
    else {
        //var vendor = req.session.walletaddress;
        var bal = pointcontract.balanceOf(req.session.walletaddress).toNumber();
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM stockNFT', function (err, rows) {
                if (err) {
                    console.log(err)
                }
                else {
                    var collections = rows;
                    res.render('vendor/goodupload', {
                        title: '我的商品集',
                        email: req.session.email,
                        role: req.session.role,
                        bal:bal,
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
    var date=req.body['date'];
    var updown = req.body['updown'];
    var mintLimit = req.body['mintLimit'];
    var uri = req.body['ipfsuri'];
    if(date==''){
        res.render('vendor/error_handle',{
            warn:'您尚未輸入日期',
        })
    }
    else if(mintLimit==''){
        res.render('vendor/error_handle', {
            limitWarn: '您尚未輸入欲發行上限',
        })
    }
    else if(mintLimit<0){
        res.render('vendor/error_handle', {
            limitWarn: '數值不可為負',
        })
    }
    else if(uri==''){
        res.render('vendor/error_handle', {
            uriWarn: '未上傳圖片或圖片未上傳成功',
        })
    }
    else{
        console.log(date)
        var timestamp = (new Date(date).getTime()) / 1000;
        var name = date + updown;
        console.log("timestamp:", timestamp)
        console.log(uri)
        var checkaddress = contract.optionAddress(name);
        if (checkaddress != '0x0000000000000000000000000000000000000000') {
            res.render('vendor/goodupload_error')
        } else {
            if (updown == 'up') {
                var data = contract.createUpOption.getData(date, timestamp, mintLimit, uri);
            } else {
                var data = contract.createDownOption.getData(date, timestamp, mintLimit, uri);
            }
            var address = req.session.walletaddress;
            var privkey = Buffer.from(req.session.pk, 'hex');
            var count = web3.eth.getTransactionCount(address);
            var gasPrice = web3.eth.gasPrice.toNumber();
            var gasLimit = 3000000;
            var rawTx = {
                "from": address,
                "nonce": web3.toHex(count),
                "gasPrice": web3.toHex(gasPrice),
                "gasLimit": web3.toHex(gasLimit),
                "to": stockAddress,
                "value": 0x0,
                "data": data,
                "chainId": 13144
            }
            var tx = new Tx(rawTx, { common: customCommon });
            tx.sign(privkey);
            var serializedTx = tx.serialize();
            var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log(hash)
            setTimeout(function () {
                var optionAddress = contract.optionAddress(name);
                console.log('optionAddress:', optionAddress)
                pool.getConnection(function (err, connection) {
                    connection.query('INSERT INTO stockNFT(name,date,address,up_or_down,image)VALUES(?,?,?,?,?)', [name,date, optionAddress, updown, uri], function (err, rows) {
                        if (err) {
                            console.log(err)
                        } else {
                            res.render('vendor/list_redirect');
                        }
                    })
                    connection.release();
                })
            }, 5000)
        }
    }
});

module.exports = router;