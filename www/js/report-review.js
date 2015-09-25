var approved = true;

setReviewReportData = function() {
    db.transaction(function(tx) {
        tx.executeSql("SELECT reports.*,clients.clientName,\
preparedByUser.userName as preparedByName, \
checkedByUser.userName as checkedByName, \
baseSuperintendentsNameUser.userName as baseSuperintendentsNameName, \
clientsApprovalNameUser.userName as clientsApprovalNameName, \
clientsApprovalNameUser2.userName as clientsApprovalNameName2, \
entities.entityName \
FROM reports \
LEFT JOIN clients ON reports.clientID = clients.clientID \
LEFT JOIN datacenterUsers as preparedByUser ON reports.preparedBy = preparedByUser.userID \
LEFT JOIN datacenterUsers as checkedByUser ON reports.checkedBy = checkedByUser.userID \
LEFT JOIN datacenterUsers as baseSuperintendentsNameUser ON reports.baseSuperintendentsName = baseSuperintendentsNameUser.userID \
LEFT JOIN datacenterUsers as clientsApprovalNameUser ON reports.clientsApprovalName = clientsApprovalNameUser.userID \
LEFT JOIN datacenterUsers as clientsApprovalNameUser2 ON reports.clientsApprovalName2 = clientsApprovalNameUser2.userID \
LEFT JOIN entities ON reports.entity = entities.entityID \
WHERE reports.fdaID='"+localStorage.fdaID+"'", [],
                      function(tx, rs) {
            row = rs.rows.item(0);
            $("#joJn").text(cleanOutput(row.joJn));
            $("#manNo").text(cleanOutput(row.manNo));
            $("#bookNo").text(cleanOutput(row.bookNo));
            $("#callNo").text(cleanOutput(row.callNo));
            $("#servDate").text(row.servDate);
            $("#repTypeName").text(row.repTypeID);
            $("#vesselName").text(cleanOutput(row.vesselName));
            $("#clientName").text(cleanOutput(row.clientName));
            $("#startDate").text(cleanOutput(row.startDate));
            $("#endDate").text(cleanOutput(row.endDate));
            $("#preparedBy").text(cleanOutput(row.preparedByName));
            $("#checkedBy").text(cleanOutput(row.checkedByName));
            $("#baseSuperintendentsName").text(cleanOutput(row.baseSuperintendentsNameName));
            $("#clientsApprovalName").text(cleanOutput(row.clientsApprovalNameName));
            $("#clientsApprovalName2").text(cleanOutput(row.clientsApprovalNameName2));
            $("#entity").text(cleanOutput(row.entityName));
            /*renderField('userID',row.preparedBy,'userName','users','#preparedBy');
            renderField('userID',row.checkedBy,'userName','users','#checkedBy');
            renderField('userID',row.baseSuperintendentsName,'userName','users','#baseSuperintendentsName');
            renderField('userID',row.clientsApprovalName,'userName','users','#clientsApprovalName');*/
            mandatoryHTML(row.preparedBy,'#preparedByLabel');
            mandatoryHTML(row.checkedBy,'#checkedByLabel');
            mandatoryHTML(row.startDate,'#startDateLabel');
            renderReviewActivities();
            localStorage.endDate = row.endDate;
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
            
            
            //$("#sign").append('<input type="button" id="sign" value="Sign" onclick="changePage(\'signature.html\',[\'signature.js\']);"/>');
            //$("#sign").append('<input type="button" id="closeCMR" value="Close this CMR" onclick="closeCMR();"/>');
            //else
            //$("#sign").append('<h1>Approval Signature</h1><img class="signature" src="data:image/jpeg;base64,'+row.clientSign+'"/>');                          
            if (row.endDate != null) {
                $("#signature-msg").html("<b>"+cleanOutput(row.clientSign)+"</b><br/>"+cleanOutput(row.clientsApprovalDT));
            } 
            /*else
            if (localStorage.userLevel != 2 && row.endDate == null) 
                $("#approvation").text("You don't have enough permissions to sign this report");  
            else
            if (localStorage.userLevel > 2 && row.endDate == null)
                $("#approvation").append('<a class="btn btn-intels pull-right" href="javascript:void(0);" onclick="closeCMR();">Sign this CMR</a>');
           */                             
            
        });
    });
    
}

function mandatory(field) {
    if (field === null || field.length == 0) {
        approved = false;
        return "mandatory";
    }
}

