var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nft-f1da896e4e-node-f6ee1078.baas.twcc.ai"));
var votingAddress = "0x395BC95612449BcdD740353BAd023c876552a425";
var abi = require('../votingABI');
var abi = abi.votingABI;
var contract = web3.eth.contract(abi).at(votingAddress);
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nft',
    chainId: 13144,
    networkId: 13144

}, 'petersburg')
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
router.post('/:votingId/:participantId',function(req,res){
    var buyAmount=req.body['amount'];
    var votingId = req.params.votingId;
    var participantId = req.params.participantId;
    var address = process.env.PLATFORM_ADDR;
    var buyer = req.session.walletaddress;
    var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
    var data = contract.buy.getData(votingId, participantId,2,buyAmount,buyer);
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
    var tx = new Tx(rawTx, { common: customCommon });
    tx.sign(privkey);
    var serializedTx = tx.serialize();
    var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    console.log(hash)
    res.render('works/buy_redirect',{
        hash:hash
    })
})
module.exports = router;