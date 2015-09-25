//Simple Sync Protocol

var //page = -1, //pagina corrente delle richieste al database
    timer = 100, // millisecondi tra una chiamata e l'altra di hub
    //op = 0, // Indice dell'operazione corrente nell'hub
    idName = "",
    actualTS = '1970-01-01 01:00:00';

Array.prototype.diff = function(b,id) {
    var bid = {}
    b.forEach(function(obj){
        bid[obj[id]] = bid;
    });
    return this.filter(function(obj){
        return !(obj[id] in bid);
    });
};

/*
function respSplit(response) {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        responseParams = {};
    while (match = search.exec(response))
        responseParams[decode(match[1])] = decode(match[2]);
    return responseParams;
}
*/

// heartBeat ------------------------------------------------------------------------------

function heartBeat(next,page,op) {
    if (next) { 
        op++;
        page = 0;
    } else page++;
    if (op > 8) op = 0;
    //console.info(op+" "+page+" "+msg);
    setTimeout(function() {
        switch (op) {
            case 0:
                getData("reports","fdaID",page,op);
                break;
            case 1:
                putLocalUpdates("reports","fdaID",page,op);
                break;
            case 2:
                getData("activities","actID",page,op);
                break;   
            case 3:
                putLocalUpdates("activities","actID",page,op);
                break;  
            case 4:
                getData("pics","picID",page,op);
                break;   
            case 5:
                putLocalUpdates("pics","picID",page,op);
                break;
            case 6:
                getData("reports_reopen","fdaID",page,op);
                break;
            case 7:
                putLocalUpdates("reports_reopen","fdaID",page,op);
                break; 
            case 8:
                getData("activitiesSBS_related_PCC","actID",page,op);
                timer = 500;
                break; 
        };
    },timer);
}

function updateReports(row,tx) {
    //db.transaction(function(tx) {
        tx.executeSql("UPDATE reports SET \
servDate = CASE WHEN (servDateTS < ? OR servDateTS IS NULL) THEN ? ELSE servDate END, \
servDateTS = CASE WHEN (servDateTS < ? OR servDateTS IS NULL) THEN ? ELSE servDateTS END, \
joJn = CASE WHEN (joJnTS < ? OR joJnTS IS NULL) THEN ? ELSE joJn END, \
joJnTS = CASE WHEN (joJnTS < ? OR joJnTS IS NULL) THEN ? ELSE joJnTS END, \
manType = CASE WHEN (manTypeTS < ? OR manTypeTS IS NULL) THEN ? ELSE manType END, \
manTypeTS = CASE WHEN (manTypeTS < ? OR manTypeTS IS NULL) THEN ? ELSE manTypeTS END, \
manNo = CASE WHEN (manNoTS < ? OR manNoTS IS NULL) THEN ? ELSE manNo END, \
manNoTS = CASE WHEN (manNoTS < ? OR manNoTS IS NULL) THEN ? ELSE manNoTS END, \
bookNo = CASE WHEN (bookNoTS < ? OR bookNoTS IS NULL) THEN ? ELSE bookNo END, \
bookNoTS = CASE WHEN (bookNoTS < ? OR bookNoTS IS NULL) THEN ? ELSE bookNoTS END, \
callNo = CASE WHEN (callNoTS < ? OR callNoTS IS NULL) THEN ? ELSE callNo END, \
callNoTS = CASE WHEN (callNoTS < ? OR callNoTS IS NULL) THEN ? ELSE callNoTS END, \
BOL = CASE WHEN (BOLTS < ? OR BOLTS IS NULL) THEN ? ELSE BOL END, \
BOLTS = CASE WHEN (BOLTS < ? OR BOLTS IS NULL) THEN ? ELSE BOLTS END, \
clientID = CASE WHEN (clientIDTS < ? OR clientIDTS IS NULL) THEN ? ELSE clientID END, \
clientIDTS = CASE WHEN (clientIDTS < ? OR clientIDTS IS NULL) THEN ? ELSE clientIDTS END, \
startDate = CASE WHEN (startDateTS < ? OR startDateTS IS NULL) THEN ? ELSE startDate END, \
startDateTS = CASE WHEN (startDateTS < ? OR startDateTS IS NULL) THEN ? ELSE startDateTS END, \
endDate = CASE WHEN (endDateTS < ? OR endDateTS IS NULL) THEN ? ELSE endDate END, \
endDateTS = CASE WHEN (endDateTS < ? OR endDateTS IS NULL) THEN ? ELSE endDateTS END, \
vesselName = CASE WHEN (vesselNameTS < ? OR vesselNameTS IS NULL) THEN ? ELSE vesselName END, \
vesselNameTS = CASE WHEN (vesselNameTS < ? OR vesselNameTS IS NULL) THEN ? ELSE vesselNameTS END, \
preparedBy = CASE WHEN (preparedByTS < ? OR preparedByTS IS NULL) THEN ? ELSE preparedBy END, \
preparedByTS = CASE WHEN (preparedByTS < ? OR preparedByTS IS NULL) THEN ? ELSE preparedByTS END, \
checkedBy = CASE WHEN (checkedByTS < ? OR checkedByTS IS NULL) THEN ? ELSE checkedBy END, \
checkedByTS = CASE WHEN (checkedByTS < ? OR checkedByTS IS NULL) THEN ? ELSE checkedByTS END, \
baseSuperintendentsName = CASE WHEN (baseSuperintendentsNameTS < ? OR baseSuperintendentsNameTS IS NULL) THEN ? ELSE baseSuperintendentsName END, \
baseSuperintendentsNameTS = CASE WHEN (baseSuperintendentsNameTS < ? OR baseSuperintendentsNameTS IS NULL) THEN ? ELSE baseSuperintendentsNameTS END, \
clientsApprovalName = CASE WHEN (clientsApprovalNameTS < ? OR clientsApprovalNameTS IS NULL) THEN ? ELSE clientsApprovalName END, \
clientsApprovalNameTS = CASE WHEN (clientsApprovalNameTS < ? OR clientsApprovalNameTS IS NULL) THEN ? ELSE clientsApprovalNameTS END, \
clientsApprovalName2 = CASE WHEN (clientsApprovalName2TS < ? OR clientsApprovalName2TS IS NULL) THEN ? ELSE clientsApprovalName2 END, \
clientsApprovalName2TS = CASE WHEN (clientsApprovalName2TS < ? OR clientsApprovalName2TS IS NULL) THEN ? ELSE clientsApprovalName2TS END, \
entity = CASE WHEN (entityTS < ? OR entityTS IS NULL) THEN ? ELSE entity END, \
entityTS = CASE WHEN (entityTS < ? OR entityTS IS NULL) THEN ? ELSE entityTS END, \
clientsApprovalDT = CASE WHEN (clientsApprovalDTTS < ? OR clientsApprovalDTTS IS NULL) THEN ? ELSE clientsApprovalDT END, \
clientsApprovalDTTS = CASE WHEN (clientsApprovalDTTS < ? OR clientsApprovalDTTS IS NULL) THEN ? ELSE clientsApprovalDTTS END, \
clientSign = CASE WHEN (clientSignTS < ? OR clientSignTS IS NULL) THEN ? ELSE clientSign END, \
clientSignTS = CASE WHEN (clientSignTS < ? OR clientSignTS IS NULL) THEN ? ELSE clientSignTS END, \
custProjID = CASE WHEN (custProjIDTS < ? OR custProjIDTS IS NULL) THEN ? ELSE custProjID END, \
custProjIDTS = CASE WHEN (custProjIDTS < ? OR custProjIDTS IS NULL) THEN ? ELSE custProjIDTS END, \
ChargeCode = CASE WHEN (ChargeCodeTS < ? OR ChargeCodeTS IS NULL) THEN ? ELSE ChargeCode END, \
ChargeCodeTS = CASE WHEN (ChargeCodeTS < ? OR ChargeCodeTS IS NULL) THEN ? ELSE ChargeCodeTS END, \
active = CASE WHEN (activeTS < ? OR activeTS IS NULL) THEN ? ELSE active END, \
activeTS = CASE WHEN (activeTS < ? OR activeTS IS NULL) THEN ? ELSE activeTS END, \
TS = ? \
WHERE fdaID = ? AND TS IS NOT NULL;", [row.servDateTS,row.servDate,row.servDateTS,row.servDateTS,
                      row.joJnTS,row.joJn,row.joJnTS,row.joJnTS,
                      row.manTypeTS,row.manType,row.manTypeTS,row.manTypeTS,
                      row.manNoTS,row.manNo,row.manNoTS,row.manNoTS,
                      row.bookNoTS,row.bookNo,row.bookNoTS,row.bookNoTS,
                      row.callNoTS,row.callNo,row.callNoTS,row.callNoTS,
                      row.BOLTS,row.BOL,row.BOLTS,row.BOLTS,
                      row.clientIDTS,row.clientID,row.clientIDTS,row.clientIDTS,
                      row.startDateTS,row.startDate,row.startDateTS,row.startDateTS,
                      row.endDateTS,row.endDate,row.endDateTS,row.endDateTS,
                      row.vesselNameTS,row.vesselName,row.vesselNameTS,row.vesselNameTS,
                      row.preparedByTS,row.preparedBy,row.preparedByTS,row.preparedByTS,
                      row.checkedByTS,row.checkedBy,row.checkedByTS,row.checkedByTS,
                      row.baseSuperintendentsNameTS,row.baseSuperintendentsName,row.baseSuperintendentsNameTS,row.baseSuperintendentsNameTS,
                      row.clientsApprovalNameTS,row.clientsApprovalName,row.clientsApprovalNameTS,row.clientsApprovalNameTS,
                      row.clientsApprovalName2TS,row.clientsApprovalName2,row.clientsApprovalName2TS,row.clientsApprovalName2TS,
                      row.entityTS,row.entity,row.entityTS,row.entityTS,
                      row.clientsApprovalDTTS,row.clientsApprovalDT,row.clientsApprovalDTTS,row.clientsApprovalDTTS,
                      row.clientSignTS,row.clientSign,row.clientSignTS,row.clientSignTS,
                      row.custProjIDTS,row.custProjID,row.custProjIDTS,row.custProjIDTS,
                      row.ChargeCodeTS,row.ChargeCode,row.ChargeCodeTS,row.ChargeCodeTS,
                      row.activeTS,row.active,row.activeTS,row.activeTS,
                      row.TS,row.fdaID],
                      function (tx, results) {},
            function (tx, error) {
                alert("Error: "+error.message);
            }
        );
    //});
}

