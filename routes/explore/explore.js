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
//var stockAddress="0xebF8Ddd2bbC45E172461CF4117a97C0b7E3F41A5";
//var stockabi = require("../stockABI");
//var stockabi = stockabi.stockABI;
//var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
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
function paginatedResults(data) {
    return (req, res, next) => {
        const page = 1; //parseInt(req.query.page);
        const limit = 9; // amount of elements each page
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};
        if (endIndex < data.length) {
            results.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        results.results = data.find().limit(limit).skip(startIndex).exec();
        next();
    };
}
router.get("/", function (req, res) {
    if(!req.session.email){
        var bal=0;
    }else{
        var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
    }
    var pool = req.connection;
    var collections=new Array();
    pool.getConnection(function (err, connection) {
        connection.query("SELECT * FROM stockNFT",function (err, rows) {
            if (err) {
                console.log(err);
            }
            else{
                var nfts=rows;
                const numOfResults = nfts.length;
                const resultsPerPage = 9;
                const numOfPages = Math.ceil(numOfResults / resultsPerPage);
                let page = req.query.page ? parseInt(req.query.page) : 1;
                const startIndex = (page - 1) * resultsPerPage;
                const endIndex = page * resultsPerPage;

                if (endIndex > nfts.length - 1) {
                    worksPerPage = nfts.slice(startIndex);
                } else {
                    worksPerPage = nfts.slice(startIndex, endIndex);
                }
                let pagination = {
                    numOfPages: Array(numOfPages),
                    page: page,
                };

                if (endIndex < nfts.length) {
                    pagination.next = "?page=" + (page + 1).toString();
                }

                if (startIndex > 0) {
                    pagination.previous = "?page=" + (page - 1).toString();
                }
                res.render('explore/explore',{
                    email:req.session.email,
                    role:req.session.role,
                    nfts:nfts,
                    bal:bal,
                    pagination: pagination,
                });
            }
            connection.release();
        });
    });    
});
/*
router.post("/",function(req,res){
    var collectionname = req.body['flexRadioDefault'];
    if(!req.session.email){
        var bal=0;
    }else{
        var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
    }
    var pool = req.connection;
    var addresslist=new Array();
    var collections=new Array();
    //var user = req.session.walletaddress;
    pool.getConnection(function (err, connection) {
        connection.query("SELECT * FROM collectionlist WHERE name IN (?)",[collectionname],function (err, rows) {
            if (err) {
                console.log(err);
            }
            for (var i = 0; i < rows.length; i++) {
                var collectionName = rows[i].name;
                var onsellAmount = vendorcontract.onSellAmount.call(rows[i].contract);
                if (onsellAmount > 0) {
                    collections.push([collectionName, onsellAmount]);
                    addresslist.push(rows[i].contract);
                }
            }
            connection.query("SELECT * FROM goods_onsell WHERE contract IN (?)",[addresslist],function(err,rows2){
                if(err){
                    console.log(err)
                }
                var works=rows2;
                const numOfResults = works.length;
                const resultsPerPage = 9;
                const numOfPages = Math.ceil(numOfResults / resultsPerPage);
                let page = req.query.page ? parseInt(req.query.page) : 1;
                const startIndex = (page - 1) * resultsPerPage;
                const endIndex = page * resultsPerPage;

                if (endIndex > works.length - 1) {
                    worksPerPage = works.slice(startIndex);
                } else {
                    worksPerPage = works.slice(startIndex, endIndex);
                }
                let pagination = {
                    numOfPages: Array(numOfPages),
                    page: page,
                };

                if (endIndex < works.length) {
                    pagination.next = "?page=" + (page + 1).toString();
                }

                if (startIndex > 0) {
                    pagination.previous = "?page=" + (page - 1).toString();
                }
                res.render("explore/explore", {
                    email: req.session.email,
                    bal: bal,
                    role: req.session.role,
                    collections: collections,
                    works: works,
                    pagination: pagination,
                });
            })
            }
        );
        connection.release();
    });
    
})*/
module.exports = router;