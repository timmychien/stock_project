var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nft-f1da896e4e-node-f6ee1078.baas.twcc.ai"));
var vendorAddress = "0xd0bbD01cd1e0580dA43031D99f0864c087040C2E";
var vendorabi = require('../vendorABI');
var vendorabi = vendorabi.vendorABI;
var abi = require('../collectionABI');
var abi = abi.collectionABI;
var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nft',
    chainId: 13144,
    networkId: 13144

}, 'petersburg')
var contracts = new Array();
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login')
    }
    var pool=req.connection;
    var owner=req.session.walletaddress;
    //console.log(owner)
    var works = new Array();
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM collectionlist',function(err,rows){
            if(err){
                console.log(err)
            }else{
                for (var i = 0; i < rows.length; i++) {
                    if (contracts.includes(rows[i].contract) == false) {
                        contracts.push(rows[i].contract);
                    }
                }
                console.log(contracts)
                for (var idx = 0; idx < contracts.length; idx++) {
                    var contract = web3.eth.contract(abi).at(contracts[idx]);
                    var idlist = contract.tokenIdofOwnerByAddress.call(owner);
                    var ids = new Array();
                    for (var j = 0; j < idlist.length; j++) {
                        if(vendorcontract.isOnSell.call(contracts[idx],idlist[j])==false){
                            ids.push(idlist[j].toNumber());
                        }
                        
                    }
                    for (var id = 0; id < ids.length; id++) {
                        var uri = contract.tokenURI.call(ids[id]);
                        works.push([uri, contracts[idx], ids[id]]);
                    }
                }
                res.render('resell/resell', {
                    title: '我的藝術品',
                    email: req.session.email,
                    role: req.session.role,
                    walletaddress: req.session.walletaddress,
                    works: works
                });
            }
        })
        connection.release();
    })
    
});
router.post('/',function(req,res){
    var nftaddress=req.body['nftaddress'];
    var tokenId=req.body['tokenId'];
    var address=req.session.walletaddress;
    var contract = web3.eth.contract(abi).at(nftaddress)
    var privkey = Buffer.from(req.session.pk, 'hex');
    var data = contract.approve.getData(vendorAddress,tokenId);
    var count = web3.eth.getTransactionCount(address);
    var gasPrice = 0;
    var gasLimit = 3000000;
    var rawTx = {
        "from": address,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": nftaddress,
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
        res.redirect('/resell/' + nftaddress + '/' + tokenId);
    },5000)
   
})
router.get('/:address/:id',function(req,res){
    res.render('resell/resell_redirect',{
        email:req.session.email
    })
})
router.post('/:address/:id',function(req,res){
    var nftaddress=req.params.address;
    var tokenId=req.params.id;
    var newPrice=req.body['newPrice'];
    var address = req.session.walletaddress;
    var privkey = Buffer.from(req.session.pk, 'hex');
    var data = vendorcontract.relist.getData(nftaddress,tokenId,address,newPrice);
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
    res.redirect('/')
})
module.exports = router;