function insertReports(row,tx) {
    //db.transaction(function(tx) {
        tx.executeSql('INSERT OR IGNORE INTO reports(fdaID,axID,toRev,repTypeID,joJn,manType,manNo,bookNo,callNo,BOL,clientID,startDate,endDate,vesselName,servDate,preparedBy,checkedBy,baseSuperintendentsName,clientsApprovalName,clientsApprovalName2,entity,clientsApprovalDT,clientSign,custProjID,ChargeCode,active,repTypeIDTS,joJnTS,manTypeTS,manNoTS,bookNoTS,callNoTS,BOLTS,clientIDTS,servDateTS,startDateTS,endDateTS,vesselNameTS,preparedByTS,checkedByTS,baseSuperintendentsNameTS,clientsApprovalNameTS,clientsApprovalName2TS,entityTS,clientsApprovalDTTS,clientSignTS,custProjIDTS,ChargeCodeTS,activeTS,TS) \
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [row.fdaID,row.axID,row.toRev,row.repTypeID,row.joJn,row.manType,row.manNo,row.bookNo,row.callNo,row.BOL,row.clientID,row.startDate,row.endDate,row.vesselName,row.servDate,row.preparedBy,row.checkedBy,row.baseSuperintendentsName,row.clientsApprovalName,row.clientsApprovalName2,row.entity,row.clientsApprovalDT,row.clientSign,row.custProjID,row.ChargeCode,row.active,row.repTypeIDTS,row.joJnTS,row.manTypeTS,row.manNoTS,row.bookNoTS,row.callNoTS,row.BOLTS,row.clientIDTS,row.servDateTS,row.startDateTS,row.endDateTS,row.vesselNameTS,row.preparedByTS,row.checkedByTS,row.baseSuperintendentsNameTS,row.clientsApprovalNameTS,row.clientsApprovalName2TS,row.entityTS,row.clientsApprovalDTTS,row.clientSignTS,row.custProjIDTS,row.ChargeCodeTS,row.activeTS,row.TS], 
                      function (tx, results) {                                     },
            function (tx, error) {
                alert("Error: "+error.message);
            }
        );
    //});
}

function insertActivities(row,tx) {
    //db.transaction(function(tx) {
        tx.executeSql('INSERT OR IGNORE INTO activities(actID,actID_SBS,actAXID,fdaID,actTypeID,details,cccID, \
cargoStatusID,qty,height,length,width,mt,cbm,containerID,LoadedEmpty,custProjID,blockID,fieldID,well,ownerID,marks,site, \
warehouse,unit,manifestID,exVessel,toVessel,exTruck,toTruck,fromBaseID,toBaseID,locationID,eqTypes,eqDedicTypes,origin, \
supplierID,newSupplier,finalClientID,dedicTrk,dedicEq,comms,tpsp,tpwn,entityID,clonedFrom,toSBS,active,actTypeIDTS,detailsTS, \
cccIDTS,cargoStatusIDTS,qtyTS,heightTS,lengthTS,widthTS,mtTS,cbmTS,containerIDTS,LoadedEmptyTS,custProjIDTS,blockIDTS,fieldIDTS, \
wellTS,ownerIDTS,marksTS,siteTS,warehouseTS,unitTS,manifestIDTS,exVesselTS,toVesselTS,exTruckTS,toTruckTS, \
fromBaseIDTS,toBaseIDTS,locationIDTS,eqTypesTS,eqDedicTypesTS,originTS,supplierIDTS,newSupplierTS,finalClientIDTS, \
dedicTrkTS,dedicEqTS,commsTS,tpspTS,tpwnTS,entityIDTS,clonedFromTS,toSBSTS,activeTS,TS) \
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                      [row.actID,row.actID_SBS,row.actAXID,row.fdaID,row.actTypeID,row.details,row.cccID,row.cargoStatusID,row.qty,row.height,row.length,row.width,row.mt,row.cbm,row.containerID,row.LoadedEmpty,row.custProjID,row.blockID,row.fieldID,row.well,row.ownerID,row.marks,row.site,row.warehouse,row.unit,row.manifestID,row.exVessel,row.toVessel,row.exTruck,row.toTruck,row.fromBaseID,row.toBaseID,row.locationID,row.eqTypes,row.eqDedicTypes,row.origin,row.supplierID,row.newSupplier,row.finalClientID,row.dedicTrk,row.dedicEq,row.comms,row.tpsp,row.tpwn,row.entityID,row.clonedFrom,row.toSBS,row.active,row.actTypeIDTS,row.detailsTS,row.cccIDTS,row.cargoStatusIDTS,row.qtyTS,row.heightTS,row.lengthTS,row.widthTS,row.mtTS,row.cbmTS,row.containerIDTS,row.LoadedEmptyTS,row.custProjIDTS,row.blockIDTS,row.fieldIDTS,row.wellTS,row.ownerIDTS,row.marksTS,row.siteTS,row.warehouseTS,row.unitTS,row.manifestIDTS,row.exVesselTS,row.toVesselTS,row.exTruckTS,row.toTruckTS,row.fromBaseIDTS,row.toBaseIDTS,row.locationIDTS,row.eqTypesTS,row.eqDedicTypesTS,row.originTS,row.supplierIDTS,row.newSupplierTS,row.finalClientIDTS,row.dedicTrkTS,row.dedicEqTS,row.commsTS,row.tpspTS,row.tpwnTS,row.entityIDTS,row.clonedFromTS,row.toSBSTS,row.activeTS,row.TS], 
                      function (tx, results) {
            //var i =1;
        },
            function (tx, error) {
                alert("Error: "+error.message);
            }
        );
    //});
}

