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
router.get('/',function(req,res){

    res.render('works/workted',{
        topic:'已投票作品'
    })
})
module.exports = router;