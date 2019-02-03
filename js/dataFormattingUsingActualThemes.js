/*Formatting API JSON returns to correct data format*/

function dataFormatting(themesJSON, orgsJSON, otherInfoJSON){
  //Get themes (GET all tags) and put into list
  for (var idx = 0; idx < themesJSON.length; idx++){
	var tag = themesJSON[idx].name;	
	themeList.push(tag);
  }
  numThemes = themesJSON.length;
  //Create dict for each theme and add to nodes
  for (var idx = 0; idx < themeList.length; idx++){	
	var themeDict = {};
	themeDict = {"id": idx, "name": themeList[idx], "level": "0", "themes": [themeList[idx]], "radius": 50};
	nodes.push(themeDict);
  }


  //GET all items of Organization Item Type, and create dict for each org and add to nodes
  for (var orgIdx = 0; orgIdx < orgsJSON.length; orgIdx++){
	  var url, logo, logoOrient, name;
	  //Match up url, logo, logo orientation, name fields correctly for each org
	  for(var itemInfo = 0; itemInfo < 4; itemInfo++){
		  var field = orgsJSON[orgIdx].element_texts[itemInfo].text;
		  if(orgsJSON[orgIdx].element_texts[itemInfo].element.name == "Title"){
			  name = field;
		  }else if(orgsJSON[orgIdx].element_texts[itemInfo].element.name == "URL"){
			  url = field;
		  }else if(orgsJSON[orgIdx].element_texts[itemInfo].element.name == "Logo orientation"){
			  logoOrient = field;
		  }else{
			  logo = field;
		  }
	  }
	  var themes = [];
	  //For loop to add themes key as a list of themes (tags related to org)
	  //And to add links between themes and org by id. BUT MAX 2 LINKS PER ORG FOR VISUAL REASONS
	  //But first shuffle up the theme tags
	  orgsJSON[orgIdx].tags.sort(function() {return Math.random()-0.5;});
	  
	  for (var themeIdx = 0; themeIdx < orgsJSON[orgIdx].tags.length; themeIdx++){
		  var boolean = Math.random() >= 0.4;
		  //make it less likely for org to link to a more densely connected theme (more popular theme)
		  if(orgsJSON[orgIdx].tags[themeIdx].name == "forms of care & self care" || 
			 orgsJSON[orgIdx].tags[themeIdx].name == "expanded educational movement" || 
			 orgsJSON[orgIdx].tags[themeIdx].name == "social reproductive environmental economies" ||
			  orgsJSON[orgIdx].tags[themeIdx].name == "cohabitation & housing rights"){
			  boolean = Math.random() < 0.2;
		  } 
		  //on last theme and no other themes have been stored as a link! add the current theme
		  if(themes.length == 0 && themeIdx == orgsJSON[orgIdx].tags.length-1){
			  boolean = true;
		  }
		  //max 2 links per org
		  else if(themes.length >= 2){
			  boolean = false;
		  }
		  //last call: make it extremely likely for org to link to less popular theme even if org already has 2 links
		  //to ensure every theme has a link
		  if(orgsJSON[orgIdx].tags[themeIdx].name == "new political processes"){
			  boolean = Math.random() >= 0.1;
		  }
		  //if 
		  //if(links.filter(link => link.target == themeList.indexOf(orgsJSON[orgIdx].tags[themeIdx])).length <1){
			//  console.log(links);
		  //	console.log(orgsJSON[orgIdx].tags[themeIdx].name);
		  //	boolean = true;
		 // }
		  if(boolean == true){
			  themes.push(orgsJSON[orgIdx].tags[themeIdx].name);
			  //Find the theme id
			  var idIterator = 0;
			  while(orgsJSON[orgIdx].tags[themeIdx].name != themeList[idIterator]){
				  idIterator++;
			  }
			  var link = {"source": orgIdx+numThemes, "target": idIterator, "type": "org-theme"}
			  links.push(link);  
		  }

	  }

	  var orgDict = {};
	  orgDict = {"id": orgIdx+numThemes, "name": name, "level": "1", "logo": logo, "logoOrient": logoOrient, "url": url, "themes": themes, "radius": imgRadius(logoOrient)};
	  nodes.push(orgDict);
  }

  //Add project title node and link it to all theme nodes
  var centerIdx = nodes.length;
  for (var themesToLink = 0; themesToLink < numThemes; themesToLink++){
	var link = {"source": centerIdx, "target": themesToLink, "type": "theme-center"}
	links.push(link);
  }
  var centerNode = {};
  var name = otherInfoJSON[0].element_texts[0].text;
  var url = otherInfoJSON[0].element_texts[1].text;
  centerNode = {"id": nodes.length, "name": name, "level": "-1", "url": url, "themes": [], "radius": 65};
  nodes.push(centerNode);  

  //Add nodes to mark links between nodes for overall node spacing/repelling purposes		
  links.forEach(function(link) {
	linkNodes.push({
	  source: nodes[link.source],
	  target: nodes[link.target]
	});
  });
	
}	

//REFACTOR THIS
function imgRadius(logoOrient){
	if(logoOrient == "rectangular"){
		return 40;
	}else if(logoOrient == "square"){
		return 20;
	}else if(logoOrient == "circle"){
		return 25;
	}
}	
