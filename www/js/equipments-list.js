setActivityData = function() {
    $("#eqCatName").text(localStorage.eqCatName);
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM activities WHERE active=1 AND actID = '"+localStorage.actID+"'", [],
                      function(tx, rs) {
                          
                          row = rs.rows.item(0);
                          eqList(row.eqTypes);
                      },
                      function(){
                        hideShutter();
                      	alert("Error rendering activity informations")
                      });
    });
    
} 

eqList = function(eqTypes) {
    var selected = '', position;
    if (eqTypes) eqTypesArr = eqTypes.split(','); else eqTypesArr = [];
    eqOutOfList = eqTypesArr; 
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM eqTypes WHERE eqTypeID LIKE '"+localStorage.eqCatQuery+"' ORDER by eqTypeID ASC", [],
        //tx.executeSql("SELECT * FROM eqTypes WHERE eqTypeID IN ('"+eqTypes.replaceAll(",","','")+"') ORDER by eqTypeDesc ASC", [],
                      function(tx, rs) {
                          for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              if ($.inArray(row.eqTypeID, eqTypesArr) >= 0) {
                                  selected = 'selected="selected"'; 
                                  position = eqOutOfList.indexOf(row.eqTypeID);;
                                  if ( ~position ) eqOutOfList.splice(position, 1);
                              }
                            else {
                                selected = '';
                            }
                              $("#eqTypeID").append('<option value="'+row.eqTypeID+'" '+selected+' >'+row.eqTypeID+' '+safeDecode(row.eqTypeDesc)+'</option>');
                          }
                          $("#eqTypeID").touchMultiSelect({
                              noneButtonPresent: false,
                              permitNoSelectedButton: true
                          });
                          //on multiselect change event listener
                          $(".touchMultiSelect li").on("click",function(){
                              var selectedValues = $('#eqTypeID').val();
                              selectedValues = selectedValues.concat(eqOutOfList);
                              if (selectedValues) updateData(true,'actID',localStorage.actID,'activities','eqTypes',selectedValues.toString());
                              else updateData(true,'actID',localStorage.actID,'activities','eqTypes',null);
                          });
                          hideShutter();
                      },
                      function(){
                          hideShutter();
                          alert("Error rendering equipment types dropdown")
                      });
    });
}   

function onBackKeyDown() {
    changePage('activity-equipment.html',['jquery.touch-multiselect.js','activity-equipment.js']);
}

var eqOutOfList = Array;
setActivityData();
