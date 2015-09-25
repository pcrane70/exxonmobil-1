renderReportsList = function() {
    $("#servDate").text(localStorage.servDate);
    db.transaction(function(tx) {
        var query = "SELECT r.fdaID,r.vesselName,r.manType,r.manNo,r.joJn,r.startDate,r.endDate,at.actTypeDesc,a.comms,a.active,r.custProjID,projName,r.ChargeCode "
		+ "FROM reports r LEFT JOIN activities a USING(fdaID) LEFT JOIN actTypes at USING(actTypeID) LEFT JOIN projs ON r.custProjID = projID "
		+ "WHERE servDate = '"+localStorage.servDate+"' AND r.active=1 AND r.clientID IN ("+clientID+") AND length(r.joJn) > 0 "
		+ "ORDER BY r.manNo,r.joJn ASC";
        tx.executeSql(query, [],
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
                          //FastClick.attach(document.body);
                      },
                      function(ts, error){
                          alert("Error during reports rendering: " + error.message);
                      });
        tx.executeSql("SELECT count(*) as repCount FROM reports WHERE servDate = '"+localStorage.servDate+"' AND reports.active=1 AND reports.clientID IN ("+clientID+") AND length(reports.joJn) > 0", [],
                      function(tx, rs) {
                          row = rs.rows.item(0);
                          $("#reportsCount").text(row.repCount+ " PCC Reports");
                      });
        // conteggio per counter tab approval
        var approvalsCountQuery = "SELECT COUNT(*) AS n FROM reports WHERE endDate IS NULL "
          + "AND active = 1 AND clientID IN ("+clientID+") AND length(joJn) > 0 " + localStorage.approvalConditions;
        tx.executeSql(approvalsCountQuery, [],
          function(tx, rs) {
            $("#approvalsCount").text(rs.rows.item(0).n);
          },
          function(tx, error) {
            alert('Error in retrieving approvals counter', error.message);
          }
        );
    });
}

renderActivities = function(fdaID) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT actTypeDesc,comms FROM activities LEFT JOIN actTypes ON activities.actTypeID = actTypes.actTypeID WHERE fdaID = '"+fdaID+"' AND activities.active=1", [],
                      function(tx, rs) { 
                          $('#rt'+fdaID).empty();
                          for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              comms = "( "+safeDecode(row.comms)+" )";
                              if (comms == "(  )") comms = "";
                              if (row.actTypeDesc === null) $('#rt'+fdaID).append("No activity type "+comms+"<br/>");
                              else $('#rt'+fdaID).append(safeDecode(row.actTypeDesc)+" "+comms+"<br/>");
                          }
                      },
                      function(){
                          alert("Error during activities rendering");
                      });
    });
}

goToReportDetail = function (fdaID,event) {
    event.preventDefault();
    localStorage.fdaID = fdaID;
    changePage("report-general.html",["report-general.js"]);
}

decServDate = function() {
    var servDate = new Date(localStorage.servDate);
    servDate.setDate(servDate.getDate() - 1);
    var mm = servDate.getMonth()+1,
        dd = servDate.getDate();
    if (dd < 10) dd='0'+dd;
    if (mm < 10) mm='0'+mm;
    localStorage.servDate = servDate.getFullYear()+"-"+mm+"-"+dd;
    $("#servDate").text(localStorage.servDate);
    renderReportsList();
    //terminalWorker.postMessage({'cmd': 'renderReportsList', 'param': [localStorage.servDate]});
}

incServDate = function() {
    var servDate = new Date(localStorage.servDate);
    servDate.setDate(servDate.getDate() + 1);
    var mm = servDate.getMonth()+1,
        dd = servDate.getDate();
    if (dd < 10) dd='0'+dd;
    if (mm < 10) mm='0'+mm;
    localStorage.servDate = servDate.getFullYear()+"-"+mm+"-"+dd;
    $("#servDate").text(localStorage.servDate);
    renderReportsList();
    //terminalWorker.postMessage({'cmd': 'renderReportsList', 'param': [localStorage.servDate]});
}

userLogout = function(event) {
    event.preventDefault();
    localStorage.userID = null;
    localStorage.userLevel = null;
    window.location.replace("index.html");
    //changePage("login.html",["login.js"]);
}

deleteReports = function(event) {
    event.preventDefault();
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM REPORTS", []);
        tx.executeSql("DELETE FROM ACTIVITIES", []);
        tx.executeSql("DELETE FROM PICS", []);
    });
    $("#worker").empty();
}

showNames = function(names) {
    names = unescape(names);
    names = eval(names);
    // se ci sono i nomi stoppo la propagazione ed apro la modale
    if (names.length > 0)
    {
        event.stopPropagation();
        // svuoto la modal
        $("#projectNamesModal .modal-body").empty();
        // creo il contenuto
        html = names.join("</li><li>");
        html = "<ul><li>" + html + "</li></ul>";
        // aggiungo il contenuto
        $("#projectNamesModal .modal-body").html(html);
        // visualizzo
        $("#projectNamesModal").modal("show");
    }
}

function onBackKeyDown() {
    changePage("login.html", ["login.js"]);
}

$("#servDate").text(localStorage.servDate);
//$("#loading").append("Rendering report list<br/>");
renderReportsList();
userLevel();

localStorage.originList = 'LIST';

//# sourceURL=report-list.js
