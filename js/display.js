/***Display visualization inside svg pane using D3***/

function displayViz(){
	//Initialize svg with gray background and physics model for visualization	
	var width = window.innerWidth;
		height = window.innerHeight - 25;
		maxRadius = 65;
		padding = 10;
	
	var body = d3.select("body");
	
	var svg = body.insert("svg", "footer");
	
	//var svg = d3.select("body").append("svg")
		svg.attr("width", width)
		.attr("height", height)
		.attr("class", "background");
	
	svg.append("rect")
		  .attr("x", 0)
		  .attr("y", 0)
		  .attr("width", width)
		  .attr("height", height);

	var force = d3.layout.force()
		.gravity(0.01)
		.distance(100)
		//center node repels all other nodes strongly
		.charge(function(d){
			var charge;
			if(width > 600){charge = -800}
			else{charge = -width/6}
			if (d.level == -1){charge = 10 * charge}
			else if(d.level == 0){charge = 2* charge}
			return charge;
		})
		.size([width, height]);

		   /*Begin displaying data stored by nodes and links in visualization*/
		   force
		  //.nodes(nodes)
		  .nodes(nodes.concat(linkNodes))
		  .links(links)
		  .start();

	  //Display links using links list		
	  var link = svg.selectAll(".link")
		  .data(links)
		.enter().append("line")
		  .attr("class", "link")
		  .attr("stroke-width", linkWeight)
		  .attr("stroke", linkColor);

	  //Select and class nodes using nodes list
	  var node = svg.selectAll(".node")
		  .data(nodes)
		  .enter().append("g")
		  .attr("class", "node")
		  //Class nodes by theme/org class type
		  .attr("class", isThemeOrOrg)
		  .call(force.drag);

		//Display theme nodes as circle colored by theme color and captioned by theme name
		var themes = svg.selectAll(".themes")
		  .append("a")
		  .attr("xlink:href", function(d){
			  var cleanedName = d.name.replace(/&/g, "%26");
			  cleanedName = cleanedName.replace(/ /g, "+");
			  return "https://constellation.carletonds.com/exhibits/browse?tags=".concat(cleanedName);})
		  themes.append("circle")
		  .attr("r", width/30)
		  .attr("fill", circleColor)
		  themes.append("text")
		  .text(function(d) { return d.name })
		  .attr("font-size", (width/1630).toString() + "em")
		  .call(wrap, width/16.6)
		  .style("fill", "black")
		  .attr("text-anchor", "middle")
		  .attr("y", function(d){
			  if(d.textHeight == 4){
				  return "-1.5em";
			  }else if(d.textHeight == 3){
				  return "-.75em";
			  }else if(d.textHeight == 1){
				  return ".25em";
			  }else{
				  return 0;
			  }
		  });
		  themes.on("mouseover", function(d) {
			   d3.select(this).select("circle").attr("r", width/25);
		  });
		  themes.on("mouseout", function(d) {
			   d3.select(this).select("circle").attr("r", width/30);
		  });
	
		//Display org nodes as logo image with hyperlink to org's Collection page
		var orgs = svg.selectAll(".orgs")
		  orgs.append("a")
		  .attr("xlink:href", function(d){return d.url})
		  .append("image")
		  .attr("xlink:href", function(d){return d.logo})
		  .attr("x", imgParamX)
		  .attr("y", imgParamY)
		  .attr("width", imgParamWidth)
		  .attr("height", imgParamHeight)
		  .attr("preserveAspectRatio", "none");
		  //tooltip functionality
		  orgs.append("svg:title")
    		.text(function(d) { return d.name; });
		  orgs.on("mouseover", function(d) {
			   d3.select(this).select("image")
				  .attr("x", function(d){return d.imgX * 1.8;})
				  .attr("y", function(d){
				   if(d.logoOrient == "circle"){
					   return d.imgY*-1.8;
				   }else{
					   return d.imgY*1.8;
				   }
			   })
				  .attr("width", function(d){return d.imgWidth * 1.8;})
				  .attr("height", function(d){return d.imgHeight * 1.8;});
			   d3.select(this).moveToFront();
			  
		  })				
          .on("mouseout", function(d) {			
			  d3.select(this).select("image")
				  .attr("x", function(d){return d.imgX;})
				  .attr("y", function(d){
					  if(d.logoOrient == "circle"){
						   return d.imgY*-.9;
					   }else{
						   return d.imgY;
					   }
			 	 })
				  .attr("width", function(d){return d.imgWidth;})
				  .attr("height", function(d){return d.imgHeight;});
		  });

		//text arc path for center node		
		svg.append("path")
		.attr("id", "titleArc") 
		.attr("d", "M-50,0 A-30,-30 0 0,1 50,0") //SVG path
		.style("fill", "none")
		.style("stroke", "#AAAAAA");

		//Display center node
		var center = svg.selectAll(".center")
		  .append("a")
		  .attr("xlink:href", function(d){return d.url})
		  center.append("circle")
		  .attr("r", width/28)
		  .attr("fill", "white")
		  center.append("image")
		  .attr("xlink:href", "https://constellation.carletonds.com/files/original/0636667ad0f2044c8b463487a134f375.png")
		  .attr("x", -width/37.5)
		  .attr("y", -width/37.5)
		  .attr("width", width/18.75)
		  .attr("height", width/18.75);

		//Join link node data to invisible circles
		var linkNode = svg.selectAll(".link-node")
			.data(linkNodes)      
			.enter().append("g")
			.append("circle")
			.attr("class", "link-node");

	  //Complete drawing all items on svg
	  force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		//Visualization is responsive to user input (dragging nodes)
		node.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";})
		//Resolve overlapping/collisions
		node.each(collide(.5));
		
		//But on desktop: nodes won't appear outside of the visible window!
		//50 is max radius of nodes on desktop, so 55 is the buffer value
		if(width > 600){
			node.attr("cx", function(d) {return d.x = Math.max(55, Math.min(width - 55, d.x));})
				.attr("cy", function(d) {return d.y = Math.max(55, Math.min(height - 55, d.y)); });
		}
		//Force center node to center of viz
		nodes[nodes.length-1].x = width / 2;
		nodes[nodes.length-1].y = height / 2;

		//Add in invisible nodes on links for spacing/repelling purposes  
		linkNode.attr("cx", function(d) { return d.x = (d.source.x + d.target.x) * 0.5; })
			.attr("cy", function(d) { return d.y = (d.source.y + d.target.y) * 0.5; });
	  });
}