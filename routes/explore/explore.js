var express = require("express");
var router = express.Router();
var Tx = require("ethereumjs-tx").Transaction;
var Web3 = require("web3");
const web3 = new Web3();
var Common = require("ethereumjs-common").default;
web3.setProvider(
    new web3.providers.HttpProvider(
        "https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"
    )
);
var vendorAddress = "0xAc79aC8B2EF6d54dc241038b993f0eDC45434e93";
var vendorabi = require("../vendorABI");
var vendorabi = vendorabi.vendorABI;
var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
var collectionabi = require("../collectionABI");
var collectionabi = collectionabi.collectionABI;
var pointabi = require("../pointABI");
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
const customCommon = Common.forCustomChain(
    "mainnet",
    {
        name: "nftproject",
        chainId: 13330,
        networkId: 13330,
    },
    "petersburg"
);
router.get("/", function (req, res) {
    if (!req.session.email) {
        res.redirect("/login");
    } else {
        var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
        var pool = req.connection;
        var works = new Array();
        var collections=new Array();
        //var collections=new Array();
        //var user = req.session.walletaddress;
        pool.getConnection(function (err, connection) {
            connection.query(
                "SELECT * FROM collectionlist ",
                function (err, rows) {
                    if (err) {
                        console.log(err);
                    }
                    for (var i = 0; i < rows.length; i++) {
                        var contract = web3.eth.contract(collectionabi).at(rows[i].contract);
                        var collectionName=rows[i].name;
                        //console.log(collectionName)
                        var onsellAmount=vendorcontract.onSellAmount.call(rows[i].contract);
                        var total = contract.totalSupply.call().toNumber();
                        //var author=contract.author.call();
                        for (var id = 1; id <= total; id++) {
                            //var owner = contract.ownerOf.call(id);
                            var isonsell = vendorcontract.isOnSell.call(rows[i].contract, id).toString();
                            if (isonsell == "true") {
                                var uri = contract.tokenURI(id);
                                var metadata = contract.MetaData.call(id);
                                var name = metadata[1];
                                var description = metadata[2];
                                var price = metadata[3];
                                works.push([uri,name,rows[i].vendorname,rows[i].contract,description,price,id]);
                            }
                        }
                        if (onsellAmount>0){
                            collections.push([collectionName, onsellAmount]);
                        }
                        
                    }
                    res.render("explore/explore", {
                        email: req.session.email,
                        bal: bal,
                        role: req.session.role,
                        collections: collections,
                        works: works,
                    });
                }
            );
            connection.release();
        });
    }
});
router.post("/",function(req,res){
    var collectionname = req.body['flexRadioDefault'];
    var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
    var pool = req.connection;
    var works = new Array();
    var collections = new Array();
    //var collections=new Array();
    //var user = req.session.walletaddress;
    pool.getConnection(function (err, connection) {
        connection.query(
            "SELECT * FROM collectionlist WHERE name IN (?)",([collectionname]),
            function (err, rows) {
                if (err) {
                    console.log(err);
                }
                for (var i = 0; i < rows.length; i++) {
                    var contract = web3.eth.contract(collectionabi).at(rows[i].contract);
                    var collectionName = rows[i].name;
                    //console.log(collectionName)
                    var onsellAmount = vendorcontract.onSellAmount.call(rows[i].contract);
                    var total = contract.totalSupply.call().toNumber();
                    //var author=contract.author.call();
                    for (var id = 1; id <= total; id++) {
                        //var owner = contract.ownerOf.call(id);
                        var isonsell = vendorcontract.isOnSell.call(rows[i].contract, id).toString();
                        if (isonsell == "true") {
                            var uri = contract.tokenURI(id);
                            var metadata = contract.MetaData.call(id);
                            var name = metadata[1];
                            var description = metadata[2];
                            var price = metadata[3];
                            works.push([uri, name, rows[i].vendorname, rows[i].contract, description, price, id]);
                        }
                    }
                    if (onsellAmount > 0) {
                        collections.push([collectionName, onsellAmount]);
                    }

                }
                res.render("explore/explore", {
                    email: req.session.email,
                    bal: bal,
                    role: req.session.role,
                    collections: collections,
                    works: works,
                });
            }
        );
        connection.release();
    });
    
})
module.exports = router;