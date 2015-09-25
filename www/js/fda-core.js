onSuccess = function(tx, r) {
}

onError = function(tx, err, table) {
    if (err.code != 5)
        alert("Error: "+err.code+" "+err.message);
    //else 
    //    if (table) 
    //        processQueue(table);
}  

createTables = function() {
    db.transaction(function(tx) {
        tx.executeSql('PRAGMA encoding = "UTF-8";', [], onSuccess, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS activities (actID varchar(30) PRIMARY KEY,actID_SBS varchar(36) DEFAULT NULL,actAXID INTEGER UNIQUE,fdaID varchar(30) NOT NULL,actTypeID varchar(20), details text, cccID varchar(20) DEFAULT NULL, cargoStatusID varchar(20) DEFAULT NULL, qty NUMERIC DEFAULT NULL, height NUMERIC DEFAULT NULL, length NUMERIC DEFAULT NULL, width NUMERIC DEFAULT NULL, mt NUMERIC DEFAULT NULL, cbm NUMERIC DEFAULT NULL, containerID varchar(20) DEFAULT NULL, LoadedEmpty varchar(10) DEFAULT NULL, custProjID varchar(20) DEFAULT NULL, blockID varchar(20) DEFAULT NULL, fieldID varchar(20) DEFAULT NULL, well varchar(60) DEFAULT NULL, ownerID varchar(20) DEFAULT NULL, marks text DEFAULT NULL, site varchar(20) DEFAULT NULL, warehouse varchar(20) DEFAULT NULL, unit varchar(20) DEFAULT NULL, manifestID varchar(50) DEFAULT NULL, exVessel varchar(60) DEFAULT NULL, toVessel varchar(60) DEFAULT NULL, exTruck varchar(60) DEFAULT NULL, toTruck varchar(60) DEFAULT NULL, fromBaseID varchar(10) DEFAULT NULL, toBaseID varchar(10) DEFAULT NULL, locationID varchar(20) DEFAULT NULL, eqTypes text, eqDedicTypes text, origin varchar(60) DEFAULT NULL, supplierID varchar(20) DEFAULT NULL, newSupplier varchar(50) DEFAULT NULL, finalClientID varchar(20) DEFAULT NULL, dedicTrk INTEGER NOT NULL DEFAULT 0, dedicEq INTEGER NOT NULL DEFAULT 0, comms text DEFAULT NULL, tpsp varchar(50) DEFAULT NULL, tpwn varchar(60) DEFAULT NULL, entityID INTEGER DEFAULT NULL, clonedFrom varchar(30) DEFAULT NULL, toSBS INTEGER DEFAULT 0, active INTEGER NOT NULL DEFAULT 1, actTypeIDTS  timestamp DATETIME DEFAULT NULL, detailsTS  timestamp DATETIME DEFAULT NULL, cccIDTS  timestamp DATETIME DEFAULT NULL,  cargoStatusIDTS  timestamp DATETIME DEFAULT NULL, qtyTS  timestamp DATETIME DEFAULT NULL, heightTS  timestamp DATETIME DEFAULT NULL, lengthTS  timestamp DATETIME DEFAULT NULL, widthTS  timestamp DATETIME DEFAULT NULL, mtTS  timestamp DATETIME DEFAULT NULL, cbmTS  timestamp DATETIME DEFAULT NULL, containerIDTS timestamp DATETIME DEFAULT NULL, LoadedEmptyTS timestamp DATETIME DEFAULT NULL, custProjIDTS  timestamp DATETIME DEFAULT NULL, blockIDTS timestamp DATETIME DEFAULT NULL, fieldIDTS timestamp DATETIME DEFAULT NULL, wellTS timestamp DATETIME DEFAULT NULL, ownerIDTS timestamp DATETIME DEFAULT NULL, marksTS timestamp DATETIME DEFAULT NULL, siteTS timestamp DATETIME DEFAULT NULL, warehouseTS timestamp DATETIME DEFAULT NULL, unitTS  timestamp DATETIME DEFAULT NULL, manifestIDTS  timestamp DATETIME DEFAULT NULL, exVesselTS timestamp DATETIME DEFAULT NULL, toVesselTS  timestamp DATETIME DEFAULT NULL, exTruckTS timestamp DATETIME DEFAULT NULL, toTruckTS  timestamp DATETIME DEFAULT NULL, fromBaseIDTS timestamp DATETIME DEFAULT NULL, toBaseIDTS timestamp DATETIME DEFAULT NULL, locationIDTS varchar(20) DEFAULT NULL, eqTypesTS timestamp DATETIME DEFAULT NULL, eqDedicTypesTS timestamp DATETIME DEFAULT NULL, originTS  timestamp DATETIME DEFAULT NULL, supplierIDTS timestamp DATETIME DEFAULT NULL, newSupplierTS timestamp DATETIME DEFAULT NULL, finalClientIDTS timestamp DATETIME DEFAULT NULL, dedicTrkTS timestamp DATETIME DEFAULT NULL, dedicEqTS timestamp DATETIME DEFAULT NULL, commsTS timestamp DATETIME DEFAULT NULL, tpspTS  timestamp DATETIME DEFAULT NULL, tpwnTS  timestamp DATETIME DEFAULT NULL, clonedFromTS timestamp DATETIME DEFAULT NULL, toSBSTS TIMESTAMP DATETIME NULL, activeTS timestamp DATETIME DEFAULT NULL, entityIDTS timestamp DATETIME DEFAULT NULL, TS timestamp DATETIME DEFAULT NULL)", [], createActivitiesIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS actTypes ( ID INTEGER PRIMARY KEY, actTypeID varchar(20) NOT NULL, actTypeDesc varchar(60) DEFAULT NULL, repTypeID varchar(20) NOT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createActTypesIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS cargoStatus ( ID INTEGER PRIMARY KEY, cargoStatusID varchar(20) NOT NULL, cargoStatusDesc varchar(60) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createCargoStatusIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS ccc ( ID INTEGER PRIMARY KEY, cccID varchar(20) NOT NULL, cccDesc varchar(60) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createCccIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS clients ( ID INTEGER PRIMARY KEY, clientID varchar(20) NOT NULL, clientName varchar(60) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createClientsIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS containers ( ID INTEGER PRIMARY KEY, containerID varchar(20) NOT NULL, containerDesc varchar(60) DEFAULT NULL, containerHeight NUMERIC DEFAULT NULL, containerWidth NUMERIC DEFAULT NULL, containerLength NUMERIC DEFAULT NULL, containerCBM NUMERIC DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], processQueue("containers"), onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS eqTypes ( ID INTEGER PRIMARY KEY, eqTypeID varchar(20) NOT NULL, eqTypeDesc varchar(60) DEFAULT NULL, dedicatedClientID varchar(50) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createEqTypesIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS locations ( ID INTEGER PRIMARY KEY, locationID varchar(20) NOT NULL, locationName varchar(50) DEFAULT NULL, locationCountry varchar(2) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createLocationsIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS projs ( ID INTEGER PRIMARY KEY, projID varchar(20) NOT NULL, projName varchar(60) DEFAULT NULL, section varchar(15) DEFAULT NULL, clientID varchar(20) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1,TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], processQueue("projs"), onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS reports ( fdaID varchar(30) PRIMARY KEY, axID INTEGER, toRev INTEGER DEFAULT 0, repTypeID varchar(20) DEFAULT NULL,manType varchar(20) DEFAULT NULL, joJn varchar(60) DEFAULT NULL, manNo varchar(60) DEFAULT NULL, bookNo varchar(60) DEFAULT NULL, callNo varchar(60) DEFAULT NULL, BOL varchar(20) DEFAULT NULL, clientID varchar(20) DEFAULT NULL, servDate date DEFAULT NULL, startDate date DEFAULT NULL, endDate date DEFAULT NULL, vesselName varchar(50) DEFAULT NULL, preparedBy varchar(20) DEFAULT NULL, checkedBy varchar(20) DEFAULT NULL, baseSuperintendentsName varchar(20) DEFAULT NULL, clientsApprovalName varchar(50) DEFAULT NULL, clientsApprovalName2 varchar(50) DEFAULT NULL, entity varchar(60) DEFAULT NULL, clientSign varchar(50) DEFAULT NULL, clientsApprovalDT DATETIME, custProjID varchar(20) DEFAULT NULL, ChargeCode varchar(20) DEFAULT NULL, AssistID varchar(50) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, repTypeIDTS timestamp DATETIME DEFAULT NULL,manTypeTS timestamp DATETIME DEFAULT NULL, joJnTS timestamp DATETIME DEFAULT NULL, manNoTS timestamp DATETIME DEFAULT NULL, bookNoTS timestamp DATETIME DEFAULT NULL, callNoTS timestamp DATETIME DEFAULT NULL, BOLTS timestamp DATETIME DEFAULT NULL, clientIDTS timestamp DATETIME DEFAULT NULL, servDateTS timestamp DATETIME DEFAULT NULL, startDateTS timestamp DATETIME DEFAULT NULL, endDateTS timestamp DATETIME DEFAULT NULL, vesselNameTS timestamp DATETIME DEFAULT NULL, preparedByTS timestamp DATETIME DEFAULT NULL, checkedByTS timestamp DATETIME DEFAULT NULL, baseSuperintendentsNameTS timestamp DATETIME DEFAULT NULL, clientsApprovalNameTS timestamp DATETIME DEFAULT NULL, clientsApprovalName2TS timestamp DATETIME DEFAULT NULL, entityTS timestamp DATETIME DEFAULT NULL, clientsApprovalDTTS timestamp DATETIME DEFAULT NULL, clientSignTS timestamp DATETIME DEFAULT NULL, custProjIDTS timestamp DATETIME DEFAULT NULL, ChargeCodeTS timestamp DATETIME DEFAULT NULL, AssistIDTS timestamp DATETIME DEFAULT NULL, activeTS timestamp DATETIME DEFAULT NULL, TS timestamp DATETIME DEFAULT NULL)", [], createReportsIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS repTypes ( ID INTEGER PRIMARY KEY, repTypeID varchar(20) NOT NULL, repTypeName varchar(50) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createRepTypesIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS suppliers ( ID INTEGER PRIMARY KEY, supplierID varchar(20) NOT NULL, supplierName varchar(60) DEFAULT NULL, section varchar(15) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createSuppliersIndexes, onError);
        //tx.executeSql("CREATE TABLE IF NOT EXISTS users ( ID INTEGER PRIMARY KEY, userID varchar(20) NOT NULL, userName varchar(60) DEFAULT NULL, userPsw varchar(60) DEFAULT NULL, userLevel INTEGER DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createUsersIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS datacenterUsers ( userID varchar(50) PRIMARY KEY,userEmployeeNumber varchar(60) DEFAULT NULL,userEmployeePosition varchar(60) DEFAULT NULL, userEmail varchar(50) DEFAULT NULL,userHash varchar(35) DEFAULT NULL,userName varchar(100) DEFAULT NULL,userValidFrom DATE DEFAULT NULL,userValidTo DATE DEFAULT NULL,userApps varchar(500) DEFAULT NULL,userRoles varchar(500) DEFAULT NULL,active INTEGER NOT NULL DEFAULT 1,TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createUsersIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS pics ( picID varchar(30) PRIMARY KEY, fdaID varchar(30) NOT NULL, actID varchar(30) NOT NULL, picThumb BLOB DEFAULT NULL, pic BLOB DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, picThumbTS timestamp DATETIME DEFAULT NULL, picTS timestamp DATETIME DEFAULT NULL, activeTS timestamp DATETIME DEFAULT NULL, TS timestamp DATETIME DEFAULT NULL)", [], onSuccess, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS vessels ( ID INTEGER PRIMARY KEY, IMO varchar(20) NOT NULL, vesselName varchar(50) NOT NULL, section varchar(15) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')))", [], createVesselsIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS origDest ( ID INTEGER PRIMARY KEY, origDestName varchar(60) NOT NULL, clientID varchar(20) NOT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')))", [], processQueue("origDest"), onError);
        //tx.executeSql("CREATE TABLE IF NOT EXISTS entities ( ID INTEGER PRIMARY KEY, entityID INTEGER NOT NULL, axCompanyID varchar(20) NOT NULL, entityName varchar(50) DEFAULT NULL, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')))", [], createEntitiesIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS entities ( entityID varchar(60) PRIMARY KEY, entityName varchar(60) DEFAULT NULL, active INTEGER NOT NULL, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')))", [], createEntitiesIndexes, onError);
        //tx.executeSql("CREATE TABLE IF NOT EXISTS eqCategories ( ID INTEGER PRIMARY KEY, eqCategoryName varchar(20) DEFAULT NULL, eqCategoryQuery varchar(100) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')))", [], processQueue("eqCategories"), onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS blocks ( ID INTEGER PRIMARY KEY, blockID varchar(20) NOT NULL, blockName varchar(60) DEFAULT NULL,clientID varchar(20) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createBlocksIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS fields ( ID INTEGER PRIMARY KEY, fieldID varchar(20) NOT NULL, fieldName varchar(60) DEFAULT NULL,clientID varchar(20) DEFAULT NULL, active INTEGER NOT NULL DEFAULT 1, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createFieldsIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS wells ("
            + "ID INTEGER PRIMARY KEY, "
            + "wellID varchar(30) NOT NULL, "
            + "wellName varchar(100) DEFAULT NULL, "
            + "section varchar(15) DEFAULT NULL, "
            + "clientID varchar(20) DEFAULT NULL, "
            + "active INTEGER NOT NULL DEFAULT 1, "
            + "TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createWellsIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS reports_reopen ( fdaID varchar(30) PRIMARY KEY, idReason INTEGER NOT NULL DEFAULT 0, note text DEFAULT NULL, idReasonTS timestamp DATETIME DEFAULT NULL, noteTS timestamp DATETIME DEFAULT NULL, TS timestamp DATETIME DEFAULT (DATETIME(current_timestamp, 'localtime')) );", [], createReopenIndexes, onError);
        tx.executeSql("CREATE TABLE IF NOT EXISTS activitiesSBS_related_PCC ("
                + "joJnPCC varchar(60), "
                + "fdaIDPCC varchar(30), "
                + "actID varchar(30), "
                + "actID_SBS varchar(30) DEFAULT NULL, "
                + "actAXID INTEGER UNIQUE, "
                + "fdaID varchar(30) NOT NULL, "
                + "actTypeID varchar(20), "
                + "details text, "
                + "cccID varchar(20) DEFAULT NULL, "
                + "cargoStatusID varchar(20) DEFAULT NULL, "
                + "qty NUMERIC DEFAULT NULL, "
                + "height NUMERIC DEFAULT NULL, "
                + "length NUMERIC DEFAULT NULL, "
                + "width NUMERIC DEFAULT NULL, "
                + "mt NUMERIC DEFAULT NULL, "
                + "cbm NUMERIC DEFAULT NULL, "
                + "containerID varchar(20) DEFAULT NULL, "
                + "LoadedEmpty varchar(10) DEFAULT NULL, "
                + "custProjID varchar(20) DEFAULT NULL, "
                + "AssistID varchar(50) DEFAULT NULL, "
                + "BOL varchar(50) DEFAULT NULL, "
                + "blockID varchar(20) DEFAULT NULL, "
                + "fieldID varchar(20) DEFAULT NULL, "
                + "well varchar(60) DEFAULT NULL, "
                + "ownerID varchar(20) DEFAULT NULL, "
                + "marks text DEFAULT NULL, "
                + "site varchar(20) DEFAULT NULL, "
                + "warehouse varchar(20) DEFAULT NULL, "
                + "unit varchar(20) DEFAULT NULL, "
                + "manifestID varchar(50) DEFAULT NULL, "
                + "exVessel varchar(60) DEFAULT NULL, "
                + "toVessel varchar(60) DEFAULT NULL, "
                + "exTruck varchar(60) DEFAULT NULL, "
                + "toTruck varchar(60) DEFAULT NULL, "
                + "fromBaseID varchar(10) DEFAULT NULL, "
                + "toBaseID varchar(10) DEFAULT NULL, "
                + "locationID varchar(20) DEFAULT NULL, "
                + "eqTypes text, "
                + "eqDedicTypes text, "
                + "origin varchar(60) DEFAULT NULL, "
                + "supplierID varchar(20) DEFAULT NULL, "
                + "newSupplier varchar(50) DEFAULT NULL, "
                + "finalClientID varchar(20) DEFAULT NULL, "
                + "dedicTrk INTEGER NOT NULL DEFAULT 0, "
                + "dedicEq INTEGER NOT NULL DEFAULT 0, "
                + "comms text DEFAULT NULL, "
                + "tpsp varchar(50) DEFAULT NULL, "
                + "tpwn varchar(60) DEFAULT NULL, "
                + "entityID INTEGER DEFAULT NULL, "
                + "clonedFrom varchar(30) DEFAULT NULL, "
                + "active INTEGER NOT NULL DEFAULT 1, "
                + "actTypeIDTS  timestamp DATETIME DEFAULT NULL, "
                + "detailsTS  timestamp DATETIME DEFAULT NULL, "
                + "cccIDTS  timestamp DATETIME DEFAULT NULL, "
                + "cargoStatusIDTS  timestamp DATETIME DEFAULT NULL, "
                + "qtyTS  timestamp DATETIME DEFAULT NULL, "
                + "heightTS  timestamp DATETIME DEFAULT NULL, "
                + "lengthTS  timestamp DATETIME DEFAULT NULL, "
                + "widthTS  timestamp DATETIME DEFAULT NULL, "
                + "mtTS  timestamp DATETIME DEFAULT NULL, "
                + "cbmTS  timestamp DATETIME DEFAULT NULL, "
                + "containerIDTS timestamp DATETIME DEFAULT NULL, "
                + "LoadedEmptyTS timestamp DATETIME DEFAULT NULL, "
                + "custProjIDTS  timestamp DATETIME DEFAULT NULL, "
                + "AssistIDTS timestamp DATETIME DEFAULT NULL, "
                + "BOLTS timestamp DATETIME DEFAULT NULL, "
                + "blockIDTS timestamp DATETIME DEFAULT NULL, "
                + "fieldIDTS timestamp DATETIME DEFAULT NULL, "
                + "wellTS timestamp DATETIME DEFAULT NULL, "
                + "ownerIDTS timestamp DATETIME DEFAULT NULL, "
                + "marksTS timestamp DATETIME DEFAULT NULL, "
                + "siteTS timestamp DATETIME DEFAULT NULL, "
                + "warehouseTS timestamp DATETIME DEFAULT NULL, "
                + "unitTS  timestamp DATETIME DEFAULT NULL, "
                + "manifestIDTS  timestamp DATETIME DEFAULT NULL, "
                + "exVesselTS timestamp DATETIME DEFAULT NULL, "
                + "toVesselTS  timestamp DATETIME DEFAULT NULL, "
                + "exTruckTS timestamp DATETIME DEFAULT NULL, "
                + "toTruckTS  timestamp DATETIME DEFAULT NULL, "
                + "fromBaseIDTS timestamp DATETIME DEFAULT NULL, "
                + "toBaseIDTS timestamp DATETIME DEFAULT NULL, "
                + "locationIDTS varchar(20) DEFAULT NULL, "
                + "eqTypesTS timestamp DATETIME DEFAULT NULL, "
                + "eqDedicTypesTS timestamp DATETIME DEFAULT NULL, "
                + "originTS  timestamp DATETIME DEFAULT NULL, "
                + "supplierIDTS timestamp DATETIME DEFAULT NULL, "
                + "newSupplierTS timestamp DATETIME DEFAULT NULL, "
                + "finalClientIDTS timestamp DATETIME DEFAULT NULL, "
                + "dedicTrkTS timestamp DATETIME DEFAULT NULL, "
                + "dedicEqTS timestamp DATETIME DEFAULT NULL, "
                + "commsTS timestamp DATETIME DEFAULT NULL, "
                + "tpspTS  timestamp DATETIME DEFAULT NULL, "
                + "tpwnTS  timestamp DATETIME DEFAULT NULL, "
                + "entityIDTS timestamp DATETIME DEFAULT NULL, "
                + "clonedFromTS timestamp DATETIME DEFAULT NULL, "
                + "activeTS timestamp DATETIME DEFAULT NULL, "
                + "TS timestamp DATETIME DEFAULT NULL, "
                + "PRIMARY KEY(actID, fdaIDPCC))", [], createActivitiesSBSIndexes, onError);
    });
}

createActivitiesIndexes = function(tx,rs) {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "actAXID" on activities (actAXID ASC);', [], onSuccess, onError);
        tx.executeSql('CREATE INDEX IF NOT EXISTS "fdaID_act" on activities (fdaID ASC);', [], onSuccess, onError);
    });
    
}

