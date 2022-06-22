var express = require("express");
var router = express.Router();
//require("dotenv").config();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var stockAddress = "0xAaAB5FdeF3E26878D2D2d7a1B4511184F21C6EC5";
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
    var date= req.body['date'];
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
        var timestamp = Math.floor(new Date(date).getTime()/1000);
        console.log("timestamp:", timestamp)
        console.log(uri)
        var checkname=date.concat('',"up");
        var checkaddress = contract.optionAddress(checkname);
        if (checkaddress != '0x0000000000000000000000000000000000000000') {
            res.render('vendor/goodupload_error')
        } else {
            var datestring = date.toString();
            var data=contract.createGame.getData(date, timestamp, mintLimit, uri);
            var address = req.session.walletaddress;
            var privkey = Buffer.from(req.session.pk, 'hex');
            var count = web3.eth.getTransactionCount(address);
            var gasPrice = 0;
            var gasLimit = 3000000;
            var rawTx = {
                "from": address,
                "nonce": web3.toHex(count),
                "gasPrice": web3.toHex(gasPrice),
                "gasLimit": web3.toHex(gasLimit),
                "to": stockAddress,
                "value": 0x0,
                "data": data,
                "chainId": 13330
            }
            var tx = new Tx(rawTx, { common: customCommon });
            tx.sign(privkey);
            var serializedTx = tx.serialize();
            var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log(hash)
            setTimeout(function () {
                var upName = date.concat('',"up");
                var downName = date.concat('',"down");
                var upAddr = contract.optionAddress(upName);
                var downAddr = contract.optionAddress(downName);
                console.log('upAddress:', upAddr)
                console.log('downAddress:', downAddr)
                pool.getConnection(function (err, connection) {
                    connection.query('INSERT INTO game_list(date,timestamp,URI,upAddr,downAddr)VALUES(?,?,?,?,?)',[date,timestamp,uri,upAddr,downAddr],function(err,rows1){
                        if(err){
                            console.log(err)
                        }else{
                            connection.query('INSERT INTO stockNFT(name,date,address,up_or_down,image)VALUES(?,?,?,?,?),(?,?,?,?,?)', [upName, date, upAddr, 'up', uri,downName,date,downAddr,'down',uri], function (err, rows2) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    res.render('vendor/list_redirect');
                                }
                            })
                        }
                    })
                    connection.release();
                })
            }, 8000)
        }
    }
});

module.exports = router;