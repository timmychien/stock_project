$('#amount').on("change", function () {
    var amount=$('#amount').val();
    for(var i=0;i<amount;i++){
        let attr = '<input type="file" id="imageupload" name="image" style="display: none;" onchange=previewFile()><br>';
        $('#inputer').val(attr);
    }
})