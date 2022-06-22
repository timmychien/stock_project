var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
var stockAddress = "0x77018B67b39598Ae8145A178c689E4CD32a5aFF6";
var stockabi = require('../stockABI');
var stockabi = stockabi.stockABI;
var stockcontract = web3.eth.contract(stockabi).at(stockAddress);
var collectionabi = require('../collectionABI');
var collectionabi = collectionabi.collectionABI;
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nftproject',
    chainId: 13330,
    networkId: 13330

}, 'petersburg')
/* GET home page. */
router.get("/:contractaddress", function (req, res) {
    var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
    var pool = req.connection;
    var contractaddress = req.params.contractaddress;
    var contract = web3.eth.contract(collectionabi).at(contractaddress);
    var uri = contract.baseURI.call();
    var name = contract.name.call();
    var mintLimit = contract.mintLimit.call();
    var totalSupply = contract.totalSupply.call();
    res.render('explore/explore_detail',{
        email:req.session.email,
        role:req.session.role,
        bal:bal,
        uri:uri,
        name:name,
        mintLimit:mintLimit,
        totalSupply:totalSupply
    })
    
});

router.post('/:contractaddress',function(req,res){
    var contractaddress = req.params.contractaddress;
    //var price = req.body['price'];
    var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
    if (bal < price) {
        res.render('explore/explore_detail', {
            warn: '您的點數餘額不足!'
        })
    }
    else{
        res.render('explore/buy_confirm', {
            contractaddress: contractaddress,
        });
    }
})
router.post('/:contractaddress/confirm', function (req, res) {
    //var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
    var tokenaddress = req.params.contractaddress;
    var tokenid = req.params.tokenid;
    var price=1;
    var pool = req.connection;
    var timestamp = Math.floor(Date.now() / 1000);
    var time = new Date();
    time = time.getUTCFullYear() + '-' +
        ('00' + (time.getMonth() + 1)).slice(-2) + '-' +
        ('00' + time.getDate()).slice(-2) + ' ' +
        ('00' + time.getHours()).slice(-2) + ':' +
        ('00' + time.getMinutes()).slice(-2) + ':' +
        ('00' + time.getSeconds()).slice(-2);    
    var tokencontract = web3.eth.contract(collectionabi).at(tokenaddress);
    var name = tokencontract.name.call();
    //var tokenowner = tokencontract.owner.call();
    var buyer = req.session.walletaddress;
    var address = req.session.walletaddress;
    var privkey = Buffer.from(req.session.pk, 'hex');
    var data = stockcontract.buy.getData(buyer,tokenaddress,amount,price,timestamp);
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
    pool.getConnection(function (err, connection) {
        var buyer_bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
        buyer_bal=buyer_bal-price;
        //var seller_bal = pointcontract.balanceOf.call(tokenowner).toNumber();
        //seller_bal=seller_bal+parseInt(price);
        var buy_change=-price;
        //var sell_change=+price;
        var buy_info='購買NFT:'+name;
        var sell_info = '販售NFT:' + name;
        connection.query('INSERT INTO point_transactions(time,address,hash,change_amount,balance,info)VALUES(?,?,?,?,?,?)',[time,buyer,hash,buy_change,buyer_bal,buy_info],function(err,rows){
            if(err){
                console.log(err)
            }else{
                connection.query("INSERT INTO nft_transaction(txhash,contractAddress,tokenId,actor,info,time)VALUES(?,?,?,?,?,?)", [hash, tokenaddress,"#",req.session.name, "購買", time], function (err, rows) {
                    res.render('explore/buy_redirect');
                })
                        
            }
        })
        connection.release();
        
    })
    //res.render('explore/buy_redirect');
    
})

module.exports = router;