createReportsIndexes = function(tx,rs) {
    db.transaction(function(tx) {
        tx.executeSql('CREATE INDEX IF NOT EXISTS "repTypeID_rep" on reports (repTypeID ASC);', [], onSuccess, onError);
        tx.executeSql('CREATE INDEX IF NOT EXISTS "clientID_rep" on reports (clientID ASC);', [], onSuccess, onError);
    });
}

createClientsIndexes = function(tx,rs) {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "clientID" on clients (clientID ASC);', [], processQueue("clients"), onError);
    });
}

createRepTypesIndexes = function() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "repTypeID" on repTypes (repTypeID ASC);', [], processQueue("repTypes"), onError);
    });
}

createActTypesIndexes = function() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "actTypeID" on actTypes (actTypeID ASC);', [], processQueue("actTypes"), onError);
    });
}

createSuppliersIndexes = function() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "supplierID" on suppliers (supplierID ASC);', [], processQueue("suppliers"), onError);
    });
}

createCargoStatusIndexes = function() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "cargoStatusID" on cargoStatus (cargoStatusID ASC);', [], processQueue("cargoStatus"), onError);
    });
}

createCccIndexes = function() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "cccID" on ccc (cccID ASC);', [], processQueue("ccc"), onError);
    });
}

createUsersIndexes = function() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "userID" on datacenterUsers (userID ASC);', [], processQueue("datacenterUsers"), onError);
    });
}   

