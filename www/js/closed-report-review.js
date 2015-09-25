setReviewReportData = function() {
    db.transaction(function(tx) {
    	tx.executeSql("SELECT * FROM reports WHERE fdaID = '"+localStorage.fdaID+"'", [],
                      function(tx, rs) {
                              row = rs.rows.item(0);
                              $("#joJn").text(safeDecode(row.joJn));
                              $("#manNo").text(safeDecode(row.manNo));
                              $("#bookNo").text(safeDecode(row.bookNo));
                              $("#callNo").text(safeDecode(row.callNo));
                              $("#servDate").text(row.servDate);
                                $("#repTypeName").text(row.repTypeID);
                          $("#vesselName").text(safeDecode(row.vesselName));
                          $("#clientName").text(safeDecode(row.clientName));
                          $("#startDate").text(safeDecode(row.startDate));
                          $("#endDate").text(safeDecode(row.endDate));
                              renderField('clientID',row.clientID,'clientName','clients','#clientName');
                              renderField('userID',row.preparedBy,'userName','users','#preparedBy');
                              renderField('userID',row.checkedBy,'userName','users','#checkedBy');
                              renderField('userID',row.baseSuperintendentsName,'userName','users','#baseSuperintendentsName');
                              renderField('userID',row.clientsApprovalName,'userName','users','#clientsApprovalName');
                              checkMandatory(row.preparedBy,'#preparedBy',"mandatory field");
                              checkMandatory(row.checkedBy,'#checkedBy',"mandatory field");
                              //checkMandatory(row.baseSuperintendentsName,'#baseSuperintendentsName',"mandatory field");
                              //checkMandatory(row.clientsApprovalName,'#clientsApprovalName',"mandatory field");
                          checkMandatory(row.startDate,'#startDate',"mandatory field");
                              renderReviewActivities();
                                //if (row.endDate == null)
                                    //$("#sign").append('<input type="button" id="sign" value="Sign" onclick="changePage(\'signature.html\',[\'signature.js\']);"/>');
                                    //$("#sign").append('<input type="button" id="closeCMR" value="Close this CMR" onclick="closeCMR();"/>');
                                //else
                                    //$("#sign").append('<h1>Approval Signature</h1><img class="signature" src="data:image/jpeg;base64,'+row.clientSign+'"/>');                          
                                //if (localStorage.userLevel != 2) 
                                    //$("#sign").html("<h1>Approval Signature</h1><p>Sorry, you don't have enough permissions to sign this report</p>");  
                          hideShutter();
                      });
    });
    
}

