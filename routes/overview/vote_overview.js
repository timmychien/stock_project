var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
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
                res.render('overview/vote_overview', {
                    title: '活動總覽',
                    data: data,
                    email: req.session.email,
                    role: req.session.role
                });
            }
        })
        connection.release();
    })

});
router.post('/', function (req, res) {
    var vote_topic = req.body['topic'];
    res.redirect('/vote/'+vote_topic);
})
/*
router.post('/signup',function(req,res){
    req.params.signup_topic=req.body.topic_signup;
    res.render('signup/signup',{
        title: '報名',
        session: req.session.email,
        role: req.session.role,
        topic: req.params.signup_topic
    })
    console.log(req.params.signup_topic)
})
router.post('/vote', function (req, res) {
    req.params.vote_topic = req.body.topic_vote;
    res.render('vote/vote', {
        title: '報名',
        session: req.session.email,
        role: req.session.role,
        topic: req.params.vote_topic
    })
    console.log(req.params.vote_topic)
})*/
module.exports = router;