createEqTypesIndexes = function() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "eqTypeID" on eqTypes (eqTypeID ASC);', [], processQueue("eqTypes"), onError);
    });
}

createBlocksIndexes = function() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "blockID" on blocks (blockID ASC);', [], processQueue("blocks"), onError);
    });
}

createFieldsIndexes = function() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "fieldID" on fields (fieldID ASC);', [], processQueue("fields"), onError);
    });
}

createWellsIndexes = function() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "wellID" on wells (wellID ASC);', [], processQueue("wells"), onError);
    });
}

createLocationsIndexes = function() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "locationID" on locations (locationID ASC);', [], processQueue("locations"), onError);
    });
}

createVesselsIndexes = function() {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "IMO" on vessels (IMO ASC);', [], processQueue("vessels"), onError);
    });
}

createEntitiesIndexes = function(tx,rs) {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "entityID" on entities (entityID ASC);', [], processQueue("entities"), onError);
    });
}

createReopenIndexes = function(tx,rs) {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "fdaID" on reports_reopen (fdaID ASC);', [], processQueue("reports_reopen"), onError);
    });
}

createActivitiesSBSIndexes = function(tx,rs) {
    db.transaction(function(tx) {
        tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS "actAXID" on activitiesSBS_related_PCC (actAXID ASC);', [], onSuccess, onError);
        tx.executeSql('CREATE INDEX IF NOT EXISTS "fdaID_act" on activitiesSBS_related_PCC (fdaID ASC);', [], onSuccess, onError);
    });
    
}


