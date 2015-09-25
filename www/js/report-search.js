renderReportsList = function() {
    // per non ottenere troppi risultati e generare meno traffico
    if ($("#search").val().length < 3) {
        $("#panelList").empty();
    	return;
	}
    $("#servDate").text(localStorage.servDate);
db.transaction(function(tx) {
        var query = "SELECT r.fdaID,r.vesselName,r.manType,r.manNo,r.joJn,r.startDate,r.endDate,at.actTypeDesc,a.comms,a.active,r.custProjID,projName,r.ChargeCode "
    + "FROM reports r LEFT JOIN activities a USING(fdaID) LEFT JOIN actTypes at USING(actTypeID) LEFT JOIN projs ON r.custProjID = projID "
    + "WHERE (r.joJn LIKE '%"+$("#search").val()+"%' OR r.manNo LIKE '%"+$("#search").val()+"%') AND r.active=1 AND r.clientID IN ("+clientID+") AND length(r.joJn) > 0 "
    + "ORDER BY r.manNo,r.joJn ASC";
        tx.executeSql(query, [],
            //"SELECT reports.fdaID,reports.vesselName,reports.manNo,reports.joJn,reports.startDate,reports.endDate,actTypes.actTypeDesc,activities.comms,activities.active FROM reports LEFT JOIN activities ON activities.fdaID = reports.fdaID LEFT JOIN actTypes ON activities.actTypeID = actTypes.actTypeID WHERE (reports.joJn LIKE '%"+$("#search").val()+"%' OR reports.manNo LIKE '%"+$("#search").val()+"%') AND reports.active=1 AND reports.clientID IN ("+clientID+") AND length(reports.joJn) > 0 ORDER BY reports.manNo,reports.joJn,activities.TS ASC", [],
                      function(tx, rs) {
                          var chargecodeHTML = '';
                          if (chargecode) {
                            chargecodeHTML = '<span class="pull-right">CHARGE CODE: ##CHARGECODE##</span>';
                          }
                          var actJojn = "", repList = "",
                              footer = '<div class="panel-footer" onclick="showNames(\'##PROJECTNAMES##\');">'
                                  + '<b>PROJECT: ##PROJECTS## ' + chargecodeHTML + '</b></div>',
                              projIDs = [], projNames = [];
                          $("#panelList").empty();
                          for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              if (actJojn != row.joJn) {
                                  if (actJojn != "") {
                                    rep += '</span></div>'
                                        + footer
                                            .replace('##PROJECTS##', projIDs.join(', '))
                                            .replace('##PROJECTNAMES##', escape(JSON.stringify(projNames)))
                                            .replace('##CHARGECODE##', row.ChargeCode || '')
                                        + '</div></a>';
                                    projIDs = [];
                                    projNames = [];
                                  } else rep = "";
                                  // da quando e' stato spostato a livello di report sara' sempre e solo uno
                                  if (row.custProjID != null && projIDs.indexOf(row.custProjID) == -1) {
                                      projIDs.push(row.custProjID);
                                      // se non trovo la corrispondenza in projs stampo comunque l'ID
                                      if (row.projName == null)
                                          projNames.push(row.custProjID);
                                      else
                                          projNames.push(row.projName);
                                  }
                                  c = 1;
                                  actJojn = row.joJn;
                                  itemClass = 'panel-progress-report';
                                  manType = '';
                                  if (row.startDate == null && row.endDate == null) itemClass='panel-empty-report';
                                  if (row.startDate != null && row.endDate != null) itemClass='panel-closed-report';
                                  if (safeDecode(row.manType) == 'Import') manType = 'Inbound'; else manType = 'Outbound';
                                  rep += '<a href="javascript:void(0);" onclick="goToReportDetail(\''+row.fdaID+'\',event)"><div class="panel '+itemClass+'"><div class="panel-heading"><h3 class="panel-title">'+safeDecode(row.vesselName)+'<span class="pull-right">'+manType+'</span></h3></div><div class="panel-sub-heading"><h1 class="repList">'+row.manNo+'</h1><h1 class="repList">'+row.joJn+'</h1></div><div class="panel-body"><span class="report-activities">'; 
                              }
                              if (row.active == 1) {
                                  var comms = "( "+safeDecode(row.comms)+" )";
                                  if (comms == "(  )") comms = "";
                                  if (row.actTypeDesc === null) comms = '<span class="badge badge-grey">'+c+'</span>&nbsp;No activity type '+comms+"<br/>";
                                  else comms = '<span class="badge badge-grey">'+c+'</span>&nbsp;'+safeDecode(row.actTypeDesc)+" "+comms+"<br/>";
                                  rep += comms;
                                  c++;
                              }
                          }
                          // last panel footer
                          if (rs.rows.length) {
                              rep += '</span></div>'
                                  + footer
                                      .replace('##PROJECTS##', projIDs.join(', '))
                                      .replace('##PROJECTNAMES##', escape(JSON.stringify(projNames)))
                                      .replace('##CHARGECODE##', row.ChargeCode || '')
                                  + '</div></a>';
                              $("#panelList").append(rep);
                          }
                      },
                      function(){
                          alert("Error during reports rendering")
                      });
        tx.executeSql("SELECT count(*) as repCount FROM reports WHERE servDate = '"+localStorage.servDate+"' AND reports.active=1 AND reports.clientID IN ("+clientID+") AND length(reports.joJn) > 0", [],
                      function(tx, rs) {
                          row = rs.rows.item(0);
                          $("#reportsCount").text(row.repCount+ " PCC Reports");
                      });
    });
}    
//     db.transaction(function(tx) {
//         tx.executeSql("SELECT reports.fdaID,reports.vesselName,reports.manNo,reports.joJn,reports.startDate,reports.endDate,actTypes.actTypeDesc,activities.comms,activities.active FROM reports LEFT JOIN activities ON activities.fdaID = reports.fdaID LEFT JOIN actTypes ON activities.actTypeID = actTypes.actTypeID WHERE (reports.joJn LIKE '%"+$("#search").val()+"%' OR reports.manNo LIKE '%"+$("#search").val()+"%') AND reports.active=1 AND reports.clientID IN ("+clientID+") AND length(reports.joJn) > 0 ORDER BY reports.manNo,reports.joJn,activities.TS ASC", [],
//                       function(tx, rs) {
//                           var actJojn = "", repList = "";
//                           $("#panelList").empty();
//                           for (var i=0; i < rs.rows.length; i++){
//                               row = rs.rows.item(i);
//                               if (actJojn != row.joJn) {
//                                   if (actJojn != "") rep += '</span></div></div></a>'; else rep = "";
//                                   c = 1;
//                                   actJojn = row.joJn;
//                                   itemClass = 'panel-progress-report';
//                                   if (row.startDate == null && row.endDate == null) itemClass='panel-empty-report';
//                                   if (row.startDate != null && row.endDate != null) itemClass='panel-closed-report';
//                                   rep += '<a href="javascript:void(0);" onclick="goToReportDetail(\''+row.fdaID+'\',event)"><div class="panel '+itemClass+'"><div class="panel-heading"><h3 class="panel-title">'+safeDecode(row.vesselName)+'</h3></div><div class="panel-sub-heading"><h1 class="repList">'+row.manNo+'</h1><h1 class="repList">'+row.joJn+'</h1></div><div class="panel-body"><span class="report-activities">'; 
//                               }
//                               if (row.active == 1) {
//                                   var comms = "( "+safeDecode(row.comms)+" )";
//                                   if (comms == "(  )") comms = "";
//                                   if (row.actTypeDesc === null) comms = '<span class="badge badge-grey">'+c+'</span>&nbsp;No activity type '+comms+"<br/>";
//                                   else comms = '<span class="badge badge-grey">'+c+'</span>&nbsp;'+safeDecode(row.actTypeDesc)+" "+comms+"<br/>";
//                                   rep += comms;
//                                   c++;
//                               }
//                           }
//                           if (rs.rows.length) {
//                               rep += '</span></div></div></a>';
//                               $("#panelList").append(rep);
//                           }
//                           //FastClick.attach(document.body);
//                       },
//                       function(){
//                           alert("Error during reports rendering")
//                       });
//         tx.executeSql("SELECT count(*) as repCount FROM reports WHERE servDate = '"+localStorage.servDate+"' AND reports.active=1 AND reports.clientID IN ("+clientID+") AND length(reports.joJn) > 0", [],
//                       function(tx, rs) {
//                           row = rs.rows.item(0);
//                           $("#reportsCount").text(row.repCount+ " PCC Reports");
//                       });
//     });
// }

goToReportDetail = function (fdaID,event) {
    event.preventDefault();
    localStorage.fdaID = fdaID;
    changePage("report-general.html",["report-general.js"]);
}

userLogout = function(event) {
    event.preventDefault();
    localStorage.userID = null;
    localStorage.userLevel = null;
    window.location.replace("index.html");
    //changePage("login.html",["login.js"]);
}

function onBackKeyDown() {
    changePage("login.html", ["login.js"]);
}

function clearSearch() {
    $("#search").val("");
    renderReportsList();
    $("#search").focus();
}