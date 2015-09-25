deletePic = function(picID) {
    var r=confirm("Are you sure to delete this picture?");
	if (r==false) return;
    db.transaction(function(tx) {
            tx.executeSql("UPDATE pics set active=0, activeTS=?, TS=null WHERE picID=?;",
                          [getDateTime(), picID],
                          function(){
                                $("#myModal").modal('hide');
                                renderPics(localStorage.actID,localStorage.fdaID);
                          }, function(){
                      	alert("Error deleting this picture")
                      });
    });    
}

renderPics = function(actID,fdaID) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM pics WHERE actID = '"+actID+"' and active = 1;", [],
                      function(tx, rs) {
                          $("#picList").css("display","none").empty();
                          for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              /*$("#picList").append(
                                  	'<div class="col-xs-6 col-md-3">'
                                  	+'<a href="#" class="thumbnail" onclick="event.preventDefault();localStorage.picID=\''+row.picID+'\';changePage(\'show-picture.html\',[\'show-picture.js\',\'iscroll.js\']);">'
                                  	+'<img class="smallPic" src="data:image/jpeg;base64,'+row.picThumb+'"/></a>'
                              		+'</div>');*/
                              $("#picList").append(
                                  '<div class="pic col-lg-3 col-sm-4 col-6">'
                                  + '<a href="#"><img class="thumbnail image-responsive" '
                                  + 'picID="' + row.picID + '" src="data:image/jpeg;base64,' + row.picThumb + '" /></a>'
                                  + '</div>');
                          }
                          $("#picList").css("display","block");  
                          hideShutter();

                          // modal manager
                          $('.thumbnail').click(function(){
                              picID = $(this).attr("picID");
                              // getting the big image from the db
                              db.transaction(function(tx) {
                                  tx.executeSql("SELECT pic FROM pics WHERE picID=?", [picID],
                                      function(tx, rs){
                                          for (var i=0; i < rs.rows.length; i++){
                                              row = rs.rows.item(i);
                                              $('#pic').empty();
                                              $("#pic").append('<img class="bigPic" src="data:image/jpeg;base64,'+row.pic+'"/>');
                                              myScroll = new iScroll('wrapper', {
                                                  zoom : true,
                                                  zoomMax : 3,
                                                  lockDirection: false,
                                                  hScrollbar: false,
                                                  vScrollbar: false
                                              });
                                              $('#myModal #delete-pic').unbind();
                                              $('#myModal #delete-pic').click(function(){
                                                  deletePic(picID);
                                              });
                                              $('#myModal').modal('show');
                                          }
                                      },
                                      function(){
                                          alert("Error rendering pic");
                                      }
                                  );
                              });
                          });
                      },
                      function(){
                          hideShutter();
                          alert("Error rendering pics");
                      });
    });  
};

cameraApp = function(){};

cameraApp.prototype={
    _pictureSource: null,
    
    _destinationType: null,
    
    run: function(){
        var that=this;
        that._pictureSource = navigator.camera.PictureSourceType;
        that._destinationType = navigator.camera.DestinationType;
        document.getElementById('capturePhotoButton').addEventListener("click", function(){
            that._capturePhoto.apply(that,arguments);
        });
    },
    
    _capturePhoto: function() {
        var that = this;
        
        // Take picture using device camera and retrieve image as base64-encoded string.
        navigator.camera.getPicture(function(){
            that._onPhotoDataSuccess.apply(that,arguments);
        },function(){
            that._onFail.apply(that,arguments);
        },{
            quality: 50,
            destinationType: that._destinationType.DATA_URL,
            correctOrientation: true
        });
    },
    
    _onPhotoDataSuccess: function(imageData) {
        //var smallImage = document.getElementById('smallImage');
        //smallImage.style.display = 'block';
        
        // Show the captured photo.
        //smallImage.src = "data:image/jpeg;base64," + imageData;
        addPic(imageData);
    },
    
    _onFail: function(message) {
        alert(message);
    }
} 

resizePic = function(image,newWidth) {
    canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d"), resizedPic;
    if (image.width > image.height) {
        // landscape
        canvas.height = newWidth;
        canvas.width = image.width * (newWidth/image.height);
        ctx.drawImage(image, 0, 0, image.width * (newWidth/image.height), newWidth);
    } else {
        // portrait
        canvas.width = newWidth;
        canvas.height = image.height * (newWidth/image.width);
        ctx.drawImage(image, 0, 0, newWidth, image.height * (newWidth/image.width));
    }
    resizedPic = canvas.toDataURL("image/jpeg");
    resizedPic = resizedPic.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    return resizedPic;
}

addPic = function(picData){
    var actID = localStorage.actID,
        fdaID = localStorage.fdaID,
        fullSize, thumb,
        image = new Image();
    image.onload = function() {
        
        //fullSize = resizePic(image,640);
        fullSize = resizePic(image,320);
        thumb = resizePic(image,100);
        //replaceAll("data:image/png;base64,","");
        var picID = getID(),
            rightNow = getDateTime();
        
        db.transaction(function(tx) {
            tx.executeSql("INSERT INTO pics (picID, fdaID, actID, picThumb, pic, active, picThumbTS, picTS, activeTS, TS) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, NULL);",[picID,fdaID,actID,thumb,fullSize,rightNow,rightNow,rightNow],
                          function(){
                              //var dataRow = '{"picID":"'+picID+'","actID":"'+actID+'","picThumb":"'+resizedPic+'","pic":"'+picData+'","active":"1"}';
                              //insertNewCommitRow('pics',dataRow,'',false);
                              renderPics(actID,fdaID);
                          },
                          function(){alert("Error saving picture")});
        });
        //TODO insert also in recordsLog
    }
    image.src = 'data:image/jpeg;base64,'+picData;
}

$("#joJnLabel").text(localStorage.joJn);

renderPics(localStorage.actID,localStorage.fdaID);
camera = new cameraApp();
camera.run();
