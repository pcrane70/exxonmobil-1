setActivityData = function() {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM activities WHERE active=1 AND actID = '"+localStorage.actID+"'", [],
                      function(tx, rs) {
                          row = rs.rows.item(0);
                          $('#eqTypes').val(row.eqTypes);
                          $('#eqDedicTypes').val(row.eqDedicTypes);
                          $('#marks').val(row.marks);
                          setupSelectize();
                          //localStorage.partialEqTypes = row.eqTypes;
                          //if (!row.eqTypes) return;
                          //selectedEq(row.eqTypes);
                          $("#container-fluid").show();
                      },
                      function(){
                      	alert("Error rendering activity informations")
                      });
    });
    
} 

function setupSelectize() {
    $('#eqTypes').selectize({
        plugins: ['remove_button'],
        hideSelected: true,
        valueField: 'eqTypeID',
        labelField: 'eqTypeDesc',
        searchField: 'eqTypeDesc',
        options: eqTypesL,
        create: false,
        onChange : function(eqTypes){ 
            if (eqTypes.length == 0) eqTypes = null;
            updateData(true,'actID',localStorage.actID,'activities','eqTypes',eqTypes);
        },
        onDelete: function(){
            var message = "Do you really want to delete this item?";
            return confirm(message);
        }
    });
    $('#eqDedicTypes').selectize({
        plugins: ['remove_button'],
        hideSelected: true,
        valueField: 'eqTypeID',
        labelField: 'eqTypeDesc',
        searchField: 'eqTypeDesc',
        options: eqDedicTypesL,
        create: false,
        onChange : function(eqDedicTypes){ 
            if (eqDedicTypes.length == 0) eqDedicTypes = null;
            updateData(true,'actID',localStorage.actID,'activities','eqDedicTypes',eqDedicTypes);
        },
        onDelete: function(){
            var message = "Do you really want to delete this item?";
            return confirm(message);
        }
    });
}

/*eqCategoriesButtons = function() {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM eqCategories WHERE active=1 ORDER BY eqCategoryName ASC", [],
                    function(tx, rs) {
                    	for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              $("#eqCategories").append('<input type="button" onclick="equipmentsList(\''+row.eqCategoryQuery+'\',\''+row.eqCategoryName+'\')" class="eqCatBtn" value="'+row.eqCategoryName+'" />');
                        }  
                    	hideShutter();
                    },
                    function(){
                    	hideShutter();
                      	alert("Error rendering equipment buttons")
                    });
    });
    
}

equipmentsList = function(eqCatQuery,eqCatName) {
    localStorage.eqCatQuery = eqCatQuery;
    localStorage.eqCatName = eqCatName;
    changePage("equipments-list.html", ["jquery.touch-multiselect.js","equipments-list.js"]);
}

selectedEq = function(eqTypes) {
    var selected = '';
    if (eqTypes) eqTypesArr = eqTypes.split(','); else eqTypesArr = Array;
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM eqTypes WHERE eqTypeID IN ('"+eqTypes.replaceAll(",","','")+"') ORDER by eqTypeDesc ASC", [],
                      function(tx, rs) {
                          for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              if ($.inArray(row.eqTypeID, eqTypesArr) >= 0) selected = 'selected="selected"'; else selected = '';
                              $("#eqTypeID").append('<option value="'+row.eqTypeID+'" '+selected+' >'+row.eqTypeID+' '+safeDecode(row.eqTypeDesc)+'</option>');
                          }
                          $("#eqTypeID").touchMultiSelect({
                              noneButtonPresent: false,
                              permitNoSelectedButton: true
                          });
                          //on multiselect change event listener
                          $(".touchMultiSelect li").on("click",function(){
                              var selectedValues = $('#eqTypeID').val();
                              if (selectedValues) updateData(true,'actID',localStorage.actID,'activities','eqTypes',selectedValues.toString());
                              else updateData(true,'actID',localStorage.actID,'activities','eqTypes',null);
                          });
                          //
                      },
                      function(){
                          hideShutter();
                          alert("Error rendering equipment types dropdown")
                      });
    });
}*/

$("#joJnLabel").text(localStorage.joJn);

function onBackKeyDown() {
    changePage('report-activities.html',['report-activities.js']);
}

//localStorage.eqCatQuery = "";
//localStorage.eqCatName = "";
setActivityData();
//eqCategoriesButtons();
