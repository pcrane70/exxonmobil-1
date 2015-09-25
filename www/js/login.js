checkUserLogin = function() {
    var userPsw = $('#userPsw').val(),
        userID = $('#userID').val();
    if (userID == "") alert("Please, first choose an user name");
    else if (!userPsw) alert("Please, type your password");
        else {
            var today = getDate(),
                userHash = md5(userID+"comequandofuoripiove"+userPsw);
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM datacenterUsers WHERE userID = '"+userID+"' AND userHash='"+userHash+"' AND active = 1 AND userValidFrom <= '"+today+"' AND userValidTo >= '"+today+"'",
                              [],
                              function(tx, rs){
                                  if (rs.rows.length == 1) {
                                      row = rs.rows.item(0);
                                      localStorage.userID = row.userID;
                                      localStorage.userName = row.userName;
                                      var userRoles = localStorage.userRoles = row.userRoles;
                                      // doppio nome per rimpiazzare quello sbagliato
                                      if (userRoles.search(userRolePrefix+'exxonviewer') != -1 || userRoles.search(userRolePrefix+'fdaviewer') != -1) localStorage.userLevel =0;
                                      if (userRoles.search(userRolePrefix+'fdatallyclerk') != -1) localStorage.userLevel =1;
                                      if (userRoles.search(userRolePrefix+'fdasupervisor') != -1) localStorage.userLevel =2;
                                      if (userRoles.search(userRolePrefix+'fdabasesuperintendent') != -1) localStorage.userLevel =3;
                                      if (userRoles.search(userRolePrefix+'fdasuperadmin') != -1) localStorage.userLevel =4;
                                      localStorage.servDate = getDate();
                                      if (localStorage.userLevel == 1) {
                                          preparedByL = [{userID:localStorage.userID,userName:localStorage.userName}];
                                          /*checkedByL = [];
                                          baseSupL = [];
                                          clientApprL = [];*/
                                      }
                                      if (localStorage.userLevel == 2) {
                                          checkedByL = [{userID:localStorage.userID,userName:localStorage.userName}];
                                          //baseSupL = [];
                                          
                                      }
                                      if (localStorage.userLevel == 3) {
                                          baseSupL = [{userID:localStorage.userID,userName:localStorage.userName}];
                                      }
                                      localStorage.approvalConditions = "";
                                      switch (localStorage.userLevel) {
                                        case '2':
                                          localStorage.approvalConditions = "AND (preparedBy IS NOT NULL AND preparedBy <> '') "
                                            + "AND (checkedBy IS NULL OR checkedBy = '')";
                                        break;
                                        case '3':
                                          localStorage.approvalConditions = "AND (preparedBy IS NOT NULL AND preparedBy <> '') "
                                            + "AND (checkedBy IS NOT NULL AND checkedBy <> '') "
                                            + "AND (baseSuperintendentsName IS NULL OR baseSuperintendentsName = '')";
                                        break;
                                      }
                                      changePage("report-list.html",["report-list.js"]);
                                  }    
                                  else alert("Wrong credentials")
                                      },
                              function() {alert("Wrong credentials")});
            });
        }
}

userIDDropdown = function() {
    var today = getDate();
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM datacenterUsers WHERE active = 1 AND userValidFrom <= '"+today+"' AND userValidTo >= '"+today+"' ORDER BY userName ASC", [],
                      function(tx, rs) {
                          for (var i=0; i < rs.rows.length; i++){
                              row = rs.rows.item(i);
                              $("#userID").append('<option value="'+row.userID+'">'+safeDecode(row.userName)+'</option>');
                          }
                          $("#userID").select2();
                          hideShutter();
                      },
                      function(){
                          hideShutter();
                          alert("Impossible to load users list")
                      });
    });
}

dropTables = function(event) {
    //terminalWorker.terminate();
    event.preventDefault();
    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS reports', []);
        tx.executeSql('DROP TABLE IF EXISTS activities', []);
        tx.executeSql('DROP TABLE IF EXISTS clients', []);
        tx.executeSql('DROP TABLE IF EXISTS bases', []);
        tx.executeSql('DROP TABLE IF EXISTS repTypes', []);
        tx.executeSql('DROP TABLE IF EXISTS suppliers', []);
        tx.executeSql('DROP TABLE IF EXISTS ccc', []);
        tx.executeSql('DROP TABLE IF EXISTS cargo', []);
        tx.executeSql('DROP TABLE IF EXISTS datacenterUsers', []);
        tx.executeSql('DROP TABLE IF EXISTS eqTypes', []);
        tx.executeSql('DROP TABLE IF EXISTS tpsp', []);
        tx.executeSql('DROP TABLE IF EXISTS projs', []);
        tx.executeSql('DROP TABLE IF EXISTS locations', []);
        tx.executeSql('DROP TABLE IF EXISTS actTypes', []);
        tx.executeSql('DROP TABLE IF EXISTS cargoStatus', []);
        tx.executeSql('DROP TABLE IF EXISTS suppliers', []);
        tx.executeSql('DROP TABLE IF EXISTS containers', []);
        tx.executeSql('DROP TABLE IF EXISTS pics', []);
        tx.executeSql('DROP TABLE IF EXISTS origDest', []);
        tx.executeSql('DROP TABLE IF EXISTS vessels', []);
        tx.executeSql('DROP TABLE IF EXISTS entities', []);
        tx.executeSql('DROP TABLE IF EXISTS eqCategories', []);
        tx.executeSql('DROP TABLE IF EXISTS blocks', []);
        tx.executeSql('DROP TABLE IF EXISTS fields', []);
        tx.executeSql('DROP TABLE IF EXISTS wells', []);
        tx.executeSql('DROP TABLE IF EXISTS reports_reopen', []);
        tx.executeSql('DROP TABLE IF EXISTS activitiesSBS_related_PCC', []);
    },null,function(){alert("Database dropped")});
};

onBackKeyDown = function() {
    window.location.replace('index.html');
}

/*
usersB = new Bloodhound({
	limit: 10,
    datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.userName); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: usersL
});

usersB.initialize();
var userID = "";
	
$('.typeahead.users').typeahead(null,{
        displayKey: 'userName',
        source: usersB.ttAdapter(),
        items:10
}).on('typeahead:selected', function (obj, datum) {
    userID = datum.userID;
    userEmail = datum.userEmail;
});
*/
$('#userID').selectize({
    maxItems: 1,
    valueField: 'userID',
    labelField: 'userName',
    searchField: 'userName',
    options: usersL,
    create: false,
    onInitialize: addSelectizeRmButton
});

//userIDDropdown();

ts = {"reports":"1970-01-01 01:00:00",
      "activities":"1970-01-01 01:00:00",
      "pics":"1970-01-01 01:00:00",
      "temp":"1970-01-01 01:00:00"};

// adds the logo in the login page
$("img.companyLogo").attr("src", companyLogo);
$("#sn").text("S/N "+device.uuid);

//# sourceURL=login.js
