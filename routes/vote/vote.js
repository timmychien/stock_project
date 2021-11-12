var express = require('express');
var router = express.Router();
//var redis=require('redis');
//var client=redis.createClient();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/991b420c343949d991d7de33d4d75717"));
var votingAddress = "0x87E6e489980f91F345af85d7EFb70c87B99233cd";
var abi = require('../votingABI');
var abi = abi.votingABI;
var contract = web3.eth.contract(abi).at(votingAddress);
//var pointabi = require('../pointABI');
//var pointabi = pointabi.pointABI;
//var pointAddress = "0x47f84209fcebA2C948C89bEC445a6bD034eb942E";
//var point = web3.eth.contract(pointabi).at(pointAddress);
/* GET home page. */
/*router.get('/:topic/:votingId', function (req, res) {
    if(!req.session.email){
        res.redirect('/')
    }
    var topic = req.params.topic;
    var votingId=req.params.votingId;
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
                var pointbalance=point.balanceOf(req.session.walletaddress).toNumber();
                console.log(pointbalance)
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
                                //data: data,
                                votingId:votingId,
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
    
});*/
router.get('/:topic/:votingId', function (req, res) {
    var topic = req.params.topic;
    var votingId=req.params.votingId;
    //var pool=req.connection;
    /*pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM voting WHERE topic=?', [topic], function (err, rows) {
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            } else {
                var votingId=rows[0].votingId;
                console.log(votingId)*/

                var totalParticipant = contract.getTotalParticipant.call(votingId).toNumber();
                var data = new Array();
                for (var i = 1; i <= totalParticipant; i++) {
                    data[i - 1] = contract.getParticipant.call(votingId, i);
                    data[i - 1][5] = data[i - 1][5].toNumber();
                    data[i - 1][6] = i;
                }
                res.render('vote/vote', {
                    topic: topic,
                    votingId: votingId,
                    email: req.session.email,
                    data: data
                });
                /*pool.getConnection(function(err,connection){
                    connection.query('SELECT * FROM art_works WHERE votingId=? AND available=?',[votingId,1],function(err,rows){
                        if (err) {
                            res.render('error', {
                                message: err.message,
                                error: err
                            })
                        } else {
                            var data=rows;
                            res.render('vote/vote', {
                                email: req.session.email,
                                data: data
                            });
                    }
                    })
                    
                })*/
                
            /*}
        })
        connection.release();
    })*/
    //console.log(votingId)
    /*var totalParticipant=contract.getTotalParticipant.call(votingId).toNumber();
    //console.log(totalParticipant)
    var data = new Array();
    for(var i=1;i<=totalParticipant;i++){
        data[i-1]=contract.getParticipant.call(votingId,i);
        data[i-1][5]=data[i-1][5].toNumber();
        data[i-1][6]=i;
    }*/
    
})
router.post('/:topic/:votingId',function(req,res){
    var votingId=req.body['votingId'];
    var participantId = req.body['participantId'];
    var pool=req.connection;
    console.log(votingId)
    console.log(participantId)
    var votecount=req.session.votecount;
    if(req.session.votecount===undefined){
        req.session.votecount=0;
    }
    else if(votecount==2){
        res.render('vote/vote_warn', {
            warn: '本日投票次數已達最大上限(2次)！'
        })
    }
    console.log('votecount',req.session.votecount)
    var address = process.env.PLATFORM_ADDR;
    var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
    var nftaddress=contract.getnftAddress.call(votingId,participantId);
    console.log(nftaddress)
    var voter=req.session.walletaddress;
    //var votecount=client.hget(voter,'count');
    //console.log('votecount:',votecount)
    var timestamp = parseInt(Date.now() / 1000);
    var data = contract.vote.getData(votingId, participantId, voter, nftaddress, 1, timestamp);
    var count = web3.eth.getTransactionCount(address);
    var gasPrice = web3.eth.gasPrice.toNumber()*2;
    var gasLimit = 3000000;
    var rawTx = {
        "from": address,
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
    req.session.votecount+=1;
    //var votes=contract.voteBalances(votingId,participantId).toNumber();
    //console.log(votes)
    /*
    pool.getConnection(function(err,connection){
        connection.query('UPDATE artworks SET votes=? WHERE votingId=?AND participantId=?',[votes,votingId,participantId],function(err,rows){
            console.log('votes updated.')
            res.render('vote/vote_redirect', {
                hash: 'https://rinkeby.etherscan.io/tx/' + hash
            });
        })
        connection.release();
    })*/
    res.render('vote/vote_redirect', {
        hash: 'https://rinkeby.etherscan.io/tx/' + hash
    });
    
    
})

module.exports = router;
