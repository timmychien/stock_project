var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://besu-nft-f1da896e4e-node-f6ee1078.baas.twcc.ai"));
var votingAddress = "0x395BC95612449BcdD740353BAd023c876552a425";
var abi = require('../votingABI');
var abi = abi.votingABI;
var contract = web3.eth.contract(abi).at(votingAddress);
router.get('/',function(req,res){
    var voter = req.session.walletaddress;
    var votecounts = contract.getVoteCounts.call(voter).toNumber();
    var data = new Array();
    for (var i = 1; i <= votecounts; i++) {
        data[i - 1] = contract.getVoteRecord.call(voter, i);
        data[i - 1][0] = data[i - 1][0].toNumber();
        data[i - 1][1] = data[i - 1][1].toNumber();
        data[i - 1][2] = data[i - 1][2].toNumber();
    }
    console.log(data)
    res.render('works/workvoted',{
        topic:'已投票作品',
        data:data,
        email: req.session.email,
        role: req.session.role,
    })
})
module.exports = router;