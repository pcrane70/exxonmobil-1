setActivityData = function() {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM activities LEFT JOIN vessels ON (vesselName = ?) WHERE activities.active=1 AND actID = ?", [localStorage.vesselName, localStorage.actID],
                      function(tx, rs) {
                          row = rs.rows.item(0);
                          /* exVessel e toVessel diventano un unico campo già popolato
                          $('#exVessel').val(row.exVessel);
                          $('#toVessel').val(row.toVessel);
                          */
                          // ipotizzando che exVessel e toVessel siano uguali, controllo se il primo non è nullo ed eventualmente prendo il valore dal localStorage
                          if (row.exVessel == null) {
                              $('#vesselName').val(row.IMO);
                              db.transaction(function(tx) {
                                  tx.executeSql("UPDATE activities SET exVessel=?, exVesselTS=?, toVessel=?, toVesselTS=?, TS=null WHERE actID=?",[row.IMO,getDateTime(),row.IMO,getDateTime(),localStorage.actID],
                                      function(tx,result){},
                                      function(ts,error){
                                          alert("Error: "+error.message);
                                      });
                              });
                          } else {
                              // se a database il campo è già valorizzato, lo stampo e basta
                              $("#vesselName").val(row.exVessel);
                          }
                          $('#fromBaseID').val(row.fromBaseID);
                          $('#toBaseID').val(row.toBaseID);
                          $('#dedicTrk').val(row.dedicTrk);
                          $('#dedicEq').val(row.dedicEq);
                          $('#locationID').val(row.locationID);
                          $('#supplierID').val(row.supplierID);
                          $('#finalClientID').val(row.finalClientID);
                          // Customer Project spostato a livello di report
                          //$('#custProjID').val(row.custProjID);
                          $('#blockID').val(row.blockID);
                          $('#fieldID').val(row.fieldID);
                          $("#wellID").val(row.well);
                          $("#exTruck").val(safeDecode(row.exTruck));
                          $("#toTruck").val(safeDecode(row.toTruck));
                          $("#tpwn").val(safeDecode(row.tpwn));
                          $("#tpsp").val(safeDecode(row.tpsp));
                          $("#newSupplier").val(safeDecode(row.newSupplier));
                          if ($.grep(origDestL, function(e){ return e.origDestName == row.fromBaseID; }).length == 0) $('#otherOrigin').val(row.fromBaseID);
                          if ($.grep(origDestL, function(e){ return e.origDestName == row.toBaseID; }).length == 0) $('#otherDestination').val(row.toBaseID);
                          setupSelectize();
                          //originDropdown(row.origin);
                          //$("#container-fluid").show();
                      },
                      function(ts, error){
                          alert("Error: "+error.message);
                      });
    });
} 

