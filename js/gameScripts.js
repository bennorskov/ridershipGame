var displayCard;
var timeout = null;
var gameModule = (function () {
	var currentStation = null;
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
	function addLine( lineName ) {
		var _html = '';
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
		_html += "<div class='displayCard__lines--circle ";
		_html += className + "'>" + lineName.toUpperCase() + "</div>";
		return _html;
	}
	function checkSwipeVsSelected(swipedStation, direction) {
		console.log(swipedStation);
		currentStation = document.getElementsByClassName("selectedStation")[0];
		if (currentStation === null) {
			addToBottomScroll();
			return;
		}
		current = dataSet[swipedStation].ridership;
		console.log(currentStation.getElementsByClassName("stationOrder__station--label")[0].innerText );
		selected = dataSet[ currentStation.getElementsByClassName("stationOrder__station--label")[0].innerText ].ridership;
		if (current > selected && direction > 0) {
			addToBottomScroll(swipedStation);
		} else if (current < selected && direction < 0){
			addToBottomScroll(swipedStation);
		}
	}
	function addToBottomScroll( elementToAdd ) {
		console.log(elementToAdd + " Added to bottom!");
	}

	// ——————— ——————— public methods below
	return {
		getDataSet: function() {
			return dataSet;
		},
		addLines: function() {},
		lockBottomScroll: function (buttonToLock) {},
		checkSwipeAgainstSelected: function () {},
		init: function () {
			displayCard = document.getElementsByClassName("displayCard")[0];
			Transform(displayCard);
			new AlloyFinger(displayCard, {
			    pressMove:function(evt){
			    	if (timeout != null) clearInterval(timeout);
			    	var maxMove = 100;
			    	// var limit = Math.min(evt.deltaX
			    	if ( Math.abs(displayCard.translateX + evt.deltaX) <= maxMove) {
			        	displayCard.translateX += evt.deltaX;
			        } else {
			        	if (displayCard.translateX < 0) displayCard.translateX = -maxMove;
			        	if (displayCard.translateX > 0) displayCard.translateX = maxMove;
			        }
			        evt.preventDefault();

			    	var percentageOfMove = displayCard.translateX/maxMove;
			    	var xRotationMax = 10,
			    		yRotationMax = 20,
			    		zRotationMax = 10;
			    	displayCard.rotateX = Math.abs(percentageOfMove) * xRotationMax;
			    	displayCard.rotateY = percentageOfMove * yRotationMax;
			    	displayCard.rotateZ = percentageOfMove * zRotationMax;
			    },
			    // Either: Check to see if the card should add, 
			    // OR: Put the card back into place
			    touchEnd: function() {
			    	var maxMove = 100;
			    	if (timeout != null) clearInterval(timeout);
			    	var completePercentage = .85;
			    	var percentageOfMove = displayCard.translateX/maxMove;
			    	if (displayCard.translateX/maxMove > completePercentage) {
			    		checkSwipeVsSelected( displayCard.getElementsByClassName("displayCard__title")[0].innerText, 1 );
			    	} else if (displayCard.translateX/maxMove < -completePercentage) {
			    		checkSwipeVsSelected( displayCard.getElementsByClassName("displayCard__title")[0].innerText, -1 );
			    	} else {
			    		timeout = setInterval(function () {
					    	var xRotationMax = 10,
					    		yRotationMax = 20,
					    		zRotationMax = 10;
					    	var easeAmount = .55;
					    	displayCard.translateX += (0 - displayCard.translateX) * easeAmount;
					    	percentageOfMove = displayCard.translateX/maxMove; // calculate after movement for rotation
					    	displayCard.rotateX = Math.abs(percentageOfMove) * xRotationMax;
					    	displayCard.rotateY = percentageOfMove * yRotationMax;
					    	displayCard.rotateZ = percentageOfMove * zRotationMax;
					    	if (Math.abs(percentageOfMove) < .05) {
					    		console.log("interval cleared!");
					    		clearInterval(timeout);
						    	displayCard.translateX = 0;
						    	displayCard.rotateX = 0;
						    	displayCard.rotateY = 0;
						    	displayCard.rotateZ = 0;
					    	}
			    		}, 50);
				    }
			    }
			});
		}
	}
})();