function updateActivities(row,tx) {
    //db.transaction(function(tx) {
        tx.executeSql("UPDATE activities SET \
fdaID = ?, \
actTypeID = CASE WHEN (actTypeIDTS < ? OR actTypeIDTS IS NULL) THEN ? ELSE actTypeID END, \
actTypeIDTS = CASE WHEN (actTypeIDTS < ? OR actTypeIDTS IS NULL) THEN ? ELSE actTypeIDTS END, \
details = CASE WHEN (detailsTS < ?  OR  detailsTS IS NULL) THEN ? ELSE details END, \
detailsTS = CASE WHEN (detailsTS < ? OR detailsTS IS NULL) THEN ? ELSE detailsTS END, \
cccID = CASE WHEN (cccIDTS < ? OR cccIDTS IS NULL) THEN ? ELSE cccID END, \
cccIDTS = CASE WHEN (cccIDTS < ? OR cccIDTS IS NULL) THEN ? ELSE cccIDTS END, \
cargoStatusID = CASE WHEN (cargoStatusIDTS < ? OR cargoStatusIDTS IS NULL) THEN ? ELSE cargoStatusID END, \
cargoStatusIDTS = CASE WHEN (cargoStatusIDTS < ? OR cargoStatusIDTS IS NULL) THEN ? ELSE cargoStatusIDTS END, \
qty = CASE WHEN (qtyTS < ? OR qtyTS IS NULL) THEN ? ELSE qty END, \
qtyTS = CASE WHEN (qtyTS < ? OR qtyTS IS NULL) THEN ? ELSE qtyTS END, \
height = CASE WHEN (heightTS < ? OR heightTS IS NULL) THEN ? ELSE height END, \
heightTS = CASE WHEN (heightTS < ? OR heightTS IS NULL) THEN ? ELSE heightTS END, \
length = CASE WHEN (lengthTS < ? OR lengthTS IS NULL) THEN ? ELSE length END, \
lengthTS = CASE WHEN (lengthTS < ? OR lengthTS IS NULL) THEN ? ELSE lengthTS END, \
width = CASE WHEN (widthTS < ? OR widthTS IS NULL) THEN ? ELSE width END, \
widthTS = CASE WHEN (widthTS < ? OR widthTS IS NULL) THEN ? ELSE widthTS END, \
mt = CASE WHEN (mtTS < ? OR mtTS IS NULL) THEN ? ELSE mt END, \
mtTS = CASE WHEN (mtTS < ? OR mtTS IS NULL) THEN ? ELSE mtTS END, \
cbm = CASE WHEN (cbmTS < ? OR cbmTS IS NULL) THEN ? ELSE cbm END, \
cbmTS = CASE WHEN (cbmTS < ? OR cbmTS IS NULL) THEN ? ELSE cbmTS END, \
containerID = CASE WHEN (containerIDTS < ? OR containerIDTS IS NULL) THEN ? ELSE containerID END, \
containerIDTS = CASE WHEN (containerIDTS < ? OR containerIDTS IS NULL) THEN ? ELSE containerIDTS END, \
LoadedEmpty = CASE WHEN (LoadedEmptyTS < ? OR LoadedEmptyTS IS NULL) THEN ? ELSE LoadedEmpty END, \
LoadedEmptyTS = CASE WHEN (LoadedEmptyTS < ? OR LoadedEmptyTS IS NULL) THEN ? ELSE LoadedEmptyTS END, \
custProjID = CASE WHEN (custProjIDTS < ? OR custProjIDTS IS NULL) THEN ? ELSE custProjID END, \
custProjIDTS = CASE WHEN (custProjIDTS < ? OR custProjIDTS IS NULL) THEN ? ELSE custProjIDTS END, \
blockID = CASE WHEN (blockIDTS < ? OR blockIDTS IS NULL) THEN ? ELSE blockID END, \
blockIDTS = CASE WHEN (blockIDTS < ? OR blockIDTS IS NULL) THEN ? ELSE blockIDTS END, \
fieldID = CASE WHEN (fieldIDTS < ? OR fieldIDTS IS NULL) THEN ? ELSE fieldID END, \
fieldIDTS = CASE WHEN (fieldIDTS < ? OR fieldIDTS IS NULL) THEN ? ELSE fieldIDTS END, \
well = CASE WHEN (wellTS < ? OR wellTS IS NULL) THEN ? ELSE well END, \
wellTS = CASE WHEN (wellTS < ? OR wellTS IS NULL) THEN ? ELSE wellTS END, \
ownerID = CASE WHEN (ownerIDTS < ? OR ownerIDTS IS NULL) THEN ? ELSE ownerID END, \
ownerIDTS = CASE WHEN (ownerIDTS < ? OR ownerIDTS IS NULL) THEN ? ELSE ownerIDTS END, \
marks = CASE WHEN (marksTS < ? OR marksTS IS NULL) THEN ? ELSE marks END, \
marksTS = CASE WHEN (marksTS < ? OR marksTS IS NULL) THEN ? ELSE marksTS END, \
site = CASE WHEN (siteTS < ? OR siteTS IS NULL) THEN ? ELSE site END, \
siteTS = CASE WHEN (siteTS < ? OR siteTS IS NULL) THEN ? ELSE siteTS END, \
warehouse = CASE WHEN (warehouseTS < ? OR warehouseTS IS NULL) THEN ? ELSE warehouse END, \
warehouseTS = CASE WHEN (warehouseTS < ? OR warehouseTS IS NULL) THEN ? ELSE warehouseTS END, \
unit = CASE WHEN (unitTS < ? OR unitTS IS NULL) THEN ? ELSE unit END, \
unitTS = CASE WHEN (unitTS < ? OR unitTS IS NULL) THEN ? ELSE unitTS END, \
manifestID = CASE WHEN (manifestIDTS < ? OR manifestIDTS IS NULL) THEN ? ELSE manifestID END, \
manifestIDTS = CASE WHEN (manifestIDTS < ? OR manifestIDTS IS NULL) THEN ? ELSE manifestIDTS END, \
exVessel = CASE WHEN (exVesselTS < ? OR exVesselTS IS NULL) THEN ? ELSE exVessel END, \
exVesselTS = CASE WHEN (exVesselTS < ? OR exVesselTS IS NULL) THEN ? ELSE exVesselTS END, \
toVessel = CASE WHEN (toVesselTS < ? OR toVesselTS IS NULL) THEN ? ELSE toVessel END, \
toVesselTS = CASE WHEN (toVesselTS < ? OR toVesselTS IS NULL) THEN ? ELSE toVesselTS END, \
exTruck = CASE WHEN (exTruckTS < ? OR exTruckTS IS NULL) THEN ? ELSE exTruck END, \
exTruckTS = CASE WHEN (exTruckTS < ? OR exTruckTS IS NULL) THEN ? ELSE exTruckTS END, \
toTruck = CASE WHEN (toTruckTS < ? OR toTruckTS IS NULL) THEN ? ELSE toTruck END, \
toTruckTS = CASE WHEN (toTruckTS < ? OR toTruckTS IS NULL) THEN ? ELSE toTruckTS END, \
fromBaseID = CASE WHEN (fromBaseIDTS < ? OR fromBaseIDTS IS NULL) THEN ? ELSE fromBaseID END, \
fromBaseIDTS = CASE WHEN (fromBaseIDTS < ? OR fromBaseIDTS IS NULL) THEN ? ELSE fromBaseIDTS END, \
toBaseID = CASE WHEN (toBaseIDTS < ? OR toBaseIDTS IS NULL) THEN ? ELSE toBaseID END, \
toBaseIDTS = CASE WHEN (toBaseIDTS < ? OR toBaseIDTS IS NULL) THEN ? ELSE toBaseIDTS END, \
locationID = CASE WHEN (locationIDTS < ? OR locationIDTS IS NULL) THEN ? ELSE locationID END, \
locationIDTS = CASE WHEN (locationIDTS < ? OR locationIDTS IS NULL) THEN ? ELSE locationIDTS END, \
eqTypes = CASE WHEN (eqTypesTS < ? OR eqTypesTS IS NULL) THEN ? ELSE eqTypes END, \
eqTypesTS = CASE WHEN (eqTypesTS < ? OR eqTypesTS IS NULL) THEN ? ELSE eqTypesTS END, \
eqDedicTypes = CASE WHEN (eqDedicTypesTS < ? OR eqDedicTypesTS IS NULL) THEN ? ELSE eqDedicTypes END, \
eqDedicTypesTS = CASE WHEN (eqDedicTypesTS < ? OR eqDedicTypesTS IS NULL) THEN ? ELSE eqDedicTypesTS END, \
origin = CASE WHEN (originTS < ? OR originTS IS NULL) THEN ? ELSE origin END, \
originTS = CASE WHEN (originTS < ? OR originTS IS NULL) THEN ? ELSE originTS END, \
supplierID = CASE WHEN (supplierIDTS < ? OR supplierIDTS IS NULL) THEN ? ELSE supplierID END, \
supplierIDTS = CASE WHEN (supplierIDTS < ? OR supplierIDTS IS NULL) THEN ? ELSE supplierIDTS END, \
newSupplier = CASE WHEN (newSupplierTS < ? OR newSupplierTS IS NULL) THEN ? ELSE newSupplier END, \
newSupplierTS = CASE WHEN (newSupplierTS < ? OR newSupplierTS IS NULL) THEN ? ELSE newSupplierTS END, \
finalClientID = CASE WHEN (finalClientIDTS < ? OR finalClientIDTS IS NULL) THEN ? ELSE finalClientID END, \
finalClientIDTS = CASE WHEN (finalClientIDTS < ? OR finalClientIDTS IS NULL) THEN ? ELSE finalClientIDTS END, \
dedicTrk = CASE WHEN (dedicTrkTS < ? OR dedicTrkTS IS NULL) THEN ? ELSE dedicTrk END, \
dedicTrkTS = CASE WHEN (dedicTrkTS < ? OR dedicTrkTS IS NULL) THEN ? ELSE dedicTrkTS END, \
dedicEq = CASE WHEN (dedicEqTS < ? OR dedicEqTS IS NULL) THEN ? ELSE dedicEq END, \
dedicEqTS = CASE WHEN (dedicEqTS < ? OR dedicEqTS IS NULL) THEN ? ELSE dedicEqTS END, \
comms = CASE WHEN (commsTS < ? OR commsTS IS NULL) THEN ? ELSE comms END, \
commsTS = CASE WHEN (commsTS < ? OR commsTS IS NULL) THEN ? ELSE commsTS END, \
tpsp = CASE WHEN (tpspTS < ? OR tpspTS IS NULL) THEN ? ELSE tpsp END, \
tpspTS = CASE WHEN (tpspTS < ? OR tpspTS IS NULL) THEN ? ELSE tpspTS END, \
tpwn = CASE WHEN (tpwnTS < ? OR tpwnTS IS NULL) THEN ? ELSE tpwn END, \
tpwnTS = CASE WHEN (tpwnTS < ? OR tpwnTS IS NULL) THEN ? ELSE tpwnTS END, \
entityID = CASE WHEN (entityIDTS < ? OR entityIDTS IS NULL) THEN ? ELSE entityID END, \
entityIDTS = CASE WHEN (entityIDTS < ? OR entityIDTS IS NULL) THEN ? ELSE entityIDTS END, \
clonedFrom = CASE WHEN (clonedFromTS < ? OR clonedFromTS IS NULL) THEN ? ELSE clonedFrom END, \
clonedFromTS = CASE WHEN (clonedFromTS < ? OR clonedFromTS IS NULL) THEN ? ELSE clonedFromTS END, \
toSBS = CASE WHEN (toSBSTS < ? OR toSBSTS IS NULL) THEN ? ELSE toSBS END, \
toSBSTS = CASE WHEN (toSBSTS < ? OR toSBSTS IS NULL) THEN ? ELSE toSBSTS END, \
active = CASE WHEN (activeTS < ? OR activeTS IS NULL) THEN ? ELSE active END, \
activeTS = CASE WHEN (activeTS < ? OR activeTS IS NULL) THEN ? ELSE activeTS END, \
TS = ? \
WHERE actID = ? AND TS IS NOT NULL;", [row.fdaID,
                      row.actTypeIDTS,row.actTypeID,row.actTypeIDTS,row.actTypeIDTS,
                      row.detailsTS,row.details,row.detailsTS,row.detailsTS,
                      row.cccIDTS,row.cccID,row.cccIDTS,row.cccIDTS,
                      row.cargoStatusIDTS,row.cargoStatusID,row.cargoStatusIDTS,row.cargoStatusIDTS,
                      row.qtyTS,row.qty,row.qtyTS,row.qtyTS,
                      row.heightTS,row.height,row.heightTS,row.heightTS,
                      row.lengthTS,row.length,row.lengthTS,row.lengthTS,
                      row.widthTS,row.width,row.widthTS,row.widthTS,
                      row.mtTS,row.mt,row.mtTS,row.mtTS,
                      row.cbmTS,row.cbm,row.cbmTS,row.cbmTS,
                      row.containerIDTS,row.containerID,row.containerIDTS,row.containerIDTS,
                      row.LoadedEmptyTS,row.LoadedEmpty,row.LoadedEmptyTS,row.LoadedEmptyTS,
                      row.custProjIDTS,row.custProjID,row.custProjIDTS,row.custProjIDTS,
                      row.blockIDTS,row.blockID,row.blockIDTS,row.blockIDTS,
                      row.fieldIDTS,row.fieldID,row.fieldIDTS,row.fieldIDTS,
                      row.wellTS,row.well,row.wellTS,row.wellTS,
                      row.ownerIDTS,row.ownerID,row.ownerIDTS,row.ownerIDTS,
                      row.marksTS,row.marks,row.marksTS,row.marksTS,
                      row.siteTS,row.site,row.siteTS,row.siteTS,
                      row.warehouseTS,row.warehouse,row.warehouseTS,row.warehouseTS,
                      row.unitTS,row.unit,row.unitTS,row.unitTS,
                      row.manifestIDTS,row.manifestID,row.manifestIDTS,row.manifestIDTS,
                      row.exVesselTS,row.exVessel,row.exVesselTS,row.exVesselTS,
                      row.toVesselTS,row.toVessel,row.toVesselTS,row.toVesselTS,
                      row.exTruckTS,row.exTruck,row.exTruckTS,row.exTruckTS,
                      row.toTruckTS,row.toTruck,row.toTruckTS,row.toTruckTS,
                      row.fromBaseIDTS,row.fromBaseID,row.fromBaseIDTS,row.fromBaseIDTS,
                      row.toBaseIDTS,row.toBaseID,row.toBaseIDTS,row.toBaseIDTS,
                      row.locationIDTS,row.locationID,row.locationIDTS,row.locationIDTS,
                      row.eqTypesTS,row.eqTypes,row.eqTypesTS,row.eqTypesTS,
                      row.eqDedicTypesTS,row.eqDedicTypes,row.eqDedicTypesTS,row.eqDedicTypesTS,
                      row.originTS,row.origin,row.originTS,row.originTS,
                      row.supplierIDTS,row.supplierID,row.supplierIDTS,row.supplierIDTS,
                      row.newSupplierTS,row.newSupplier,row.newSupplierTS,row.newSupplierTS,
                      row.finalClientIDTS,row.finalClientID,row.finalClientIDTS,row.finalClientIDTS,
                      row.dedicTrkTS,row.dedicTrk,row.dedicTrkTS,row.dedicTrkTS,
                      row.dedicEqTS,row.dedicEq,row.dedicEqTS,row.dedicEqTS,
                      row.commsTS,row.comms,row.commsTS,row.commsTS,
                      row.tpspTS,row.tpsp,row.tpspTS,row.tpspTS,
                      row.tpwnTS,row.tpwn,row.tpwnTS,row.tpwnTS,
                      row.entityIDTS,row.entityID,row.entityIDTS,row.entityIDTS,
                      row.clonedFromTS,row.clonedFrom,row.clonedFromTS,row.clonedFromTS,
                      row.toSBSTS,row.toSBS,row.toSBSTS,row.toSBSTS,
                      row.activeTS,row.active,row.activeTS,row.activeTS,
                      row.TS,row.actID],
                      function (tx, results) {},
            function (tx, error) {
                alert("Error: "+error.message);
            }
        );
    //});
}

