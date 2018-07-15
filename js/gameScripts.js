var timeout = null;
var gameModule = (function () {
	var dataSet = new Map();
	var displayedStations = new Map();
	function setupDataObject() {
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
		var _html = '';
		var className = returnClassNameFromLineName(lineName);
		_html += "<div class='displayCard__lines--circle ";
		_html += className + "'>" + lineName.toUpperCase() + "</div>";
		return _html;
	}
	function checkSwipeVsSelected(swipedStation, direction) {
		// console.log(swipedStation);
		//
		// temp test code:
		gameModule.currentStation = document.getElementsByClassName("selectedStation")[0];
		console.log(gameModule.currentStation);
		// end test code
		//
		if (gameModule.currentStation === null) {
			console.log("current Station was null!");
			addToBottomScroll(swipedStation);
			return;
		}
		current = dataSet.get(swipedStation).ridership;
		console.log(gameModule.currentStation.getElementsByClassName("stationOrder__station--label")[0].innerText );
		selected = dataSet.get( gameModule.currentStation.getElementsByClassName("stationOrder__station--label")[0].innerText ).ridership;
		if (current > selected && direction > 0) { // bigger swipe (right)
			addToBottomScroll(swipedStation);
		} else if (current < selected && direction < 0){ // smaller swipe (left)
			addToBottomScroll(swipedStation);
		}
		changeDisplayCard( getRandomStationName() );
	}
	function getRandomStationName() {
		var keyArray = Array.from(dataSet.keys());

		return keyArray[ Math.floor(keyArray.length * Math.random()) ];
		//"Lexington Av-53 St";
	}
	function changeDisplayCard(stationName) {
		// change the card that you swipe to test the riderships
		console.log("adding " + stationName + " card");

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
		console.log(stationToAdd + " Added to bottom!");
		var statOrd = document.getElementsByClassName("stationOrder")[0];
		var lineName = dataSet.get(stationToAdd).lines[Math.floor(dataSet.get(stationToAdd).lines.length * Math.random())];
		var className = returnClassNameFromLineName(lineName);
		var _html = "<div class='stationOrder__station selectedStation " + className + "'>";
		_html += "<h1 class='stationOrder__station--label'>" + stationToAdd + "</h1>";
		_html += "<h1 class='stationOrder__station--lineLabel'>"+ lineName.toUpperCase() +"</h1>";
		_html += "</div>";
		var temp = document.createElement("template");
		temp.innerHTML = _html.trim();
		console.log("Temp is " + temp.innerHTML);
		statOrd.appendChild(temp.content.firstChild);
		gameModule.currentStation = temp;
		displayedStations.set(stationToAdd, dataSet.get(stationToAdd));
		dataSet.delete(stationToAdd);
	}
	function lockBottomScroll ( stationToLock ) {
		var bottomScrollChildren = gameModule.bottomScrollContainer.children;
		var bSLeft = gameModule.bottomScrollContainer.offsetLeft;
		var bSWidth = gameModule.bottomScrollContainer.offsetWidth;
		var screenMiddle = window.screen.width * .5;

		//stationToLock is used when clicking on a button 
		if (stationToLock == null || stationToLock == undefined) {
			//find closest button to center
			var closestAmount = screenMiddle;
			for (let chi of bottomScrollChildren) {
				var centerOfStation = chi.offsetLeft + chi.offsetWidth*.5;
				if (Math.abs(screenMiddle - (centerOfStation + bSLeft)) < closestAmount) {
					closestAmount = Math.abs(screenMiddle - (centerOfStation + bSLeft));
					stationToLock = chi;
				}
			}
		}
		// select station by making it bigger and removing outline
		stationToLock.classList.add("selectedStation");
		console.log(stationToLock.children[0]);
		//set bottom text to station name
		document.getElementsByClassName("stationOrder__selectedStationLabel")[0].innerText = stationToLock.children[0].innerText;

		//scroll parent to that spot

	}

	// ——————— ——————— public methods below
	return {
		getDataSet: function() {
			return dataSet;
		},
		displayCard: "",
		bottomScrollContainer: "",
		currentStation: null,
		checkSwipeAgainstSelected: function () {},
		setupSwipeEvent: function () {
			// ————— ————— ————— ————— set up swipe event for bottom container
			new AlloyFinger(this.bottomScrollContainer, {
				pressMove: function(evt) {
					var selected = document.getElementsByClassName("selectedStation")[0] || null;
					if (selected != null) {
						selected.classList.remove("selectedStation");
					}
					var curLeft = gameModule.bottomScrollContainer.offsetLeft;;
					gameModule.bottomScrollContainer.style.left = (curLeft + evt.deltaX) + "px";
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
			    	var maxMove = 100;
			    	if (timeout != null) clearInterval(timeout);
			    	var completePercentage = .85;
			    	var percentageOfMove = gameModule.displayCard.translateX/maxMove;
			    	if (gameModule.displayCard.translateX/maxMove > completePercentage) {
			    		checkSwipeVsSelected( gameModule.displayCard.getElementsByClassName("displayCard__title")[0].innerText, 1 );
			    		//gameModule.displayCard.parentNode.removeChild(gameModule.displayCard);
			    	} else if (gameModule.displayCard.translateX/maxMove < -completePercentage) {
			    		checkSwipeVsSelected( gameModule.displayCard.getElementsByClassName("displayCard__title")[0].innerText, -1 );
			    		//gameModule.displayCard.parentNode.removeChild(gameModule.displayCard);
			    	}
		    		timeout = setInterval(function () {
				    	var xRotationMax = 10,
				    		yRotationMax = 20,
				    		zRotationMax = 10;
				    	var easeAmount = .55;
				    	gameModule.displayCard.translateX += (0 - gameModule.displayCard.translateX) * easeAmount;
				    	percentageOfMove = gameModule.displayCard.translateX/maxMove; // calculate after movement for rotation
				    	gameModule.displayCard.rotateX = Math.abs(percentageOfMove) * xRotationMax;
				    	gameModule.displayCard.rotateY = percentageOfMove * yRotationMax;
				    	gameModule.displayCard.rotateZ = percentageOfMove * zRotationMax;
				    	if (Math.abs(percentageOfMove) < .05) {
				    		// console.log("interval cleared!");
				    		clearInterval(timeout);
					    	gameModule.displayCard.translateX = 0;
					    	gameModule.displayCard.rotateX = 0;
					    	gameModule.displayCard.rotateY = 0;
					    	gameModule.displayCard.rotateZ = 0;
				    	}
		    		}, 50);
			    }
			});
		},
		init: function () {
			setupDataObject();
			gameModule.displayCard = document.getElementsByClassName("displayCard")[0];
			gameModule.bottomScrollContainer = document.getElementsByClassName("stationOrder")[0];
			gameModule.setupSwipeEvent();
		}
	}
})();


