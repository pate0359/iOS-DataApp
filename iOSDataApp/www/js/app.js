var app = {
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

		var section1 = document.getElementById("people-list");
		var section2 = document.getElementById("occasion-list");

		Hammer(section1).on("swipeleft", function () {
			//			alert("swipeleft");
			$(section1).animate({
				left: "-100%"
			}, 200);
			$(section2).animate({
				left: "0"
			}, 200);
		});

		Hammer(section2).on("swiperight", function () {
			//			alert("swiperight");
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
	}
}

app.init();