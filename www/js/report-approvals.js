setReportData = function() {
    var result;
    $("#loading").append("Rendering report");
    db.transaction(function(tx) {
        tx.executeSql("SELECT reports.*,clients.clientName FROM reports LEFT JOIN clients ON reports.clientID = clients.clientID WHERE reports.fdaID='"+localStorage.fdaID+"'", [],
                      function(tx, rs) {
                          row = rs.rows.item(0);
                          localStorage.clientID = row.clientID;
                          localStorage.repTypeID = row.repTypeID;
                          
                          result = $.grep(usersL, function(e){ return e.userID == row.preparedBy; });
                          if (result.length) $("#preparedBy").attr('placeholder',result[0].userName);
                          
                          result = $.grep(usersL, function(e){ return e.userID == row.checkedBy; });
                          if (result.length) $("#checkedBy").attr('placeholder',result[0].userName);
                          
                          result = $.grep(usersL, function(e){ return e.userID == row.baseSuperintendentsName; });
                          if (result.length) $("#baseSuperintendentsName").attr('placeholder',result[0].userName);
                          
                          result = $.grep(usersL, function(e){ return e.userID == row.clientsApprovalName; });
                          if (result.length) $("#clientsApprovalName").attr('placeholder',result[0].userName);
                          //$("#preparedByDD option").clone().appendTo("#preparedBy");
                          //$("#preparedBy").append(ddLists["preparedByDD"]);
                          //$("#preparedBy").val(row.preparedBy).attr("selected","selected");
                          
                          //$("#checkedByDD option").clone().appendTo("#checkedBy");
                          //$("#checkedBy").append(ddLists["checkedByDD"]);
                          //$("#checkedBy").val(row.checkedBy).attr("selected","selected");
                          
                          //$("#baseSupDD option").clone().appendTo("#baseSuperintendentsName");
                          //$("#baseSuperintendentsName").append(ddLists["baseSupDD"]);
                          //$("#baseSuperintendentsName").val(row.baseSuperintendentsName).attr("selected","selected");
                          
                          //$("#clientApprDD option").clone().appendTo("#clientsApprovalName");
                          //$("#clientsApprovalName").append(ddLists["clientApprDD"]);
                          //$("#clientsApprovalName").val(row.clientsApprovalName).attr("selected","selected");
                          
                          /*if (row.endDate != null) {
                              $("#CMRStatus").val("Review");
                              $("#status").text("CMR Closed");
                              $(".typeahead").attr("disabled","disabled");
                          }*/
                          
                          hideShutter();
                      },
                      function(){
                          	hideShutter();
                      		alert("Error rendering report informations")
                      });          
    });
    
}  

endReport = function(){
    updateData(true,'fdaID',localStorage.fdaID,'reports','endDate',getDateTime());
    changePage('report-general.html',['report-general.js']);
}

function onBackKeyDown() {
    changePage('report-list.html',['report-list.js']);
}

// check user role
userLevel2();
inputLevel();

setReportData();

// prepared by autocomplete ------------------------------------------------------
$("#loading").append("Rendering prepared by<br/>");
preparedByB = new Bloodhound({
	limit: 10,
    datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.userName); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: preparedByL
});

preparedByB.initialize();
	
$('.typeahead.preparedBy').typeahead(null,{
        displayKey: 'userName',
        source: preparedByB.ttAdapter(),
        items:10
}).on('typeahead:selected', function (obj, datum) {
    updateData(true,'fdaID',localStorage.fdaID,'reports','preparedBy',datum.userID);
});

// checked by autocomplete ------------------------------------------------------
$("#loading").append("Rendering checked by<br/>");
checkedByB = new Bloodhound({
	limit: 10,
    datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.userName); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: checkedByL
});

checkedByB.initialize();
	
$('.typeahead.checkedBy').typeahead(null,{
        displayKey: 'userName',
        source: checkedByB.ttAdapter(),
        items:10
}).on('typeahead:selected', function (obj, datum) {
    updateData(true,'fdaID',localStorage.fdaID,'reports','checkedBy',datum.userID);
});

// base superintendent autocomplete ------------------------------------------------------
$("#loading").append("Rendering Base Superintendent<br/>");
baseSupB = new Bloodhound({
	limit: 10,
    datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.userName); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: baseSupL
});

baseSupB.initialize();
	
$('.typeahead.baseSuperintendentsName').typeahead(null,{
        displayKey: 'userName',
        source: baseSupB.ttAdapter(),
        items:10
}).on('typeahead:selected', function (obj, datum) {
    updateData(true,'fdaID',localStorage.fdaID,'reports','baseSuperintendentsName',datum.userID);
});

// client approval autocomplete ------------------------------------------------------
$("#loading").append("Rendering Client Approval Name<br/>");
clientApprB = new Bloodhound({
	limit: 10,
    datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.userName); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: clientApprL
});

clientApprB.initialize();
	
$('.typeahead.clientsApprovalName').typeahead(null,{
        displayKey: 'userName',
        source: clientApprB.ttAdapter(),
        items:10
}).on('typeahead:selected', function (obj, datum) {
    updateData(true,'fdaID',localStorage.fdaID,'reports','clientsApprovalName',datum.userID);
});

if (localStorage.title.length > 0) $("#title").text(localStorage.title);
hideShutter();