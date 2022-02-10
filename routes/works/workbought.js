var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/991b420c343949d991d7de33d4d75717"));
var votingAddress = "0x074633F77544C5B0e8f02A534E3313E1fe61dc04";
var abi = require('../votingABI');
var abi = abi.votingABI;
var contract = web3.eth.contract(abi).at(votingAddress);
router.get('/', function (req, res) {
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
        data: data
    })
})
module.exports = router;