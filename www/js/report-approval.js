renderReportsList = function() {
    $("#servDate").text(localStorage.servDate);
    db.transaction(function(tx) {
        var query = "SELECT r.fdaID,r.vesselName,r.manType,r.manNo,r.joJn,r.startDate,r.endDate,at.actTypeDesc,a.comms,a.active,r.custProjID,projName "
      		+ "FROM reports r LEFT JOIN activities a USING(fdaID) LEFT JOIN actTypes at USING(actTypeID) LEFT JOIN projs ON r.custProjID = projID "
      		+ "WHERE endDate IS NULL AND r.active=1 AND r.clientID IN ("+clientID+") AND length(r.joJn) > 0 "
      		+ localStorage.approvalConditions + " ORDER BY r.manNo, r.joJn ASC";
        tx.executeSql(query, [],
                      function(tx, rs) {
                          var actJojn = "", repList = "",
                              footer = '<div class="panel-footer" onclick="showNames(\'##PROJECTNAMES##\');">'
                                  + '<b>PROJECT: ##PROJECTS##</b></div>',
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
                                  + '</div></a>';
                              $("#panelList").append(rep);
                          }
                          //FastClick.attach(document.body);
                      },
                      function(ts, error){
                          alert("Error during reports rendering: " + error.message);
                      });
        // conteggio per counter tab approval
        var approvalsCountQuery = "SELECT COUNT(*) AS n FROM reports WHERE endDate IS NULL "
          + "AND active = 1 AND clientID IN ("+clientID+") AND length(joJn) > 0 " + localStorage.approvalConditions;
        tx.executeSql(approvalsCountQuery, [],
          function(tx, rs) {
            $("#reportsCount").text(rs.rows.item(0).n);
          },
          function(tx, error) {
            alert('Error in retrieving approvals counter', error.message);
          }
        );
    });
}

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

renderReportsList();

localStorage.originList = 'APPROVAL';

//# sourceURL=report-list.js
