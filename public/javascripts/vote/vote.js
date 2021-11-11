
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
        web3.eth.getBalance(accounts[0], function (error, bal) {
            if (!error) {
                $('#addr').text(accounts[0]);
                $('#bal').text(bal / 10 ** 18);
            } else {
                console.log(error)
            }
        })
    })
    
    web3.eth.getAccounts(function(err,accounts){
        if(!err){
            var votingId = $('input[id=votingId]').val();
            var participantId = $('input[id=participantId]').val();
            contract.voteBalances(votingId, participantId, function (err, votes) {
                $('dd[id=votes]').text(votes);
            })
        }else{
            console.log(err)
        }
        
    })
    
})