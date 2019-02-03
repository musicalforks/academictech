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
	  var url, logo, logoOrient, name, themes;
	  //Match up url, logo, logo orientation, name, related themes fields correctly for each org
	  for(var itemInfo = 0; itemInfo < 5; itemInfo++){
		  var field = orgsJSON[orgIdx].element_texts[itemInfo].text;
		  
		  if(orgsJSON[orgIdx].element_texts[itemInfo].element.name == "Title"){
			  name = field;
		  }else if(orgsJSON[orgIdx].element_texts[itemInfo].element.name == "URL"){
			  url = field;
		  }else if(orgsJSON[orgIdx].element_texts[itemInfo].element.name == "Logo orientation"){
			  logoOrient = field;
		  }else if(orgsJSON[orgIdx].element_texts[itemInfo].element.name == "Logo file URL"){
			  logo = field;
		  }else if(orgsJSON[orgIdx].element_texts[itemInfo].element.name == "Primary themes"){
			  //var to store list of themes (tags related to org)
			  field = field.replace(/, /g, ',');
			  themes = field.split(',');
		  }
	  }
	 
	  //Add links between themes and org by id. BUT MAX 2 LINKS PER ORG FOR VISUAL REASONS
	  for (var themeIdx = 0; themeIdx < themes.length; themeIdx++){
		  //Find the theme id
		  var idIterator = 0;
		  while(themes[themeIdx] != themeList[idIterator]){
			  idIterator++;
			  if(idIterator > numThemes){
				  break;
			  }
		  }
		  var link = {"source": orgIdx+numThemes, "target": idIterator, "type": "org-theme"}
		  links.push(link);    
	  }

	  //Create dictionary for each org and push to nodes list
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
