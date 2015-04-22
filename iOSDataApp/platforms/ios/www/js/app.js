var _PEOPLE_ = "people";
var _OCCASION_ = "occasions";
var _GIFTPEOPLE_ = "giftPeople";
var _GIFTOCCASION_ = "giftOccasion";
var selectedPage = _PEOPLE_;


var personID, personName;
var occasionID, occasionName;
var fordropdown = false;

var app = {
	selectedPage: selectedPage,
	loadRequirements: 0,
	init: function () {
		document.addEventListener("deviceready", app.onDeviceReady);
		document.addEventListener("DOMContentLoaded", app.onDomReady);
	},
	onDeviceReady: function () {
		app.loadRequirements++;
		if (app.loadRequirements === 2) {
			app.start();
		}
	},
	onDomReady: function () {
		app.loadRequirements++;
		//		if (app.loadRequirements === 2) {
		//			app.start();
		//		}
		app.start();
	},
	start: function () {
		//connect to database
		//build the lists for the main pages based on data
		//add button and navigation listeners

		//Set default page is "People List"
		Storage.displayedPage(_PEOPLE_);
		selectedPage=_PEOPLE_;
		//Open database
		Storage.initDB();

		var section1 = document.getElementById("people-list");
		var section2 = document.getElementById("occasion-list");

		Hammer(section1).on("swipeleft", function () {
			//			alert("swipeleft");

			Storage.displayedPage(_OCCASION_);
			selectedPage=_OCCASION_;
			//Get occasion list
			Storage.getOccasionList();

			$(section1).animate({
				left: "-100%"
			}, 200);
			$(section2).animate({
				left: "0"
			}, 200);
		});

		Hammer(section2).on("swiperight", function () {
			//			alert("swiperight");


			//Set default page is "People List"
			Storage.displayedPage(_PEOPLE_);
			selectedPage=_PEOPLE_;
			//Get people list
			Storage.getPeopleList();

			$(section1).animate({
				left: "0"
			}, 200);
			$(section2).animate({
				left: "100%"
			}, 200);
		});

		var elem = document.getElementById('mySwipe');
		window.mySwipe = Swipe(elem, {
			// startSlide: 4, 
			// auto: 3000, 
			// continuous: true, 
			// disableScroll: true, 
			// stopPropagation: true, 
			// callback: function(index, element) {}, 
			// transitionEnd: function(index, element) {} 
		});

		var elem = document.getElementById('mySwipe1');
		window.mySwipe1 = Swipe(elem, {
			// startSlide: 4, 
			// auto: 3000, 
			// continuous: true, 
			// disableScroll: true, 
			// stopPropagation: true, 
			// callback: function(index, element) {}, 
			// transitionEnd: function(index, element) {} 
		});
	},
	AddPeopleOccation: function (ev) {
		var target = ev.currentTarget;
		var pageName = target.getAttribute("displaypage");
		//alert(pageName);

		if (pageName == _PEOPLE_) {
			
			document.getElementById("new-per-occ").placeholder="Add person name";
			
			selectedPage = _PEOPLE_;
			document.querySelector("#add-person-occasion h3").innerHTML = "Add New Person";

		} else if (pageName == _OCCASION_) {
			
			document.getElementById("new-per-occ").placeholder="Add occasion";
			
			selectedPage = _OCCASION_;
			document.querySelector("#add-person-occasion h3").innerHTML = "Add New Occasion";
		}

		document.getElementById("add-person-occasion").style.display = "block";
		document.querySelector("[data-role=overlay]").style.display = "block";
	},
	AddGift: function (ev) {
		var target = ev.currentTarget;
		var pageName = target.getAttribute("displaypage");

		//alert(pageName);
		
		document.getElementById("new-idea").value="";
		

		if (pageName == _GIFTPEOPLE_) {
			
			document.getElementById("new-idea").placeholder="Add gift for person";
			
			selectedPage = _GIFTPEOPLE_;
			document.querySelector("#add-gift h3").innerHTML = "Add new gift for " + personName;

			document.querySelector(".dropdown-toggle").innerHTML = "Occasions <span class=\"caret\"></span>";
			
			fordropdown = true;
			Storage.displayedPage(selectedPage);
			Storage.getOccasionList();

		} else if (pageName == _GIFTOCCASION_) {
			
			document.getElementById("new-idea").placeholder="Add gift for occasion";
			
			selectedPage = _GIFTOCCASION_;
			document.querySelector("#add-gift h3").innerHTML = "Add new gift for " + occasionName;
			
			document.querySelector(".dropdown-toggle").innerHTML = "Persons <span class=\"caret\"></span>";
			

			fordropdown = true;
			Storage.displayedPage(selectedPage);
			Storage.getPeopleList();
			
		}

		document.getElementById("add-gift").style.display = "block";
		document.querySelector("[data-role=overlay]").style.display = "block";
	},
	AddHTMLToDropDown: function (pagename, array) {

		var ul = document.querySelector(".giftdropdown");
		ul.innerHTML = "";
		var li = "";

		if (pagename == _GIFTOCCASION_) {
			for (var i = 0; i < array.length; i++) {
				li += "<li class=\"list-group-item\"> <a id=" + array.item(i).person_id + " name=" + array.item(i).person_name + "' href=\"#\">" + array.item(i).person_name + "</a></li>";

				console.log(array.item(i).person_name);
			}

		} else if (pagename == _GIFTPEOPLE_) {

			for (var i = 0; i < array.length; i++) {
				li += "<li class=\"list-group-item\"> <a id=" + array.item(i).occ_id + " name=" + array.item(i).occ_name + "' href=\"#\">" + array.item(i).occ_name + "</a></li>";

				console.log(array.item(i).occ_name);
			}
		}
		ul.innerHTML = li;
		
//		<li><a tabindex="-1" href="#">AB</a>
//					</li>
		
		//Drop down selection
		$(".dropdown-menu li a").click(function () {
			$(this).parents(".input-group-btn").find('.btn').val($(this).data('value'));
			$(this).parents(".input-group-btn").find('.btn').html(
				
				$(this).text() + "  <span class=\"caret\"></span>"
			);
			
			if (selectedPage == _GIFTOCCASION_) {
				
				personID=$(this).attr("id");
				personName=$(this).attr("name");
				
				console.log("personid "+personID+" personName "+personName);
				
			} else if (selectedPage == _GIFTPEOPLE_) {
				
				occasionID=$(this).attr("id");
				occasionName=$(this).attr("name");
				
				console.log("OCid "+occasionID+" OccName "+occasionName);
			}	
			
			
		});
	},
	hideModel: function () {
		document.getElementById("add-person-occasion").style.display = "none";
		document.querySelector("[data-role=overlay]").style.display = "none";

		document.getElementById("add-gift").style.display = "none";
		document.querySelector("[data-role=overlay]").style.display = "none";

	},
	save: function () {
		if (selectedPage == _PEOPLE_) {
			var name = document.getElementById("new-per-occ").value;
			Storage.displayedPage(selectedPage);
			Storage.insertPeople(name);
			document.getElementById("new-per-occ").value = "";

		} else if (selectedPage == _OCCASION_) {
			var occ = document.getElementById("new-per-occ").value;
			Storage.displayedPage(selectedPage);
			Storage.insertOccasion(occ);
			document.getElementById("new-per-occ").value = "";

		} else if (selectedPage == _GIFTPEOPLE_) {
						
			Storage.displayedPage(selectedPage);
			
			var ideaText=document.getElementById("new-idea").value;
			Storage.insertGift(personID,occasionID,ideaText);

		} else if (selectedPage == _GIFTOCCASION_) {
			
			Storage.displayedPage(selectedPage);
			var ideaText=document.getElementById("new-idea").value;
			Storage.insertGift(personID,occasionID,ideaText);
		}
	},
	insertSucess: function (pagename, array) {
		
		app.getListForPage(pagename);
	},
	deleteSucess: function (pagename, array)
	{
		app.getListForPage(pagename);
	},
	getListForPage:function(pagename)
	{
		if (pagename == _PEOPLE_) {
			//Get people list
			Storage.getPeopleList();

		} else if (pagename == _OCCASION_) {
			//Get people list
			Storage.getOccasionList();

		} else if (pagename == _GIFTPEOPLE_) {
			//Get gift list
			fordropdown = false;
			Storage.getGiftListForPerson(personID);

		} else if (pagename == _GIFTOCCASION_) {
			//Get gift list
			fordropdown = false;
			Storage.getGiftListForOccasion(occasionID);
		}
	},
	AddHTMLforList: function (pagename, array) {
		if (pagename == _PEOPLE_) {
			
			document.querySelector(".peopleList").innerHTML = "";

			for (var i = 0; i < array.length; i++) 
			{
				var li = document.createElement("li");
				li.innerHTML = array.item(i).person_name;
				li.setAttribute("id", array.item(i).person_id);
				li.setAttribute("name", array.item(i).person_name);
				li.setAttribute("class","list-group-item");
				li.setAttribute("swipeFor","people");
				
				app.addHammerGestures(li);
				document.querySelector('.peopleList').appendChild(li);
			}

		} else if (pagename == _OCCASION_) {
			
			document.querySelector(".occasionList").innerHTML = "";

			for (var i = 0; i < array.length; i++) 
			{
				var li = document.createElement("li");
				li.innerHTML = array.item(i).occ_name;
				li.setAttribute("id", array.item(i).occ_id);
				li.setAttribute("name", array.item(i).occ_name);
				li.setAttribute("class","list-group-item");
				li.setAttribute("swipeFor","occasion");
				app.addHammerGestures(li);
				document.querySelector('.occasionList').appendChild(li);
			}

		} else if (pagename == _GIFTPEOPLE_) {
			if (fordropdown == true) {
				app.AddHTMLToDropDown(pagename, array);
			} else {
				
				document.querySelector(".giftForPersonList").innerHTML = "";
				for (var i = 0; i < array.length; i++) 
				{
					var li = document.createElement("li");
					li.innerHTML = array.item(i).gift_idea+ " - " +array.item(i).occ_name;
					li.setAttribute("id", array.item(i).gift_id);
					li.setAttribute("name", array.item(i).gift_idea);
					li.setAttribute("purchased", array.item(i).purchased);
					li.setAttribute("occ_name", array.item(i).occ_name);
					
										
					var span = document.createElement("span");
//					span.setAttribute("class", "span");
//					console.log("purchased people - "+array.item(i).purchased);
					var isPurchased=array.item(i).purchased
					if(isPurchased == "true")
					{
						span.innerHTML="Purchased";						
					}else{
						span.innerHTML="";
					}
					li.appendChild(span);
					li.setAttribute("class","list-group-item");
					app.addHammerGestures(li);
					document.querySelector('.giftForPersonList').appendChild(li);
				}
			}

		} else if (pagename == _GIFTOCCASION_) {
			if (fordropdown == true) {
				app.AddHTMLToDropDown(pagename, array);
			} else {
				document.querySelector(".giftOccasionList").innerHTML = "";
				for (var i = 0; i < array.length; i++) 
				{
					var li = document.createElement("li");
					li.innerHTML = array.item(i).gift_idea+ " - " +array.item(i).person_name;
					li.setAttribute("id", array.item(i).gift_id);
					li.setAttribute("name", array.item(i).gift_idea);
					li.setAttribute("purchased", array.item(i).purchased);
					li.setAttribute("person_name", array.item(i).person_name);
					
					var span = document.createElement("span");
//					span.setAttribute("class", "span");
					//console.log("purchased occ- "+array.item(i).purchased);
					var isPurchased=array.item(i).purchased
					
					if(isPurchased == "true")
					{
						span.innerHTML="Purchased";
						
					}else{
						span.innerHTML="";
					}
					li.appendChild(span);
					li.setAttribute("class","list-group-item");
					app.addHammerGestures(li);
					document.querySelector('.giftOccasionList').appendChild(li);
				}
			}
		}
	},
	addHammerGestures: function (element) {
		// Add Hammer double tap event
		var mc = new Hammer.Manager(element);
		// Tap recognizer with minimal 2 taps
		mc.add(new Hammer.Tap({
			event: 'doubletap',
			taps: 2
		}));
		// Single tap recognizer
		mc.add(new Hammer.Tap({
			event: 'singletap'
		}));
		// we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
		mc.get('doubletap').recognizeWith('singletap');
		// we only want to trigger a tap, when we don't have detected a doubletap
		mc.get('singletap').requireFailure('doubletap');
		
		mc.on("singletap doubletap", function (ev) {
			
			var target = ev.target;
			console.log(target.getAttribute("name"));
			
			
			if (selectedPage == _PEOPLE_) {
				if (ev.type == "singletap") 
				{
					//MOVE NEXT OR UPDATE PURCHASED
					//alert("singleTap");
					
					personID = target.getAttribute("id");
					personName = target.getAttribute("name")
					
					//giftForPersonList
					//Get gift list
					fordropdown = false;
					Storage.displayedPage(_GIFTPEOPLE_);
					selectedPage=_GIFTPEOPLE_;
					Storage.getGiftListForPerson(personID);
					
					mySwipe.next();

				} else if (ev.type == "doubletap") {

					//DELETE
					//alert("doubleTap");
					var personId = target.getAttribute("id");
					Storage.displayedPage(_PEOPLE_);
					selectedPage=_PEOPLE_;
					Storage.deletePeople(personId);
				}
				
			} else if (selectedPage == _OCCASION_) {
				if (ev.type == "singletap") 
				{
					//MOVE NEXT OR UPDATE PURCHASED
					//alert("singleTap");
					
					occasionID = target.getAttribute("id");
					occasionName = target.getAttribute("name")
					

					//Get gift list
					fordropdown = false;
					Storage.displayedPage(_GIFTOCCASION_);
					selectedPage=_GIFTOCCASION_;
					Storage.getGiftListForOccasion(occasionID);
					
					mySwipe1.next();

				} else if (ev.type == "doubletap") {
					
					//DELETE
					var occid = target.getAttribute("id");
					Storage.displayedPage(_OCCASION_);
					selectedPage=_OCCASION_;
					Storage.deleteOccasion(occid);
					//alert("doubleTap");
				}
				
			} else if (selectedPage == _GIFTPEOPLE_) {
				if (ev.type == "singletap") 
				{
					//MOVE NEXT OR UPDATE PURCHASED
					//alert("singleTap");
					
					var giftid = target.getAttribute("id");
					var purchased = target.getAttribute("purchased");
					if(purchased == "true")
					{
						//Update storage
						Storage.updateGiftPurchase(giftid,false);
						
						//Update UI
						target.querySelector("span").innerHTML="";
						target.setAttribute("purchased", false);
						
					}else{
						//Update storage
						Storage.updateGiftPurchase(giftid,true);
						
						//Update UI
						target.querySelector("span").innerHTML="Purchased"; 
						target.setAttribute("purchased", true);
//						var span = document.createElement("span");
//						span.innerHTML="Purchased";
//						target.appendChild(span);
					}
					
				} else if (ev.type == "doubletap") {

					//DELETE
					var giftid = target.getAttribute("id");
					Storage.displayedPage(_GIFTPEOPLE_);
					selectedPage=_GIFTPEOPLE_;
					Storage.deleteGift(giftid);
					//alert("doubleTap");
				}
			} else if (selectedPage == _GIFTOCCASION_) {
				if (ev.type == "singletap") 
				{
					//MOVE NEXT OR UPDATE PURCHASED
					//alert("singleTap");
					
					var giftid = target.getAttribute("id");
					var purchased = target.getAttribute("purchased");
					if(purchased == "true")
					{
						//Update storage
						Storage.updateGiftPurchase(giftid,false);
						//UPDATE UI
						target.querySelector("span").innerHTML="";
						target.setAttribute("purchased", false);
						
					}else{
						//Update storage
						Storage.updateGiftPurchase(giftid,true);
						//Update UI
						target.querySelector("span").innerHTML="Purchased"; 
						target.setAttribute("purchased", true);
//						var span = document.createElement("span");
//						span.innerHTML="Purchased";
//						target.appendChild(span);
					}

				} else if (ev.type == "doubletap") {

					//DELETE
					var giftid = target.getAttribute("id");
					Storage.displayedPage(_GIFTOCCASION_);
					selectedPage=_GIFTOCCASION_;
					Storage.deleteGift(giftid);
					//alert("doubleTap");
				}
			}
		});
	},
	movePrev: function (ev) {
		var target = ev.currentTarget;
		console.log(target.getAttribute("name"));

		if (target.getAttribute("backButton") == "people") {
			
			selectedPage=_PEOPLE_;
			mySwipe.prev()
			
		} else if (target.getAttribute("backButton") == "occasion") {
			
			selectedPage=_OCCASION_;
			mySwipe1.prev()
		}
	}
}

app.init();