function setupSelectize() {
    var dedicTrk = [
        {"key":"0","val":"Pool"},
        {"key":"1","val":"Dedicated"},
        {"key":"2","val":"Third Party"}
    ];
    var dedicEq = [
        {"key":"0","val":"NOT Dedicated"},
        {"key":"1","val":"Dedicated"}
    ];
    /* exVessel e toVessel diventano un unico campo vesselName
    $('#exVessel').selectize({
        maxItems: 1,
        valueField: 'IMO',
        labelField: 'vesselName',
        searchField: 'vesselName',
        options: vesselsL,
        create: false,
        onChange : function(IMO){ 
            if (IMO.length == 0) IMO = null;
            updateData(true,'actID',localStorage.actID,'activities','exVessel',IMO);
        }
    });
    $('#toVessel').selectize({
        maxItems: 1,
        valueField: 'IMO',
        labelField: 'vesselName',
        searchField: 'vesselName',
        options: vesselsL,
        create: false,
        onChange : function(IMO){ 
            if (IMO.length == 0) IMO = null;
            updateData(true,'actID',localStorage.actID,'activities','toVessel',IMO);
        }
    });
    */
    $('#vesselName').selectize({
        maxItems: 1,
        valueField: 'IMO',
        labelField: 'vesselName',
        searchField: 'vesselName',
        options: vesselsL,
        create: false,
        onChange : function(IMO){
            if (IMO.length == 0) IMO = null;
            // memorizzo il dato su entrambi i campi
            db.transaction(function(tx) {
                tx.executeSql("UPDATE activities SET exVessel=?, exVesselTS=?, toVessel=?, toVesselTS=?, TS=null WHERE actID=?",[IMO,getDateTime(),IMO,getDateTime(),localStorage.actID],
                    function(tx,result){},
                    function(ts,error){
                        alert("Error: "+error.message);
                    });
            });
        }
    });
    $('#dedicTrk').selectize({
        maxItems: 1,
        valueField: 'key',
        labelField: 'val',
        searchField: 'val',
        options: dedicTrk,
        create: false,
        onChange : function(key){ 
            if (key.length == 0) key = 0;
            updateData(true,'actID',localStorage.actID,'activities','dedicTrk',key)
        }
    });
    $('#dedicEq').selectize({
        maxItems: 1,
        valueField: 'key',
        labelField: 'val',
        searchField: 'val',
        options: dedicEq,
        create: false,
        onChange : function(key){ 
            if (key.length == 0) key = 0;
            updateData(true,'actID',localStorage.actID,'activities','dedicEq',key)
        }
    });
    $fromBaseSelectize = $('#fromBaseID').selectize({
        maxItems: 1,
        valueField: 'origDestName',
        labelField: 'origDestName',
        searchField: 'origDestName',
        options: origDestL,
        create: false,
        onChange : function(origDestName){ 
            if (origDestName.length == 0) origDestName = null;
            updateData(true,'actID',localStorage.actID,'activities','fromBaseID',origDestName);
            $('#otherOrigin').val('');
        }
    });
    $toBaseSelectize = $('#toBaseID').selectize({
        maxItems: 1,
        valueField: 'origDestName',
        labelField: 'origDestName',
        searchField: 'origDestName',
        options: origDestL,
        create: false,
        onChange : function(origDestName){ 
            if (origDestName.length == 0) origDestName = null;
            updateData(true,'actID',localStorage.actID,'activities','toBaseID',origDestName);
            $('#otherDestination').val('');
        }
    });
    $('#locationID').selectize({
        maxItems: 1,
        valueField: 'locationID',
        labelField: 'locationName',
        searchField: 'locationName',
        options: locationsL,
        create: false,
        onChange : function(locationID){ 
            if (locationID.length == 0) locationID = null;
            updateData(true,'actID',localStorage.actID,'activities','locationID',locationID);
        }
    });
    $('#supplierID').selectize({
        maxItems: 1,
        valueField: 'supplierID',
        labelField: 'supplierName',
        searchField: 'supplierName',
        options: suppliersL,
        create: false,
        onChange : function(supplierID){ 
            if (supplierID.length == 0) supplierID = null;
            updateData(true,'actID',localStorage.actID,'activities','supplierID',supplierID,function(){
                // if not empty, selectize selection (newSupplier reset), otherwise no newSupplier reset
                if(supplierID)
                {
                    $('#newSupplier').val('');
                    updateData(true,'actID',localStorage.actID,'activities','newSupplier','');
                }
            });
        }
    });
    $('#finalClientID').selectize({
        maxItems: 1,
        valueField: 'clientID',
        labelField: 'clientName',
        searchField: 'clientName',
        options: clientsL,
        create: false,
        onChange : function(clientID){ 
            if (clientID.length == 0) clientID = null;
            updateData(true,'actID',localStorage.actID,'activities','finalClientID',clientID);
        }
    });
    /* Customer Project spostato a livello di report
    $('#custProjID').selectize({
        maxItems: 1,
        valueField: 'projID',
        labelField: 'projName',
        searchField: 'projName',
        options: projsL,
        create: false,
        onChange : function(projID){ 
            if (projID.length == 0) projID = null;
            updateData(true,'actID',localStorage.actID,'activities','custProjID',projID);
        }
    });
    // disabilito il customer project in quanto proveniente da AX e quindi non modificabile
    $('#custProjID')[0].selectize.disable();
    */
    $('#blockID').selectize({
        maxItems: 1,
        valueField: 'blockID',
        labelField: 'blockName',
        searchField: 'blockName',
        options: blocksL,
        create: false,
        onChange : function(blockID){ 
            if (blockID.length == 0) blockID = null;
            updateData(true,'actID',localStorage.actID,'activities','blockID',blockID);
        }
    });
    $('#fieldID').selectize({
        maxItems: 1,
        valueField: 'fieldID',
        labelField: 'fieldName',
        searchField: 'fieldName',
        options: fieldsL,
        create: false,
        onChange : function(fieldID){ 
            if (fieldID.length == 0) fieldID = null;
            updateData(true,'actID',localStorage.actID,'activities','fieldID',fieldID);
        }
    });
    $('#wellID').selectize({
        maxItems: 1,
        valueField: 'wellID',
        labelField: 'wellName',
        searchField: 'wellName',
        options: wellsL,
        create: false,
        onChange : function(wellID){ 
            if (wellID.length == 0) wellID = null;
            updateData(true,'actID',localStorage.actID,'activities','well',wellID);
        }
    });

    // aggiungo i bottoni per la cancellazione delle selectize
    addSelectizeRmButton();
}

