window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
        } catch (error) {
            console.log(error);
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    web3.eth.getAccounts(function (error, accounts) {
        var walletdb = $('#walletdb').val();
        if (walletdb != undefined && accounts[0] != walletdb) {
            alert('您目前連接的錢包地址與本帳戶不符！')
        }
        if (accounts[0] == walletdb) {
            web3.eth.getBalance(accounts[0], function (error, bal) {
                if (!error) {
                    $('#addr').text(accounts[0]);
                    $('#bal').text(bal / 10 ** 18);
                    pointcontract.balanceOf(accounts[0], function (err, points) {
                        $('#point_bal').text(points)
                    })

                } else {
                    console.log(error)
                }
            })
        }
    })
    $('#buy').click(function(){
        web3.eth.getAccounts(function(err,accounts){
            if(!err){
                var buyer = accounts[0];
                var token = $('#contractaddress').val();
                var tokenid = $('#tokenid').val();
                console.log(token)
                console.log(tokenid)
                vendorcontract.buy(buyer,2,token,tokenid,function(err,hash){
                    if(!err){
                        console.log(hash)
                        window.location="/";
                    }else{
                        console.log(err)
                    }
                })
            }else{
                console.log(err)
            }
        })
        return false;
    })
})