renderReviewActivities = function() {
    db.transaction(function(tx) {
    	tx.executeSql("SELECT * FROM activities WHERE fdaID = '"+localStorage.fdaID+"' and active = 1", [],
                      function(tx, rs) {
                          if (rs.rows.length == 0) $("#activities").append('<div class="row">No activities found</div>');
                          for (var i=0; i < rs.rows.length; i++){
                          	row = rs.rows.item(i);
                            actID = row.actID;
                          	if (!isNaN(row.qty) && !isNaN(row.width) && !isNaN(row.height) && !isNaN(row.length))
								var cbm = Math.round(row.qty * row.width * row.height * row.length * 100) / 100;
                                var ft = "";
								if (!isNaN(cbm) && !isNaN(row.mt)) 
									if (cbm >= row.mt) ft = cbm; 
										else ft = row.mt;
								if (ft >= 5) ft = "HL "+ft;
									else ft = "GC " + ft;
                              if (row.dedicTrk) var dedicTrk = "Yes"; else var dedicTrk = "No";    
                              $("#activities").append('<h3><span id="actTypeID-'+actID+'"></span> ('+cleanOutput(row.comms)+')</h3><div id="activities-'+actID+'"></div>');    
                              $("#activities-"+actID).append('<div class="row"><label>Cargo Config Code</label><div class="inputRO big"><div id="cccID-'+actID+'">-</div></div></div><div class="row"><label>Cargo Status</label><div class="inputRO big"><div id="cargoStatusID-'+actID+'">-</div></div></div><div class="row"><label>Quantity</label><div class="inputRO big" id="qty-'+actID+'">'+cleanOutput(row.qty)+'</div></div><div class="row"><label>Height (meters)</label><div class="inputRO big" id="height-'+actID+'">'+cleanOutput(row.height)+'</div></div><div class="row"><label>Width (meters)</label><div class="inputRO big" id="width-'+actID+'">'+cleanOutput(row.width)+'</div></div><div class="row"><label>Lenght (meters)</label><div class="inputRO big" id="length-'+actID+'">'+cleanOutput(row.length)+'</div></div><div class="row"><label>CBM</label><div class="inputRO big">'+cleanOutput(cbm)+'</div></div><div class="row"><label>M/T</label><div class="inputRO big" id="mt-'+actID+'">'+cleanOutput(row.mt)+'</div></div><div class="row"><label>FT</label><div class="inputRO big">'+cleanOutput(ft)+'</div></div><div class="row"><label>Container</label><div class="inputRO big"><div id="containerID-'+actID+'">-</div></div></div><div class="row"><label>Ex Vessel</label><div class="inputRO big" id="exVessel-'+actID+'">-</div></div><div class="row"><label>To Vessel</label><div class="inputRO big" id="toVessel-'+actID+'">-</div></div><div class="row"><label>Ex Truck</label><div class="inputRO big">'+cleanOutput(row.exTruck)+'</div></div><div class="row"><label>To Truck</label><div class="inputRO big">'+cleanOutput(row.toTruck)+'</div></div><div class="row"><label>Dedicated Truck</label><div class="inputRO big">'+cleanOutput(dedicTrk)+'</div></div><div class="row"><label>Origin</label><div class="inputRO big" id="fromBaseID-'+actID+'">-</div></div><div class="row"><label>Destination</label><div class="inputRO big" id="toBaseID-'+actID+'">-</div></div><div class="row"><label>Location</label><div class="inputRO big" id="locationID-'+actID+'">'+cleanOutput(row.locationID)+'</div></div><div class="row"><label>Supplier</label><div class="inputRO big"><div id="supplierID-'+actID+'">-</div></div></div><div class="row"><label>Final Client</label><div class="inputRO big"><div id="finalClientID-'+actID+'">-</div></div></div><div class="row"><label>Thirt Party Service Provider</label><div class="inputRO big"><div id="tpsp-'+actID+'">'+cleanOutput(row.tpsp)+'</div></div></div><div class="row"><label>Thirt Party Waybill Number</label><div class="inputRO big">'+cleanOutput(row.tpwn)+'</div></div><div class="row"><label>Custom Project</label><div class="inputRO big"><div id="projID-'+actID+'">-</div></div></div><div class="row"><label>Comments</label><div class="inputRO">'+cleanOutput(row.comms)+'</div><div class="row"><h1>Pictures</h1></div><div class="row"><div class="input" id="picList-'+actID+'"></div></div>');   
//<div class="row"><label>Activity Start</label><div class="inputRO big" id="startDate-'+actID+'">'+cleanOutput(row.startDate)+'</div></div><div class="row"><label>Activity End</label><div class="inputRO big" id="endDate-'+actID+'">'+cleanOutput(row.endDate)+'</div></div>                              
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
                              //renderField('tpspID',row.tpspID,'tpspName','tpsp','#tpsp-'+actID);
                              renderField('projID',row.custProjID,'projName','projs','#projID-'+actID);  
                              renderField('IMO',row.exVessel,'vesselName','vessels','#exVessel-'+actID);  
                              renderField('IMO',row.toVessel,'vesselName','vessels','#toVessel-'+actID);  
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
                              //checkMandatory(row.startDate,'#startDate-'+actID,"mandatory field");
                              //checkMandatory(row.endDate,'#endDate-'+actID,"mandatory field");
                              
                              
                              //renderReviewActivity(row.actID,rs.rows.length);    	
                          } 
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
                      });
    });
    
} 

cleanOutput = function(value) {
    if (value == undefined || !value) return "-";
    else return value;
}

