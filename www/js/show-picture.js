deletePic = function(picID,actID,fdaID,event) {
    var r=confirm("Are you sure to delete this picture?");
	if (r==false) return;
    db.transaction(function(tx) {
            tx.executeSql("UPDATE pics set active=0, activeTS=?, TS=null WHERE picID=?;",
                          [getDateTime(), picID],
                          function(){
                              	//var dataRow = '{"picID":"'+picID+'","active":"0"}';
	                          	//insertNewCommitRow('pics',dataRow,'activity-detail.html?actID='+actID+'&fdaID='+fdaID+'&back=1',true);
                              	//window.location.replace('activity-detail.html?actID='+actID+'&fdaID='+fdaID+'&back=1');
                              	changePage('activity-pics.html',['activity-pics.js']);
                          }, function(){
                      	alert("Error deleting this picture")
                      });
    });    
}

renderPic = function(picID) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM pics WHERE picID = '"+picID+"' and active = 1;", [],
                     function(tx, rs) {
                          for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              $("#pic").append('<img class="bigPic" src="data:image/jpeg;base64,'+row.pic+'"/>');
                           }
                           hideShutter();
                      },
                      function(){
                           hideShutter();
                      		alert("Error rendering this picture")
                      });
    });  
}; 

renderPic(localStorage.picID);
var myScroll;
setTimeout(function() {
    myScroll = new iScroll('wrapper', {
        zoom : true,
        zoomMax : 3,
        lockDirection: false,
        hScrollbar: false, 
        vScrollbar: false
    });
}, 100);

$("#joJnLabel").text(localStorage.joJn);
