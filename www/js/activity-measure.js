setActivityData = function() {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM activities WHERE active=1 AND actID = '"+localStorage.actID+"'", [],
                      function(tx, rs) {
                          row = rs.rows.item(0);
                          $('#actTypeID').val(row.actTypeID);
                          $('#cccID').val(row.cccID);
                          $('#cargoStatusID').val(row.cargoStatusID);
                          $('#containerID').val(row.containerID);
                          $('#LoadedEmpty').val(row.LoadedEmpty);
                          setupSelectize();
                          //$("#details").val(safeDecode(row.details));
                          $("#qty").val(safeDecode(row.qty));
                          $("#height").val(safeDecode(row.height));
                          $("#width").val(safeDecode(row.width));
                          $("#length").val(safeDecode(row.length));
                          $("#mt").val(safeDecode(row.mt));
                          $("#cbm").text(safeDecode(row.cbm));
                          $("#comms").val(safeDecode(row.comms));
                          if (row.containerID != null) {
                              $("#LoadedEmptyLabel").addClass("mandatory");
                              $("#height").prop('disabled', true);
                              $("#width").prop('disabled', true);
                              $("#length").prop('disabled', true);
                          } else {
                              fullEmptySel.disable();
                              fullEmptySel.clearOptions();
                          }
                          calcCubic();

                          // se è una copia da SBS o se è stata inviata all'SBS
                          // blocco la modifica della maggior parte dei campi
                          if (row.actID_SBS || row.toSBS) {
                            $("#cccID")[0].selectize.disable();
                            $("#cargoStatusID")[0].selectize.disable();
                            $("#containerID")[0].selectize.disable();
                            $("#LoadedEmpty")[0].selectize.disable();
                            $("#height").prop('disabled', true);
                            $("#width").prop('disabled', true);
                            $("#length").prop('disabled', true);
                            $("#mt").prop('disabled', true);
                          }

                          // aggiungo i bottoni per la cancellazione delle selectize
                          addSelectizeRmButton();
                          
                          $("#container-fluid").show();
                          
                          //FastClick.attach(document.getElementById("footer"));
                      },
                      function(){
                          alert("Error rendering activity informations")
                      });
    });
    
} 

var fullEmpty = [{"key":"Empty","val":"Empty Container"},{"key":"Full","val":"Full Container"}],
    $fullEmptySel,fullEmptySel;