checkMandatory = function(value,node,message) {
    if (value == null || value == "") {
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
                              $("#activities-"+actID).append('<div class="row"><input type="button" onclick="localStorage.actID=\''+actID+'\';changePage(\'activity-measure.html\',[\'activity-measure.js\']);" value="Edit activity" style="float:right;"/></div><div class="row"><label>Cargo Config Code</label><div class="inputRO big"><div id="cccID-'+actID+'">-</div></div></div><div class="row"><label>Cargo Status</label><div class="inputRO big"><div id="cargoStatusID-'+actID+'">-</div></div></div><div class="row"><label>Quantity</label><div class="inputRO big" id="qty-'+actID+'">'+cleanOutput(row.qty)+'</div></div><div class="row"><label>Height (meters)</label><div class="inputRO big" id="height-'+actID+'">'+cleanOutput(row.height)+'</div></div><div class="row"><label>Width (meters)</label><div class="inputRO big" id="width-'+actID+'">'+cleanOutput(row.width)+'</div></div><div class="row"><label>Lenght (meters)</label><div class="inputRO big" id="length-'+actID+'">'+cleanOutput(row.length)+'</div></div><div class="row"><label>CBM</label><div class="inputRO big">'+cleanOutput(cbm)+'</div></div><div class="row"><label>M/T</label><div class="inputRO big" id="mt-'+actID+'">'+cleanOutput(row.mt)+'</div></div><div class="row"><label>FT</label><div class="inputRO big">'+cleanOutput(ft)+'</div></div><div class="row"><label>Container</label><div class="inputRO big"><div id="containerID-'+actID+'">-</div></div></div><div class="row"><label>Ex Vessel</label><div class="inputRO big">'+cleanOutput(row.exVessel)+'</div></div><div class="row"><label>To Vessel</label><div class="inputRO big">'+cleanOutput(row.toVessel)+'</div></div><div class="row"><label>Ex Truck</label><div class="inputRO big">'+cleanOutput(row.exTruck)+'</div></div><div class="row"><label>To Truck</label><div class="inputRO big">'+cleanOutput(row.toTruck)+'</div></div><div class="row"><label>Dedicated Truck</label><div class="inputRO big">'+cleanOutput(dedicTrk)+'</div></div><div class="row"><label>Origin</label><div class="inputRO big" id="fromBaseID-'+actID+'">-</div></div><div class="row"><label>Destination</label><div class="inputRO big" id="toBaseID-'+actID+'">-</div></div><div class="row"><label>Location</label><div class="inputRO big" id="locationID-'+actID+'">'+cleanOutput(row.locationID)+'</div></div><div class="row"><label>Supplier</label><div class="inputRO big"><div id="supplierID-'+actID+'">-</div></div></div><div class="row"><label>Final Client</label><div class="inputRO big"><div id="finalClientID-'+actID+'">-</div></div></div><div class="row"><label>Thirt Party Service Provider</label><div class="inputRO big"><div id="tpspID-'+actID+'">-</div></div></div><div class="row"><label>Thirt Party Waybill Number</label><div class="inputRO big">'+cleanOutput(row.tpwn)+'</div></div><div class="row"><label>Activity Start</label><div class="inputRO big" id="startDate-'+actID+'">'+cleanOutput(row.startDate)+'</div></div><div class="row"><label>Activity End</label><div class="inputRO big" id="endDate-'+actID+'">'+cleanOutput(row.endDate)+'</div></div><div class="row"><label>Custom Project</label><div class="inputRO big"><div id="projID-'+actID+'">-</div></div></div><div class="row"><label>Comments</label><div class="inputRO">'+cleanOutput(row.comms)+'</div><div class="row"><h1>Pictures</h1></div><div class="row"><div class="input" id="picList-'+actID+'"></div></div>');   
                              
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
    updateData(true,'fdaID',localStorage.fdaID,'reports','endDate',getDateTime());
    changePage('report-general.html',['report-general.js']);
}

function onBackKeyDown() {
    changePage('report-approvals.html',['report-approvals.js']);
}


var actCount = 0;
if (localStorage.title.length > 0) $("#title").text(localStorage.title);
setReviewReportData();

/*$('#sign').signature();
$('#clear').click(function() {
    $('#sign').signature('clear');
});
$('#save').click(function() {
    saveSign(localStorage.fdaID,$('#sign').signature('toJSON'));
});*/