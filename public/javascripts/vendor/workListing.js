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
/*
function previewImages() {

    var preview = document.querySelector('#preview');

    if (this.files) {
        [].forEach.call(this.files, readAndPreview);
    }

    function readAndPreview(file) {

        // Make sure `file.name` matches our extensions criteria
        if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
            return alert(file.name + " is not an image");
        } // else...

        var reader = new FileReader();

        reader.addEventListener("load", function () {
            var image = new Image();
            image.height = 100;
            //image.title = file.name;
            image.src = this.result;
            preview.appendChild(image);
        });

        reader.readAsDataURL(file);

    }

}
document.querySelector('#file-input').addEventListener("change", previewImages);
const ipfs = window.IpfsHttpClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
var uriarr=new Array();
$("#file-input").on("change", function () {
    var reader = new FileReader();
    reader.onload = function (e) {

        const magic_array_buffer_converted_to_buffer = buffer.Buffer(reader.result); // honestly as a web developer I do not fully appreciate the difference between buffer and arrayBuffer 
        ipfs.add(magic_array_buffer_converted_to_buffer, (err, result) => {
            console.log(err, result);

            //let link = "<a href='https://gateway.ipfs.io/ipfs/" + result[0].hash>'</a>;
            let ipfsLink = "https://gateway.ipfs.io/ipfs/" + result[0].hash;
            //document.getElementById("link").innerHTML = link
            uriarr.push(ipfsLink)
            //$('#ipfsuri').val(ipfsLink);
        })
    }
    reader.readAsArrayBuffer(this.files[0]);
})
$('#ipfsuri').val(uriarr);
*/