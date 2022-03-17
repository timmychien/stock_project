/*
$('#check').hide();
$('#notice').hide();
$('#addr').hide();
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
    $('#addCollection').click(function(){
        web3.eth.getAccounts(function(error,accounts){
            var name = $('#name').val();
            var symbol = $('#symbol').val();
            var vendor = accounts[0];
            vendorcontract.createNFT(name,symbol,vendor,function(error,hash){
                if(!error){
                    $('#addCollection').hide();
                    $('#check').show();
                }else{
                    console.log(error)
                }
            })
        })
        return false;
    })
    
})*/