checkNewestRecords = function(table) {
    $("#logger").text("Checking "+table);
    db.transaction(function(tx) {
        tx.executeSql("SELECT max(TS) AS maxts FROM "+table, [],
                      function(tx, rs) {
                          if (rs.rows.length) 
                              getNewLookupRecords(table,rs.rows.item(0).maxts,0);
                          else 
                              getNewLookupRecords(table,"1970-01-01 01:00:00",0);
                      },
                      function (tx, error) {
                          alert("Error: "+error.message);
                      });
    });
}

getNewLookupRecords = function(table,lastTS,page) {
    var lastTSU = new Date(lastTS),
        timeDiff = lastTSU.getTimezoneOffset(),
        response;
    lastTSU = (lastTSU.getTime() / 1000) - timeDiff * 60;
    //var XHR = new XMLHttpRequest();
    switch(table)
    {
        case "projs":
        case "fields":
        case "blocks":
        case "wells":
        case "origDest":
            var url = baseUrl+"/2/getlookup/"+table+"/b6afc9c7bea7e8036035afd5b89cb664/"+lastTSU+"/"+page+"/"+clientID;
            break;    
        default:
            var url = baseUrl+"/2/getlookup/"+table+"/b6afc9c7bea7e8036035afd5b89cb664/"+lastTSU+"/"+page;
    }
    
    $.ajax({
        type: "GET",
        url: url,
        data: '',
        success: function(data){
            if(data.length) 
            {
                processNewLookupRecords(table,data);
                page++;
                getNewLookupRecords(table,lastTS,page);
            }
            else checkQueue();
        },
        error: function(data){
            checkQueue();
        },
        dataType: "json"
    });
    
    /*
    
    
	XHR.open("GET", url, true);
	  XHR.onreadystatechange = function() {
	      if(XHR.readyState == 4 && XHR.status == 200) {
              response = XHR.responseText;
	          //receive response from devput server api
	          if(response.indexOf("data=[]") == -1) 
	          {
	          	processNewLookupRecords(table,response);
	          	page++;
	          	getNewLookupRecords(table,lastTS,page);
	          }
              else checkQueue();
	      } else if(XHR.status == 0) checkQueue();
	  }
	  try { XHR.send(); } catch (e){ 
          checkQueue(); 
      }*/
}

checkQueue = function(){
    op = 0;
    // end of the process
    queue.shift();
    processedTables += 1;
    if (queue.length === 0) 
    {
        queueProcessing = false;
        if (processedTables == 18)
            checkDeletedRecords();
    }
    else
        checkNewestRecords(queue[0]);    
}

json2sql = function(table,row) {
    var separator = "",
        labels = "",
        values = "",
        value = "",
        key;
    for (key in row) {
        labels += separator+key;
        value = row[key];
        if (value == "null" || value === null) values += separator+"NULL";
        else {
            value = value.replaceAll("'","''");
            values += separator+"'"+value+"'";
        }
        separator = ",";
    }
    return "INSERT OR REPLACE INTO "+table+" ("+labels+") VALUES ("+values+");";
} 

processNewLookupRecords = function(table,dataArray) {
    var row, query;
    if (!dataArray.length) return;
    op += dataArray.length;
    $("#logger").text("Updating "+op+" records...");
    db.transaction(function(tx) {
        for (var i=0; i < dataArray.length; i++){
            row = dataArray[i];
            query = json2sql(table,row);
            tx.executeSql(query,[]);
        }
    });
}

processQueue = function(table){
    queue.push(table);
    if (!queueProcessing) 
    {
        queueProcessing = true;
        checkNewestRecords(queue[0]);
    }
}

checkDeletedRecords = function() {
    $('#logger').text("Checking database records...");
    autoComp();
    db.transaction(function(tx) {
        list = "select fdaID from reports where servDate >= '"+getDate1MonthAgo()+"')";
        tx.executeSql('DELETE FROM reports WHERE fdaID NOT IN ('+list+');', [], onSuccess ,onError);
        tx.executeSql('DELETE FROM activities WHERE fdaID NOT IN ('+list+');', [], onSuccess ,onError);
        tx.executeSql('DELETE FROM pics WHERE fdaID NOT IN ('+list+');', [], onSuccess ,onError);
    }); 
    
};

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

