var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nft-f1da896e4e-node-f6ee1078.baas.twcc.ai"));
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x3321432994311cf7ee752971C8A8D67dF357fa43";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
var vendorAddress = "0xd0bbD01cd1e0580dA43031D99f0864c087040C2E";
var vendorabi = require('../vendorABI');
var vendorabi = vendorabi.vendorABI;
var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
var collectionabi = require('../collectionABI');
var collectionabi = collectionabi.collectionABI;
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nft',
    chainId: 13144,
    networkId: 13144

}, 'petersburg')
/* GET home page. */
router.get("/:contractaddress/:tokenid", function (req, res) {
    if (!req.session.email) {
        res.redirect("/login");
    }
    var bal = pointcontract.balanceOf(req.session.walletaddress).toNumber();
    var pool=req.connection;
    var contractaddress=req.params.contractaddress;
    var tokenid=req.params.tokenid;
    var contract=web3.eth.contract(collectionabi).at(contractaddress);
    //var creator=contract.author.call();
    var owner = contract.ownerOf.call(tokenid);
    //var isonsell = vendorcontract.isOnSell.call(contractaddress, id).toString();
    var uri = contract.tokenURI(tokenid);
    pool.getConnection(function(err,connection){
        var metadata=contract.Metadata.call(tokenId);
        var name=metadata[1];
        var description=metadata[2];
        var price=metadata[3].toNumber();
        connection.query('SELECT * FROM member_info WHERE address=?',[owner],function(err,rows){
            if(err){
                console.log(err)
            }else{
                var ownername=rows[0].Name;
                res.render("explore/explore_detail", {
                    title: "nft_detail",
                    bal: bal,
                    email: req.session.email,
                    name: name,
                    description:description,
                    price:price,
                    creator: creator,
                    uri: uri,
                    tokenid: tokenid,
                    contractaddress: contractaddress,
                    owner: ownername
                });
            }
        })
    })
    
});

router.post('/:contractaddress/:tokenid', function (req, res) {
    //var tokenaddress = req.params.contractaddress;
    //var tokenid = req.params.tokenid;
    var tokenaddress=req.body['address'];
    var tokenid=req.body['id'];
    console.log(tokenaddress)
    console.log(tokenid)
    var buyer = req.session.walletaddress;
    var address = req.session.walletaddress;
    var privkey = Buffer.from(req.session.pk, 'hex');
    var data = vendorcontract.buy.getData(buyer, 2, tokenaddress, tokenid);
    var count = web3.eth.getTransactionCount(address);
    var gasPrice = web3.eth.gasPrice.toNumber() * 2;
    var gasLimit = 3000000;
    var rawTx = {
        "from": address,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": vendorAddress,
        "value": 0x0,
        "data": data,
        "chainId": 13144
    }
    var tx = new Tx(rawTx, { common: customCommon });
    tx.sign(privkey);
    var serializedTx = tx.serialize();
    var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    console.log(hash)
    res.render('explore/buy_redirect');
})

module.exports = router;