function setupSelectize() {
    $('#actTypeID').selectize({
        maxItems: 1,
        valueField: 'actTypeID',
        labelField: 'actTypeDesc',
        searchField: 'actTypeDesc',
        options: actTypeL,
        create: false,
        onChange : function(actTypeID){ 
            if (actTypeID.length == 0) actTypeID = null;
            updateData(true,'actID',localStorage.actID,'activities','actTypeID',actTypeID);
        }
    });
    $('#cccID').selectize({
        maxItems: 1,
        valueField: 'cccID',
        labelField: 'cccDesc',
        searchField: 'cccDesc',
        options: cccL,
        create: false,
        onChange : function(cccID){ 
            if (cccID.length == 0) cccID = null;
            updateData(true,'actID',localStorage.actID,'activities','cccID',cccID);
        }
    });
    $('#cargoStatusID').selectize({
        maxItems: 1,
        valueField: 'cargoStatusID',
        labelField: 'cargoStatusDesc',
        searchField: 'cargoStatusDesc',
        options: cargoStatusL,
        create: false,
        onChange : function(cargoStatusID){ 
            if (cargoStatusID.length == 0) cargoStatusID = null;
            updateData(true,'actID',localStorage.actID,'activities','cargoStatusID',cargoStatusID);
        }
    });
    $('#containerID').selectize({
        maxItems: 1,
        valueField: 'containerID',
        labelField: 'containerDesc',
        searchField: 'containerDesc',
        options: containersL,
        create: false,
        onChange : function(containerID){ 
            if (containerID.length == 0) { // No container
                $("#LoadedEmptyLabel").removeClass("mandatory");
                $("#height").prop('disabled', false);
                $("#width").prop('disabled', false);
                $("#length").prop('disabled', false);
                fullEmptySel.disable();
                fullEmptySel.clearOptions();
                db.transaction(function(tx) {
                    var today_dt = getDateTime();
                    tx.executeSql("UPDATE activities set containerID=null,containerIDTS=?,width=null,widthTS=?,height=null,heightTS=?,length=null,lengthTS=?,mt=null,mtTS=?,LoadedEmpty=null,LoadedEmptyTS=?,cbm=null,cbmTS=?,TS=null WHERE actID = ?",[today_dt,today_dt,today_dt,today_dt,today_dt,today_dt,today_dt,localStorage.actID],
                                  function(tx,result){
                                      $("#height").val('');
                                      $("#width").val('');
                                      $("#length").val('');
                                      $("#mt").val('');
                                      $("#cbm").val('');
                                      calcCubic();
                                  },
                                  function(ts,error){
                                      alert("Error: "+error.message);
                                  });	
                });
            } else {
                fullEmptySel.load(function(callback){
                    callback(fullEmpty);
                });
                $("#LoadedEmptyLabel").addClass("mandatory");
                $("#height").prop('disabled', true);
                $("#width").prop('disabled', true);
                $("#length").prop('disabled', true);
                fullEmptySel.enable();
                var contResult = $.grep(containersL, function(e){ return e.containerID == $("#containerID").val(); });
                db.transaction(function(tx) {
                    var today_dt = getDateTime();
                    tx.executeSql("UPDATE activities set containerID=?,containerIDTS=?,width=?,widthTS=?,height=?,heightTS=?,length=?,lengthTS=?,cbm=?,cbmTS=?,TS=null WHERE actID = ?",[containerID,today_dt,contResult[0].containerWidth,today_dt,contResult[0].containerHeight,today_dt,contResult[0].containerLength,today_dt,contResult[0].containerCBM,today_dt,localStorage.actID],
                                  function(tx,result){
                                      $("#height").val(safeDecode(contResult[0].containerHeight));
                                      $("#width").val(safeDecode(contResult[0].containerWidth));
                                      $("#length").val(safeDecode(contResult[0].containerLength));
                                      $("#cbm").text(safeDecode(contResult[0].containerCBM));
                                      calcCubic();
                                  },
                                  function(ts,error){
                                      alert("Error: "+error.message);
                                  });	
                });                
            }
        }
    });
    $fullEmptySel = $('#LoadedEmpty').selectize({
        maxItems: 1,
        valueField: 'key',
        labelField: 'val',
        searchField: 'val',
        options: fullEmpty,
        create: false,
        onChange : function(key){ 
            if (key.length == 0) key = null;
            updateData(true,'actID',localStorage.actID,'activities','LoadedEmpty',key)
        }
    });
    fullEmptySel = $fullEmptySel[0].selectize;
}

execSql = function(query, callback) {
    db.transaction(function(tx) {
        tx.executeSql(query,[],
                      function(tx, rs){
                          changePage('report-activities.html',['report-activities.js']);
                      },
                      function(tx, e){
                          alert("Error cloning the activity: " + e.message)
                      });
    });
} 


