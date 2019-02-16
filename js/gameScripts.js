// // Station Factory 
// class stationFactory {
// 	function buildStation() {
// 	};
// };

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
var gameModule = (function () {
	// As the game progresses, move stations into displayedStations and delete from dataSet
    var start = true;  // There's probably a better way to do this.    
	var dataSet = new Map();
	var sortedSet = [];
	var displayedStations = new Map();
    var afBottom;
	var afDisplay;
	// Station Object
	class station {
		constructor(options) {
			this.name = options.name || '';
			this.lines = options.lines || [];
			this.ridership = options.ridership || 0;
		};
	};
	var onTouchStartBottomScrollContainer = function(evt) { 
		// Get x location of finger press to use in tap events
		gameModule.bottomScrollContainer.touchStartX = evt.touches[0].pageX;
		evt.preventDefault();
		
		console.log('00000-----New Event-----00000');
	};
	var onPressMoveBottomScrollContainer = function(evt) {
		// Skip function if animation already underway
		if (gameModule.animateBottomScroll == true) { return; }
		// Move stationOrd element along x axis
		var screenMiddle = window.screen.width * .5;
		var curLeft = gameModule.stationOrd.offsetLeft;
		var newPosition = evt.deltaX + curLeft;

		// If there is a station selected, unselect it while scrolling
		var selected = document.getElementsByClassName("selectedStation")[0] || null;
		if (selected != null) {
			selected.classList.remove("selectedStation");
			document.getElementsByClassName("stationOrder__selectedStationLabel")[0].innerText = "";
		}
		// Move stationOrd, restricting it from leaving the screen entirely
		if(newPosition > screenMiddle) {
			newPosition = screenMiddle;
		}
		else if(newPosition < screenMiddle - gameModule.stationOrd.offsetWidth) {
			newPosition = screenMiddle - gameModule.stationOrd.offsetWidth;
		}
		gameModule.stationOrd.style.left = newPosition + "px";
	};
	var onTouchEndBottomScrollContainer = function() {
		// Skip function if animation already underway
		if (gameModule.animateBottomScroll == false) {
			lockBottomScroll( null, true );
		}
		
		console.log('touchEnd');
	};
    var onTapBottomScrollContainer = function() {
        // Skip function if animation already underway
        if (gameModule.animateBottomScroll == true) { return; }
        var screenWidth = window.screen.width;
        var selected = document.getElementsByClassName("selectedStation")[0] || null;
        var stationToLock = null;
        if (selected != null) {
            // Select left station
            if (gameModule.bottomScrollContainer.touchStartX < screenWidth * .4) {
                stationToLock = selected.previousElementSibling;
            }
            // Select right station
            else if (gameModule.bottomScrollContainer.touchStartX > screenWidth * .6) {
                stationToLock = selected.nextElementSibling;
            }
            else { stationToLock = selected; }
            // Remove previous selection and lock on new selection    
            if(stationToLock != null) {            
                // Lock on newly selected station
                lockBottomScroll(stationToLock, true);
            }
        }

        console.log("--tap:\n" + parseInt(gameModule.bottomScrollContainer.touchStartX / (screenWidth/3)));
	};
	function buildStation() {
	};
	function scrapeFile(input) {
		const file = input.target.files[0];
		const reader = new FileReader();
	
		reader.onload = (event) => {
			const file = event.target.result;
			const allLines = file.split(/\r\n|\n/);
			// Reading line by line
			allLines.forEach((line) => {
				console.log(line);
			});
		};
	
		reader.onerror = (event) => {
			alert(event.target.error.name);
		};
	};	   
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
        dataSet = new Map();
        displayedStations = new Map();

		dataSet.set( "14th St-Union Square", {
			name: "14th St-Union Square",
			lines: ["4", "5", "6", "n", "q", "r", "l"],
			ridership: 34557551,
			rank: 8
		});
		dataSet.set( "Grand Central-42nd St", {
			name: "Grand Central-42nd St",
			lines: ["4", "5", "6", "7", "s"],
			ridership: 44928488,
			rank: 10
		});
		dataSet.set("Times Square-42 St", {
			name: "Times Square-42 St",
			lines: ["n", "q", "r", "w", "s", "1", "2", "3", "7", "a", "c", "e"],
			ridership: 64815739,
			rank: 12
		});
		dataSet.set( "34 St-Herald Sq", {
			name: "34 St-Herald Sq",
			lines: ["n", "q", "r", "w", "m", "f", "d", "b"],
			ridership: 39672507,
			rank: 9
		});
		dataSet.set("34 St-Penn Station", {
			name: "34 St-Penn Station",
			lines: ["1", "2", "3", "a", "c", "e"],
			ridership: 50400738,
			rank: 11		
		});
		dataSet.set("Fulton St", {
			name: "Fulton St",
			lines: ["a", "c", "j", "z", "2", "3", "4", "5"],
			ridership: 26838473,
			rank: 7
		});
		dataSet.set("59 St-Columbus Circle", {
			name: "59 St-Columbus Circle",
			lines: ["a", "c", "d", "b", "1"],
			ridership: 22929203,
			rank: 6
		});
		dataSet.set("Lexington Av / 59 St", {
			name: "Lexington Av / 59 St",
			lines: ["4", "5", "6", "n", "w", "r"],
			ridership: 17888188,
			rank: 3
		});
		dataSet.set("86 St", {
			name: "86 St",
			lines: ["4", "5", "6"],
			ridership: 14277369,
			rank: 0
		});
		dataSet.set("Lexington Av-53 St", {
			name: "Lexington Av-53 St",
			lines: ["e", "m", "6"],
			ridership: 18940774,
			rank: 5
		});
		dataSet.set("Flushing-Main St", {
			name: "Flushing-Main St",
			lines: ["7"],
			ridership: 18746832,
			rank: 4
		});
		dataSet.set("47-50 Sts-Rockefeller Center", {
			name: "47-50 Sts-Rockefeller Center",
			lines: ["b", "d", "f", "m"],
			ridership: 17471620,
			rank: 2
		});
		dataSet.set("74-Bway/Jackson Hts-Roosevelt Av", {
			name: "74-Bway/Jackson Hts-Roosevelt Av",
			lines: ["e"],
			ridership: 17095073,
			rank: 1
		});

		// Put stations into sorted array to check for locking adjacent stations later
		dataSet.forEach(function(value, key, map) {
			sortedSet.push(map.get(key));
		});
		sortedSet.sort(function(a, b) {return a.ridership - b.ridership;});
	};
	function returnClassNameFromLineName( lineName ) {
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
	function checkSwipeVsSelected( swipedStation, direction ) {
		/* 
		*	check the displayCard vs the selectedStation. 
		*	swipedStation is a string
		*	direction is a number. > 0 is right swipe. < 0 is left swipe.
		*/
	  
		// Check for game start/win/lose events
		if(swipedStation == "Game Over" || swipedStation == "You Win") {
            gameModule.init()
			return;
		} else if (swipedStation == "Subway Riders") {
            changeDisplayCard(getRandomStationName());
            return;
        } else if(gameModule.getSelectedStation() == null) {
			addToBottomScroll(swipedStation);
			changeDisplayCard( getRandomStationName() );
			afBottom.on('touchStart', onTouchStartBottomScrollContainer);
            afBottom.on('pressMove', onPressMoveBottomScrollContainer);
            afBottom.on('touchEnd', onTouchEndBottomScrollContainer);
			afBottom.on('tap', onTapBottomScrollContainer);
            return;    
        }

		// Check for locked adjacent stations 
		if((direction == 1) && gameModule.selectedStation.classList.contains('lockedMore')) {
			return;
		} else if((direction == -1) && gameModule.selectedStation.classList.contains('lockedLess')) {
			return;
		}

		// store stations in "card" and "selected" then compare
		var card = dataSet.get(swipedStation);
		var selected = displayedStations.get(gameModule.getSelectedStation().getElementsByClassName("stationOrder__station--label")[0].innerText);
		var rightStation = gameModule.getSelectedStation().nextElementSibling;
		if (rightStation != null) {
			rightStation = displayedStations.get(rightStation.getElementsByClassName("stationOrder__station--label")[0].innerText);
		}
		var leftStation = gameModule.getSelectedStation().previousElementSibling;
		if (leftStation != null) {
			leftStation = displayedStations.get(leftStation.getElementsByClassName("stationOrder__station--label")[0].innerText);
		}

        // more temporary test code to help with comparisons
        console.log(card.ridership + ": " + card.name + "\n" + selected.ridership + ": " + selected.name);
        // end test code
        
		//	Need to check against selected and adjacent stations
		if (direction > 0 && selected.ridership < card.ridership) {
			// Check station to right of selected	
			if (rightStation == null) {
				addToBottomScroll(swipedStation);
			}
			else if (card.ridership < rightStation.ridership) {
				addToBottomScroll(swipedStation);	
			}
			else {
				displayLoseScreen([card, selected, rightStation]);
            	return;
			}
		} else if (direction < 0 && card.ridership < selected.ridership) { 
			// Check station to left of selected
			if (leftStation == null) {
				addToBottomScroll(swipedStation);
			} 
			else if (leftStation.ridership < card.ridership) {
				addToBottomScroll(swipedStation);
			} else {
				displayLoseScreen([card, selected, leftStation]);
            	return;
			}
		} else {  
            displayLoseScreen([card, selected]);
            return;
        }
        
        // WIN CONDITION check (if dataSet of stations is empty)
        if(dataSet.size < 1) {
            console.log('dataSet is empty! You Win!');
            displayWinScreen();
		}
		else {
			changeDisplayCard( getRandomStationName() );			
		}
	}
	function getRandomStationName() {
		// find a random station name from all station names not yet added to bottom of the screen
		var keyArray = Array.from(dataSet.keys());

		return keyArray[ Math.floor(keyArray.length * Math.random()) ];
	}
	function changeDisplayCard( stationName ) {
		// change the displayCard that you swipe to test against selectedStation
		console.log("adding " + stationName + " card");
        
		var _html = "<hr><h1 class='displayCard__title'>" + stationName + "</h1>";
		_html += "<div class='displayCard__lines'>";

		// add line circles to main card
		var lines = dataSet.get(stationName).lines;
		for (var i = 0; i < lines.length; i++) {
			_html += addLineToDisplayCard(lines[i]) + " ";
		};
		_html += "</div>";
		gameModule.displayCard.innerHTML = _html;
	}
	function addToBottomScroll( stationToAdd ) {        
		// grab a random line from the station to use as the display station for the botton bar:
		var lineName = dataSet.get(stationToAdd).lines[Math.floor(dataSet.get(stationToAdd).lines.length * Math.random())];
		var className = returnClassNameFromLineName(lineName);
		var newStation = null;
		
        var _html = "<div class='stationOrder__station " + className + "'>";
		_html += "<h1 class='stationOrder__station--label'>" + stationToAdd + "</h1>";
		_html += "<h1 class='stationOrder__station--lineLabel'>"+ lineName.toUpperCase() +"</h1>";
		_html += "</div>";

		// it's less hacky to create a temporary dom element than use a hidden one
		var temp = document.createElement("template");
		temp.innerHTML = _html.trim(); // remove extra whitespace
                
        // Insert stationToAdd into stationOrder in correct ranking of ridership
        if(gameModule.getSelectedStation() == null) {
            newStation = gameModule.stationOrd.appendChild(temp.content.firstChild);
        }
        else {
            var stationOrdChildren = gameModule.stationOrd.children;  
            // Cycle through stationOrd to find correct rank
            for (let chi of stationOrdChildren) {
				var added = false;
                var chiName = chi.getElementsByClassName("stationOrder__station--label")[0].innerText;
				var chiRiders = displayedStations.get(chiName).ridership;
				var chiRank = displayedStations.get(chiName).rank;
				var addRiders = dataSet.get(stationToAdd).ridership;
				var addRank = dataSet.get(stationToAdd).rank;
				if(chi.nextElementSibling != null) {
					var nextStation = chi.nextElementSibling;
 					var nextRank = displayedStations.get(nextStation.getElementsByClassName("stationOrder__station--label")[0].innerText).rank;
				}
				else nextRank = -9;

				// Left of current
				if(addRank < chiRank) {
					newStation = gameModule.stationOrd.insertBefore(temp.content.firstChild, chi);
					// Directly left of current
					if (addRank == chiRank - 1) {
						chi.classList.add('lockedLess');
						newStation.classList.add('lockedMore');
					}
					added = true;
					break;
				}
				// Directly right of current
				else if (addRank == chiRank + 1) {
					newStation = gameModule.stationOrd.insertBefore(temp.content.firstChild, chi.nextElementSibling)
					chi.classList.add('lockedMore');
					newStation.classList.add('lockedLess');
					// Check next station ahead for locking purposes
					if(addRank == nextRank - 1) {
						newStation.classList.add('lockedMore');
						nextStation.classList.add('lockedLess');
					}
					added = true;
					break;
				}
			} 
			// Right of last station, but not directly
			if(added == false) {
				newStation = gameModule.stationOrd.appendChild(temp.content.firstChild);
			}
		}
        
		// move the station into displayed stations and delete from dataSet
		displayedStations.set(stationToAdd, dataSet.get(stationToAdd));
        dataSet.delete(stationToAdd);  
        lockBottomScroll(gameModule.getSelectedStation(), false);
        
		console.log("addToBottomScroll:\n--" + stationToAdd);

		return newStation;
	}
	function lockBottomScroll ( stationToLock=null, animate=false ) {
        // Skip function if animation already underway
        if (gameModule.animateBottomScroll == true) { return; }
        // Skip function if stationOrd is empty
        var stationOrdChildren = gameModule.stationOrd.children;
        if (stationOrdChildren.length < 1) {return;}
		// stationToLock is a dom element or null
        var screenMiddle = window.screen.width * .5;
		var sOLeft = gameModule.stationOrd.offsetLeft;
		
        // if a swipe, then stationToLock will be null, so we have to find the most middle station
		if (stationToLock == null || stationToLock == undefined) {
            //find closest button to center
			var closestAmount = screenMiddle;
			// cycle through children until you find the closest child to the center. 
			// select it
			for (let chi of stationOrdChildren) {
				var centerOfStation = chi.offsetLeft + (chi.offsetWidth*.5);
                var difference = Math.abs(screenMiddle - (centerOfStation + sOLeft));
				if (difference < closestAmount) {
					closestAmount = difference;
					stationToLock = chi;                    
				}
			}    
		} 
		// if you tapped on a station, stationToLock should already be set

		// Reset gameModule.selectedStation
		if(gameModule.getSelectedStation() != null) {
			gameModule.getSelectedStation().classList.remove("selectedStation");
		//	document.getElementsByClassName("stationOrder__selectedStationLabel")[0].innerText = "";
		}
		gameModule.selectedStation = stationToLock;        
		// select station by making it bigger and removing outline
		stationToLock.classList.add("selectedStation");
		// set bottom text to station name
		document.getElementsByClassName("stationOrder__selectedStationLabel")[0].innerText = stationToLock.children[0].innerText;

        // Instantly correct position to lock selected station in middle
        if(animate == false) {
            gameModule.stationOrd.style.left = (screenMiddle - (stationToLock.offsetLeft + (stationToLock.offsetWidth * .5))) + "px";
        }
        // Animate scroll to lock selected station in middle
        else {
			afBottom.off('touchStart', onTouchStartBottomScrollContainer);
            afBottom.off('pressMove', onPressMoveBottomScrollContainer);
            afBottom.off('touchEnd', onTouchEndBottomScrollContainer);
			afBottom.off('tap', onTapBottomScrollContainer);
			gameModule.animateBottomScroll = true;
            gameModule.animate();
        }
        
        console.log("lockBottomScroll:\n--" + stationToLock.getElementsByClassName('stationOrder__station--label')[0].innerHTML);
	}
    function displayStartScreen () {
		var startingStation = getRandomStationName();

        gameModule.animateDisplayCard = false;
        gameModule.animateBottomScroll = false;
		gameModule.displayCard.innerHTML = "";

        // Display instructions
        // it's less hacky to create a temporary dom element than use a hidden one
		var _html = "<hr><h1 class='displayCard__title'>Subway Riders</h1>";
		_html += "<p>Rank stations in order of annual ridership.</p><br>"
		_html += "<p><-----Swipe this station sign left if it has fewer riders than " + startingStation + ".</p><br>";
		_html += "<p align='right'>----->Swipe right if it has more riders than " + startingStation + ".</p><br>";
		_html += "<p>Scroll along the bottom to select a different station. ";
		_html += "Swipe either direction to start.</p>"
		var temp = document.createElement("template");
		temp.innerHTML = _html.trim(); // remove extra whitespace
		gameModule.displayCard.appendChild(temp.content);

		addToBottomScroll(startingStation);
		lockBottomScroll();
    }
    function displayLoseScreen (stationArray) {
        // This function is called by checkSwipeVsSelected when player answers incorrectly.
        gameModule.animateDisplayCard = false;
        gameModule.animateBottomScroll = false;
		console.log("Game Over, dude!");     
		
		var newElement = addToBottomScroll(gameModule.displayCard.getElementsByClassName('displayCard__title')[0].innerText);
		lockBottomScroll(newElement, true);
		var currentSelected = newElement.getElementsByClassName("stationOrder__station--label")[0].innerText;

		stationArray.sort(function(a, b) {return a.ridership - b.ridership});

        // it's less hacky to create a temporary dom element than use a hidden one
		var _html = "<hr><h1 class='displayCard__title'>Game Over</h1><br><br>";
		_html += "The correct placement of " + currentSelected + " is shown below.<br>"

		_html += "<br><h3>Swipe here to play again.</h3>";
		var temp = document.createElement("template");
		temp.innerHTML = _html.trim(); 
		gameModule.displayCard.innerHTML = "";
		gameModule.displayCard.appendChild(temp.content);
    }
    function displayWinScreen () {
        // This function is called by checkSwipeVsSelected when dataSet runs out of stations.
        gameModule.animateDisplayCard = false;
        gameModule.animateBottomScroll = false;
        console.log("Winner, winner, chicken dinner!");      
    
        gameModule.displayCard.innerHTML = "";

        // it's less hacky to create a temporary dom element than use a hidden one
        var _html = "<hr><h1 class='displayCard__title'>You Win</h1><br><h3>Swipe to play again.</h3>";
		var temp = document.createElement("template");
		temp.innerHTML = _html.trim(); 
		gameModule.displayCard.appendChild(temp.content);    
    }

	// ——————— ——————— public methods below
	return {
		getDataSet: function() {
			// dataSet is private
			return dataSet;
		},
		getSelectedStation: function() {
			// selectedStation is dependent on document state
			return document.getElementsByClassName('selectedStation')[0];
		},
		displayCard: "",
		stationOrd: "",
        bottomScrollContainer: "",
		selectedStation: null,
		setupSwipeEvent: function () {
			// ————— ————— ————— ————— set up swipe event for bottom container
            afBottom = new AlloyFinger(this.bottomScrollContainer, {
                touchStart: onTouchStartBottomScrollContainer,
				pressMove: onPressMoveBottomScrollContainer, 
				touchEnd: onTouchEndBottomScrollContainer, 
                tap: onTapBottomScrollContainer
			});

			// ————— ————— ————— ————— set up swipe event for main card
			Transform(this.displayCard);
			afDisplay = new AlloyFinger(this.displayCard, {
			    pressMove:function(evt){
			    	var maxMove = 100;
                    if ( Math.abs(gameModule.displayCard.translateX + evt.deltaX) <= maxMove) {
			        	gameModule.displayCard.translateX += evt.deltaX;
			        } else {
			        	if (gameModule.displayCard.translateX < 0) 
                            gameModule.displayCard.translateX = -maxMove;
			        	if (gameModule.displayCard.translateX > 0) 
                            gameModule.displayCard.translateX = maxMove;
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

					// did you swipe long enough to check the card, and is the swipe direction locked?
			    	if (percentageOfMove > completePercentage) {
			    		checkSwipeVsSelected( gameModule.displayCard.getElementsByClassName("displayCard__title")[0].innerText, 1 );
			    	} else if (percentageOfMove < -completePercentage) {
			    		checkSwipeVsSelected( gameModule.displayCard.getElementsByClassName("displayCard__title")[0].innerText, -1 );
			    	}

			    	gameModule.animateDisplayCard = true;
			    	gameModule.animate();
			    }
			});
		},
		init: function () {
            // Reset game state variables
            gameModule.animateDisplayCard = false;
            gameModule.animateBottomScroll = false;
            gameModule.selectedStation = null;
            
            // Initialize game object properties to doc elements
            gameModule.displayCard = document.getElementsByClassName("displayCard")[0];
            gameModule.bottomScrollContainer = document.getElementsByClassName('bottomScrollContainer')[0];
            gameModule.stationOrd = document.getElementsByClassName("stationOrder")[0];

            // Clear existing stations to start fresh
            gameModule.stationOrd.innerHTML = '';
            gameModule.stationOrd.style.left = "0px";
            document.getElementsByClassName("stationOrder__selectedStationLabel")[0].innerText = "";
            
            setupDataObject();
            
            displayStartScreen();
            
            if (start) {
                start = false;
                gameModule.setupSwipeEvent();
            }
            // afBottom.off('touchStart', onTouchStartBottomScrollContainer);
            // afBottom.off('pressMove', onPressMoveBottomScrollContainer);
            // afBottom.off('touchEnd', onTouchEndBottomScrollContainer);
            // afBottom.off('tap', onTapBottomScrollContainer);
		},
		// ———— ———— animation flags:
		animateDisplayCard: false,
		animateBottomScroll: false,
		animate: function () {
			/* 
			*	recursive call to the animation funciton. 
			*	call gameModule.animate() after setting animation flags to true
			*	and animate will call itself until flags are false. 
			*/
			if (gameModule.animateDisplayCard) {
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
		    		gameModule.animateDisplayCard = false;
			    	gameModule.displayCard.translateX = 0;
			    	gameModule.displayCard.rotateX = 0;
			    	gameModule.displayCard.rotateY = 0;
			    	gameModule.displayCard.rotateZ = 0;
		    	}
		    }
		    if (gameModule.animateBottomScroll) {
                // Animate selected station to center of screen
                var stationToLock = gameModule.getSelectedStation();
                if (stationToLock != null && stationToLock != undefined) {
                    var screenMiddle = window.screen.width *.5;
                    var current = parseInt(gameModule.stationOrd.style.left);
                    var final = screenMiddle - (stationToLock.offsetLeft + (stationToLock.offsetWidth * .5));
					var step = Math.max(Math.abs(final - current) * .15, 3);
                    var allowance = step + 1;

                    if(current > final && (current > (final + allowance))) {
                        // move left - 
                        gameModule.stationOrd.style.left = (current - step) + "px";   
                    }
                    else if(current < final && (current < (final - allowance))) {
                        // move right +
                        gameModule.stationOrd.style.left = (current + step) + "px";
                    }
                    else {
                        // End animation
                        gameModule.stationOrd.style.left = final + "px";
						gameModule.animateBottomScroll = false;
						afBottom.on('touchStart', onTouchStartBottomScrollContainer);
						afBottom.on('pressMove', onPressMoveBottomScrollContainer);
						afBottom.on('touchEnd', onTouchEndBottomScrollContainer);
						afBottom.on('tap', onTapBottomScrollContainer);
                    }                             
                }
		    }
			if (gameModule.animateDisplayCard || gameModule.animateBottomScroll) { 
				// recursion. window.request... is a more performant animation function than setInterval
				window.requestAnimationFrame(gameModule.animate); 
			}
		}
	}
})();