/*
*	Main Game engine
*
* 	There is one global object that the game runs with, "gameModule"
*	All functions are based inside that global object
*	The object is set up in the gameModule.init() function called from body => onload
*
*	Anything with "function" is private inside of gameModule
*
*	Anything in the "return" are publically accessible. You can call them from 
*		anywhere else in the code as decendents of gameModule. (eg "gameModule.getDataSet();" )
*
*	
*
*/

var timeout = null;
var gameModule = (function () {
	// As the game progresses, move stations into displayedStations and delete from dataSet
	var dataSet = new Map();
	var displayedStations = new Map();
	function setupDataObject() {
		/*
		*	Syntaxt for acessing data:
		*	dataSet.get( [station name as string] ).ridership
		*	
		* 	eg: "dataSet.get('34 St-Herald Sq').ridership" returns 39672507 as a number
		*	"dataSet.get('34 St-Herald Sq').lines" returns an array of strings: ["n", "q", "r", "w", "m", "f", "d", "b"]
		*
		*	The logic here is that we can use the names of stations as the key for an associative array
		*	That way, we can just call any data from a station using its name
		*	(The downside is that it's rather easy to mistype/spell station names, so watch for that)
		*/

		dataSet.set( 
			"14th St-Union Square", {
			lines: ["4", "5", "6", "n", "q", "r", "l"],
			ridership: 34557551
		});
		dataSet.set( "Grand Central-42nd St", {
			lines: ["4", "5", "6", "7", "s"],
			ridership: 44928488
		});
		dataSet.set("Times Square-42 St", {
			lines: ["n", "q", "r", "w", "s", "1", "2", "3", "7", "a", "c", "e"],
			ridership: 64815739
		});
		dataSet.set( "34 St-Herald Sq", {
			lines: ["n", "q", "r", "w", "m", "f", "d", "b"],
			ridership: 39672507
		});
		dataSet.set("34 St-Penn Station", {
			lines: ["1", "2", "3", "a", "c", "e"],
			ridership: 50400738		
		});
		dataSet.set("Fulton St", {
			lines: ["a", "c", "j", "z", "2", "3", "4", "5"],
			ridership: 26838473
		});
		dataSet.set("59 St-Columbus Circle", {
			lines: ["a", "c", "d", "b", "1"],
			ridership: 22929203
		});
		dataSet.set("Lexington Av / 59 St", {
			lines: ["4", "5", "6", "n", "w", "r"],
			ridership: 17888188
		});
		dataSet.set("86 St", {
			lines: ["4", "5", "6"],
			ridership: 14277369
		});
		dataSet.set("Lexington Av-53 St", {
			lines: ["e", "m", "6"],
			ridership: 18940774
		});
		dataSet.set("Flushing-Main St", {
			lines: ["7"],
			ridership: 18746832
		});
		dataSet.set("47-50 Sts-Rockefeller Center", {
			lines: ["b", "d", "f", "m"],
			ridership: 17471620
		});
		dataSet.set("74-Bway/Jackson Hts-Roosevelt Av", {
			lines: ["e"],
			ridership: 17095073
		});
	};
	function returnClassNameFromLineName(lineName) {
		// the line names don't line up with the css for their color
		// this function takes a line name (eg a, 6, l) and returns the css for it's color
		var className;
		switch(lineName) {
			case "4":
			case "5":
			case "6":
				className = "fourfivesix";
				break;
			case "n":
			case "q":
			case "r":
			case "w":
				className = "nqrw";
				break;
			case "1":
			case "2":
			case "3":
				className = "onetwothree";
				break;
			case "a":
			case "c":
			case "e":
				className = "ace";
				break;
			case "j":
			case "z":
				className = "jz";
				break;
			case "b":
			case "d":
			case "f":
			case "m":
				className = "bdfm";
				break;
			case "7":
				className = "seven";
				break;
			default:
				className = lineName;
				break;
		}
		return className;
	};
	function addLineToDisplayCard( lineName ) {
		// put a line on the center card
		// concatenate html into one string then return that string
		var _html = '';
		var className = returnClassNameFromLineName(lineName);
		_html += "<div class='displayCard__lines--circle ";
		_html += className + "'>" + lineName.toUpperCase() + "</div>";
		return _html;
	}
	function checkSwipeVsSelected(swipedStation, direction) {
		/* 
		*	check the displayCard vs the selectedStation. 
		*	swipedStation is a string
		*	direction is a number. > 0 is right swipe. < 0 is left swipe.
		*/
		gameModule.selectedStation = document.getElementsByClassName("selectedStation")[0];		

/*
		if (gameModule.selectedStation === null || gameModule.selectedStation === undefined) {
			// if first station. There is nothing to compare, just add it!
			console.log("current Station was null or undefined!");
			addToBottomScroll( getRandomStationName() );
            changeDisplayCard( getRandomStationName() );
			return; // ignore below and return void
		}
*/
		// store ridership in "current" and "selected" then compare
		var card = dataSet.get(swipedStation).ridership;
		var selected = displayedStations.get( gameModule.selectedStation.getElementsByClassName("stationOrder__station--label")[0].innerText ).ridership;
		
        // more temporary test code to help with comparisons
        console.log(card + ": " + swipedStation + "\n" + selected + ": " + gameModule.selectedStation.getElementsByClassName("stationOrder__station--label")[0].innerText);
        // end test code
        
		/*
		*	Future step! (Issue created on github)
		* 	Need to check against all added stations
		*	Right now, we're only checking against the selected station
		*/
		if (card > selected && direction > 0) { // bigger swipe (right)
			addToBottomScroll(swipedStation);
		} else if (card < selected && direction < 0){ // smaller swipe (left)
			addToBottomScroll(swipedStation);
		}
        else {  
             console.log("Game Over!")
        }
		changeDisplayCard( getRandomStationName() );
	}
	function getRandomStationName() {
		// find a random station name from all station names not yet added
		var keyArray = Array.from(dataSet.keys());

		return keyArray[ Math.floor(keyArray.length * Math.random()) ];
	}
	function changeDisplayCard(stationName) {
		// change the displayCard that you swipe to test against selectedStation
        // If stationName is null, use a random station from data set
//        if(stationName === null || stationName === undefined) {
//            stationName = getRandomStationName();
//        }
        if(dataSet.size < 1) {
// DATASET IS OUT OF STATIONS. WIN CONDITION???
console.log('dataSet is empty! You Win!');            
        }
		console.log("adding " + stationName + " card");
        
        gameModule.displayCard = document.getElementsByClassName("displayCard")[0];

		var _html = "<hr><h1 class='displayCard__title'>" + stationName + "</h1>";
		_html += "<div class='displayCard__lines'>";

		// add line circles to main card
		var lines = dataSet.get(stationName).lines;
		for (var i = lines.length - 1; i >= 0; i--) {
			_html += addLineToDisplayCard(lines[i]) + " ";
		};
		_html += "</div>";
		gameModule.displayCard.innerHTML = _html;
	}
	function addToBottomScroll( stationToAdd ) {
        // Initialize stationOrd by adding a random station at game start
//        if(stationToAdd == null || stationToAdd == undefined) {
//            stationToAdd = getRandomStationName();
//        }
		console.log(stationToAdd + " Added to bottom!");

		// "stationOrder" is the class name of the bottom bar. 
		// we could improve performance by storing this in a variable like gameModule.displayCard
        gameModule.stationOrd = document.getElementsByClassName("stationOrder")[0];
        
		// grab a random line from the station to use as the display station for the botton bar:
		var lineName = dataSet.get(stationToAdd).lines[Math.floor(dataSet.get(stationToAdd).lines.length * Math.random())];
		var className = returnClassNameFromLineName(lineName);
		var _html = "<div class='stationOrder__station " + className + "'>";
		_html += "<h1 class='stationOrder__station--label'>" + stationToAdd + "</h1>";
		_html += "<h1 class='stationOrder__station--lineLabel'>"+ lineName.toUpperCase() +"</h1>";
		_html += "</div>";

		// it's less hacky to create a temporary dom element than use a hidden one
		var temp = document.createElement("template");
		temp.innerHTML = _html.trim(); // remove extra whitespace
		console.log("Temp is " + temp.innerHTML);
		gameModule.stationOrd.appendChild(temp.content.firstChild);
		// move the station into displayed stations and delete from dataSet
		displayedStations.set(stationToAdd, dataSet.get(stationToAdd));
        dataSet.delete(stationToAdd);        
	}
	function lockBottomScroll ( stationToLock ) {
		// stationToLock is a dom element or null
		// eventually we should click on a station and it'll scroll to it
        gameModule.stationOrd = document.getElementsByClassName('stationOrder')[0];        
		var stationOrdChildren = gameModule.stationOrd.children;
		var bSLeft = gameModule.stationOrd.offsetLeft;
		var bSWidth = gameModule.stationOrd.offsetWidth;
		var screenMiddle = window.screen.width * .5;
		
        // if a swipe, then stationToLock will be null, so we have to find the most middle station
		if (stationToLock == null || stationToLock == undefined) {
            //find closest button to center
			var closestAmount = screenMiddle;
			// cycle through children until you find the closest child to the center. 
			// select it
			for (let chi of stationOrdChildren) {
				var centerOfStation = chi.offsetLeft + (chi.offsetWidth*.5);
                var difference = Math.abs(screenMiddle - (centerOfStation + bSLeft));
				if (difference < closestAmount) {
					closestAmount = difference;
					stationToLock = chi;                    
				}
			}    
		}
		// if you pressed on a button, stationToLock should already be set
               
		// select station by making it bigger and removing outline
		stationToLock.classList.add("selectedStation");
		console.log(stationToLock.children[0]);
		gameModule.selectedStation = stationToLock;        
		// set bottom text to station name
		document.getElementsByClassName("stationOrder__selectedStationLabel")[0].innerText = stationToLock.children[0].innerText;
        // Animate scroll to lock selected station in the screen middle
        gameModule.animateBottomSlide = true;
        gameModule.animate();
	}

	// ——————— ——————— public methods below
	return {
		getDataSet: function() {
			// dataSet is private
			return dataSet;
		},
		displayCard: "",
		stationOrd: "",
        bottomScrollContainer: "",
		selectedStation: null,
		setupSwipeEvent: function () {
			// ————— ————— ————— ————— set up swipe event for bottom container
            gameModule.bottomScrollContainer = document.getElementsByClassName('bsc')[0];           

			new AlloyFinger(this.bottomScrollContainer, {
				pressMove: function(evt) {
					var selected = document.getElementsByClassName("selectedStation")[0] || null;
					if (selected != null) {
						selected.classList.remove("selectedStation");
                        document.getElementsByClassName("stationOrder__selectedStationLabel")[0].innerText = "";
// FUTURE?
// Add inertia scrolling to swipes?                        
					}
                    // Move stations with swipe, restricting stations from leaving the screen
					var curLeft = gameModule.stationOrd.offsetLeft;
                    var newPosition = evt.deltaX + curLeft;
                    var screenMiddle = window.screen.width * .5;
                    if(newPosition > screenMiddle) {
                        newPosition =  screenMiddle;
                    }
                    else if(newPosition < screenMiddle - gameModule.stationOrd.offsetWidth) {
                        newPosition = screenMiddle - gameModule.stationOrd.offsetWidth;
                    }
					gameModule.stationOrd.style.left = newPosition + "px";
				}, 
				touchEnd: function(evt) {
					lockBottomScroll();
				}
			});

			// ————— ————— ————— ————— set up swipe event for main card
			Transform(this.displayCard);
			new AlloyFinger(this.displayCard, {
			    pressMove:function(evt){
			    	if (timeout != null) clearInterval(timeout);
			    	var maxMove = 100;
			    	// var limit = Math.min(evt.deltaX
			    	if ( Math.abs(gameModule.displayCard.translateX + evt.deltaX) <= maxMove) {
			        	gameModule.displayCard.translateX += evt.deltaX;
			        } else {
			        	if (gameModule.displayCard.translateX < 0) gameModule.displayCard.translateX = -maxMove;
			        	if (gameModule.displayCard.translateX > 0) gameModule.displayCard.translateX = maxMove;
			        }
			        evt.preventDefault();

			    	var percentageOfMove = gameModule.displayCard.translateX/maxMove;
			    	var xRotationMax = 10,
			    		yRotationMax = 20,
			    		zRotationMax = 10;
			    	gameModule.displayCard.rotateX = Math.abs(percentageOfMove) * xRotationMax;
			    	gameModule.displayCard.rotateY = percentageOfMove * yRotationMax;
			    	gameModule.displayCard.rotateZ = percentageOfMove * zRotationMax;
			    },
			    // Either: Check to see if the card should add, 
			    // OR: Put the card back into place
			    touchEnd: function() {
			    	// touchEnd is a function from Alloy. It's when your finger lifts 
			    	var maxMove = 100;
			    	var completePercentage = .85;
			    	var percentageOfMove = gameModule.displayCard.translateX/maxMove;

			    	// did you swipe long enough to check the card?
			    	if (gameModule.displayCard.translateX/maxMove > completePercentage) {
			    		checkSwipeVsSelected( gameModule.displayCard.getElementsByClassName("displayCard__title")[0].innerText, 1 );
			    	} else if (gameModule.displayCard.translateX/maxMove < -completePercentage) {
			    		checkSwipeVsSelected( gameModule.displayCard.getElementsByClassName("displayCard__title")[0].innerText, -1 );
			    	}

			    	gameModule.animateMainCard = true;
			    	gameModule.animate();
		    		
			    }
			});
		},
		init: function () {
			setupDataObject();
            // init stationOrder bar with 3 random stations            
            addToBottomScroll( getRandomStationName() );
            addToBottomScroll( getRandomStationName() );            
            addToBottomScroll( getRandomStationName() );
            lockBottomScroll();

            // init displayCard with random station            
            changeDisplayCard( getRandomStationName() );

            gameModule.setupSwipeEvent();
		},
		// ———— ———— animation flags:
		animateMainCard: false,
		animateBottomSlide: false,
		animate: function () {
			/* 
			*	recursive call to the animation funciton. 
			*	call gameModule.animate() after setting animation flags to true
			*	and animate will call itself until flags are false. 
			*/
			if (gameModule.animateMainCard) {
		    	var maxMove = 100;
		    	var xRotationMax = 10,
		    		yRotationMax = 20,
		    		zRotationMax = 10;
		    	var easeAmount = .55;
		    	gameModule.displayCard.translateX += (0 - gameModule.displayCard.translateX) * easeAmount;
		    	var percentageOfMove = gameModule.displayCard.translateX/maxMove; // calculate after movement for rotation
		    	gameModule.displayCard.rotateX = Math.abs(percentageOfMove) * xRotationMax;
		    	gameModule.displayCard.rotateY = percentageOfMove * yRotationMax;
		    	gameModule.displayCard.rotateZ = percentageOfMove * zRotationMax;
		    	// end and reset the animation if you're close enough
		    	if (Math.abs(percentageOfMove) < .05) {
		    		gameModule.animateMainCard = false;
			    	gameModule.displayCard.translateX = 0;
			    	gameModule.displayCard.rotateX = 0;
			    	gameModule.displayCard.rotateY = 0;
			    	gameModule.displayCard.rotateZ = 0;
		    	}
		    }
		    if (gameModule.animateBottomSlide) {
		    	// Move until the selected station is in the middle
		    	// this is where the bottom slide should lock in place
                // FUTURE!
                // animate scroll parent to that spot
                // here's a non-animated fix 
                // offset container to lock selected station in center of screen
                var stationToLock = document.getElementsByClassName("selectedStation")[0];
                if (stationToLock != null && stationToLock != undefined) {
                    var screenMiddle = window.screen.width *.5;
                    var adjust = stationToLock.offsetLeft + (stationToLock.offsetWidth * .5);
                    gameModule.stationOrd.style.left = (screenMiddle - adjust) + "px";
                }
                // End scroll animation (for future use)
                if(gameModule.stationOrd.style.left == ((screenMiddle - adjust) + "px")) {
                    gameModule.animateBottomSlide = false;
                }
		    }
			if (gameModule.animateMainCard || gameModule.animateBottomSlide) { 
				// recursion. window.request... is a more performant animation function than setInterval
				window.requestAnimationFrame(gameModule.animate); 
			}
		}
	}
})();



