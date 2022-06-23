var express = require("express");
var router = express.Router();
//require("dotenv").config();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var stockAddress = "0x3be920996149c9746729D2A707a360D0324CD425";
var stockabi = require('../stockABI');
var stockabi = stockabi.stockABI;
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
var contract = web3.eth.contract(stockabi).at(stockAddress);
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
            connection.query('SELECT * FROM game_list', function (err, rows) {
                if (err) {
                    console.log(err)
                }
                else {
                    var games = rows;
                    res.render('vendor/goodupload', {
                        email: req.session.email,
                        role: req.session.role,
                        bal:bal,
                        games:games,
                    })
                }
            });
            connection.release();
        })

    }

});
router.post("/", function (req, res) {
    var pool = req.connection;
    var gameDate= req.body['date'];
    var mintLimit = req.body['mintLimit'];
    var uri = req.body['ipfsuri'];
    if(gameDate==''){
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
        //console.log(gameDate)
        var timestamp = Math.floor(new Date(gameDate).getTime()/1000);
        //console.log("timestamp:", timestamp)
        console.log(uri)
        var checkname=gameDate.concat('',"up");
        var checkaddress = contract.optionAddress(checkname);
        if (checkaddress != '0x0000000000000000000000000000000000000000') {
            res.render('vendor/goodupload_error')
        } else {
            var data=contract.createGame.getData(gameDate, timestamp, mintLimit, uri);
            var address = req.session.walletaddress;
            var privkey = Buffer.from(req.session.pk, 'hex');
            var count = web3.eth.getTransactionCount(address);
            var gasPrice = 0;
            var gasLimit = 8000000;
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
                var upName = gameDate.concat('',"up");
                var downName = gameDate.concat('',"down");
                var upAddr = contract.optionAddress(upName);
                var downAddr = contract.optionAddress(downName);
                console.log('upAddress:', upAddr)
                console.log('downAddress:', downAddr)
                pool.getConnection(function (err, connection) {
                    connection.query('INSERT INTO game_list(date,timestamp,URI,upAddr,downAddr)VALUES(?,?,?,?,?)',[gameDate,timestamp,uri,upAddr,downAddr],function(err,rows1){
                        if(err){
                            console.log(err)
                        }else{
                            connection.query('INSERT INTO stockNFT(name,date,address,up_or_down,image)VALUES(?,?,?,?,?),(?,?,?,?,?)', [upName, gameDate, upAddr, 'up', uri,downName,gameDate,downAddr,'down',uri], function (err, rows2) {
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