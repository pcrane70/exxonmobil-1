getSignature = function() {
    var sigImg = signature.getSignatureImage();
    sigImg = sigImg.replace(/^data:image\/(png|jpg);base64,/, "");
    updateData(true,'fdaID',localStorage.fdaID,'reports','clientSign',sigImg);
    changePage('report-review.html',['jquery.signaturepad.min.js','json2.min.js','jquery-ui.min.js','report-review.js',]);
}

var signature = $('.sigPad').signaturePad({drawOnly:true,bgColour : 'transparent'});
hideShutter();