function insertActivitiesSBS(row,tx) {
    //db.transaction(function(tx) {
        tx.executeSql('INSERT OR IGNORE INTO activitiesSBS_related_PCC(joJnPCC,fdaIDPCC,actID,actAXID,fdaID,actTypeID,details,cccID, \
cargoStatusID,qty,height,length,width,mt,cbm,containerID,LoadedEmpty,custProjID,blockID,fieldID,well,ownerID,marks,site, \
warehouse,unit,manifestID,exVessel,toVessel,exTruck,toTruck,fromBaseID,toBaseID,locationID,eqTypes,eqDedicTypes,origin, \
supplierID,newSupplier,finalClientID,dedicTrk,dedicEq,comms,tpsp,tpwn,entityID,active,actTypeIDTS,detailsTS, \
cccIDTS,cargoStatusIDTS,qtyTS,heightTS,lengthTS,widthTS,mtTS,cbmTS,containerIDTS,LoadedEmptyTS,custProjIDTS,blockIDTS,fieldIDTS, \
wellTS,ownerIDTS,marksTS,siteTS,warehouseTS,unitTS,manifestIDTS,exVesselTS,toVesselTS,exTruckTS,toTruckTS, \
fromBaseIDTS,toBaseIDTS,locationIDTS,eqTypesTS,eqDedicTypesTS,originTS,supplierIDTS,newSupplierTS,finalClientIDTS, \
dedicTrkTS,dedicEqTS,commsTS,tpspTS,tpwnTS,entityIDTS,activeTS,TS) \
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                      [row.joJnPCC,row.fdaIDPCC,row.actID,row.actAXID,row.fdaID,row.actTypeID,row.details,row.cccID,row.cargoStatusID,row.qty,row.height,row.length,row.width,row.mt,row.cbm,row.containerID,row.LoadedEmpty,row.custProjID,row.blockID,row.fieldID,row.well,row.ownerID,row.marks,row.site,row.warehouse,row.unit,row.manifestID,row.exVessel,row.toVessel,row.exTruck,row.toTruck,row.fromBaseID,row.toBaseID,row.locationID,row.eqTypes,row.eqDedicTypes,row.origin,row.supplierID,row.newSupplier,row.finalClientID,row.dedicTrk,row.dedicEq,row.comms,row.tpsp,row.tpwn,row.entityID,row.active,row.actTypeIDTS,row.detailsTS,row.cccIDTS,row.cargoStatusIDTS,row.qtyTS,row.heightTS,row.lengthTS,row.widthTS,row.mtTS,row.cbmTS,row.containerIDTS,row.LoadedEmptyTS,row.custProjIDTS,row.blockIDTS,row.fieldIDTS,row.wellTS,row.ownerIDTS,row.marksTS,row.siteTS,row.warehouseTS,row.unitTS,row.manifestIDTS,row.exVesselTS,row.toVesselTS,row.exTruckTS,row.toTruckTS,row.fromBaseIDTS,row.toBaseIDTS,row.locationIDTS,row.eqTypesTS,row.eqDedicTypesTS,row.originTS,row.supplierIDTS,row.newSupplierTS,row.finalClientIDTS,row.dedicTrkTS,row.dedicEqTS,row.commsTS,row.tpspTS,row.tpwnTS,row.entityIDTS,row.activeTS,row.TS], 
                      function (tx, results) {
            //var i =1;
        },
            function (tx, error) {
                alert("Error: "+error.message);
            }
        );
    //});
}