function mandatory1of2(field1,field2,isTruck) {
    // se e' un ex/toTruck ma non devono essere mandatory, salto
    if (isTruck && !extotruckmandatory) return;
    if ((field1 === null || field1.length == 0) && (field2 === null || field2.length == 0)) {
        approved = false;
        return "mandatory";
    }
}

function mandatoryIfContainer(containerID,containerStatus) {
    if (containerID === null || containerID.length == 0) return; 
    if (containerStatus === null || containerStatus.length == 0) {
        approved = false;
        return "mandatory";
    }
}

function mandatoryHTML(field,node) {
    if (field == null || field.length == 0) {
        $(node).addClass("mandatory");
        approved = false;
    }
}

renderReviewActivities = function() {
    db.transaction(function(tx) {
        tx.executeSql("SELECT activities.*,actTypeDesc,cccDesc,cargoStatusDesc,containerDesc,supplierName,newSupplier,clientName,projName, \
exVessels.vesselName as exVesselName,toVessels.vesselName as toVesselName, eqTypes FROM activities \
left join actTypes on activities.actTypeID = actTypes.actTypeID \
left join ccc on activities.cccID = ccc.cccID \
left join cargoStatus on activities.cargoStatusID = cargoStatus.cargoStatusID \
left join containers on activities.containerID = containers.containerID \
left join suppliers on activities.supplierID = suppliers.supplierID \
left join clients on activities.finalClientID = clients.clientID \
left join projs on activities.custProjID = projs.projID \
left join vessels as exVessels on activities.exVessel = exVessels.IMO \
left join vessels as toVessels on activities.toVessel = toVessels.IMO \
WHERE fdaID = ? and activities.active = 1", [localStorage.fdaID],
                      function(tx, rs) {
            if (rs.rows.length == 0) $("#activities").append('<div class="row">No activities found</div>');
            var acts = '';
            for (var i=0; i < rs.rows.length; i++){
                row = rs.rows.item(i);
                actID = row.actID;
                //if (!isNaN(row.width) && !isNaN(row.height) && !isNaN(row.length))
                //    cbm = Math.round(row.width * row.height * row.length * 100) / 100;
                var ft = "";
                if (!isNaN(row.cbm) && !isNaN(row.mt)) 
                    if (row.cbm >= row.mt) ft = row.cbm; 
                    else ft = row.mt;
                if (ft >= 5) ft = "HL "+ft;
                else ft = "GC " + ft;
                switch (row.dedicTrk) {
                    case 2:
                        dedicTrk = 'Third Party';
                    break;
                    case 1:
                        dedicTrk = 'Dedicated';
                    break;
                    default:
                        dedicTrk = 'Pool';
                }   
                if (row.dedicEq) dedicEq = "Dedicated"; else dedicEq = "NOT Dedicated"; 
                if (localStorage.userLevel == 0) var editBtn = "";
                else if (localStorage.endDate.length == 19) var editBtn = "";
                else var editBtn = '<div class="panel-body"> \
<div class="row no-margin edit-act"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row"></label> \
<div class="col-sm-7"> \
<div class="form-row"><a class="btn btn-intels pull-right" href="javascript:void(0);" onclick="localStorage.actID=\''+row.actID+'\';changePage(\'activity-measure.html\',[\'activity-measure.js\']);">Edit Activity</a></div> \
</div> \
</div> \
</div>';
                var actCheck = "";
                if (mandatory(row.actTypeID)
                    || mandatory(row.cccDesc)
                    || mandatory(row.cargoStatusDesc)
                    || mandatory(row.qty)
                    || mandatory(row.height)
                    || mandatory(row.width)
                    || mandatory(row.length)
                    || mandatory(row.mt)
                    || mandatory1of2(row.exTruck,row.toTruck,1)
                    || mandatory(row.fromBaseID)
                    || mandatory(row.toBaseID)
                    || mandatory(row.locationID)
                    || mandatory1of2(row.supplierName, row.newSupplier)
                    || mandatory1of2(row.eqTypes,row.eqDedicTypes)
                    || mandatoryIfContainer(row.containerID,row.LoadedEmpty))
                        actCheck = "mandatory";
                
                // retrieving equipment list from row.eqTypes and eqTypesL
                var eqTypesSplit = "", eqTypesHTML = "";
                if (row.eqTypes != null) {
                    eqTypesSplit = row.eqTypes.split(',');
                    for (j = 0,l = eqTypesSplit.length; j < l; j ++) {
                        // TODO: inline style that must be moved to CSS files
                        var result = $.grep(eqTypesL, function(e) { return e.eqTypeID == eqTypesSplit[j] });
                        if (result.length == 1) eqTypesHTML += '<span class="badge badge-grey" style="font-size:25px">' + (j+1) + '</span>&nbsp;&nbsp;' + result[0].eqTypeDesc + "<br />";
                    }
                }
                
                // retrieving dedicated equipment list from row.eqDedicTypes and eqDedicTypesL
                var eqDedicTypesSplit = "", eqDedicTypesHTML = "";
                if (row.eqDedicTypes != null) {
                    eqDedicTypesSplit = row.eqDedicTypes.split(',');
                    for (j = 0,l = eqDedicTypesSplit.length; j < l; j ++) {
                        // TODO: inline style that must be moved to CSS files
                        var result = $.grep(eqDedicTypesL, function(e) { return e.eqTypeID == eqDedicTypesSplit[j] });
                        if (result.length == 1) eqDedicTypesHTML += '<span class="badge badge-grey" style="font-size:25px">' + (j+1) + '</span>&nbsp;&nbsp;' + result[0].eqTypeDesc + "<br />";
                    }
                }
                
                acts += '<div class="panel panel-intels-activity"> \
<div class="panel-heading '+actCheck+'"> \
<a data-toggle="collapse" data-parent="#accordion" href="#collapse'+i+'"> \
<h4 class="panel-title"><span class="badge">'+(i+1)+'</span>&nbsp;&nbsp; \
'+cleanOutput(row.actTypeDesc)+'<br/>'+cleanOutput(row.comms)+' \
</h4> \
</a> \
</div> \
<div id="collapse'+i+'" class="panel-collapse collapse">'+editBtn+' \
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory(row.cccDesc)+'">Cargo Config Code</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.cccDesc)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory(row.cargoStatusDesc)+'">Cargo Status</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.cargoStatusDesc)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory(row.qty)+'">Quantity</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.qty)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory(row.height)+'">Height (meters)</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.height)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory(row.width)+'">Width (meters)</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.width)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory(row.length)+'">Length (meters)</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.length)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">CBM</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.cbm)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory(row.mt)+'">M/T</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.mt)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">F/T</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(ft)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">Container</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.containerDesc)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatoryIfContainer(row.containerID,row.LoadedEmpty)+'">Container Status</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.LoadedEmpty)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">Ex Vessel</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.exVesselName)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">To Vessel</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.toVesselName)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory1of2(row.exTruck,row.toTruck,1)+'">Ex Truck</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.exTruck)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory1of2(row.exTruck,row.toTruck,1)+'">To Truck</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.toTruck)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">Truck</label> \
<div class="col-sm-7"> \
<div class="form-row">'+dedicTrk+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">Equipment</label> \
<div class="col-sm-7"> \
<div class="form-row">'+dedicEq+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory(row.fromBaseID)+'">Origin</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.fromBaseID)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory(row.toBaseID)+'">Destination</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.toBaseID)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory(row.locationID)+'">Location</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.locationID)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row '+mandatory1of2(row.supplierName,row.newSupplier)+'">Supplier</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.supplierName ? row.supplierName : row.newSupplier)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">Final Client</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.clientName)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">3rd P. Service Prov.</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.tpsp)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">3rd P. Waybill No.</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.tpwn)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">Customer Project</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.projName)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">Customer Block</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.blockID)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">Custom Field</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.fieldID)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-5 control-label text-right form-row">Custom Well</label> \
<div class="col-sm-7"> \
<div class="form-row">'+cleanOutput(row.well)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-12 control-label form-row '+mandatory1of2(row.eqTypes,row.eqDedicTypes)+'">Equipment Types</label> \
<div class="col-sm-12"> \
<div class="form-row">'+cleanOutput(eqTypesHTML)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-12 control-label form-row '+mandatory1of2(row.eqTypes,row.eqDedicTypes)+'">Dedicated Equipment Types</label> \
<div class="col-sm-12"> \
<div class="form-row">'+cleanOutput(eqDedicTypesHTML)+'</div> \
</div> \
</div> \
</div> \
\
<div class="row no-margin"> \
<div class="form-group"> \
<label for="" class="col-sm-12 control-label form-row">Equipment Remarks</label> \
<div class="col-sm-12"> \
<div class="form-row">'+cleanOutput(row.marks).toUpperCase()+'</div> \
</div> \
</div> \
</div> \
\
</div> \
</div> \
</div>';
                
                /*  

                checkMandatory(row.actTypeID,'#actTypeID-'+actID,"Activity type missing");
                checkMandatory(row.cccID,'#cccID-'+actID,"mandatory field");
                checkMandatory(row.cargoStatusID,'#cargoStatusID-'+actID,"mandatory field");
                checkMandatory(row.qty,'#qty-'+actID,"mandatory field");
                checkMandatory(row.length,'#length-'+actID,"mandatory field");
                checkMandatory(row.height,'#height-'+actID,"mandatory field");
                checkMandatory(row.width,'#width-'+actID,"mandatory field");
                checkMandatory(row.mt,'#mt-'+actID,"mandatory field");
                //checkMandatory(row.ownerID,'#ownerID-'+actID,"mandatory field");
                checkMandatory(row.fromBaseID,'#fromBaseID-'+actID,"mandatory field");
                checkMandatory(row.toBaseID,'#toBaseID-'+actID,"mandatory field");
                checkMandatory(row.locationID,'#locationID-'+actID,"mandatory field");
                //checkMandatory(row.startDate,'#startDate-'+actID,"mandatory field");
                //checkMandatory(row.endDate,'#endDate-'+actID,"mandatory field");
                
                
                //renderReviewActivity(row.actID,rs.rows.length);    	
                */
            } 
            
            $("#activities").append(acts);
            if (!approved) {
                $("#errors-msg").text("Missing mandatory fields");
                $("#errors-msg-label").addClass("mandatory"); 
                $("#signage").css('display','none'); 
            }
            /*if (row.endDate != null)
            	{
                    $(".edit-act").css("display","none");
                   $("#approv-section").css("display","none");
                }*/
            /*
            $( "#activities" ).accordion({
                collapsible: true,
                active: false,
                animate: 300
            });
            $('#activities h3').bind('click',function(){
                var self = this;
                setTimeout(function() {
                    theOffset = $(self).offset();
                    $('body,html').animate({ scrollTop: theOffset.top - 62 });
                }, 310); // ensure the collapse animation is done
            }); */
        },function(tx,error){
            console.log(error.message);
        });
    });
    
} 

