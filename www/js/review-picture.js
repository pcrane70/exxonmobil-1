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

function onBackKeyDown() {
    changePage('report-review.html',['jquery-ui.min.js','jquery.signature.min.js','report-review.js']);
}

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