function updateActivitiesSBS(row,tx) {
    //db.transaction(function(tx) {
        tx.executeSql("UPDATE activitiesSBS_related_PCC SET \
fdaID = ?, \
actTypeID = CASE WHEN (actTypeIDTS < ? OR actTypeIDTS IS NULL) THEN ? ELSE actTypeID END, \
actTypeIDTS = CASE WHEN (actTypeIDTS < ? OR actTypeIDTS IS NULL) THEN ? ELSE actTypeIDTS END, \
details = CASE WHEN (detailsTS < ?  OR  detailsTS IS NULL) THEN ? ELSE details END, \
detailsTS = CASE WHEN (detailsTS < ? OR detailsTS IS NULL) THEN ? ELSE detailsTS END, \
cccID = CASE WHEN (cccIDTS < ? OR cccIDTS IS NULL) THEN ? ELSE cccID END, \
cccIDTS = CASE WHEN (cccIDTS < ? OR cccIDTS IS NULL) THEN ? ELSE cccIDTS END, \
cargoStatusID = CASE WHEN (cargoStatusIDTS < ? OR cargoStatusIDTS IS NULL) THEN ? ELSE cargoStatusID END, \
cargoStatusIDTS = CASE WHEN (cargoStatusIDTS < ? OR cargoStatusIDTS IS NULL) THEN ? ELSE cargoStatusIDTS END, \
qty = CASE WHEN (qtyTS < ? OR qtyTS IS NULL) THEN ? ELSE qty END, \
qtyTS = CASE WHEN (qtyTS < ? OR qtyTS IS NULL) THEN ? ELSE qtyTS END, \
height = CASE WHEN (heightTS < ? OR heightTS IS NULL) THEN ? ELSE height END, \
heightTS = CASE WHEN (heightTS < ? OR heightTS IS NULL) THEN ? ELSE heightTS END, \
length = CASE WHEN (lengthTS < ? OR lengthTS IS NULL) THEN ? ELSE length END, \
lengthTS = CASE WHEN (lengthTS < ? OR lengthTS IS NULL) THEN ? ELSE lengthTS END, \
width = CASE WHEN (widthTS < ? OR widthTS IS NULL) THEN ? ELSE width END, \
widthTS = CASE WHEN (widthTS < ? OR widthTS IS NULL) THEN ? ELSE widthTS END, \
mt = CASE WHEN (mtTS < ? OR mtTS IS NULL) THEN ? ELSE mt END, \
mtTS = CASE WHEN (mtTS < ? OR mtTS IS NULL) THEN ? ELSE mtTS END, \
cbm = CASE WHEN (cbmTS < ? OR cbmTS IS NULL) THEN ? ELSE cbm END, \
cbmTS = CASE WHEN (cbmTS < ? OR cbmTS IS NULL) THEN ? ELSE cbmTS END, \
containerID = CASE WHEN (containerIDTS < ? OR containerIDTS IS NULL) THEN ? ELSE containerID END, \
containerIDTS = CASE WHEN (containerIDTS < ? OR containerIDTS IS NULL) THEN ? ELSE containerIDTS END, \
LoadedEmpty = CASE WHEN (LoadedEmptyTS < ? OR LoadedEmptyTS IS NULL) THEN ? ELSE LoadedEmpty END, \
LoadedEmptyTS = CASE WHEN (LoadedEmptyTS < ? OR LoadedEmptyTS IS NULL) THEN ? ELSE LoadedEmptyTS END, \
custProjID = CASE WHEN (custProjIDTS < ? OR custProjIDTS IS NULL) THEN ? ELSE custProjID END, \
custProjIDTS = CASE WHEN (custProjIDTS < ? OR custProjIDTS IS NULL) THEN ? ELSE custProjIDTS END, \
blockID = CASE WHEN (blockIDTS < ? OR blockIDTS IS NULL) THEN ? ELSE blockID END, \
blockIDTS = CASE WHEN (blockIDTS < ? OR blockIDTS IS NULL) THEN ? ELSE blockIDTS END, \
fieldID = CASE WHEN (fieldIDTS < ? OR fieldIDTS IS NULL) THEN ? ELSE fieldID END, \
fieldIDTS = CASE WHEN (fieldIDTS < ? OR fieldIDTS IS NULL) THEN ? ELSE fieldIDTS END, \
well = CASE WHEN (wellTS < ? OR wellTS IS NULL) THEN ? ELSE well END, \
wellTS = CASE WHEN (wellTS < ? OR wellTS IS NULL) THEN ? ELSE wellTS END, \
ownerID = CASE WHEN (ownerIDTS < ? OR ownerIDTS IS NULL) THEN ? ELSE ownerID END, \
ownerIDTS = CASE WHEN (ownerIDTS < ? OR ownerIDTS IS NULL) THEN ? ELSE ownerIDTS END, \
marks = CASE WHEN (marksTS < ? OR marksTS IS NULL) THEN ? ELSE marks END, \
marksTS = CASE WHEN (marksTS < ? OR marksTS IS NULL) THEN ? ELSE marksTS END, \
site = CASE WHEN (siteTS < ? OR siteTS IS NULL) THEN ? ELSE site END, \
siteTS = CASE WHEN (siteTS < ? OR siteTS IS NULL) THEN ? ELSE siteTS END, \
warehouse = CASE WHEN (warehouseTS < ? OR warehouseTS IS NULL) THEN ? ELSE warehouse END, \
warehouseTS = CASE WHEN (warehouseTS < ? OR warehouseTS IS NULL) THEN ? ELSE warehouseTS END, \
unit = CASE WHEN (unitTS < ? OR unitTS IS NULL) THEN ? ELSE unit END, \
unitTS = CASE WHEN (unitTS < ? OR unitTS IS NULL) THEN ? ELSE unitTS END, \
manifestID = CASE WHEN (manifestIDTS < ? OR manifestIDTS IS NULL) THEN ? ELSE manifestID END, \
manifestIDTS = CASE WHEN (manifestIDTS < ? OR manifestIDTS IS NULL) THEN ? ELSE manifestIDTS END, \
exVessel = CASE WHEN (exVesselTS < ? OR exVesselTS IS NULL) THEN ? ELSE exVessel END, \
exVesselTS = CASE WHEN (exVesselTS < ? OR exVesselTS IS NULL) THEN ? ELSE exVesselTS END, \
toVessel = CASE WHEN (toVesselTS < ? OR toVesselTS IS NULL) THEN ? ELSE toVessel END, \
toVesselTS = CASE WHEN (toVesselTS < ? OR toVesselTS IS NULL) THEN ? ELSE toVesselTS END, \
exTruck = CASE WHEN (exTruckTS < ? OR exTruckTS IS NULL) THEN ? ELSE exTruck END, \
exTruckTS = CASE WHEN (exTruckTS < ? OR exTruckTS IS NULL) THEN ? ELSE exTruckTS END, \
toTruck = CASE WHEN (toTruckTS < ? OR toTruckTS IS NULL) THEN ? ELSE toTruck END, \
toTruckTS = CASE WHEN (toTruckTS < ? OR toTruckTS IS NULL) THEN ? ELSE toTruckTS END, \
fromBaseID = CASE WHEN (fromBaseIDTS < ? OR fromBaseIDTS IS NULL) THEN ? ELSE fromBaseID END, \
fromBaseIDTS = CASE WHEN (fromBaseIDTS < ? OR fromBaseIDTS IS NULL) THEN ? ELSE fromBaseIDTS END, \
toBaseID = CASE WHEN (toBaseIDTS < ? OR toBaseIDTS IS NULL) THEN ? ELSE toBaseID END, \
toBaseIDTS = CASE WHEN (toBaseIDTS < ? OR toBaseIDTS IS NULL) THEN ? ELSE toBaseIDTS END, \
locationID = CASE WHEN (locationIDTS < ? OR locationIDTS IS NULL) THEN ? ELSE locationID END, \
locationIDTS = CASE WHEN (locationIDTS < ? OR locationIDTS IS NULL) THEN ? ELSE locationIDTS END, \
eqTypes = CASE WHEN (eqTypesTS < ? OR eqTypesTS IS NULL) THEN ? ELSE eqTypes END, \
eqTypesTS = CASE WHEN (eqTypesTS < ? OR eqTypesTS IS NULL) THEN ? ELSE eqTypesTS END, \
eqDedicTypes = CASE WHEN (eqDedicTypesTS < ? OR eqDedicTypesTS IS NULL) THEN ? ELSE eqDedicTypes END, \
eqDedicTypesTS = CASE WHEN (eqDedicTypesTS < ? OR eqDedicTypesTS IS NULL) THEN ? ELSE eqDedicTypesTS END, \
origin = CASE WHEN (originTS < ? OR originTS IS NULL) THEN ? ELSE origin END, \
originTS = CASE WHEN (originTS < ? OR originTS IS NULL) THEN ? ELSE originTS END, \
supplierID = CASE WHEN (supplierIDTS < ? OR supplierIDTS IS NULL) THEN ? ELSE supplierID END, \
supplierIDTS = CASE WHEN (supplierIDTS < ? OR supplierIDTS IS NULL) THEN ? ELSE supplierIDTS END, \
newSupplier = CASE WHEN (newSupplierTS < ? OR newSupplierTS IS NULL) THEN ? ELSE newSupplier END, \
newSupplierTS = CASE WHEN (newSupplierTS < ? OR newSupplierTS IS NULL) THEN ? ELSE newSupplierTS END, \
finalClientID = CASE WHEN (finalClientIDTS < ? OR finalClientIDTS IS NULL) THEN ? ELSE finalClientID END, \
finalClientIDTS = CASE WHEN (finalClientIDTS < ? OR finalClientIDTS IS NULL) THEN ? ELSE finalClientIDTS END, \
dedicTrk = CASE WHEN (dedicTrkTS < ? OR dedicTrkTS IS NULL) THEN ? ELSE dedicTrk END, \
dedicTrkTS = CASE WHEN (dedicTrkTS < ? OR dedicTrkTS IS NULL) THEN ? ELSE dedicTrkTS END, \
dedicEq = CASE WHEN (dedicEqTS < ? OR dedicEqTS IS NULL) THEN ? ELSE dedicEq END, \
dedicEqTS = CASE WHEN (dedicEqTS < ? OR dedicEqTS IS NULL) THEN ? ELSE dedicEqTS END, \
comms = CASE WHEN (commsTS < ? OR commsTS IS NULL) THEN ? ELSE comms END, \
commsTS = CASE WHEN (commsTS < ? OR commsTS IS NULL) THEN ? ELSE commsTS END, \
tpsp = CASE WHEN (tpspTS < ? OR tpspTS IS NULL) THEN ? ELSE tpsp END, \
tpspTS = CASE WHEN (tpspTS < ? OR tpspTS IS NULL) THEN ? ELSE tpspTS END, \
tpwn = CASE WHEN (tpwnTS < ? OR tpwnTS IS NULL) THEN ? ELSE tpwn END, \
tpwnTS = CASE WHEN (tpwnTS < ? OR tpwnTS IS NULL) THEN ? ELSE tpwnTS END, \
entityID = CASE WHEN (entityIDTS < ? OR entityIDTS IS NULL) THEN ? ELSE entityID END, \
entityIDTS = CASE WHEN (entityIDTS < ? OR entityIDTS IS NULL) THEN ? ELSE entityIDTS END, \
active = CASE WHEN (activeTS < ? OR activeTS IS NULL) THEN ? ELSE active END, \
activeTS = CASE WHEN (activeTS < ? OR activeTS IS NULL) THEN ? ELSE activeTS END, \
TS = ? \
WHERE actID = ? AND fdaIDPCC = ? AND TS IS NOT NULL;", [row.fdaID,
                      row.actTypeIDTS,row.actTypeID,row.actTypeIDTS,row.actTypeIDTS,
                      row.detailsTS,row.details,row.detailsTS,row.detailsTS,
                      row.cccIDTS,row.cccID,row.cccIDTS,row.cccIDTS,
                      row.cargoStatusIDTS,row.cargoStatusID,row.cargoStatusIDTS,row.cargoStatusIDTS,
                      row.qtyTS,row.qty,row.qtyTS,row.qtyTS,
                      row.heightTS,row.height,row.heightTS,row.heightTS,
                      row.lengthTS,row.length,row.lengthTS,row.lengthTS,
                      row.widthTS,row.width,row.widthTS,row.widthTS,
                      row.mtTS,row.mt,row.mtTS,row.mtTS,
                      row.cbmTS,row.cbm,row.cbmTS,row.cbmTS,
                      row.containerIDTS,row.containerID,row.containerIDTS,row.containerIDTS,
                      row.LoadedEmptyTS,row.LoadedEmpty,row.LoadedEmptyTS,row.LoadedEmptyTS,
                      row.custProjIDTS,row.custProjID,row.custProjIDTS,row.custProjIDTS,
                      row.blockIDTS,row.blockID,row.blockIDTS,row.blockIDTS,
                      row.fieldIDTS,row.fieldID,row.fieldIDTS,row.fieldIDTS,
                      row.wellTS,row.well,row.wellTS,row.wellTS,
                      row.ownerIDTS,row.ownerID,row.ownerIDTS,row.ownerIDTS,
                      row.marksTS,row.marks,row.marksTS,row.marksTS,
                      row.siteTS,row.site,row.siteTS,row.siteTS,
                      row.warehouseTS,row.warehouse,row.warehouseTS,row.warehouseTS,
                      row.unitTS,row.unit,row.unitTS,row.unitTS,
                      row.manifestIDTS,row.manifestID,row.manifestIDTS,row.manifestIDTS,
                      row.exVesselTS,row.exVessel,row.exVesselTS,row.exVesselTS,
                      row.toVesselTS,row.toVessel,row.toVesselTS,row.toVesselTS,
                      row.exTruckTS,row.exTruck,row.exTruckTS,row.exTruckTS,
                      row.toTruckTS,row.toTruck,row.toTruckTS,row.toTruckTS,
                      row.fromBaseIDTS,row.fromBaseID,row.fromBaseIDTS,row.fromBaseIDTS,
                      row.toBaseIDTS,row.toBaseID,row.toBaseIDTS,row.toBaseIDTS,
                      row.locationIDTS,row.locationID,row.locationIDTS,row.locationIDTS,
                      row.eqTypesTS,row.eqTypes,row.eqTypesTS,row.eqTypesTS,
                      row.eqDedicTypesTS,row.eqDedicTypes,row.eqDedicTypesTS,row.eqDedicTypesTS,
                      row.originTS,row.origin,row.originTS,row.originTS,
                      row.supplierIDTS,row.supplierID,row.supplierIDTS,row.supplierIDTS,
                      row.newSupplierTS,row.newSupplier,row.newSupplierTS,row.newSupplierTS,
                      row.finalClientIDTS,row.finalClientID,row.finalClientIDTS,row.finalClientIDTS,
                      row.dedicTrkTS,row.dedicTrk,row.dedicTrkTS,row.dedicTrkTS,
                      row.dedicEqTS,row.dedicEq,row.dedicEqTS,row.dedicEqTS,
                      row.commsTS,row.comms,row.commsTS,row.commsTS,
                      row.tpspTS,row.tpsp,row.tpspTS,row.tpspTS,
                      row.tpwnTS,row.tpwn,row.tpwnTS,row.tpwnTS,
                      row.entityIDTS,row.entityID,row.entityIDTS,row.entityIDTS,
                      row.activeTS,row.active,row.activeTS,row.activeTS,
                      row.TS,row.actID,row.fdaIDPCC],
                      function (tx, results) {},
            function (tx, error) {
                alert("Error: "+error.message);
            }
        );
    //});
}

