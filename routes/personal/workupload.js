var express = require('express');
var router = express.Router();
require('dotenv').config();
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nft-f1da896e4e-node-f6ee1078.baas.twcc.ai"));
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x3321432994311cf7ee752971C8A8D67dF357fa43";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
/* GET home page. */
router.get('/', function (req, res) {
    var pool=req.connection;
    if (!req.session.email) {
        res.redirect('/login');
    }
    if (req.session.isverified == 0) {
        console.log('need verify')
        res.redirect('/emailverify');
    }
    else{
        var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
        var author = req.session.walletaddress;
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM art_works WHERE authoraddress=?',[author], function (err, rows) {
                if (err) {
                    console.log(err)
                }
                else{
                    var works=rows;
                    res.render('personal/workupload', {
                        title: '我的商品集',
                        email: req.session.email,
                        role: req.session.role,
                        bal: bal,
                        works:works
                    })
                }
                
            });
            connection.release();
        })
        
    }
    
});
router.post('/',function(req,res){
    //res.send(req.file)
    var author=req.session.name;
    var authoraddress=req.session.walletaddress;
    var name=req.body['name'];
    var symbol=req.body['symbol'];
    var uri=req.body['ipfsuri'];
    var description=req.body['description'];
    console.log(uri)
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM art_works WHERE name=? AND,symbol=?',[name,symbol],function(err,rows){
            if (err) {
                console.log(err)
            }
            if(rows==1){
                res.render('personal/workupload',{
                    warn:"此名稱與代號已被使用！"
                })
            }
            else{
                connection.query('INSERT INTO art_works (votingId,participantId,name,symbol,author,uri,authoraddress,available,promote,description)VALUES(?,?,?,?,?,?,?,?,?,?)', [0,0, name, symbol, author, uri, authoraddress, 0,0,description], function (err, rows) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('upload success')
                        res.render('personal/workupload_redirect',{
                            uri:uri
                        })
                    }
                })
            }
        })
        connection.release();
    })
})
module.exports = router;