Array.prototype.listify = function() 
{
    list = JSON.stringify(this);
    list = list.replaceAll("\"","'");
    list = list.replaceAll("[","");
    list = list.replaceAll("]","");
    return list;
}

openDb = function() {
    if(window.sqlitePlugin !== undefined) {
        db = window.sqlitePlugin.openDatabase("FDA_Client_Database");
    } else {
        // For debuging in simulator fallback to native SQL Lite
        db = window.openDatabase("FDA_Machine_Database", "", "FDA Machine Database", 200000);
    }
}

safeEncode = function(str) {
    if (str === null || str == "null") return null;
    if (typeof(str) == "string") {
        str = str.replaceAll("'", "#039;");
        str = str.replaceAll('&', "#038;");
        str = str.replaceAll('"', "#034;");
        str = str.replaceAll('\\', "#092;");
    }
    return str;
}

safeDecode = function(str) {
    if (str === null || str == "null") return "";
    if (str === undefined) return "";
    if (typeof(str) == "string") {
        str = str.replaceAll("#039;","'");
        str = str.replaceAll("#038;",'&');
        str = str.replaceAll("#034;",'"');
        str = str.replaceAll("#092;",'\\');
    }
    return str;
}

getDate = function() {
    var today = new Date();
    var mm = today.getMonth()+1,
        dd = today.getDate();
    if (dd < 10) dd='0'+dd;
    if (mm < 10) mm='0'+mm;
    var today_s = today.getFullYear()+"-"+mm+"-"+dd;
    return today_s;
}

getDate1MonthAgo = function() {
    var today = new Date();
    today.setDate(today.getDate()-30);
    var mm = today.getMonth()+1,
        dd = today.getDate();
    if (dd < 10) dd='0'+dd;
    if (mm < 10) mm='0'+mm;
    var today_s = today.getFullYear()+"-"+mm+"-"+dd;
    return today_s;
}

getDateTime = function() {
    var today_s = getDate();
    var currentTime = new Date();
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    today_s += " "+ hours + ":" + minutes + ":" + seconds;
    return today_s;
} 

getUID = function() {
    var currentTime = new Date();
    var mm = currentTime.getMonth()+1,
        dd = currentTime.getDate();
    if (dd < 10) dd='0'+dd;
    if (mm < 10) mm='0'+mm;
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    var uid_s = localStorage.uuid + currentTime.getFullYear() + mm + dd + hours + minutes + seconds + String(parseInt(Math.random()*1000));
    return uid_s;
}

getID = function() {
    var currentTime = new Date();
    var mm = currentTime.getMonth()+1,
        dd = currentTime.getDate();
    if (dd < 10) dd='0'+dd;
    if (mm < 10) mm='0'+mm;
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    var id_s = localStorage.uuid + currentTime.getFullYear() + mm + dd + hours + minutes + seconds;
    return id_s;
}

function uuid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

escapeString = function(JSStr) {
    var escapedJSString = JSStr.replace("\"", "\\\"");
    escapedJSString = JSStr.replace("'", "''");
    return escapedJSString;
}

updateData = function(valid,tableID,tableIDValue,tableName,keyID,keyValue,callback) {
    if (!valid) return;
    if (keyID != "fdaID") fieldTS = keyID+"TS='"+getDateTime()+"',";
    else fieldTS = "";
    db.transaction(function(tx) {
        tx.executeSql("UPDATE "+tableName+" set "+keyID+"=?,"+fieldTS+" TS=null WHERE "+tableID+" = ?",[safeEncode(keyValue),safeEncode(tableIDValue)],
                      function(){
                          if (callback) callback();
                      });		
    });
}

/* enhance $.getScript to handle multiple scripts */
var getScript = jQuery.getScript;
jQuery.getScript = function( resources, callback ) {
    
    var // reference declaration &amp; localization
    length = resources.length,
        handler = function() { counter++; },
        deferreds = [],
        counter = 0,
        idx = 0;
    
    for ( ; idx < length; idx++ ) {
        deferreds.push(
            getScript( "js/"+resources[ idx ], handler )
        );
    }
    
    jQuery.when.apply( null, deferreds ).then(function() {
        callback && callback();
    });
};

changePage = function(page, scripts) {
    //$("#shutter").css("display","block");
    $( "#pageContainer" ).load( page+" #page", function(){
        $.getScript(scripts, function( data, textStatus, jqxhr ) {
            //FastClick.attach(document.body);
        });
        
    });
}

/*
loadDD = function(node,tableName,key,value,where,readable) {
    var list = '';
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM "+tableName+" WHERE "+where+" ORDER BY "+value+" ASC", [],
        function(tx, rs) {
            for (var i=0; i < rs.rows.length; i++){
            	row = rs.rows.item(i);
                list += '<option value="'+row[key]+'">'+safeDecode(row[value])+'</option>';
				//$("#"+node).append('<option value="'+row[key]+'">'+safeDecode(row[value])+'</option>');
			}
            //$("#loading").append(readable+" Loaded<br/>");
            ddLists[node] = list;
        },
        function(){
			alert(readable+" error");
		});
    });
};
*/

rs2arr = function(rs) {
    var arr = [];
    for (var i=0, l=rs.rows.length; i < l; i++) arr.push(rs.rows.item(i));
    return arr;
}

gotoLogin = function(){
    deleteObsoleteReports();
    changePage("login.html", ["login.js"]);
    heartBeat(false,-1,0);
}