function insertPics(row,tx) {
    //db.transaction(function(tx) {
        tx.executeSql('INSERT OR IGNORE INTO pics(picID,fdaID,actID,picThumb,pic,active,picThumbTS,picTS,activeTS,TS) VALUES (?,?,?,?,?,?,?,?,?,?)', 
                      [row.picID,row.fdaID,row.actID,row.picThumb,row.pic,row.active,row.picThumbTS,row.picTS,row.activeTS,row.TS], 
                      function (tx, results) {
                          //var i =1;
                      },
                      function (tx, error) {
                          alert("Error: "+error.message);
                      }
                     );
    //});
}

function updatePics(row,tx) {
    //db.transaction(function(tx) {
        tx.executeSql("UPDATE pics SET \
active = CASE WHEN (activeTS < ? OR activeTS IS NULL) THEN ? ELSE active END, \
activeTS = CASE WHEN (activeTS < ? OR activeTS IS NULL) THEN ? ELSE activeTS END, \
TS = ? \
WHERE picID = ? AND TS IS NOT NULL;", [row.activeTS,row.active,row.activeTS,row.activeTS,
                      row.TS,row.picID],
                      function (tx, results) {},
            function (tx, error) {
                alert("Error: "+error.message);
            }
        );
    //});
}

function insertReopen(row,tx) {
    //db.transaction(function(tx) {
        tx.executeSql('INSERT OR IGNORE INTO reports_reopen(fdaID,idReason,note,idReasonTS,noteTS,TS) VALUES (?,?,?,?,?,?)', 
                      [row.fdaID,row.idReason,row.note,row.idReasonTS,row.noteTS,row.TS], 
                      function (tx, results) {
                          //var i =1;
                      },
                      function (tx, error) {
                          alert("Error: "+error.message);
                      }
                     );
    //});
}

