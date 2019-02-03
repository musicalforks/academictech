/**Script to retrieve Omeka site data and display visualization using D3.js***/


//Stores dicts representing themes and orgs to display as nodes	
var nodes = [];
//Stores dicts representing midpoints btwn themes and orgs to (on links) for spacing/buffering purposes
var linkNodes = [];
//Stores links between themes and orgs
var links = [];
//Stores names of themes
var themeList = [];
var numThemes = 0;
	
/*Complete API requests, format resulting JSON to usable data, and visualize the data*/
	
//Send API requests for theme data (GET all tags) and format resulting JSON
d3.json("https://constellation.carletonds.com/api/tags?pretty_print", function(data1) {
	//Send API requests for org data (GET all items of Organization Item type) and format resulting JSON
	d3.json("https://constellation.carletonds.com/api/items/?item_type=19", function(data2){
		//Send API requests for center node + color key data (GET all items of Viz Backend type) and format resulting JSON
		d3.json("https://constellation.carletonds.com/api/items/?item_type=20", function(data3){
			dataFormatting(data1, data2, data3);
			var themeColorKey, sthemeColorKey, definedColorsKey;
			defineColors(data3);
			displayViz();
			
	});
});
});
	


