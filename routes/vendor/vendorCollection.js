var express=require('express');
const { PassThrough } = require('form-data');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/991b420c343949d991d7de33d4d75717"));
var abi = require('../collectionABI');
var abi = abi.collectionABI;
var contracts=new Array();
router.get('/',function(req,res){
    if (!req.session.email) {
        res.redirect('/login');
    }
    var pool=req.connection;
    var vendor=req.session.walletaddress;
    var works=new Array();
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM collectionlist WHERE vendor=?',[vendor],function(err,rows){
            if(err){
                console.log(err)
            }
            for(var i=0;i<rows.length;i++){
                if(contracts.includes(rows[i].contract)==false){
                    contracts.push(rows[i].contract);
                }
            }
            for(var idx=0;idx<contracts.length;idx++){
                var contract = web3.eth.contract(abi).at(contracts[idx]);
                //var bal = contract.balanceOf.call(vendor).toNumber();
                var idlist = contract.tokenIdofOwnerByAddress.call(vendor);
                var ids = new Array();
                for(var j=0;j<idlist.length;j++){
                    ids.push(idlist[j].toNumber());
                }
                for(var id=0;id<ids.length;id++){
                    var uri=contract.tokenURI.call(ids[id]);
                    works.push([uri,contracts[idx],ids[id]]);
                }
            }
            res.render('vendor/vendorCollection', {
                title: '我的商品集',
                email: req.session.email,
                role: req.session.role,
                works: works
            })    
        });
        
        
        connection.release();
    })
    
    
})
module.exports=router;