var express = require('express');
var router = express.Router();
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/991b420c343949d991d7de33d4d75717"));
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x99fDf0C3D582520614B49e967929156EF9e4Cbba";
var point = web3.eth.contract(pointabi).at(pointAddress);
/* GET home page. */
router.get('/', function (req, res) {
    if(!req.session.email){
        res.redirect('/login');
    }
    else{
        var pool = req.connection;
        pool.getConnection(function (err, connection) {
            var now = parseInt(Date.now() / 1000);
            connection.query('SELECT * FROM voting WHERE startVotestamp<? AND endVotestamp>?', [now, now], function (err, rows) {
                if (err) {
                    res.render('error', {
                        message: err.message,
                        error: err
                    })
                }
                else {
                    var data = rows;
                    res.render('activity/activity_onvote', {
                        title: '投票中活動',
                        data: data,
                        email: req.session.email,
                        role: req.session.role
                    });
                }
            })
            connection.release();
        })
    }

});
router.post('/', function (req, res) {
    var vote_topic = req.body['topic'];
    var pool = req.connection;
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM voting WHERE topic=?', [vote_topic], function (err, rows) {
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            } else {
                var startVote = rows[0].startVotestamp;
                var now = parseInt(Date.now() / 1000);
                var pointbalance = point.balanceOf(req.session.walletaddress).toNumber();
                if (now < startVote) {
                    res.render('../vote/vote_warn', {
                        warn: '投票時間尚未開始！'
                    })
                }
                else if (pointbalance < 1) {
                    res.render('../vote/vote_warn', {
                        warn: '點數餘額不足！'
                    })
                } else {
                    var votingId = rows[0].votingId;
                    res.redirect('/vote/' + vote_topic + '/' + votingId);
                }

            }
        })
        connection.release();
    })

})
module.exports = router;