cloneAct = function(actID) {
    var r=confirm("Are you sure You want to clone this activity?");
    if (r==false) return;
    newActID = getID();
    //TODO add into recordLog
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM `activities` WHERE actID = '"+actID+"';",[],
                      function(tx, rs){
                          var labels = "", values = "", separator = "";
                          for (var i=0; i < rs.rows.length; i++){
                              r = rs.rows.item(i);
                              // row clone because r properties have {writable: false}
                              var row = {}
                              for (i in r) row[i] = r[i];
                              for (key in row) {
                                  labels += separator+key;
                                  if (key == "actID") 
                                      values += separator+"'"+newActID+"'";
                                  else if (key == "comms") {
                                      if (row['comms'] === null) values += separator+"'Cloned "+getDateTime()+"'";
                                      else values += separator+"'"+row['comms']+" - Cloned "+getDateTime()+"'";
                                      row[key+"TS"] = getDateTime();
                                  }
                                  else if (key == "clonedFrom") {
                                      values += separator+"'"+actID+"'";
                                      row[key+"TS"] = getDateTime();
                                  }
                                  /*else if (key == "length" || key == "width" || key == "height" || key == "mt" || key == "qty") {
                                          values += separator+"null";
                                          row[key+"TS"] = getDateTime(); 
                                      }*/
                                      else if (key == "TS") 
                                          values += separator+"null";
                                          else if (row[key] === null) 
                                              values += separator+"null";
                                              else
                                                  values += separator+"'"+row[key]+"'";
                                  separator = ",";
                              }
                              query = "INSERT INTO activities ("+labels+") VALUES ("+values+");";
                              execSql(query);
                          }
                      }, 
                      function(){
                          alert("Error cloning the activity")
                      });
    });
}

calcCubic = function() {
    var mt = parseFloat($("#mt").val());
    if ($('#containerID').val() == '') {
        
        var height = parseFloat($("#height").val()),
            width = parseFloat($("#width").val()),
            length = parseFloat($("#length").val());
        var cbm = 0;
        if (!isNaN(width) && !isNaN(height) && !isNaN(length))
            cbm = Math.round(width * height * length * 1000) / 1000;
        updateData(true,'actID',localStorage.actID,'activities','cbm',cbm);
    } else {
        cbm = parseFloat($("#cbm").text());
    }
    $("#cbm").text(cbm),
        ft = "";
    if (!isNaN(cbm) && !isNaN(mt)) 
        if (cbm >= mt) ft = cbm; 
        else ft = mt;
    if (ft >= 5) ft = "HL "+ft;
    else ft = "GC " + ft; 
    $("#ft").text(ft);
}

valNumeric = function(element) {
    var val = $(element).val();
    if (val.indexOf(".") == -1) {
        val = val.replaceAll("#",".");
        val = val.replaceAll("*",".");
    } else {
        val = val.replaceAll("#","");
        val = val.replaceAll("*","");
    }
    $(element).val(val);
    //if (isNaN($(element).context.valueAsNumber)) {
    if (! (/^\d*(?:\.\d{0,3})?$/.test(val)) || val<=0) {
        //$(element).removeClass("ok");
        $(element).addClass("error");
        return false;
    }
    else { 
        $(element).removeClass("error");
        //$(element).addClass("ok");
        return true;
    }
}

valInteger = function(element) {
    var val = $(element).val();
    if (! (/^\d+$/.test(val))) {
        //$(element).removeClass("ok");
        $(element).addClass("error");
        return false;
    }
    else { 
        $(element).removeClass("error");
        //$(element).addClass("ok");
        return true;
    }
}

changePreparedBy = function(){
    if (localStorage.userLevel == 1)
        db.transaction(function(tx) {
            tx.executeSql("UPDATE reports SET preparedBy = ?, preparedByTS = ?, TS = NULL WHERE fdaID = ? AND endDate IS NULL", [localStorage.userID,getDateTime(),localStorage.fdaID],
                          function(tx, rs) {},
                          function(){});
        });
}

changePreparedBy();

// per aggiornare il customer project in caso di creazione nuova attivita'
// ma anche in caso di spostamento ad un job con project diverso
updateCustomerProject = function () {
    db.transaction(function(tx) {
        tx.executeSql("UPDATE activities SET custProjID = ?, custProjIDTS = ?, TS = NULL WHERE fdaID = ? AND (custProjID <> ? OR custProjID IS NULL)",
                     [localStorage.custProjID, getDateTime(), localStorage.fdaID, localStorage.custProjID],
                     function (tx, rs) {},
                     function () {});
    })
}

updateCustomerProject();

function onBackKeyDown() {
    changePage('report-activities.html',['report-activities.js']);
}

setActivityData();
$("#joJnLabel").text(localStorage.joJn);

//# sourceURL=activity-measure.js
