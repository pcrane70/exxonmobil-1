setActivityData = function() {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM activities WHERE active=1 AND actID = '"+localStorage.actID+"'", [],
                      function(tx, rs) {
                          row = rs.rows.item(0);
                          if  (row.startDate) $("#startDate").val(row.startDate); 
                          else $("#startDate").val(null); 
                      },
                      function(){
                          alert("Error rendering activity informations")
                      });
    });
    
}

moveActivity = function(keyValue) {
    if (!keyValue) {
        alert("Can't move the activity, no job is selected");
        return;
    }
    
    var r=confirm("Are you sure You want to move this activity?");
    if (r==false) return;

    db.transaction(function(tx)
    {
        // ricavo le attività attive già associate al job di destinazione
        var query = "SELECT COUNT(*) AS n FROM activities WHERE fdaID = ? AND active = 1";
        tx.executeSql(query, [keyValue], function (tx, rs)
        {
            // se non ci sono attività collegate, aggiorno la servDate ed il preparedBy
            var row = rs.rows.item(0);
            if (row.n == 0)
            {
                var query = "UPDATE reports SET servDate = ?, servDateTS = ?, preparedBy = ?, preparedByTS = ?, TS = NULL WHERE fdaID = ?";
                tx.executeSql(query, [getDate(), getDateTime(), localStorage.userID, getDateTime(), keyValue], function(){});
            }
            // sposto l'attività
            var query = "UPDATE activities SET fdaID = ?, TS = NULL WHERE actID = ?";
            tx.executeSql(query, [keyValue, localStorage.actID], function(){});
            // aggiorno la startDate solo se startDate IS NULL
            if (localStorage.startDate)
            {
                var query = "UPDATE reports SET startDate = ?, startDateTS = ?, TS = NULL WHERE fdaID = ? AND startDate IS NULL";
                tx.executeSql(query, [localStorage.startDate, getDateTime(), keyValue], function(){});
            }
            // se il job corrente rimane vuoto, torna grigio (startDate ed endDate a NULL)
            query = "SELECT COUNT(*) AS n FROM activities WHERE fdaID = ? AND active = 1";
            tx.executeSql(query, [localStorage.fdaID], function(tx, rs){
                var row = rs.rows.item(0);
                if (row.n == 0)
                {
                    var query = "UPDATE reports SET startDate = NULL, startDateTS = ?, TS = NULL WHERE fdaID = ?";
                    tx.executeSql(query, [getDateTime(), localStorage.fdaID], function(){});
                }
            });
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
                              $("#picList").append('<a href="#" onclick="event.preventDefault();localStorage.picID=\''+row.picID+'\';changePage(\'show-picture.html\',[\'show-picture.js\',\'iscroll.js\']);"><img class="smallPic" src="data:image/jpeg;base64,'+row.picThumb+'"/></a>');
                          }
                          $("#picList").css("display","block");  
                          hideShutter();
                      },
                      function(){
                          hideShutter();
                          alert("Error rendering pics")
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
    //if (image.width > image.height) {
    canvas.width = newWidth;
    canvas.height = image.height * (newWidth/image.width);
    ctx.drawImage(image, 0, 0, newWidth, image.height * (newWidth/image.width));
    /*} else {
        	canvas.height = 100;
			canvas.width = image.height * (100/image.width);

			ctx.save(); 
			ctx.translate(canvas.width, canvas.height/2); 
			ctx.rotate(90*Math.PI/180); 
			ctx.drawImage(image, 0, 0, 100, image.height * (100/image.width));
			ctx.restore();    
        }*/
    resizedPic = canvas.toDataURL("image/jpeg");
    resizedPic = resizedPic.replace(/^data:image\/(png|jpg);base64,/, "");
    return resizedPic;
}

writeError = function(error) {
    alert("Error: " + error.code + " " + error.message);
}

writeSuccess =  function(value) {
    
}

addPic = function(picData){
    var actID = localStorage.actID,
        fdaID = localStorage.fdaID,
        fullSize, thumb,
        image = new Image();
    image.onload = function() {
        
        fullSize = resizePic(image,640);
        thumb = resizePic(image,100);
        //replaceAll("data:image/png;base64,","");
        var picID = getID(),
            rightNow = getDateTime();
        try {
            fileSystemHelper = new FileSystemHelper();
            fileSystemHelper.writeLine(picID+".jpg", fullSize, writeSuccess, writeError);
        } catch(e) {
            console.log(e);
        }
        
        db.transaction(function(tx) {
            tx.executeSql("INSERT INTO pics (picID, fdaID, actID, picThumb, pic, active, picThumbTS, picTS, activeTS, TS) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, NULL);",[picID,fdaID,actID,picID+".jpg",picID+".jpg",rightNow,rightNow,rightNow],
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

deleteActivity = function(actID) {
    var r=confirm("Are you sure You want to delete this activity?");
    if (r==false) return;
    if (!actID) actID = localStorage.actID;
    db.transaction(function(tx) {
        tx.executeSql("UPDATE activities SET active = ?, activeTS = ?, TS = NULL WHERE actID = ?",
                      [0, getDateTime(), actID],
                      function(){
                            tx.executeSql("UPDATE pics SET active = ?, activeTS = ?, TS = NULL WHERE actID = ?",
                                [0, getDateTime(), actID], function(){});
                      		},
                      function(){
                      	alert("Error deleting this activity")
                      });
        // se il job corrente rimane vuoto, torna grigio (startDate ed endDate a NULL)
        query = "SELECT COUNT(*) AS n FROM activities WHERE fdaID = ? AND active = 1";
        tx.executeSql(query, [localStorage.fdaID], function(tx, rs){
            var row = rs.rows.item(0);
            if (row.n == 0)
            {
                var query = "UPDATE reports SET startDate = NULL, startDateTS = ?, TS = NULL WHERE fdaID = ?";
                tx.executeSql(query, [getDateTime(), localStorage.fdaID], function(){}, function (tr, e) {
                    alert ("Error in query: " + query + "\n" + e.message);
                    return true; // torno true per effettuare il rollback
                });
            }
        });
    });
}

jnList = function() {
    db.transaction(function(tx) {
        tx.executeSql("select fdaID,joJn from reports where length(joJn) > 0 AND active = 1 order by joJn", [],
                      function(tx, rs) {
                          joJnL = rs2arr(rs);
                          $('#moveJob').selectize({
                              maxItems: 1,
                              valueField: 'fdaID',
                              labelField: 'joJn',
                              searchField: 'joJn',
                              options: joJnL,
                              create: false,
                              onInitialize: addSelectizeRmButton
                          });
                          $("#container-fluid").show();
                      },
                      function(){
                          alert("Error parsing jobs");
                      });
    });
};

jnList();
$("#joJnLabel").text(localStorage.joJn);

function onBackKeyDown() {
    changePage('report-activities.html',['report-activities.js']);
}

//setActivityData();
renderPics(localStorage.actID,localStorage.fdaID);
camera = new cameraApp();
camera.run();

//# sourceURL=activity-misc.js
