setReportData = function() {
    db.transaction(function(tx) {
        var query = "SELECT r.*, c.clientName, p.projName "
            + "FROM reports r LEFT JOIN clients c USING(clientID) "
            + "LEFT JOIN projs p ON (r.custProjID = p.projID)"
            + "WHERE r.fdaID = ?";
        tx.executeSql(query, [localStorage.fdaID],
                      function(tx, rs) {
                          row = rs.rows.item(0);
                          $("#preparedBy").val(row.preparedBy);
                          $("#checkedBy").val(row.checkedBy);
                          $("#baseSuperintendentsName").val(row.baseSuperintendentsName);
                          $("#clientsApprovalName").val(row.clientsApprovalName);
                          $("#clientsApprovalName2").val(row.clientsApprovalName2);
                          $("#entity").val(row.entity);
                          localStorage.endDate = row.endDate;
                          inputLevel(row.endDate);
                          localStorage.startDate = row.startDate;
                          $("#joJn").text(safeDecode(row.joJn));
                          localStorage.joJn = safeDecode(row.joJn);
                          $("#joJnLabel").text(safeDecode(row.joJn));
                          $("#manNo").text(safeDecode(row.manNo));
                          $("#bookNo").text(safeDecode(row.bookNo));
                          $("#callNo").text(safeDecode(row.callNo));
                          $("#vesselName").text(safeDecode(row.vesselName));
                          localStorage.vesselName = safeDecode(row.vesselName);
                          var projName = row.projName + " (" + row.custProjID + ")";
                          if (row.projName == null)
                              projName = row.custProjID;
                          $("#customerProject").text(safeDecode(projName));
                          $("#clientName").text(safeDecode(row.clientName));
                          $("#startDate").text(safeDecode(row.startDate));
                          $("#endDate").text(safeDecode(row.endDate));
                          $("#servDate").text(safeDecode(row.servDate));
                          localStorage.clientID = row.clientID;
                          if (row.endDate != null && row.endDate.length == 19) {
                              $("#signature-msg").html("<b>"+safeDecode(row.clientSign)+"</b><br/>"+safeDecode(row.clientsApprovalDT));
                          }
                          /*title = safeDecode(row.vesselName)+" - "+safeDecode(row.manNo);
                          localStorage.title = title;
                          if (title.length > 0) $("#title").text(localStorage.title);
                          $("#repTypeName").text(row.repTypeID); //TODO check if necessary to translate repTypeID to repTypeName*/
                          localStorage.repTypeID = row.repTypeID;
                          //report closed
                          if (row.endDate != null) {
                              $('#activitiesLink').css('display','none');
                              //$('#approvalsLink').css('display','none');
                              //$('#reviewLink').css('display','inline-block');
                          } else {
                              //$('#activitiesLink').css('display','inline-block');
                              //if (localStorage.userLevel == 2)
                              //    $('#approvalsLink').css('display','inline-block');
                              //$('#reviewLink').css('display','none');
                          }
                          setupSelectize();
                          
                          // managing reopenButton visibility (cannot use userLevel4 because its behaviour is opposite)
                          if (row.endDate != null && localStorage.userLevel == 4)
                              $("#reopenButton").show();
            
                          // memorizzo il customer project per inserirlo nelle activity
                          localStorage.custProjID = row.custProjID;
                      },
                      function(tx,error){
                          alert("Error: "+error.message);
                      }); 
    });
}

function onBackKeyDown() {
    changePage('report-list.html',['report-list.js']);
}

