$('img[id="preview"]').hide();
var uriarr =new Array();
function previewFile() {
    var preview = document.querySelector('img');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
        preview.src = reader.result;
    }, false);
    if (file) {
        reader.readAsDataURL(file);
        $('label').hide();
        $('img[id="preview"]').show();
    }
}
const ipfs = window.IpfsHttpClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
var uriarr = new Array();
$("#imageupload").on("change", function () {
    var reader = new FileReader();
    reader.onload = function (e) {

        const magic_array_buffer_converted_to_buffer = buffer.Buffer(reader.result); // honestly as a web developer I do not fully appreciate the difference between buffer and arrayBuffer 
        ipfs.add(magic_array_buffer_converted_to_buffer, (err, result) => {
            console.log(err, result);

            //let link = "<a href='https://gateway.ipfs.io/ipfs/" + result[0].hash>'</a>;
            let ipfsLink = "https://gateway.ipfs.io/ipfs/" + result[0].hash;
            //document.getElementById("link").innerHTML = link
            $('#ipfsuri').val(ipfsLink);
        })
    }
    reader.readAsArrayBuffer(this.files[0]);
})
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
    $('#upload').click(function (){
        web3.eth.getAccounts(function(err,accounts){
            if(!err){
                var vendor = accounts[0];
                var uri = $('#ipfsuri').val();
                console.log(uri)
                var name = $('#name').val();
                console.log(name)
                vendorcontract.getaddress(vendor, name, function (err, addr) {
                    if (!err) {
                        console.log(addr)
                        vendorcontract.singleMint(addr, vendor, uri, function (err, hash) {
                            if (!err) {
                                console.log(hash)
                                window.location = "/";
                            } else {
                                console.log(err)
                            }
                        })
                    } else {
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
