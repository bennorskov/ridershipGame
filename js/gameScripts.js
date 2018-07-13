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
			ridership: 64531511
		},
		 "34 St-Herald Sq": {
			lines: ["n", "q", "r", "w", "m", "f", "d", "b"],
			ridership: 39000352
		},
		"34 St-Penn Station": {
			lines: ["1", "2", "3"],
			ridership: 27741367		
		},
		"34 St-Penn Station": {
			lines: ["a", "c", "e"],
			ridership: 25183869
		},
		"Fulton St": {
			lines: ["a", "c", "j", "z", "2", "3", "4", "5"],
			ridership: 25162937
		},
		"59 St-Columbus Circle": {
			lines: ["a", "c", "d", "b", "1"],
			ridership: 23203443
		},
		"Lexington Av / 59 St": {
			lines: ["4", "5", "6", "n", "w", "r"],
			ridership: 21000635
		},
		"86 St": {
			lines: ["4", "5", "6"],
			ridership: 20337593
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
	function checkSwipeVsSelected() {
		if (currentStation === null) {
			addToBottomScroll();
			return;
		}
	}
	function addToBottomScroll() {}

	// ——————— ——————— public methods below
	return {
		getDataSet: function() {
			return dataSet;
		},
		addLines: function() {},
		lockBottomScroll: function (buttonToLock) {},
		checkSwipeAgainstSelected: function () {}
	}
})();