function updateReopen(row,tx) {
    //db.transaction(function(tx) {
        tx.executeSql("UPDATE reports_reopen SET \
idReason = CASE WHEN (idReasonTS < ? OR idReasonTS IS NULL) THEN ? ELSE idReason END, \
idReasonTS = CASE WHEN (idReasonTS < ? OR idReasonTS IS NULL) THEN ? ELSE idReasonTS END, \
note = CASE WHEN (noteTS < ? OR noteTS IS NULL) THEN ? ELSE note END, \
noteTS = CASE WHEN (noteTS < ? OR noteTS IS NULL) THEN ? ELSE noteTS END, \
TS = ? \
WHERE fdaID = ? AND TS IS NOT NULL;", [row.idReasonTS,row.idReason,row.idReasonTS,row.idReasonTS,
                      row.noteTS,row.note,row.noteTS,row.noteTS,
                      row.TS,row.fdaID],
                      function (tx, results) {},
            function (tx, error) {
                alert("Error: "+error.message);
            }
        );
    //});
}


// checkTS ----------------------------------------------------------------------------

function getData(table,idName,page,op) {
    if (page == 0)
        db.transaction(function(tx) {
            tx.executeSql("SELECT max(TS) as max FROM "+table, [],
                          function(tx, rs) {
                              if (!rs.rows.length) {
                                  heartBeat(true,page,op);
                                  return;
                              }
                              var row = rs.rows.item(0);
                              if (row.max == null) actualTS = "1970-01-01 01:00:00";
                              else {
                                  actualTS = row.max;
                              }
                              getDataTS(table,idName,actualTS,page,op);
                          });
        });
    else getDataTS(table,idName,actualTS,page,op);
}


function getDataTS(table,idName,lastTS,page,op) {
    var url = baseUrl+"/2/getdata/"+table+"/b6afc9c7bea7e8036035afd5b89cb664/"+page+"/"+clientID+"/"+encodeURIComponent(lastTS);
    $.get( url ,"", function(resp){ 
        led();
        if (resp.length) {
            //insert or ignore
            db.transaction(function(tx) {
                if (table == 'reports') {
                    for (var i=0,l=resp.length; i < l; i++){
                        var row = resp[i];
                        insertReports(row,tx);
                        updateReports(row,tx);
                    }
                }
                if (table == 'activities') {
                    for (var i=0,l=resp.length; i < l; i++){
                        var row = resp[i];
                        insertActivities(row,tx);
                        updateActivities(row,tx);
                    }  
                }
                if (table == 'pics') {
                    for (var i=0,l=resp.length; i < l; i++){
                        var row = resp[i];
                        insertPics(row,tx);
                        updatePics(row,tx);
                    }  
                }
                if (table == 'reports_reopen') {
                    for (var i=0,l=resp.length; i < l; i++){
                        var row = resp[i];
                        insertReopen(row,tx);
                        updateReopen(row,tx);
                    }  
                }
                if (table == 'activitiesSBS_related_PCC') {
                    for (var i=0,l=resp.length; i < l; i++){
                        var row = resp[i];
                        insertActivitiesSBS(row,tx);
                        updateActivitiesSBS(row,tx);
                    }  
                }
            },
        	function(){
                heartBeat(false,page,op);
            },
            function(){
                heartBeat(false,page,op);
            });
        } else heartBeat(true,page,op);
    }, 'json').fail(function(request,error) {
        heartBeat(true,page,op);
    }); 
}

/*

function array2insert(row,ta) {
    var separator = "", labels = "", values = "", key;
    for (key in row) {
        labels += separator+key;
        if (row[key] === null) 
            values += separator+"null";
        else values += separator+"'"+row[key]+"'";
        separator = ",";
    }
    return "INSERT OR IGNORE INTO "+ta+" ("+labels+") VALUES ("+values+");"
}

function getRemoteData(table,idName,lastUpdate) {
    var lastTS = new Date(lastUpdate).getTime(),
        url = baseUrl+"/1/map/"+table+"/b6afc9c7bea7e8036035afd5b89cb664/"+page+"/"+lastTS;
    $.get( url ,"", function(resp){ 
        data = resp.data;
        idList = resp.idl;
        //TODO verificare il crc
        if (!data.length) {
            //ts[table] = ts["temp"];
            heartBeat(true);
            return;
        }
        selRecFromMap(table,idName,idList,data);
    }, 'json').fail(function(request,error) {
        heartBeat(true);
    });
}
*/
/*function checkTS(table,idName) {
	var url = baseUrl+"/1/ts/"+table+"/b6afc9c7bea7e8036035afd5b89cb664/";
	$.get( url ,"", function(resp){ 
        if (resp != ts[table]) {
            ts["temp"] = resp;
			getRemoteMap(table,idName);
        }
        else
            heartBeat(true);
    }, 'text').fail(function(request,error) {
    	heartBeat(true);
	});
}*/

