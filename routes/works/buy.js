var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/991b420c343949d991d7de33d4d75717"));
var votingAddress = "0xA37A3C77EDeC40581321e6bd67f616Cad462bbA0";
var abi = require('../votingABI');
var abi = abi.votingABI;
var contract = web3.eth.contract(abi).at(votingAddress);
/* GET home page. */
router.get('/:votingId/:participantId', function (req, res) {
    var votingId=req.params.votingId;
    var participantId = req.params.participantId;
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM art_works WHERE votingId=? AND participantId=?',[votingId,participantId],function(err,rows){
            var data=rows;
            res.render('works/buy',{
                data:data,
                email:req.session.email,
                role:req.session.role
            })
        })
    })
});