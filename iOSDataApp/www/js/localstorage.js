var db;
var displayedPage;

var Storage = {
	
	initDB: function () 
	{
		try {
			if (!window.openDatabase) {
				alert('not supported');
			} else {
				var shortName = 'CDAppStorage';
				var version = '1.0';
				var displayName = 'CDApp_pate0359';
				var maxSize = 65536; // in bytes
				db = openDatabase(shortName, version, displayName, maxSize);
			}
		} catch(e) {
			// Error handling code goes here.
			if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			} else {
				alert("Unknown error "+e+".");
			}
			return;
		}
		
		//Create tables
		Storage.createTables();
		
		//Get people list
		Storage.getPeopleList();
	},
	
	//CREATE TABLES
	createTables: function () 
	{
		//Create People table
		db.transaction(function(tx) {
			//tx.executeSql('DROP TABLE IF EXISTS people');
			tx.executeSql('CREATE TABLE IF NOT EXISTS people (person_id  integer primary key, person_name varchar)');
		},Storage.dbCreateError,Storage.dbCreateSuccess);
		
		//Create Occasions table
		db.transaction(function(tx) {
			//tx.executeSql('DROP TABLE IF EXISTS occasions ');
			tx.executeSql('CREATE TABLE IF NOT EXISTS occasions (occ_id integer primary key, occ_name varchar)');
		},Storage.dbCreateError,Storage.dbCreateSuccess);
		
		//Create Gift table
		db.transaction(function(tx) {
			//tx.executeSql('DROP TABLE IF EXISTS gifts ');
			tx.executeSql('CREATE TABLE IF NOT EXISTS gifts (gift_id integer primary key, person_id integer, occ_id integer, gift_idea varchar, purchased boolean)');
		},Storage.dbCreateError,Storage.dbCreateSuccess);
	},
	
	/////////////---	PEOPLE 	---////////////////
	insertPeople: function (name) 
	{
		db.transaction(function(tx) {
			tx.executeSql("INSERT INTO people (person_name) VALUES (?)", [name],Storage.dbInsertSuccess,Storage.dbInsertError);
		});
	},
	deletePeople:function(personId)
	{
		 db.transaction(function(tx) {
            tx.executeSql("DELETE from people WHERE person_id=?", [personId],Storage.dbDeleteSuccess,Storage.dbDeleteError);
   		});
	},
	getPeopleList:function()
	{
		db.transaction(function(tx) {
			tx.executeSql( "SELECT * FROM people", [],Storage.dbSelectSuccess,Storage.dbSelectError);
		});		
	},
	
	/////////////---	OCCASION 	---////////////////
	insertOccasion: function (occ) 
	{
		db.transaction(function(tx) {
			tx.executeSql("INSERT INTO occasions (occ_name) VALUES (?)", [occ], Storage.dbInsertSuccess,Storage.dbInsertError);
		});
	},
	deleteOccasion:function(occId)
	{
		db.transaction(function(tx) {
            tx.executeSql("DELETE from occasions WHERE occ_id=?", [occId], Storage.dbDeleteSuccess,Storage.dbDeleteError);
   		});
	},
	getOccasionList:function()
	{
		db.transaction(function(tx) {
			tx.executeSql( "SELECT * FROM occasions", [],Storage.dbSelectSuccess,Storage.dbSelectError);
		});
	},
	
	/////////////---	GIFT 	---////////////////
	insertGift: function (personId,occId,idea) 
	{
		db.transaction(function(tx) {
			tx.executeSql("INSERT INTO gifts (person_id, occ_id, gift_idea, purchased) VALUES (?,?,?,?)", [personId,occId,idea,false], Storage.dbInsertSuccess,Storage.dbInsertError);
		});
	},
	deleteGift:function(giftId)
	{
		 db.transaction(function(tx) {
            tx.executeSql("DELETE from gifts WHERE gift_id=?", [giftId],Storage.dbDeleteSuccess,Storage.dbDeleteError);
   		});
	},
	getGiftListForPerson:function(pid)
	{
		
		//SELECT g.purchased, g.gift_id, g.gift_idea,o.occ_name FROM gifts AS g INNER JOIN occasions AS o ON o.occ_id=g.occ_id WHERE g.person_id=1
		
		db.transaction(function(tx) {
			tx.executeSql( "SELECT g.purchased, g.gift_id, g.gift_idea,o.occ_name FROM gifts AS g INNER JOIN occasions AS o ON o.occ_id=g.occ_id WHERE g.person_id==?", [pid],Storage.dbSelectSuccess,Storage.dbSelectError);
		});
	},
	getGiftListForOccasion:function(occid)
	{
		//SELECT g.purchased, g.gift_id, g.gift_idea,p.person_name FROM gifts AS g INNER JOIN people AS p ON p.person_id=g.person_id WHERE g.occ_id=
		db.transaction(function(tx) {
			tx.executeSql( "SELECT g.purchased, g.gift_id, g.gift_idea,p.person_name FROM gifts AS g INNER JOIN people AS p ON p.person_id=g.person_id WHERE g.occ_id=?", [occid],Storage.dbSelectSuccess,Storage.dbSelectError);
		});
	},
	updateGiftPurchase:function(giftId,boolVal)
	{
		db.transaction(function(tx) {
			tx.executeSql( "UPDATE gifts SET purchased=? WHERE gift_id=?",[boolVal,giftId], Storage.dbUpdateSuccess, Storage.dbUpdateError);
		});
	},
	
	//Error Handling
	dbCreateError:function(transaction,error)
	{
		alert('Oops. Error while creating table - '+error.message+' (Code '+error.code+')');
	},
	dbInsertError:function(transaction,error)
	{
		app.hideModel();
		alert('Oops.  Error while instering data - '+error.message+' (Code '+error.code+')');
	},
	dbDeleteError:function(transaction, error)
	{
		alert('Oops.  Error while deleting data - '+error.message+' (Code '+error.code+')');
	},
	dbSelectError:function(transaction, error)
	{
		alert('Oops.  Error while getting data - '+error.message+' (Code '+error.code+')');
	},
	dbUpdateError:function(transaction, error)
	{
		alert('Oops.  Error while purchasing. - '+error.message+' (Code '+error.code+')');
	},
	
	//Success methods
	dbCreateSuccess:function(transaction, results)
	{
		console.log("dbCreateSuccess");
	},
	dbInsertSuccess:function(transaction, results)
	{
		console.log("dbInsertSuccess :" +displayedPage);
		app.hideModel();
		
		app.insertSucess(displayedPage,results.rows);
		
	},
	dbDeleteSuccess:function(transaction, results)
	{
		console.log("dbDeleteSuccess");
		app.deleteSucess(displayedPage,results.rows);
		
	},
	dbSelectSuccess:function(transaction, results)
	{
		var len = results.rows.length;
		app.AddHTMLforList(displayedPage,results.rows);
		console.log("dbSelectSuccess");
	},
	dbUpdateSuccess:function(transaction, results)
	{
		console.log("updateSucess");
	},
	displayedPage:function(pagename)
	{
		displayedPage=pagename;
	}
}