function removeLocalUpdates(table,idName,idList) {
    db.transaction(function(tx) {
        tx.executeSql("UPDATE "+table+" SET TS = '1970-01-01 01:00:00' WHERE "+idName+" IN ("+idList+");", [],null,null);
    });
}

function putLocalUpdates(table,idName,page,op) {
    var xhr = new XMLHttpRequest(), 
        separator = "",
        resultRows = "",
        idList = "",
        url = baseUrl+"/2/putlocalupdates/"+table+"/b6afc9c7bea7e8036035afd5b89cb664";
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM "+table+" WHERE TS IS NULL", [],
                      function(tx, rs) {
                          if (!rs.rows.length) {
                              heartBeat(true,page,op);
                              return;
                          }
                          for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              resultRows += separator+JSON.stringify(row);
                              idList += separator+"'"+row[idName]+"'";
                              separator = ",";
                          }
                          $.post( url ,"data=["+encodeURIComponent(resultRows)+"]",function(data){
                              led();
                              if (data.result == "OK") removeLocalUpdates(table,idName,idList)
                                  },"json")
                          .always(function() {
                              heartBeat(true,page,op);
                          });	
                      });
    });   	
}

function led() {
    $("#footer-nav").addClass("navbar-led");
    setTimeout(function(){
        $("#footer-nav").removeClass("navbar-led");
    },500);
}

// checkTS ------------------------------------------------------------------------


// getRemoteMap: chiede la mappa dei record per la pagina page della tabella table
// table: tabella corrente
// idName: nome dell'indice della tabella corrente
/*

function getRemoteMap(table,idName,lastUpdate) {
    var lastTS = new Date(lastUpdate).getTime(),
        url = baseUrl+"/1/map/"+table+"/b6afc9c7bea7e8036035afd5b89cb664/"+page+"/"+lastTS;
    $.get( url ,"", function(resp){ 
        data = resp.data;
        idList = resp.idl;
        //TODO verificare il crc
        if (!data.length) {
            //ts[table] = ts["temp"];
            heartBeat(true);
            return;
        }
        selRecFromMap(table,idName,idList,data);
    }, 'json').fail(function(request,error) {
        heartBeat(true);
    });
}
*/

// b: seleziona i record locali corrispondenti alla mappa arrivata dal server
// ta: tabella corrente
// id: nome dell'indice della tabella corrente
// idl: lista degli indici trovati nella mappa
// y1: array record della mappa
/*

function selRecFromMap(table,idName,idList,y1) {
    idl = idList.listify();
    db.transaction(function(tx) {
        tx.executeSql("SELECT "+idName+",TS FROM "+table+" where "+idName+" IN ("+idl+");", [],
                      function(tx, rs){
                          //try {
                          var //toInsert = [], // record nuovi da inserire nel database locale
                          y2 = [], // record presenti nel database locale
                              toUpdate = "", // record da aggiornare nel database locale
                              toInsertList = "", // lista degli elementi da inserire
                              sep = ""; // separatore di elementi
                          for (var i=0; i < rs.rows.length; i++) y2.push(rs.rows.item(i));
                          toInsert = y1.diff(y2,idName);
                          for (var i=0, l=toInsert.length; i < l; i++){
                              toInsertList += sep+"'"+toInsert[i][idName]+"'";
                              sep = ",";
                          }
                          toInsert = toInsertList;
                          sep = "";
                          // 2500 confronti alla volta!!!
                          for (var i=0, l=y1.length; i < l; i++) {
                              for (var j=0, l2=y2.length; j < l2; j++) {
                                  if (y1[i][idName] == y2[j][idName] && y1[i].TS != y2[j].TS && y2[j].TS != null ) {
                                      toUpdate += sep+"'"+y1[i][idName]+"'";
                                      sep = ",";
                                  }
                              }
                          }
                          getRecToInsert(table,idName,toInsert,toUpdate);
                      },
                      function(tx, err){
                          heartBeat(true);
                      });
    }); 
}

function getRecToInsert(table,idName,toInsert,toUpdate) {
    var //xhr = new XMLHttpRequest(), 
    //insertData = [], 
    //respData = [],
    url = baseUrl+"/1/data/"+table+"/b6afc9c7bea7e8036035afd5b89cb664/";
    if (toInsert.length)
        $.post( url ,"list="+toInsert, function(resp){
            getRecToUpdate(table,idName,toUpdate,resp);
        }, "json").fail(function() {
            heartBeat(true);
        });
    else getRecToUpdate(table,idName,toUpdate,[]);
}

function getRecToUpdate(table,idName,toUpdate,insertData) {
    var respData = {}, 
        updateData = [],
        url = baseUrl+"/1/data/"+table+"/b6afc9c7bea7e8036035afd5b89cb664/";
    if (toUpdate.length)
        $.post( url ,"list="+toUpdate, function(updateData){
            compRecToUpdate(table,idName,insertData,updateData);
        }, "json").fail(function(request,error) {
            heartBeat(true);
        });
    else compRecToUpdate(table,idName,insertData,[]);
}


function compRecToUpdate(table,idName,insertData,updateData) {
    if (!updateData.length) {
        commitChanges(table,idName,insertData,[],[]);
        return;
    }
    var oldData = [],
        sep = "",
        toUpdateList = "";
    db.transaction(function(tx) {
        for (var i=0, l=updateData.length; i < l; i++){
            toUpdateList += sep+"'"+updateData[i][idName]+"'";
            sep = ",";
        }
        tx.executeSql("SELECT * FROM "+table+" where "+idName+" IN ("+toUpdateList+") ORDER BY "+idName+";", [],
                      function(tx, rs){
                          for (var i=0, l=rs.rows.length; i < l; i++) oldData.push(rs.rows.item(i));
                          commitChanges(table,idName,insertData,updateData,oldData);
                      },
                      function(tx, err){
                          heartBeat(true);
                      });
    });
}

function commitChanges(table,idName,insertData,updateData,oldData) {
    var qry;
    db.transaction(function(tx) {
        for (var i=0, l=insertData.length; i < l; i++){
            qry = array2insert(insertData[i],table);
            //self.postMessage({"id":"worker","value":qry+"<br/>"});
            tx.executeSql(qry, [], null, 
                          function(tx, err){
                          });
        }
        for (var i=0, l=updateData.length; i < l; i++){
            qry = array2update(idName,updateData[i][idName],updateData[i],oldData[i],table);
            //self.postMessage({"id":"worker","value":qry+"<br/>"});
            tx.executeSql(qry, []);
        }
    }, 
                   function(){ 
                       heartBeat(false);
                   }, 
                   function(){ 
                       heartBeat(false);
                   });
}




function date2ts(dateTimeStr) {
    var dateTimeTS = new Date(dateTimeStr),
        timeDiff = dateTimeTS.getTimezoneOffset();
    if (isNaN(timeDiff)) 
        return 0;
    else
        return (dateTimeTS.getTime() / 1000) - timeDiff * 60;
}

function keepField(field) {
    if (field == 'fdaID' || field == 'actID' || field == 'picID' || field == 'axID' || field == 'actAXID' || field == 'toRev' ||  field.substring(field.length-2,field.length) == "TS" || field == "TS") return false;
    else return true;
}

function newValue(key,newArray,oldArray) {
    if (key == "TS") return true;
    if (date2ts(newArray[key+"TS"]) > date2ts(oldArray[key+"TS"])) return true;
    else return false;
}

function array2update(key,value,newArray,oldArray,ta) {
    var separator = "", couples = "", where = key+"='"+value+"'",arrayKey, equal = true;
    for (key in newArray) {
        if (keepField(key)) {
            if (newValue(key,newArray,oldArray)) {
                if (newArray[key] === null) couples += separator+key+"=null";
                else couples += separator+key+"='"+newArray[key]+"'";
                separator = ",";
                couples += separator+key+"TS='"+newArray[key+"TS"]+"'";
                equal = false;
            }
        }
    }
    if (equal) couples += separator+"TS='"+newArray["TS"]+"'";
    if (!couples) return "";
    else return "UPDATE "+ta+" SET "+couples+" WHERE "+where+";";
}

function compareResults(key,value,dataArray,ta) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM "+ta+" WHERE "+key+"='"+value+"'", [],
                      function(tx, rs) {
                          if (rs.rows.length == 0) array2insert(dataArray,ta)
                          else array2update(key,value,dataArray,rs.rows.item(0),ta);
                      });
    });
}

*/
