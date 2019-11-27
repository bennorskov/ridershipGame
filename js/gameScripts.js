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
var once = true;
var htmlT = '';
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
	function moveRightBar(direction) {
		// extraSpace adds margin at the top of a station
		// if there are stations in the direction selected, add "extraSpace" class to the next station dot

		var station = gameModule.getStationWithSpace();
		
		if (station != null) {
			station.classList.remove("extraSpace");
			if (direction == 1 && once) {
				once = false;
				if (station.nextElementSibling != null) {
					console.log('add sibling');
					station.nextElementSibling.classList.add("extraSpace");
				}
			}
			if (direction == -1 && once) {
				once = false;
				if (station.previousElementSibling != null)
					station.previousElementSibling.classList.add("extraSpace");
			}

			// move right side bar container
			var top = Number( gameModule.stationOrd.style.top.substring(0, gameModule.stationOrd.style.top.indexOf('%')) );
			var rightBarMoveAmount = document.getElementsByClassName("stationOrder__stationSelected")[0].offsetHeight;
			rightBarMoveAmount = rightBarMoveAmount / window.innerHeight;
			rightBarMoveAmount *= 100;
			console.log("rightBarMoveAmount " + rightBarMoveAmount);
			top += rightBarMoveAmount * -direction;
			gameModule.stationOrd.style.top = top + "%";
			
		} else {
			// if there's only one station, or if there's no station, each needs a different handler
		}
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
	function checkSwipeVsSelected( swipedStation ) {
		/* 
		*	check the displayCard vs the selectedStation. 
		*	swipedStation is a string of the station name
		*/
	  
		// Check for game start/win/lose events
		if(swipedStation == "Game Over" || swipedStation == "You Win") {
            gameModule.init()
			return;
		} else if (swipedStation == "Subway Riders") {
			// start card
            changeDisplayCard(getRandomStationName());
            return;
        } else if(gameModule.getStationWithSpace() == null && displayedStations.size == 0) {
        	// if there is no stations, it's the first one. add it and grab another
			addToRightSide(swipedStation);
			changeDisplayCard( getRandomStationName() );
            return;    
        }

        // comparison for station ridership
		var currentStationData = dataSet.get(swipedStation);
		var bottomStationRidership, topStationRidership;
		// return the DOM element with space on top for the station you're adding
		bottomStationRidership = gameModule.getStationWithSpace(); 
		if (bottomStationRidership == undefined) {
			// if there is no station with space, then we add to the end of the list
			bottomStationRidership = 0; // dummy data for compare later
			topStationRidership = displayedStations.get(gameModule.stationOrd.lastElementChild.innerText).ridership;
			// above line is last station currently displayed. 
		} else {
			// see how much the ridership is below:
			bottomStationRidership = displayedStations.get(bottomStationRidership.getElementsByClassName("stationOrder__station--label")[0].innerText).ridership;
			// grab the station above:
			topStationRidership = gameModule.getStationWithSpace().previousElementSibling;
			if (topStationRidership != null) {
				// if there is one, then grab its ridership
				topStationRidership = displayedStations.get(topStationRidership.getElementsByClassName("stationOrder__station--label")[0].innerText).ridership;
			} else {
				topStationRidership = 999999999; // make a "dummy" top station that everything is less than
			}
		}
		
        // console.log("swiped: " + currentStationData.ridership + ": " + currentStationData.name + "\n" + bottomStationRidership + " < bottom | top => " + topStationRidership);
        
		//	Need to check against spaceStation and topStation
		if (currentStationData.ridership > bottomStationRidership && currentStationData.ridership < topStationRidership) {
			addToRightSide(swipedStation);
		} else {  
			console.log ("YOU LOST!");
			return;
            displayLoseScreen([currentStationData, spaceStation]);
            return;
        }
        
        // WIN CONDITION check (if dataSet of stations is empty)
        if(dataSet.size < 1) {
            console.log('dataSet is empty! You Win!');
            displayWinScreen();
		} else {
			changeDisplayCard( getRandomStationName() );			
		}
	}
	function getRandomStationName() {
		// find a random station name from all station names not yet added to bottom of the screen
		var keyArray = Array.from(dataSet.keys());

		return keyArray[ Math.floor(keyArray.length * Math.random()) ];
	}
	function changeDisplayCard( stationName ) {
		// change the displayCard of the main circle        
		var _html = "<hr><h1 class='displayCard__title'>" + stationName + "</h1>";
		_html += "<div class='displayCard__lines'>";

		// add line circles to main card
		var lines = dataSet.get(stationName).lines;
		for (var i = 0; i < lines.length; i++) {
			_html += addLineToDisplayCard(lines[i]) + " ";
		};
		_html += "</div>";
		gameModule.displayCard.innerHTML = _html;
		changeDisplayCircle(lines[0]);		
	}
	function changeDisplayCircle(_lineName) {
		// Change the Display circle contents and color
		gameModule.displayStationCircle.innerHTML = _lineName.toUpperCase();
		// only take first class
		gameModule.displayStationCircle.classList = gameModule.displayStationCircle.classList[0];
		// add in the correct class name based on the line of that station
		gameModule.displayStationCircle.classList.add( returnClassNameFromLineName(_lineName) );
		// Future Polish: make the displayCricle slowly cycle through all the stations
	}
	function addToRightSide( stationToAdd ) {   
		// grab a random line from the station to use as the display station for the botton bar:
		var lineName = dataSet.get(stationToAdd).lines[Math.floor(dataSet.get(stationToAdd).lines.length * Math.random())];
		var className = returnClassNameFromLineName(lineName);
		var newStation = null;
		
        var _html = "<div class='stationOrder__station " + className + "'>";
		_html += "<h1 class='stationOrder__station--label'>" + stationToAdd + "</h1>";
		_html += "</div>";

		// it's less hacky to create a temporary dom element than use a hidden one
		var temp = document.createElement("template");
		temp.innerHTML = _html.trim(); // add elements and remove extra whitespace
                
        var spaceStation = gameModule.getStationWithSpace();
        // Insert stationToAdd into stationOrder based on current space
        if(spaceStation == null) {
            newStation = gameModule.stationOrd.appendChild(temp.content.firstChild);
            newStation.classList.add("extraSpace");
        } else {
        	gameModule.stationOrd.insertBefore(temp.content.firstChild, spaceStation);
        	/*
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
			}*/
		}
        
		// move the station into displayed stations and delete from dataSet
		displayedStations.set(stationToAdd, dataSet.get(stationToAdd));
        dataSet.delete(stationToAdd);  
		return newStation;
	}
    function displayStartScreen () {
		var startingStation = getRandomStationName();
        gameModule.animateDisplayCircle = false;
		gameModule.displayCard.innerHTML = "";

		changeDisplayCard(getRandomStationName());

		// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----  TEST CODE
		// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----  TEST CODE
		// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----  TEST CODE
		// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----  TEST CODE
		return;

		// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----  TEST CODE
		// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----  TEST CODE
		// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----  TEST CODE
		// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----  TEST CODE
		// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----  TEST CODE

        // Display instructions
        // it's less hacky to create a temporary dom element than use a hidden one
		var _html = "<hr><h1 class='displayCard__title'>Subway Riders</h1>";
		_html += "<p>Rank stations in order of how many folks use them.</p><br>"
		_html += "<p>Swipe this station sign left or right if you want to see more stations</p><br>";
		_html += "<p>Swipe down to start.</p><br>";
		_html += "<p>Scroll along the bottom to select a different station. </p>";
		var temp = document.createElement("template");
		temp.innerHTML = _html.trim(); // remove extra whitespace
		gameModule.displayCard.appendChild(temp.content);

		addToRightSide(startingStation);
    }
    function displayLoseScreen (stationArray) {
        // This function is called by checkSwipeVsSelected when player answers incorrectly.
        gameModule.animateDisplayCircle = false;
		console.log("Game Over, dude!");     
		
		var newElement = addToRightSide(gameModule.displayCard.getElementsByClassName('displayCard__title')[0].innerText);
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
        gameModule.animateDisplayCircle = false;
        console.log("Winner, winner, chicken dinner!");      
    
        gameModule.displayCard.innerHTML = "";

        // it's less hacky to create a temporary dom element than use a hidden one
        var _html = "<hr><h1 class='displayCard__title'>You Win</h1><br><h3>Swipe to play again.</h3>";
		var temp = document.createElement("template");
		temp.innerHTML = _html.trim(); 
		gameModule.displayCard.appendChild(temp.content);    
    }

	// ——————— ——————— ——————— ——————— public methods below
	return {
		getDataSet: function() {
			// dataSet is private
			return dataSet;
		},
		getDisplayedStations: function() {
			// dataSet is private
			return displayedStations;
		},
		getStationWithSpace: function() {
			// selectedStation is dependent on document state
			return document.getElementsByClassName('extraSpace')[0];
		},
		displayCardTouchContainer: "",
		stationOrd: "",
		selectedStation: null,
		maxMoveX: 140,
		maxMoveY: 100,
		setupSwipeEvent: function () {

			// ————— ————— ————— ————— set up swipe event for main circle
			Transform(this.displayStationCircle);
			afDisplay = new AlloyFinger(this.displayStationCircle, {
			    pressMove:function(evt){
			    	// pressMove only updates the display of the station card.
			    	// all checks to see if it was swiped down enough happen in touchEnd()
			    	var maxMoveX = gameModule.maxMoveX;
			        var maxMoveY = gameModule.maxMoveY;

			    	// limit amount of movement on the x axis
                    if ( Math.abs(gameModule.displayStationCircle.translateX + evt.deltaX) <= maxMoveX) {
			        	gameModule.displayStationCircle.translateX += evt.deltaX;
			        	gameModule.displayStationCircle.translateX = (gameModule.displayStationCircle.translateX < 0) ? 0 : gameModule.displayStationCircle.translateX;
			        } else {
			        	if (gameModule.displayStationCircle.translateX < 0) 
                            gameModule.displayStationCircle.translateX = -maxMoveX; 
			        	if (gameModule.displayStationCircle.translateX > 0) 
                            gameModule.displayStationCircle.translateX = maxMoveX;
			        }

			        // limit amount of movement on the Y axis
			        if ( Math.abs(gameModule.displayStationCircle.translateY + evt.deltaY) <= maxMoveY) {
				    	gameModule.displayStationCircle.translateY += evt.deltaY;
			        } else {
			        	if (gameModule.displayStationCircle.translateY < 0) 
                            gameModule.displayStationCircle.translateY = -maxMoveY;
			        	if (gameModule.displayStationCircle.translateY > 0) 
                            gameModule.displayStationCircle.translateY = maxMoveY;
			        }
			        evt.preventDefault();

			        // swipe rotation movement limits
			    	var percentageOfMoveX = gameModule.displayStationCircle.translateX/maxMoveX;
			    	var percentageOfMoveY = gameModule.displayStationCircle.translateY/maxMoveY;
			    	var xRotationMax = 20,
				        yRotationMax = 20,
			    		zRotationMax = 10;
			    	gameModule.displayStationCircle.rotateX = percentageOfMoveY * xRotationMax;
			    	gameModule.displayStationCircle.scaleX = 1.2-percentageOfMoveX;
			    	gameModule.displayStationCircle.scaleY = 1.2-percentageOfMoveX;
			    	//gameModule.displayStationCircle.rotateZ = percentageOfMoveX * zRotationMax;

		    		var moveRightBarThreshhold = .8;

			    	// If the card is far enough up or down, animate the right station bar
			    	if (Math.abs(percentageOfMoveY) > moveRightBarThreshhold) {
			    		console.log("Move Right Bar! " + percentageOfMoveY);
			    		var direction = (percentageOfMoveY>0) ? 1 : -1;
			    		moveRightBar(direction);
			    	}

			    },
			    // Either: Check to see if the card should add, 
			    // OR: Put the card back into place
			    touchEnd: function() {
			    	// When your finger leaves the station display card
			    	var maxMove = gameModule.maxMoveX;
			    	var completePercentage = .85;
			    	var percentageOfMove = gameModule.displayStationCircle.translateX/maxMove;

					// did you swipe long enough to add the card to the right?
			    	if (percentageOfMove > completePercentage) {
			    		checkSwipeVsSelected( gameModule.displayCard.getElementsByClassName("displayCard__title")[0].innerText);
			    	} else if (percentageOfMove < -completePercentage) {
			    		checkSwipeVsSelected( gameModule.displayCard.getElementsByClassName("displayCard__title")[0].innerText);
			    	} 

			    	// turn on animations to put the circle back
			    	gameModule.animateDisplayCircle = true;
			    	gameModule.animate();
			    }
			});
		},
		init: function () {
            // Reset game state variables
            gameModule.animateDisplayCircle = false;
            gameModule.selectedStation = null;
            
            // Initialize game object properties to doc elements
            gameModule.displayCard = document.getElementsByClassName("displayCard")[0];
            gameModule.displayStationCircle = document.getElementsByClassName("displayStationCircle")[0];
            gameModule.displayCardTouchContainer = document.getElementsByClassName("displayCardTouchContainer")[0];
            gameModule.bottomScrollContainer = document.getElementsByClassName('bottomScrollContainer')[0];
            gameModule.stationOrd = document.getElementsByClassName("stationOrder")[0];

            // Clear existing stations to start fresh
            //gameModule.stationOrd.innerHTML = '';
            gameModule.stationOrd.style.top = "35%";
            
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
		animateDisplayCircle: false,
		animate: function () {
			/* 
			*	recursive call to the animation funciton. 
			*	call gameModule.animate() after setting animation flags to true
			*	and animate will call itself until flags are false. 
			*/
			if (gameModule.animateDisplayCircle) {
		    	var maxMoveX = gameModule.maxMoveX;
		        var maxMoveY = gameModule.maxMoveY;
		    	var xRotationMax = 10;
		    		yRotationMax = 10,
		    		zRotationMax = 10;
		    	var easeAmount = .35;
		    	gameModule.displayStationCircle.translateX += (0 - gameModule.displayStationCircle.translateX) * easeAmount;
		    	gameModule.displayStationCircle.translateY += (0 - gameModule.displayStationCircle.translateY) * easeAmount;
		    	var percentageOfMoveX = gameModule.displayStationCircle.translateX/maxMoveX; // calculate after movement for rotation
		    	var percentageOfMoveY = gameModule.displayStationCircle.translateY/maxMoveY;
		    	gameModule.displayStationCircle.rotateX = percentageOfMoveY * xRotationMax;
		    	gameModule.displayStationCircle.scaleX = 1.3-percentageOfMoveX;
		    	gameModule.displayStationCircle.scaleY = 1.3-percentageOfMoveX;
		    	gameModule.displayStationCircle.rotateZ = percentageOfMoveX * zRotationMax;

    			// console.log("animation! " + percentageOfMoveY + " " + percentageOfMoveX);
		    	// end animation and reset to 0 if the card is close to 0
		    	if ( (Math.abs(percentageOfMoveX) + Math.abs(percentageOfMoveY)) < .1) {
		    		// console.log("finished animation! " + percentageOfMoveY + " " + percentageOfMoveX);
		    		gameModule.animateDisplayCircle = false;
			    	gameModule.displayStationCircle.translateX = 0;
			    	gameModule.displayStationCircle.translateY = 0;
			    	gameModule.displayStationCircle.rotateX = 0;
			    	gameModule.displayStationCircle.rotateY = 0;
			    	gameModule.displayStationCircle.rotateZ = 0;
			    	gameModule.displayStationCircle.scaleX = 1;
		    		gameModule.displayStationCircle.scaleY = 1;

		    	}
		    }
			if (gameModule.animateDisplayCircle) { 
				// recursion. window.request... is a more performant animation function than setInterval
				window.requestAnimationFrame(gameModule.animate); 
			}
		}
	}
})()