autoComp = function() {
    var today = getDate();
    db.transaction(function(tx) {
        // users -------------------------------------------------------------
        tx.executeSql("SELECT userID,userName,userEmail FROM datacenterUsers WHERE active = 1 AND userValidFrom <= '"+today+"' AND userValidTo >= '"+today+"' AND userRoles LIKE '%"+userRolePrefix+"fda%' ORDER BY userName ASC", [],
                      function(tx, rs) {
                          for (var i=0, l=rs.rows.length; i < l; i++) {
                              var node = {};
                              node.userID = rs.rows.item(i).userID;
                              node.userName = rs.rows.item(i).userName;
                              node.userEmail = rs.rows.item(i).userEmail;
                              usersL.push(node);
                          }
                      },
                      function(){
                          alert("Error parsing users");
                      });
        // prepared by -------------------------------------------------------------
        tx.executeSql("SELECT userID,userName FROM datacenterUsers WHERE active = 1 AND userRoles LIKE '%"+userRolePrefix+"fdatallyclerk%' ORDER BY userName ASC", [],
                      function(tx, rs) {
                          preparedByL = rs2arr(rs);
                          $("#loading").append("Prepared by loaded<br/>");
                      },
                      function(){
                          alert("Error parsing prepared by");
                      });
        // checked by -------------------------------------------------------------
        tx.executeSql("SELECT userID,userName FROM datacenterUsers WHERE active = 1 AND userRoles LIKE '%"+userRolePrefix+"fdasupervisor%' ORDER BY userName ASC", [],
                      function(tx, rs) {
                          checkedByL = rs2arr(rs);
                          $("#loading").append("Checked by loaded<br/>");
                      },
                      function(){
                          alert("Error parsing checked by");
                      });
        // base superintendent -------------------------------------------------------------
        tx.executeSql("SELECT userID,userName FROM datacenterUsers WHERE active = 1 AND userRoles LIKE '%"+userRolePrefix+"fdabasesuperintendent%' ORDER BY userName ASC", [],
                      function(tx, rs) {
                          baseSupL = rs2arr(rs);
                          $("#loading").append("Base Superintendents loaded<br/>");
                      },
                      function(){
                          alert("Error parsing base superintendents");
                      });
        // client approval -------------------------------------------------------------
        tx.executeSql("SELECT userID,userName FROM datacenterUsers WHERE active = 1 AND userRoles LIKE '%"+userRolePrefix+"fdabaseclient%' ORDER BY userName ASC", [],
                      function(tx, rs) {
                          clientApprL = rs2arr(rs);
                          $("#loading").append("Client approval loaded<br/>");
                      },
                      function(){
                          alert("Error parsing client approval");
                      });
        // Activity type  -------------------------------------------------------------
        tx.executeSql("SELECT actTypeID,actTypeDesc FROM actTypes WHERE active = 1 AND repTypeID = 'PCC' ORDER by actTypeDesc ASC ;", [],
                      function(tx, rs) {
                          actTypeL = rs2arr(rs);
                          $("#loading").append("Activity types loaded<br/>");
                      },
                      function(){
                          alert("Error parsing activity types");
                      });
        // Cargo Config Code  -------------------------------------------------------------
        tx.executeSql("SELECT cccID,cccDesc FROM ccc WHERE active = 1 ORDER by cccDesc ASC ;", [],
                      function(tx, rs) {
                          cccL = rs2arr(rs);
                          $("#loading").append("Cargo Config Code loaded<br/>");
                      },
                      function(){
                          alert("Error parsing Cargo Config Code");
                      });     
        // Cargo Status  -------------------------------------------------------------
        tx.executeSql("SELECT cargoStatusID,cargoStatusDesc FROM cargoStatus WHERE active = 1 ORDER by cargoStatusDesc ASC ;", [],
                      function(tx, rs) {
                          cargoStatusL = rs2arr(rs);
                          $("#loading").append("Cargo Status loaded<br/>");
                      },
                      function(){
                          alert("Error parsing Cargo Status");
                      });           
        // Containers  -------------------------------------------------------------
        tx.executeSql("SELECT containerID,containerDesc,containerWidth,containerLength,containerHeight,containerCBM FROM containers WHERE active = 1 ORDER by containerDesc ASC ;", [],
                      function(tx, rs) {
                          containersL = rs2arr(rs);
                          $("#loading").append("Containers loaded<br/>");
                      },
                      function(){
                          alert("Error parsing Containers");
                      });         
        // vessels  -------------------------------------------------------------
        tx.executeSql("SELECT IMO,vesselName FROM vessels WHERE active = 1 AND section = 'Offshore' ORDER by vesselName ASC ;", [],
                      function(tx, rs) {
                          vesselsL = rs2arr(rs);
                          $("#loading").append("Vessels loaded<br/>");
                      },
                      function(){
                          alert("Error parsing Vessels");
                      });    
        // origDest  -------------------------------------------------------------
        tx.executeSql("SELECT distinct(origDestName) FROM origDest WHERE active = 1 AND clientID IN ("+clientID+") ORDER by origDestName ASC ;", [],
                      function(tx, rs) {
                          origDestL = rs2arr(rs);
                          $("#loading").append("Origin and Destinations loaded<br/>");
                      },
                      function(){
                          alert("Error parsing Origin and Destinations");
                      }); 
        // locations  -------------------------------------------------------------
        tx.executeSql("SELECT locationID,locationName FROM locations WHERE active = 1 ORDER by locationName ASC ;", [],
                      function(tx, rs) {
                          locationsL = rs2arr(rs);
                          $("#loading").append("Locations loaded<br/>");
                      },
                      function(){
                          alert("Error parsing Locations");
                      });
        // suppliers  -------------------------------------------------------------
        tx.executeSql("SELECT supplierID,supplierName FROM suppliers WHERE section = 'Offshore' AND active = 1 ORDER by supplierName ASC ;", [],
                      function(tx, rs) {
                          suppliersL = rs2arr(rs);
                          $("#loading").append("Suppliers loaded<br/>");
                      },
                      function(){
                          alert("Error parsing Suppliers");
                      });
        // clients  -------------------------------------------------------------
        tx.executeSql("SELECT clientID,clientName FROM clients WHERE active = 1 ORDER by clientName ASC ;", [],
                      function(tx, rs) {
                          clientsL = rs2arr(rs);
                          $("#loading").append("Clients loaded<br/>");
                      },
                      function(){
                          alert("Error parsing Clients");
                      });
        // projects  -------------------------------------------------------------
        tx.executeSql("SELECT projID,projName FROM projs WHERE active = 1 ORDER by projName ASC ;", [],
                      function(tx, rs) {
                          projsL = rs2arr(rs);
                          $("#loading").append("Projects loaded<br/>");
                      },
                      function(){
                          alert("Error parsing Projects");
                      });
        // blocks  -------------------------------------------------------------
        tx.executeSql("SELECT blockID,blockName FROM blocks WHERE active = 1 ORDER by blockName ASC ;", [],
                      function(tx, rs) {
                          blocksL = rs2arr(rs);
                          $("#loading").append("Blocks loaded<br/>");
                      },
                      function(){
                          alert("Error parsing Blocks");
                      });
        // fields  -------------------------------------------------------------
        tx.executeSql("SELECT fieldID,fieldName FROM fields WHERE active = 1 ORDER by fieldName ASC ;", [],
                      function(tx, rs) {
                          fieldsL = rs2arr(rs);
                          $("#loading").append("Fields loaded<br/>");
                      },
                      function(){
                          alert("Error parsing Fields");
                      });
        // wells  -------------------------------------------------------------
        tx.executeSql("SELECT wellID, wellName FROM wells WHERE active = 1 ORDER by wellName ASC ;", [],
                      function(tx, rs) {
                          wellsL = rs2arr(rs);
                          $("#loading").append("Wells loaded<br/>");
                      },
                      function(){
                          alert("Error parsing Wells");
                      });
        // non dedicated equipments  -------------------------------------------------------------
        tx.executeSql("SELECT eqTypeID,eqTypeDesc || ' ( ' || eqTypeID || ' )' as eqTypeDesc FROM eqTypes WHERE active = 1 AND dedicatedClientID IS NULL OR dedicatedClientID = '' ORDER by eqTypeDesc ASC", [],
                      function(tx, rs) {
                          eqTypesL = rs2arr(rs);
                          $("#loading").append("Non dedicated equipments loaded<br/>");
                      }, 
                      function(){
                          alert("Error parsing non dedicated equipments");
                      });
        // dedicated equipments  -------------------------------------------------------------
        tx.executeSql("SELECT eqTypeID,eqTypeDesc || ' ( ' || eqTypeID || ' )' as eqTypeDesc FROM eqTypes WHERE active = 1  AND dedicatedClientID IN (" + clientID + ") ORDER by eqTypeDesc ASC", [],
                      function(tx, rs) {
                          eqDedicTypesL = rs2arr(rs);
                          $("#loading").append("Dedicated equipments loaded<br/>");
                          gotoLogin();
                      }, 
                      function(){
                          alert("Error parsing dedicated equipments");
                      });
        // entities  -------------------------------------------------------------
        tx.executeSql("SELECT entityID,entityName FROM entities WHERE active = 1 ORDER by entityName ASC", [],
                      function(tx, rs) {
                          entitiesL = rs2arr(rs);
                          $("#loading").append("Entities loaded<br/>");
                          gotoLogin();
                      }, 
                      function(){
                          alert("Error parsing entities");
                      });
    });
};

