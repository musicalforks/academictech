/********************HELPER FUNCTIONS FOR DISPLAYING/STYLING ELEMENTS IN D3********************/	
	
var width = window.innerWidth - 20;

/*Function to determine if node is theme or org*/	
function isThemeOrOrg(d){
	if (d.level == "0"){
		return "themes";
	}else if (d.level == "1"){
		return "orgs";
	}else{
		return "center";
	}
}
	
/**Block for color coding**/
/**Original Theme Color Key Fall 2018
Expanded Educational Movement (Blue)
Social Reproductive Environmental Economies (Darkgreen)
Forms of Care & Self-Care (Purple)
Cohabitation & Housing Rights (Lime)
Media Literacy & Independent Information (Salmon)
Labor (Orange)
Artivism (Orangered)
New Political Processes (Lemon)
Migrant Rights (White)
Eco-rights (Palegreen)
Gender Rights (Majenta)**/


function defineColors(colorKeyJSON){
	var unprocJSON = colorKeyJSON[0].element_texts[2].text;
	unprocJSON = unprocJSON.replace(/\n/g, ": ").split(": ");
	themeColorKey = {};
	var theme, color;
	for(var i = 0; i < unprocJSON.length; i = i+2){
		theme = unprocJSON[i].toString();
		color = unprocJSON [i+1].toString();
		themeColorKey[theme] = color;
	}

//Iterate through color key and replace color names with rgb equivalent
//if a color name is invalid, then default the theme to white 
Object.keys(themeColorKey).forEach(function(key){ 
	themeColorKey[key] === undefined ? delete themeColorKey[key] : themeColorKey[key] = generateColor(themeColorKey[key]);
});
console.log(themeColorKey);
}

//Convert a color name to its rgb equivalent
function generateColor(colorName){
	if(validColorName(colorName) == true){
			return colorToRGBA(colorName);
	}else{
		//not a valid color name, return white
		return [255,255,230];
	}
}

//Open-source credit:
//https://http://jsfiddle.net/WK_of_Angmar/xgA5C/
//Validates input as CSS color name/string
function validColorName(string) {
    //Alter the following conditions according to your need.
    if (string === "") { return false; }
    if (string === "inherit") { return false; }
    if (string === "transparent") { return false; }
    
    var image = document.createElement("img");
    image.style.color = "rgb(0, 0, 0)";
    image.style.color = string;
    if (image.style.color !== "rgb(0, 0, 0)") { return true; }
    image.style.color = "rgb(255, 255, 255)";
    image.style.color = string;
    return image.style.color !== "rgb(255, 255, 255)";
}


//Open-source credit:
//https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes/1573141
//Converts CSS color name to rgba
function colorToRGBA(color) {
    var cvs, ctx;
    cvs = document.createElement('canvas');
    cvs.height = 1;
    cvs.width = 1;
    ctx = cvs.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
}

/*Avg two r/g/b values by first squaring them, then avergaging the squared values,
(here the first value can be weighted), and then finally taking the square root of that average*/
function avgRgb(rgb1, rgb2, weight){
	var rgb1Sq = Math.pow(rgb1, 2)
	var rgb2Sq = Math.pow(rgb2, 2)
	return Math.sqrt(((weight * rgb1Sq) + rgb2Sq)/2);	
}

/**End block for color coding**/


/*Helper function to determine theme node color*/
function circleColor(d){
	var theme = d.themes[0];
	return d3.rgb(themeColorKey[theme][0], themeColorKey[theme][1],themeColorKey[theme][2]);
}

/*Helper function to determine link color by averaging the colors of related themes*/
function linkColor(d){
	var themeList = d.source.themes.concat(d.target.themes);
	themeList = themeList.unique();
	
	var r, g, b;
	r = themeColorKey[themeList[0]][0]
	g = themeColorKey[themeList[0]][1]
	b = themeColorKey[themeList[0]][2]
	for(var theme=1; theme < themeList.length; theme++){
		r = avgRgb(r, themeColorKey[themeList[theme]][0], 1)
		g = avgRgb(g, themeColorKey[themeList[theme]][1], 1)
		b = avgRgb(b, themeColorKey[themeList[theme]][2], 1)
	}
	//Weight the theme at 1.75 when avging for org-theme link
	if(d.type == "org-theme"){
		var theme = d.target.themes[0];
		r = avgRgb(r, themeColorKey[theme][0], 1.5);
		g = avgRgb(g, themeColorKey[theme][1], 1.5);
		b = avgRgb(b, themeColorKey[theme][2], 1.5);
	}
	return d3.rgb(r, g, b);
}	
	
/*Determines stroke weight of a link*/
function linkWeight(d){
	if(d.type == "org-theme"){
		return 2;
	}else if(d.type == "theme-center"){
		return 7;
	}
}

/*Series of helper functions to position and size logo images depending on logo orientation
REFACTOR THIS*/	
function imgParamX(d){
	if(d.logoOrient == "rectangular"){
		d.imgX = -width/30;
		return -width/30;
	}else if(d.logoOrient == "square"){
		d.imgX = -width/60;
		return -width/60;
	}else if(d.logoOrient == "circle"){
		d.imgX = -width/43.5;
		return -width/43.5;
	}
}
function imgParamY(d){
	if(d.logoOrient == "rectangular"){
		d.imgY = -width/96;
		return -width/96;
	}else if(d.logoOrient == "square"){
		d.imgY = -width/60;
		return -width/60;
	}else if(d.logoOrient == "circle"){
		d.imgY = width/43.5;
		return -width/43.5;
	}
}
function imgParamWidth(d){
	if(d.logoOrient == "rectangular"){
		d.imgWidth = width/15;
		return width/15;
	}else if(d.logoOrient == "square"){
		d.imgWidth = width/30;
		return width/30;
	}else if(d.logoOrient == "circle"){
		d.imgWidth = width/21.8;
		return width/21.8;
	}
}
function imgParamHeight(d){
	if(d.logoOrient == "rectangular"){
		d.imgHeight = width/48;
		return width/48;
	}else if(d.logoOrient == "square"){
		d.imgHeight = width/30;
		return width/30;
	}else if(d.logoOrient == "circle"){
		d.imgHeight = width/21.8;
		return width/21.8;
	}
}

/*D3 text wrapping
Open-source credit: https://bl.ocks.org/mbostock/7555321*/	
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        numLines = 1,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        //dy = parseFloat(text.attr("dy")),
		dy = 0,
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + dy + "em").text(word);
		numLines += 1;
      }
    }
	d3.select(this).data()[0]["textHeight"] = numLines;
  });
}
	
/*Delete duplicate elements from array
Open-source credit: 
https://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items*/
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

/* Resolve collisions and overlapping between nodes through iterative relaxation,
treating each node as a circle with a radius--
"two nodes a and b are separated so that the distance between a and b is at least radius(a) + radius(b)."
Open-source credit:
http://bl.ocks.org/fabiovalse/bf9c070d0fa6bab79d6a*/
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + 10;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() {  
	return this.each(function() { 
		var firstChild = this.parentNode.firstChild; 
		if (firstChild) { 
			this.parentNode.insertBefore(this, firstChild); 
		} 
	});
};
