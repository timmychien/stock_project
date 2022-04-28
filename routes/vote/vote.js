var express = require('express');
var router = express.Router();
//var redis=require('redis');
//var client=redis.createClient();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var votingAddress = "0x1265cF01155a42c78a5DF92cdc07B20d9d107ddF";
var abi = require('../votingABI');
var abi = abi.votingABI;
var contract = web3.eth.contract(abi).at(votingAddress);
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nft',
    chainId: 13330,
    networkId: 13330

}, 'petersburg')
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
                /*
                pool.getConnection(function(err,connection){
                    connection.query('SELECT votecount FROM member_info WHERE address=?',[req.session.walletaddress],function(err,rows){
                        if (err) {
                            res.render('error', {
                                message: err.message,
                                error: err
                            })
                        } else {
                            var votecount=rows[0].votecount;
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
    var pointpaid=req.body['pointpaid'];
    var voter = req.session.walletaddress;
    //var address = process.env.PLATFORM_ADDR;
    var address=req.session.walletaddress;
    //var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
    var privkey = Buffer.from(req.session.pk, 'hex');
    var pool=req.connection;
    console.log(votingId)
    console.log(participantId)
    pool.getConnection(function (err, connection) {
        connection.query('SELECT votecount FROM member_info WHERE address=?', [voter], function (err, rows) {
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            } 
            var votecount = rows[0].votecount;
            if (votecount == 2) {
                res.render('vote/vote_warn', {
                    warn: '本日投票次數已達最大上限(2次)！'
                })
                console.log('votecount', votecount)
            }else{
                var timestamp = parseInt(Date.now() / 1000);
                var data = contract.vote.getData(votingId, participantId, voter,timestamp,pointpaid);
                var count = web3.eth.getTransactionCount(address);
                var gasPrice = web3.eth.gasPrice.toNumber() * 2;
                var gasLimit = 3000000;
                var rawTx = {
                    "from": address,
                    "nonce": web3.toHex(count),
                    "gasPrice": web3.toHex(gasPrice),
                    "gasLimit": web3.toHex(gasLimit),
                    "to": votingAddress,
                    "value": 0x0,
                    "data": data,
                    "chainId": 13144
                }
                var tx = new Tx(rawTx, { common: customCommon });
                tx.sign(privkey);
                var serializedTx = tx.serialize();
                var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
                console.log(hash)

                pool.getConnection(function (err, connection) {
                    connection.query('UPDATE  member_info SET votecount=votecount+1 WHERE address=?', [voter], function (err, rows) {
                        if (err) {
                            res.render('error', {
                                message: err.message,
                                error: err
                            })
                        } else {
                            console.log('votecount updated.')
                            res.render('vote/vote_redirect', {
                                //hash: 'https://rinkeby.etherscan.io/tx/' + hash
                            });
                        }

                    })
                    connection.release();
                })
            }
        }) 
    })
})
/*
router.post('/:topic/:votingId/buy',function(req,res){
    var votingId_buy = req.body['votingId_buy'];
    var participantId_buy = req.body['participantId_buy'];
    console.log(votingId_buy)
    console.log(participantId_buy)
    var buyer = req.session.walletaddress;
    var address = process.env.PLATFORM_ADDR;
    var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
    var data = contract.buy.getData(votingId_buy, participantId_buy, 1, 1, buyer);
    var count = web3.eth.getTransactionCount(address);
    var gasPrice = web3.eth.gasPrice.toNumber() * 2;
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
    res.render('vote/buy_redirect', {
        hash: 'https://rinkeby.etherscan.io/tx/' + hash
    });
})*/
module.exports = router;