/*
loadMixedDD = function(node,tableName,key,value,where,readable) {
    var list = '<option value="">Make a selection</option>';
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM "+tableName+" WHERE "+where+" ORDER BY "+key+" ASC", [],
        function(tx, rs) {
            for (var i=0; i < rs.rows.length; i++){
            	row = rs.rows.item(i);
                list += '<option value="'+row[key]+'">'+row[key]+' : '+safeDecode(row[value])+'</option>';
				//$("#"+node).append('<option value="'+row[key]+'">'+safeDecode(row[value])+'</option>');
			}
            $("#loading").append(readable+" Loaded<br/>");
            ddLists[node] = list;
        },
        function(){
			alert(readable+" error");
		});
    });
};
*/

showShutter = function() {
    $("#shutter").css("display","block");
}

hideShutter = function() {
    $("#shutter").css("display","none");
    $("#loading").empty();
}

onBackKeyDown = function() {
}

/*
userLevel2 = function(enabled) {
    if (enabled != null && enabled.length == 19) return "";
    if (localStorage.userLevel == 2) $('.userLevel2').css('display','inline-block');
}

userLevel3 = function(enabled) {
    if (enabled != null && enabled.length == 19) return "";
    if (localStorage.userLevel == 3) $('.userLevel3').css('display','inline-block');
}
*/

userLevel = function(enabled) {
    if (enabled != null && enabled.length == 19) return "";
    if (localStorage.userLevel == 4) $('.userLevel4').css('display','inline-block');
    if (localStorage.userLevel == 3) $('.userLevel3').css('display','inline-block');
    if (localStorage.userLevel == 2) $('.userLevel2').css('display','inline-block');
    if (localStorage.userLevel == 1) $('.userLevel1').css('display','inline-block');
    if (localStorage.userLevel == 0) $('.userLevel0').css('display','none');
}

inputLevel = function(enabled) {
    if (enabled != null && enabled.length == 19) return "";
    if (localStorage.userLevel == 4) $('.inputLevel4').prop( "disabled",false );
    if (localStorage.userLevel == 3) $('.inputLevel3').prop( "disabled",false );
    if (localStorage.userLevel == 2) $('.inputLevel2').prop( "disabled",false );
    if (localStorage.userLevel == 1) $('.inputLevel1').prop( "disabled",false );
}

newActivity = function() {
    var r=confirm("Create a new activity?");
    if (r==false) return;
    showShutter();
    var today_dt = getDateTime(),
        today_d = getDate();
    
    actID = getID();
    //TODO add into recordLog
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO activities(actID, fdaID, active,TS) VALUES (?,?,1,NULL)",
                      [actID,localStorage.fdaID],
                      function(tx, rs){
                          db.transaction(function(tx) {
                              tx.executeSql("UPDATE reports SET startDate = ?, startDateTS = ?, TS = NULL WHERE fdaID = ? and startDate IS NULL",
                                            [today_dt,today_dt,localStorage.fdaID],
                                            function(tx, rs){},
                                            function(){});
                              tx.executeSql("UPDATE reports SET servDate = ?, servDateTS = ?, TS = NULL WHERE fdaID = ?",
                                            [today_d,today_dt,localStorage.fdaID],
                                            function(tx, rs){},
                                            function(){});
                          });
                          localStorage.actID = actID;
                          changePage("activity-measure.html",['activity-measure.js']);
                      },
                      function(tx, error){
                          alert("Error: "+err.message);
                      });
    });
}

deleteObsoleteReports = function() {
    db.transaction(function(tx) {
        // deleting old activities
        tx.executeSql("DELETE FROM activities WHERE fdaID IN (SELECT fdaID FROM reports WHERE reports.endDate IS NOT NULL AND reports.servDate < DATE('now', '-30 days'));", [],
            function(tx, rs) {},
            function(){});
        // deleting old reports
        tx.executeSql("DELETE FROM reports WHERE reports.endDate IS NOT NULL AND reports.servDate < DATE('now', '-30 days');", [],
            function(tx, rs) {},
            function(){});
    });
}

/*
decServDate = function() {
	var servDate = new Date(localStorage.servDate);
	servDate.setDate(servDate.getDate() - 1);
	var mm = servDate.getMonth()+1,
	dd = servDate.getDate();
	if (dd < 10) dd='0'+dd;
	if (mm < 10) mm='0'+mm;
	localStorage.servDate = servDate.getFullYear()+"-"+mm+"-"+dd;
    $("#servDate").text(localStorage.servDate);
    terminalWorker.postMessage({'cmd': 'renderReportsList', 'param': [localStorage.servDate]});
	//changePage("report-list.html",["report-list.js"]);
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
    terminalWorker.postMessage({'cmd': 'renderReportsList', 'param': [localStorage.servDate]});
	//changePage("report-list.html",["report-list.js"]);
}

*/
// Worker ******************************************************************************************


// library main body

// library body ************************************************************************************

var db,
    op = 0, //operations
    queue = new Array(),
    queueProcessing = false,
    processedTables = 0,
    //clientID = "C10151",
    //ddLists = [],
    value = '',
    usersL = [],
    preparedByL,
    checkedByL,
    baseSupL,
    clientApprL,
    actTypeL,
    cccL,
    cargoStatusL,
    containersL,
    vesselsL,
    origDestL,
    locationsL,
    suppliersL,
    clientsL,
    projsL,
    blocksL,
    fieldsL,
    eqTypesL;

// adds the logo in the loading page
$("img.companyLogo").attr("src", companyLogo);

