var openOption = "";

function toggleView( elementName ) {
	
	if ( doc[elementName].style.display == "none" || doc[elementName].style.display == "" ) {
		showElement( elementName );
	} else {
		hideElement( elementName );
	}

}

function showElement( name ) {

	if ( name == "pStyle" || name == "pDough" || name == "pSauce" || name == "pCheese" || name == "pMeats" || name == "pVegetables" || name == "pFruits" ) {

		if ( openOption != "" )
			hideElement( openOption );

		doc[name].style.display = "block";
		doc[name + "-arrow"].src = "images/downArrow.png";
		openOption = name;
	} else if ( name == "checkoutMenu" ) {
		doc["blackScreen"].style.display = "initial";
		doc["checkoutCart"].style.display = "initial";
	} else if ( name != "" ) {
		doc[name].style.display = "initial";
	}

}

function hideElement( name ) {

	if ( name == "pStyle" || name == "pDough" || name == "pSauce" || name == "pCheese" || name == "pMeats" || name == "pVegetables" || name == "pFruits" ) {
		doc[name].style.display = "none";
		doc[name + "-arrow"].src = "images/rightArrow.png";
	} else if ( name == "checkoutMenu" ) {
		doc["blackScreen"].style.display = "none";
		doc["checkoutCart"].style.display = "none";
	} else if ( name != "" ) {
		doc[name].style.display = "none";
	}
}