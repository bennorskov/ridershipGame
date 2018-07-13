(function () {
	var dataSet = [
		{
			lines: ["4", "5", "6", "n", "q", "r", "l"],
			ridership: 34557551,
			name: "14th Street Union Square"
		},
		{
			lines: ["4", "5", "6", "7", "s"],
			ridership: 44928488,
			name: "Grand Central 42nd Street"
		},
		{
			lines: ["n", "q", "r", "w", "s", "1", "2", "3", "7", "a", "c", "e"],
			ridership: 64531511,
			name: "Times Square-42 Street "
		},
		{
			lines: ["n", "q", "r", "w", "m", "f", "d", "b"],
			ridership: 39000352,
			name: "34 Street-Herald Square" 
		},
		{
			lines: ["1", "2", "3"],
			ridership: 27741367,
			name: "34 Street-Penn Station" 
		}
	];

	function addLine( lineName ) {
		var _html = '';
		var className = lineName;
		switch(lineName) {
			case "4":
			case "5":
			case "6":
				className = "fourfivesix"
				break;
			case "n":
			case "q":
			case "r":
			case "w":
				className = "nqr"
				break;
		}
		_html += "<div class='displayCard__lines--circle ";
		_html += className + "'>" + lineName.toUpperCase() + "</div>";
		return _html;
	}
});