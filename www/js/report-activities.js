setReportData = function() {
    //$("#loading").append("Rendering report");
    db.transaction(function(tx) {
        tx.executeSql("SELECT reports.*,clients.clientName FROM reports LEFT JOIN clients ON reports.clientID = clients.clientID WHERE reports.fdaID='"+localStorage.fdaID+"'", [],
                      function(tx, rs) {
                          row = rs.rows.item(0);
                          localStorage.clientID = row.clientID;
                          localStorage.repTypeID = row.repTypeID;
 
                      },
                      function(){
                      	alert("Error during report rendering")
                      });
    });
    
}  
 
renderpanelList = function() {
    var comms = "";
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM activities LEFT JOIN actTypes ON activities.actTypeID = actTypes.actTypeID WHERE fdaID = '"+localStorage.fdaID+"' AND activities.active=1", [],
                      function(tx, rs) {
                          var acts = "",
                              c = 1;
                          for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              if (row.comms) comms = row.comms;
                              var actTypeDesc = row.actTypeDesc;
                              if (!actTypeDesc) actTypeDesc = "No activity type";
                              dimentions = '<div class="dimentions">Qty '+row.qty+'&nbsp;&nbsp;&nbsp;W '+row.width+'&nbsp;&nbsp;&nbsp;H '+row.height+'&nbsp;&nbsp;&nbsp;L '+row.length+' , '+row.mt+' TONS </div>';
                              dimentions = dimentions.replaceAll('null','-');
                              var toSBS = '';
                              if (row.toSBS == 1) {
                                toSBS = '<span class="pull-left"><i>activity sent to SBS</i></span>';
                              }
                              acts += '<a onclick="event.preventDefault();localStorage.actID=\''+row.actID+'\';changePage(\'activity-measure.html\',[\'activity-measure.js\']);"><div class="panel panel-intels-activity"><div class="panel-heading"><h3 class="panel-title">';
                              acts += '<span style="float:right;font-size:35px;" class="glyphicon glyphicon-unchecked" onclick="event.stopPropagation();updateCheckbox(this);">';
                              acts += '<input type="checkbox" name="act[]" value="'+row.actID+'" style="display:none;" /></span>';
                              //acts += '<button type="button" class="btn btn-primary" data-toggle="button" onclick="event.stopPropagation()">Single toggle</button>';
                              acts += '<span class="badge ">'+c+'</span>&nbsp;&nbsp;'+actTypeDesc+'</h3></div><div class="panel-sub-heading text-right">'+toSBS+dimentions+'</div><div class="panel-body">'+comms+'</div></div></a>';
                          	  comms = "";
                              c++;
                          }
                          $("#panelList").append(safeDecode(acts));
                          $("#container-fluid").show();
                          //FastClick.attach(document.getElementById("footer"));
                      },
                      function(){
                   		  alert("Error during activities rendering")
                      });
    });
}

// funzione che permette la selezione del job number tramite modal popup
moveMultipleActivityGetJobNumber = function() {
    // ricavo le attività
    var ids = $("input:checkbox[name='act[]']:checked");
    // verifico che sia stata selezionata almeno un'attività
    if (ids.length == 0) {
        alert ("Select at least one activity to move.");
        return;
    }
    // visualizzo la modal
    $("#moveModal").modal("show");
}

// funzione per lo spostamento delle attività
moveMultipleActivity = function() {

    // ricavo le attività
    var $checks = $("input:checkbox[name='act[]']:checked");
    var ids = [];
    for (i = 0; i < $checks.length; i ++)
        ids.push($checks.eq(i).val());
    // verifico che sia stata selezionata almeno un'attività
    if (ids.length == 0) {
        alert ("Select at least one activity to move.");
        return;
    }
    // verifico che sia stato selezionato il job di destinazione
    var keyValue = $("#moveJob").val();
    if (keyValue.trim().length == 0) {
        alert("No job selected.");
        return;
    }
    // conferma di sicurezza
    var r = confirm("Are you sure You want to move selected activities?");
    if (r == false) return;
    
    // sposto le attività selezionate
    db.transaction(function(tx)
    {
        // ricavo le attività già associate al job di destinazione
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
            // sposto le attività
            var query = "UPDATE activities SET fdaID = ?, TS = NULL WHERE actID IN ('"+ids.join("','")+"')";
            tx.executeSql(query, [keyValue], function(){});
            // aggiorno la startDate solo se startDate IS NULL
            if (localStorage.startDate)
            {
                var query = "UPDATE reports set startDate = ?, startDateTS = ?, TS = NULL WHERE fdaID = ? AND startDate IS NULL";
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
    
    // ad inserimento avvenuto, chiudo la modal
    $("#moveModal").modal("hide");

    // ricarico la lista delle attività
    $("#panelList").empty();
    renderpanelList();
    //changePage('report-activities.html',['report-activities.js']);
}

sendToSBS = function () {
  // ricavo le attività
  var $checks = $("input:checkbox[name='act[]']:checked");
  var ids = [];
  for (i = 0; i < $checks.length; i ++)
      ids.push($checks.eq(i).val());
  // verifico che sia stata selezionata almeno un'attività
  if (ids.length == 0) {
      alert ("Select at least one activity to send.");
      return;
  }
  var msg = "Signing the selected activities will be locked and sent to SBS.\n"
    + "Are you sure you want to continue?";
  if (confirm (msg)) {
    db.transaction(function(tx) {
      var query = "UPDATE activities SET toSBS = 1, toSBSTS = ?, TS = null "
        + "WHERE actID IN ('"+ids.join("','")+"') AND toSBS = 0";
      tx.executeSql(query, [getDateTime()],
        function (tx, res) {
          console.log('sending activities to SBS success', res);
          // ad update avvenuto chiudo la modale
          $("#moveModal").modal("hide");
          // ricarico la lista delle attività
          $("#panelList").empty();
          renderpanelList();
        },
        function (tx, e) {
          alert('Error sending activities to SBS: ', e.message);
        }
      );
    });
  }
}

// funzione per la popolazione della modal necessaria per la selezione del job number
jnList = function() {
    db.transaction(function(tx) {
        tx.executeSql("SELECT fdaID, joJn FROM reports WHERE length(joJn) > 0 AND active = 1 AND endDate ISNULL ORDER BY joJn", [],
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
                      },
                      function(){
                          alert("Error parsing jobs");
                      });
    });
};

function onBackKeyDown() {
    changePage('report-list.html',['report-list.js']);
}

function goBack() {
  switch (localStorage.originList) {
    case 'LIST':
      changePage('report-list.html',['report-list.js']);
    break;
    case 'APPROVAL':
      changePage('report-approval.html',['report-approval.js']);
    break;
  }
}

$("#joJnLabel").text(localStorage.joJn);
setReportData();
renderpanelList();
jnList();

//# sourceURL=report-activities.js
