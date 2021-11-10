var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/991b420c343949d991d7de33d4d75717"));
var votingAddress = "0xD1de894d6C17789dC263b1BeE386F451A4FABF3D";
var abi = require('../votingABI');
var abi = abi.votingABI;
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x8b014D5aF226d052Aff504E0d120926834286Dca";
var point = web3.eth.contract(pointabi).at(pointAddress);
var contract = web3.eth.contract(abi).at(votingAddress);
/* GET home page. */
router.get('/:topic', function (req, res) {
    if(!req.session.email){
        res.redirect('/')
    }
    var topic = req.params.topic;
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM voting WHERE topic=?',[topic],function(err,rows){
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            }else{
                var startVote=rows[0].startVotestamp;
                var now=parseInt(Date.now()/1000);
                var pointbalence=point.balanceOf(req.session.walletaddress);
                console.log(now)
                console.log(startVote)
                if(now<startVote){
                    res.render('vote/vote_warn',{
                        warn:'投票時間尚未開始！'
                    })
                }
                else if(pointbalance<1){
                    res.render('vote/vote_warn', {
                        warn: '點數餘額不足！'
                    })
                }
                else{
                    var votingId = rows[0].votingId;
                    connection.query('SELECT * FROM art_works WHERE votingId=?', [votingId], function (err, rows) {
                        if (err) {
                            res.render('error', {
                                message: err.message,
                                error: err
                            })
                        } else {
                            var data = rows;
                            res.render('vote/vote', {
                                title: '投票',
                                topic: topic,
                                data: data,
                                email: req.session.email,
                                role: req.session.role
                            });
                        }
                    })
                }
                
            }
        })
        connection.release();
    })
    
});
router.post('/:topic',function(req,res){
    var address = process.env.PLATFORM_ADDR;
    var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
    var votingId=req.body['votingId'];
    var participantId=req.body['participantId'];
    var nftaddress=contract.getnftAddress.call(votingId,participantId);
    console.log(nftaddress)
    var voter=req.session.walletaddress;
    var timestamp = parseInt(Date.now() / 1000);
    var data = contract.vote.getData(votingId, participantId,voter,nftaddress,1,timestamp);
    var count = web3.eth.getTransactionCount(address);
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 3000000;
    var rawTx = {
        "from":address,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": votingAddress,
        "value": 0x0,
        "data": data,
        "chainId": 0x04
    }
    var tx = new Tx(rawTx, { chain: 'rinkeby' });
    tx.sign(privkey);
    var serializedTx = tx.serialize();
    var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    console.log(hash)
    res.render('vote/vote_redirect',{
        hash: 'https://rinkeby.etherscan.io/tx/' + hash
    });
})

module.exports = router;
