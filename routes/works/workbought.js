var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var votingAddress = "0x1265cF01155a42c78a5DF92cdc07B20d9d107ddF";
var votingAddress = "";
var abi = require('../votingABI');
var abi = abi.votingABI;
var contract = web3.eth.contract(abi).at(votingAddress);
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect("/login");
    }
    var buyer = req.session.walletaddress;
    var buycounts = contract.getbuyCounts.call(buyer).toNumber();
    var data = new Array();
    for (var i = 1; i <= buycounts; i++) {
        data[i - 1] = contract.getBuyRecord.call(buyer, i);
        data[i - 1][0] = data[i - 1][0].toNumber();
        data[i - 1][1] = data[i - 1][1].toNumber();
        data[i - 1][2] = data[i - 1][2].toNumber();
    }
    console.log(data)
    res.render('works/workbought', {
        topic: '已購買作品',
        data: data,
        bal: bal,
        email: req.session.email,
        role: req.session.role,
    })
})
module.exports = router;