cleanOutput = function(value) {
    if (value == undefined || value === null || value.length == 0) return "--";
    else return safeDecode(value);
}

checkMandatory = function(value,node,message) {
    if (value === null || value.length == 0) {
        $(node).addClass("mandatory");
        $(node).text(message);
        $("#sign").css("display","none");
    }
}

renderPics = function(actID) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM pics WHERE actID = '"+actID+"' and active = 1;", [],
                      function(tx, rs) {
                          for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              $("#picList-"+actID).append('<a href="#" onclick="event.preventDefault();localStorage.picID=\''+row.picID+'\';changePage(\'review-picture.html\',[\'review-picture.js\',\'iscroll.js\']);"><img class="smallPic" src="data:image/jpeg;base64,'+row.picThumb+'"/></a>');
                          }
                      },
                      function(){
                          alert("Error rendering pics")
                      });
    });  
};


/*renderReviewActivity = function(actID,count) {
	if (!actID) return;
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM activities WHERE actID = '"+actID+"';", [],
                     function(tx, rs) {
                          for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              if (!isNaN(row.qty) && !isNaN(row.width) && !isNaN(row.height) && !isNaN(row.length))
								var cbm = Math.round(row.qty * row.width * row.height * row.length * 100) / 100;
                                var ft = "";
								if (!isNaN(cbm) && !isNaN(row.mt)) 
									if (cbm >= row.mt) ft = cbm; 
										else ft = row.mt;
								if (ft >= 5) ft = "HL "+ft;
									else ft = "GC " + ft;
                              if (row.dedicTrk) var dedicTrk = "Yes"; else var dedicTrk = "No";    
                              $("#activities").append('<h3><span id="actTypeID-'+actID+'"></span> ('+cleanOutput(row.details)+')</h3><div id="activities-'+actID+'"></div>');    
                              $("#activities-"+actID).append('<div class="row"><input type="button" onclick="localStorage.actID=\''+actID+'\';changePage(\'activity-measure.html\',[\'activity-measure.js\']);" value="Edit activity" style="float:right;"/></div><div class="row"><label>Cargo Config Code</label><div class="inputRO big"><div id="cccID-'+actID+'">-</div></div></div><div class="row"><label>Cargo Status</label><div class="inputRO big"><div id="cargoStatusID-'+actID+'">-</div></div></div><div class="row"><label>Quantity</label><div class="inputRO big" id="qty-'+actID+'">'+cleanOutput(row.qty)+'</div></div><div class="row"><label>Height (meters)</label><div class="inputRO big" id="height-'+actID+'">'+cleanOutput(row.height)+'</div></div><div class="row"><label>Width (meters)</label><div class="inputRO big" id="width-'+actID+'">'+cleanOutput(row.width)+'</div></div><div class="row"><label>length (meters)</label><div class="inputRO big" id="length-'+actID+'">'+cleanOutput(row.length)+'</div></div><div class="row"><label>CBM</label><div class="inputRO big">'+cleanOutput(cbm)+'</div></div><div class="row"><label>M/T</label><div class="inputRO big" id="mt-'+actID+'">'+cleanOutput(row.mt)+'</div></div><div class="row"><label>FT</label><div class="inputRO big">'+cleanOutput(ft)+'</div></div><div class="row"><label>Container</label><div class="inputRO big"><div id="containerID-'+actID+'">-</div></div></div><div class="row"><label>Ex Vessel</label><div class="inputRO big">'+cleanOutput(row.exVessel)+'</div></div><div class="row"><label>To Vessel</label><div class="inputRO big">'+cleanOutput(row.toVessel)+'</div></div><div class="row"><label>Ex Truck</label><div class="inputRO big">'+cleanOutput(row.exTruck)+'</div></div><div class="row"><label>To Truck</label><div class="inputRO big">'+cleanOutput(row.toTruck)+'</div></div><div class="row"><label>Dedicated Truck</label><div class="inputRO big">'+cleanOutput(dedicTrk)+'</div></div><div class="row"><label>Origin</label><div class="inputRO big" id="fromBaseID-'+actID+'">-</div></div><div class="row"><label>Destination</label><div class="inputRO big" id="toBaseID-'+actID+'">-</div></div><div class="row"><label>Location</label><div class="inputRO big" id="locationID-'+actID+'">'+cleanOutput(row.locationID)+'</div></div><div class="row"><label>Supplier</label><div class="inputRO big"><div id="supplierID-'+actID+'">-</div></div></div><div class="row"><label>Final Client</label><div class="inputRO big"><div id="finalClientID-'+actID+'">-</div></div></div><div class="row"><label>Thirt Party Service Provider</label><div class="inputRO big"><div id="tpspID-'+actID+'">-</div></div></div><div class="row"><label>Thirt Party Waybill Number</label><div class="inputRO big">'+cleanOutput(row.tpwn)+'</div></div><div class="row"><label>Activity Start</label><div class="inputRO big" id="startDate-'+actID+'">'+cleanOutput(row.startDate)+'</div></div><div class="row"><label>Activity End</label><div class="inputRO big" id="endDate-'+actID+'">'+cleanOutput(row.endDate)+'</div></div><div class="row"><label>Custom Project</label><div class="inputRO big"><div id="projID-'+actID+'">-</div></div></div><div class="row"><label>Comments</label><div class="inputRO">'+cleanOutput(row.comms)+'</div><div class="row"><h1>Pictures</h1></div><div class="row"><div class="input" id="picList-'+actID+'"></div></div>');   
                              
//<div class="row"><label>Cargo Owner</label><div class="inputRO big"><div id="ownerID-'+actID+'">-</div></div></div>
                              renderField('actTypeID',row.actTypeID,'actTypeDesc','actTypes','#actTypeID-'+actID);
                              //renderField('clientID',row.ownerID,'clientName','clients','#ownerID-'+actID);  
                              renderField('cccID',row.cccID,'cccDesc','ccc','#cccID-'+actID);
                              renderField('cargoStatusID',row.cargoStatusID,'cargoStatusDesc','cargoStatus','#cargoStatusID-'+actID);
                              renderField('containerID',row.containerID,'containerDesc','containers','#containerID-'+actID);
                              renderField('baseID',row.fromBaseID,'baseName','bases','#fromBaseID-'+actID);
                              renderField('baseID',row.toBaseID,'baseName','bases','#toBaseID-'+actID);
                              renderField('supplierID',row.supplierID,'supplierName','suppliers','#supplierID-'+actID);
                              renderField('finalClientID',row.finalClientID,'clientName','clients','#finalClientID-'+actID);
                              renderField('tpspID',row.tpspID,'tpspName','tpsp','#tpspID-'+actID);
                              renderField('projID',row.custProjID,'projName','projs','#projID-'+actID);  
                              renderPics(actID);
                              checkMandatory(row.actTypeID,'#actTypeID-'+actID,"Activity type missing");
                              checkMandatory(row.cccID,'#cccID-'+actID,"mandatory field");
                              checkMandatory(row.cargoStatusID,'#cargoStatusID-'+actID,"mandatory field");
                              checkMandatory(row.qty,'#qty-'+actID,"mandatory field");
                              checkMandatory(row.length,'#length-'+actID,"mandatory field");
                              checkMandatory(row.height,'#height-'+actID,"mandatory field");
                              checkMandatory(row.width,'#width-'+actID,"mandatory field");
                              checkMandatory(row.mt,'#mt-'+actID,"mandatory field");
                              //checkMandatory(row.ownerID,'#ownerID-'+actID,"mandatory field");
                              checkMandatory(row.fromBaseID,'#fromBaseID-'+actID,"mandatory field");
                              checkMandatory(row.toBaseID,'#toBaseID-'+actID,"mandatory field");
                              checkMandatory(row.locationID,'#locationID-'+actID,"mandatory field");
                              checkMandatory(row.startDate,'#startDate-'+actID,"mandatory field");
                              checkMandatory(row.endDate,'#endDate-'+actID,"mandatory field");
                              
                          }
                         
                         actCount++;
                         if (actCount == count) {
                             $( "#activities" ).accordion({
                              collapsible: true,
                                 active: false,
                                 animate: 300
                            });
                             $('#activities h3').bind('click',function(){
                                var self = this;
                                setTimeout(function() {
                                    theOffset = $(self).offset();
                                    $('body,html').animate({ scrollTop: theOffset.top - 62 });
                                }, 310); // ensure the collapse animation is done
                            });
                         }
                     });
    });
}*/

