const { baToJSON } = require('ethereumjs-util');
var express = require('express');
var router = express.Router();
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login');
    }
    if (req.session.isverified == 0) {
        console.log('need verify')
        res.redirect('/emailverify');
    }else{
        var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
        res.render('personal/myinfo', {
            title: '我的個人資料',
            email: req.session.email,
            name: req.session.name,
            walletaddress: req.session.walletaddress,
            address: req.session.home_address,
            cellphone: req.session.cellphone,
            privkey: req.session.pk,
            role: req.session.role,
            bal:bal
        });
    }
    

});

module.exports = router;