var express=require('express');
var router=express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://besu-nft-f1da896e4e-node-f6ee1078.baas.twcc.ai"));
var vendorAddress = "0x749cc91223ECe3E2F533eA52760A9D3072da2165";
var vendorabi = require('../vendorABI');
var vendorabi = vendorabi.vendorABI;
var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
var collectionabi=require('../collectionABI');
var collectionabi=collectionabi.collectionABI;
router.get('/',function(req,res){
    var pool=req.connection;
    var works=new Array();
    var user=req.session.walletaddress;
    pool.getConnection(function(err,connection){
        connection.query('SELECT contract FROM collectionlist ',function(err,rows){
            if(err){
                console.log(err)
            }
            for(var i=0;i<rows.length;i++){
                var contract=web3.eth.contract(collectionabi).at(rows[i].contract);
                var total=contract.totalSupply.call().toNumber();
                var author=contract.author.call();
                for(var id=1;id<=total;id++){
                    var owner=contract.ownerOf.call(id);
                    if(owner==author&&owner!=user){
                        var uri=contract.tokenURI(id);
                        works.push([uri,rows[i].contract,id]);
                    }
                }
            }
            res.render('explore/explore', {
                email: req.session.email,
                role: req.session.role,
                works: works
            })
        })
        connection.release();
    })
    
})
router.post('/',function(req,res){
    var tokenaddress=req.body['contractaddress'];
    var tokenid=req.body['tokenid'];
    var buyer = req.session.walletaddress;
    var address = process.env.PLATFORM_ADDR;
    var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
    var data = vendorcontract.buy.getData(buyer,2,tokenaddress,tokenid);
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
    res.render('explore/buy_redirect');
})
module.exports=router;