function deleteOrigin() {
    var temp = $("#otherOrigin").val();
    $fromBaseSelectize[0].selectize.clear();
    $("#otherOrigin").val(temp);
}

function deleteDestination() {
    var temp = $("#otherDestination").val();
    $toBaseSelectize[0].selectize.clear();
    $("#otherDestination").val(temp); 
}

function deleteSupplier() {
    // trick because clear
    var temp = $("#newSupplier").val();
    $("#supplierID")[0].selectize.clear();
    $("#newSupplier").val(temp); 
}

function updateNewOrigDest(newOrigDest,fieldName) {
    // getting the selected value
    var val = $(newOrigDest).val();
    // ctrl variable
    var found = false;
    // check if the val is already present
    for (i = 0; i < origDestL.length; i ++)
    {
        // if present
        if (origDestL[i].origDestName.trim().toUpperCase() == val.trim().toUpperCase())
        {
            // set the supplierID field
            $("#"+fieldName)[0].selectize.setValue(origDestL[i].origDestName);
            $(newOrigDest).val("");
            found = true;
            break;
        }
    }
    // if not found, update the report field
    if (!found)
    {
        updateData(true,'actID',localStorage.actID,'activities',fieldName,val);
        // clear selectize related, only if not empty value 
        if (val.length)
            eval("delete" + newOrigDest.id.replace ('other', '') + "()");
    }
}

function updateNewSupplier(newSupplier) {
    // getting the selected value
    var val = $(newSupplier).val();
    // ctrl variable
    var found = false;
    // check if the val is already present
    for (i = 0; i < suppliersL.length; i ++)
    {
        // if present
        if (suppliersL[i].supplierID.trim().toUpperCase() == val.trim().toUpperCase()
            || suppliersL[i].supplierName.trim().toUpperCase() == val.trim().toUpperCase())
        {
            // set the supplierID field
            $("#supplierID")[0].selectize.setValue(suppliersL[i].supplierID);
            $(newSupplier).val("");
            found = true;
            break;
        }
    }
    // if not found, update newSupplier field
    if (!found)
    {
        updateData(true,'actID',localStorage.actID,'activities','newSupplier',val);
        // clear selectize related, only if not empty value 
        if (val.length)
            deleteSupplier();
    }
}

/*originDropdown = function(selected) {
    db.transaction(function(tx) {
        tx.executeSql("select origDest.* from origDest LEFT JOIN reports on reports.clientID = origDest.clientID WHERE reports.fdaID = '"+localStorage.fdaID+"' ORDER BY origDestName ASC", [],
                      function(tx, rs) {
                          for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              if (selected == row.origDestName) sel = 'selected="selected"'; else sel = '';
                              $("#origin").append('<option value="'+row.origDestName+'" '+sel+' >'+safeDecode(row.origDestName)+'</option>');
                          }
                      },
                      function(){
                          alert("Error rendering origin dropdown")
                      });
    });
}

deleteActivity = function(actID) {
    var r=confirm("Are you sure to delete this activity?");
    if (r==false) return;
    if (!actID) actID = localStorage.actID;
    db.transaction(function(tx) {
        tx.executeSql("UPDATE activities set active=0 WHERE actID = '"+actID+"'",
                      [],
                      function(){
                          //var dataRow = '{"actID":"'+actID+'","active":"0"}';
                          //insertNewCommitRow('activities',dataRow,"report-detail.html?fdaID="+localStorage.fdaID,true);
                          //window.location.replace("report-detail.html?fdaID="+localStorage.fdaID)
                      },
                      function(){
                          alert("Error deleting this activity")
                      });
    });
} 

valNumeric = function(element) {
    //var val = $(element).val();
    if (isNaN($(element).context.valueAsNumber)) {
        //if (! (/^\d*(?:\.\d{0,3})?$/.test(val))) {
        $(element).removeClass("ok");
        $(element).addClass("error");
        return false;
    }
    else { 
        $(element).removeClass("error");
        $(element).addClass("ok");
        return true;
    }
}

valInteger = function(element) {
    var val = $(element).val();
    if (! (/^\d+$/.test(val))) {
        $(element).removeClass("ok");
        $(element).addClass("error");
        return false;
    }
    else { 
        $(element).removeClass("error");
        $(element).addClass("ok");
        return true;
    }
}
*/
function onBackKeyDown() {
    changePage('report-activities.html',['report-activities.js']);
}

setActivityData();
$("#joJnLabel").text(localStorage.joJn);
var $fromBaseSelectize, $toBaseSelectize;

// mandatorieta' opzionale per exTruck e toTruck
if (extotruckmandatory)
{
    $("label[for=exTruck]").addClass ("mandatory");
    $("label[for=toTruck]").addClass ("mandatory");
}

//# sourceURL=activity-location.js