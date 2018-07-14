var timeout = null;
var gameModule = (function () {
	var dataSet = {
		"14th St-Union Square": {
			lines: ["4", "5", "6", "n", "q", "r", "l"],
			ridership: 34557551
		},
		"Grand Central-42nd St": {
			lines: ["4", "5", "6", "7", "s"],
			ridership: 44928488
		},
		"Times Square-42 St": {
			lines: ["n", "q", "r", "w", "s", "1", "2", "3", "7", "a", "c", "e"],
			ridership: 64815739
		},
		 "34 St-Herald Sq": {
			lines: ["n", "q", "r", "w", "m", "f", "d", "b"],
			ridership: 39672507
		},
		"34 St-Penn Station": {
			lines: ["1", "2", "3", "a", "c", "e"],
			ridership: 50400738		
		},
		"Fulton St": {
			lines: ["a", "c", "j", "z", "2", "3", "4", "5"],
			ridership: 26838473
		},
		"59 St-Columbus Circle": {
			lines: ["a", "c", "d", "b", "1"],
			ridership: 22929203
		},
		"Lexington Av / 59 St": {
			lines: ["4", "5", "6", "n", "w", "r"],
			ridership: 17888188
		},
		"86 St": {
			lines: ["4", "5", "6"],
			ridership: 14277369
		},
		"Lexington Av-53 St": {
			lines: ["e", "m", "6"],
			ridership: 18940774
		},
		"Flushing-Main St": {
			lines: ["7"],
			ridership: 18746832
		},
		"47-50 Sts-Rockefeller Center": {
			lines: [],
			ridership: 17471620
		},
		"74-Bway/Jackson Hts-Roosevelt Av": {
			lines: [],
			ridership: 17095073
		}
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
		// temp test code:
		gameModule.currentStation = document.getElementsByClassName("selectedStation")[0];
		console.log(gameModule.currentStation);
		// end test code
		if (gameModule.currentStation === null) {
			addToBottomScroll(swipedStation);
			return;
		}
		current = dataSet[swipedStation].ridership;
		console.log(gameModule.currentStation.getElementsByClassName("stationOrder__station--label")[0].innerText );
		selected = dataSet[ gameModule.currentStation.getElementsByClassName("stationOrder__station--label")[0].innerText ].ridership;
		if (current > selected && direction > 0) { // bigger swipe (right)
			addToBottomScroll(swipedStation);
		} else if (current < selected && direction < 0){ // smaller swipe (left)
			addToBottomScroll(swipedStation);
		}
		changeDisplayCard("Lexington Av-53 St");
	}
	function addToBottomScroll( stationToAdd ) {
		console.log(stationToAdd + " Added to bottom!");
		var statOrd = document.getElementsByClassName("stationOrder")[0];
		var lineName = dataSet[stationToAdd].lines[ Math.floor(dataSet[stationToAdd].lines.length * Math.random()) ];
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
	}
	function changeDisplayCard(stationName) {
		console.log("added " + stationName + " card")
		var _html = "<hr><h1 class='displayCard__title'>" + stationName + "</h1>";
		_html += "<div class='displayCard__lines'>";
		var lines = dataSet[stationName].lines;
		for (var i = lines.length - 1; i >= 0; i--) {
			_html += addLineToDisplayCard(lines[i]) + " ";
		};
		_html += "</div>";
		gameModule.displayCard.innerHTML = _html;
	}

	// ——————— ——————— public methods below
	return {
		getDataSet: function() {
			return dataSet;
		},
		displayCard: "",
		currentStation: null,
		lockBottomScroll: function (buttonToLock) {},
		checkSwipeAgainstSelected: function () {},
		setupSwipeEvent: function () {
			// set up swipe event
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
			this.displayCard = document.getElementsByClassName("displayCard")[0];
			gameModule.setupSwipeEvent();
		}
	}
})();