document.addEventListener("deviceready", function () { 
    //$(document).ready( function () {
    
    openDb();
    createTables();
    
    /*
    $.ajax({
        type: "GET",
        url: baseUrl+"/2/test",
        data: '',
        success: function(data){
            $("#version").append("Internal OIWA network<br/><br/>");
            openDb();
            createTables();
        },
        error: function(data){
            $("#version").append("Public network<br/><br/>");
            baseUrl = "http://196.6.190.46/datacenter_fda";
            openDb();
            createTables();
        },
        dataType: "json"
    });
    */
    //FastClick.attach(document.body);
    localStorage.servDate = getDate();
    localStorage.uuid = device.uuid;
    /*$("#loading").append("Starting background services<br/>");
	terminalWorker = new Worker("js/worker.js");
    terminalWorker.onmessage=function(event){
        render = safeDecode(event.data.value);
        //if (event.data.id == "worker") $("#worker").append(event.data.value);
        //else 
            $("#"+event.data.id).empty().html(render);
        if (event.data.hs) hideShutter();
    };*/
    //loadDD("clientIDDD","clients","clientID","clientName","1","Clients");
    //loadDD("userID","users","userID","userName","1","Users");
    //loadDD("preparedByDD","users","userID","userName","userLevel = 1","Prepared By Users");
    //loadDD("checkedByDD","users","userID","userName","userLevel = 2","Checked By Users");
    //loadDD("baseSupDD","users","userID","userName","userLevel = 3","Base Superintendent Users");
    //loadDD("clientApprDD","users","userID","userName","userLevel = 4","Client Approvals Users");
    //loadMixedDD("cccIDDD","ccc","cccID","cccDesc","1","CCC");
    //loadDD("cargoStatusIDDD","cargoStatus","cargoStatusID","cargoStatusDesc","1","Cargo Status");
    //loadDD("containerIDDD","containers","containerID","containerDesc","1","Containers");
    //loadDD("baseIDDD","origDest","origDestName","origDestName","1","Origins and Destinations");
    //loadDD("locationIDDD","locations","locationID","locationID","1","Locations"); 
    //loadDD("vesselsDD","vessels","IMO","vesselName","1","Vessels"); 
    //loadDD("supplierIDDD","suppliers","supplierID","supplierName","1","Suppliers");     
    //loadDD("tpspIDDD","tpsp","tpspID","tpspName","1","TPSP"); 
    //loadDD("projIDDD","projs","projID","projName","1","Projects");  
    //loadDD("blockIDDD","blocks","blockID","blockName","1","Blocks"); 
    //loadDD("fieldIDDD","fields","fieldID","fieldName","1","Fields"); 
    //changePage("login.html", ["login.js"]);
    //hub(false);
});

// funzione per la gestione delle checkbox con le glyphicon di bootstrap
function updateCheckbox(span) {
    // ricevo lo span e cerco la checkbox nascosta che utilizzo per memorizzare il dato
    var $span = $(span);
    var $check = $span.find(":checkbox");
    // se è selezionata va deselezionata
    if ($check.attr("checked") == "checked") {
        // deseleziono la checkbox
        $check.removeAttr("checked");
        // modifico la glyphicon
        $span.removeClass("glyphicon-check");
        $span.addClass("glyphicon-unchecked");
    // altrimenti va selezionata
    } else {
        // seleziono la checkbox
        $check.attr("checked", "checked");
        // modifico la glyphicon
        $span.removeClass("glyphicon-unchecked");
        $span.addClass("glyphicon-check");
    }
}

// funzione per aggiungere la cancellazione alle selectize singole
function addSelectizeRmButton() {
	// hack per le selectize e la nuova versione di Android
	var rm_button = document.createElement("span");
	$(rm_button).addClass("glyphicon");
	$(rm_button).addClass("glyphicon-remove");
	$(rm_button).addClass("selectize-remove-button");
	$(rm_button).bind('click', function () {
        // se e' disabilitata esco subito senza fare niente
        if ($(this).prev()[0].selectize.isDisabled) return;
        var message = "Do you really want to clear this field?";
        if (confirm (message))
            $(this).prev()[0].selectize.clear();
	});
	$(rm_button).insertAfter(".selectized:not([disabled])");
}

// funzione che aggiorna le activities sulla base di quelle dell'SBS
updateActivitiesFromSBS = function (fdaIDPCC, callback) {
    // ricavo le attività correlate presenti, non ancora copiate
    db.transaction (function (tx) {
        var query = "SELECT r.AssistID AS reportAssistID, a.* FROM activitiesSBS_related_PCC a "
            + "INNER JOIN reports r ON (a.fdaIDPCC = r.fdaID) "  
            + "WHERE fdaIDPCC = ? AND r.endDate IS NULL AND actID NOT IN "
            + "(SELECT DISTINCT actID_SBS FROM activities WHERE fdaID = ? AND actID_SBS IS NOT NULL)";
        tx.executeSql (query, [fdaIDPCC, fdaIDPCC], function (tx, r) {
            // copio le attività
            for (var i = 0; i < r.rows.length; i ++) {
                // clono l'attività, altrimenti non modificabile
                var act = JSON.parse(JSON.stringify(r.rows.item(i)));
                // setto l'actID dell'SBS da cui viene copiata, per tracciabilità
                act.actID_SBS = act.actID;
                // referenzio correttamente la nuova attività al PCC
                // setto l'fdaID del PCC
                act.fdaID = act.fdaIDPCC;
                // creo un nuovo id per l'attività
                act.actID = uuid();
                // resetto i dati relativi all'SBS
                act.actTypeID = '';
                act.fromBaseID = '';
                act.toBaseID = '';
                // aggiungo ai remarks un commento per capire che è stata copiata da un SBS
                act.comms += ' (copied from SBS)';
                // resetto tutti i TS
                for (var k in act) {
                    if (k.substr(-2) == 'TS') {
                        act[k] = getDateTime();
                    }
                }
                // aggiungo l'AssistID dai dati del report
                act.AssistID = act.reportAssistID;
                act.AssistIDTS = getDateTime();
                delete act.reportAssistID;
                // imposto il TS a null per inviarlo al server
                act.TS = null;
                // cancello i riferimenti al PCC, non più necessari
                delete act.fdaIDPCC;
                var joJnPCC = act.joJnPCC; // me la salvo che la uso dopo
                delete act.joJnPCC;
                // inserisco l'attività
                insertActivities(act, tx);
            }

            // se maggiore di zero aggiorno la startDate
            // (solo se startDate nulla in modo da non sovrascriverla se già popolata)
            if (r.rows.length > 0) {
              var startDateUpdate = "UPDATE reports SET startDate = ?, startDateTS = ?, TS = null "
                + "WHERE fdaID = ? AND startDate IS NULL";
              tx.executeSql (startDateUpdate, [getDateTime(), getDateTime(), fdaIDPCC], function (tx, r) {}, function (tx, err) { console.log(err); });
              // aggiorno anche la servDate
              var servDateUpdate = "UPDATE reports SET servDate = ?, servDateTS = ?, TS = null "
                + "WHERE fdaID = ?";
              tx.executeSql (servDateUpdate, [getDate(), getDateTime(), fdaIDPCC], function (tx, r) {}, function (tx, err) { console.log(err); });
            }

            if (callback) {
                callback();
            }

        }, function (tx, e) {
            alert("Error in retrieving SBS activities\n" + e.message);
        });
    });
}
