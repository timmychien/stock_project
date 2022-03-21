var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nft-f1da896e4e-node-f6ee1078.baas.twcc.ai"));
var vendorAddress = "0x749cc91223ECe3E2F533eA52760A9D3072da2165";
var abi = require('../vendorABI');
var abi = abi.vendorABI;
var contract = web3.eth.contract(abi).at(vendorAddress);
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nft',
    chainId: 13144,
    networkId: 13144

}, 'petersburg')
/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login')
    }
    res.render('resell/resell', {
        title: '販售',
        email: req.session.email,
        role: req.session.role,
        walletaddress: req.session.walletaddress
    });
});

module.exports = router;