function setupSelectize() {
    $('#preparedBy').selectize({
        maxItems: 1,
        valueField: 'userID',
        labelField: 'userName',
        searchField: 'userName',
        options: preparedByL,
        create: false,
        onChange : function(userID){ 
            if (userID.length == 0) userID = null;
            updateData(true,'fdaID',localStorage.fdaID,'reports','preparedBy',userID);
        }
    });
    
    $('#checkedBy').selectize({
        maxItems: 1,
        valueField: 'userID',
        labelField: 'userName',
        searchField: 'userName',
        options: checkedByL,
        create: false,
        onChange : function(userID){ 
            if (userID.length == 0) userID = null;
            updateData(true,'fdaID',localStorage.fdaID,'reports','checkedBy',userID);
        }
    });
    
    $('#baseSuperintendentsName').selectize({
        maxItems: 1,
        valueField: 'userID',
        labelField: 'userName',
        searchField: 'userName',
        options: baseSupL,
        create: false,
        onChange : function(userID){ 
            if (userID.length == 0) userID = null;
            updateData(true,'fdaID',localStorage.fdaID,'reports','baseSuperintendentsName',userID);
        }
    });
    
    $('#clientsApprovalName').selectize({
        maxItems: 1,
        valueField: 'userID',
        labelField: 'userName',
        searchField: 'userName',
        options: clientApprL,
        create: false,
        onChange : function(userID){ 
            if (userID.length == 0) userID = null;
            updateData(true,'fdaID',localStorage.fdaID,'reports','clientsApprovalName',userID);
        }
    });
    
    $('#clientsApprovalName2').selectize({
        maxItems: 1,
        valueField: 'userID',
        labelField: 'userName',
        searchField: 'userName',
        options: clientApprL,
        create: false,
        onChange : function(userID){ 
            if (userID.length == 0) userID = null;
            updateData(true,'fdaID',localStorage.fdaID,'reports','clientsApprovalName2',userID);
        }
    });
    
    $('#entity').selectize({
        maxItems: 1,
        valueField: 'entityID',
        labelField: 'entityName',
        searchField: 'entityName',
        options: entitiesL,
        create: false,
        onChange : function(entityID){ 
            if (entityID.length == 0) entityID = null;
            updateData(true,'fdaID',localStorage.fdaID,'reports','entity',entityID);
        }
    });
    
    // disable all the selectizes for readonly user role
    if (localStorage.userLevel == 0) {
        var s = $(".selectized");
        for (i = 0; i < s.length; i ++)
            s[i].selectize.lock();
    }

    // aggiungo i bottoni per la cancellazione delle selectize
    addSelectizeRmButton();
}

function reopenJob() {
    var r=confirm("Are you sure You want to reopen this report?");
    if (r==false) return;
	updateData(true,'fdaID',localStorage.fdaID,'reports','endDate',null);
    changePage('report-general.html',['report-general.js']);
}

function resetOptions(span) {
    // ricevo lo span e cerco la checkbox nascosta che utilizzo per memorizzare il dato
    var $span = $(span);
    var $check = $span.find(":checkbox");
    // uncheck su tutte le checkbox tranne quella cliccata
    $("[name=" + $check.attr("name") + "]:checkbox").not($check).attr("checked", false);
    // uncheck su tutti gli span tranne quello cliccato
    $("span.glyphicon-check").not($span).removeClass("glyphicon-check").addClass("glyphicon-unchecked");
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

// aggiorno i dati delle attività se presenti SBS correlati,
// poi carico i dati del report
updateActivitiesFromSBS(localStorage.fdaID, function() {
    setReportData();
    userLevel(localStorage.endDate);
});

if (typeof showclientsapprovalname2 != "undefined" && showclientsapprovalname2 == true)
    $("#clientsApprovalName2-row").show();
if (typeof showentity != "undefined" && showentity == true)
    $("#entity-row").show();

// gestisco l'evento di apertura della modal
$("#reopenModal #reopenModalButton").unbind();
$("#reopenModal #reopenModalButton").click(function(){
    // ricavo i dati inseriti
    var idReason = $("[name=idReason][checked]").length ? $("[name=idReason][checked]").val() : 0;
    var note = $("[name=note]").val();
    var now = getDateTime();
    // mandatorieta'
    if (idReason == 0 && note.length == 0) {
        alert("Please, provide at least one information.");
        return;
    }
    // aggiorno i dati a database
    db.transaction(function(tx) {
        var query = "INSERT OR REPLACE INTO reports_reopen (fdaID, idReason, note, idReasonTS, noteTS, TS) VALUES (?, ?, ?, ?, ?, ?)";
        tx.executeSql(query, [localStorage.fdaID, idReason, note, now, now, null],
            function(tx,rs){},
            function(){}
        );
    });
    
    $("#reopenModal").modal("hide");
    reopenJob();
});

//# sourceURL=report-general.js
