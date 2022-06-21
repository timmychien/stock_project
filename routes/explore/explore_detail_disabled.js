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
var stockabi=require('../stockABI');
var stockabi=stockabi.stockABI;
var stockAddress ="0xebF8Ddd2bbC45E172461CF4117a97C0b7E3F41A5";
var stockcontract=web3.eth.contract(stockabi).at(stockAddress);
var collectionabi = require('../collectionABI');
var collectionabi = collectionabi.collectionABI;
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nftproject',
    chainId: 13330,
    networkId: 13330

}, 'petersburg')
/* GET home page. */
router.get("/:contractaddress", function (req, res) {
    var pool = req.connection;
    var contractaddress = req.params.contractaddress;
    if (!req.session.email) {
        var bal=0;
        var contract = web3.eth.contract(collectionabi).at(contractaddress);
        var uri=contract.baseURI.call();
        var name = contract.name.call();
        var mintLimit = contract.mintLimit.call();
        var totalSupply = contract.totalSupply.call();
        res.render('explore/explore_detail_disabled',{
            bal:bal,
            uri:uri,
            name:name,
            mintLimit:mintLimit,
            totalSupply:totalSUpply
        })
    }else{
        res.redirect('/explore_detail/'+contractaddress)
    }
});
module.exports = router;