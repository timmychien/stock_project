/*
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
            contract.getTotalParticipant(votingId,function(err,totalcounts){
                if(!err){
                    for (var i = 1; i <= totalcounts; i++) {
                        contract.getParticipant(votingId, i,function(err,info){
                            if(!err){
                                document.getElementById("votingId").value = votingId;
                                document.getElementById("participantId").value = i;
                                document.getElementById("author").value = info[4];
                                document.getElementById("name").value = info[0];
                                document.getElementById("symbol").value = info[1];
                                document.getElementById("votes").value = info[5].toNumber();
                            }
                            else{
                                console.log(err)
                            }
                        });
                        
                    }
                }
                else {console.log(err)}
            });
            }else{
            console.log(err)
        }
        
    })
    
})*/
$('#buyform').hide();

$('#buybutton').click(function () {
    $('#buyform').show();
    $('#buybutton').hide();
})