renderField = function(key,value,field,table,container) {
    if (!key || !value || !table || !field) return;
    db.transaction(function(tx) {
        tx.executeSql("SELECT "+field+" FROM "+table+" WHERE "+key+" = '"+value+"';", [],
                      function(tx, rs) {
                          if (rs.rows.length ==0) return;
                          row = rs.rows.item(0);
                          $(container).text(cleanOutput(safeDecode(row[field])));
                      },
                      function() {
                          $(container).text("-");
                      });
    });
}     

/*
saveSign = function(fdaID,sign) {
    
}*/

closeCMR = function() {
    var r=confirm("Are you sure You want to close this report?");
    if (r==false) return;
    if (localStorage.userLevel == 2 || localStorage.userLevel == 4)
        db.transaction(function(tx) {
            tx.executeSql("UPDATE reports SET endDate = ?,clientSign = ?,clientsApprovalDT = ?,endDateTS = ?,clientSignTS = ?,clientsApprovalDTTS = ?, TS = NULL WHERE fdaID = ?", [getDateTime(),localStorage.userName,getDateTime(),getDateTime(),getDateTime(),getDateTime(),localStorage.fdaID],
                          function(tx, rs) {
                              changePage('report-general.html',['report-general.js']);
                          },
                          function(tx,error){
                              alert("Error: "+error.message)
                          });
        });
    /*updateData(true,'fdaID',localStorage.fdaID,'reports','endDate',getDateTime());
    updateData(true,'fdaID',localStorage.fdaID,'reports','clientSign',localStorage.userName);
    updateData(true,'fdaID',localStorage.fdaID,'reports','clientsApprovalDT',getDateTime());
    changePage('report-general.html',['report-general.js']);*/
}

function onBackKeyDown() {
    changePage('report-approvals.html',['report-approvals.js']);
}


var actCount = 0;
setReviewReportData();
userLevel(localStorage.endDate);

/*$('#sign').signature();
$('#clear').click(function() {
    $('#sign').signature('clear');
});
$('#save').click(function() {
    saveSign(localStorage.fdaID,$('#sign').signature('toJSON'));
});*/

$("#joJnLabel").text(localStorage.joJn);
