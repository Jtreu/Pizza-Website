/* variables */
var canAddMorePizza = true;
var selected = {};
var pizzas = [];
var total = 0.0;
var estimatedReadyTime = 0;

init();

function init() {
	// Default settings
	resetPizza();

	showElement( "pStyle" );
}

function completeOrder() {

	if ( pizzas.length > 0 ) {
		showElement( "onSuccessDiv" );
		hideElement( "placeOrderBtn" );

		//console.log( getPreviousOrders() );

		// SQL Table: Time Order Submitted
		doc["pOrderTime"].innerHTML = pizzas.length * 15; // 15 minutes per pizza

		canAddMorePizza = false;

	    // Create XMLHttpRequest object
	    var hr = new XMLHttpRequest();
	    // Create some variables we need to send to our PHP file
	    var url = "http://localhost/PizzaOrder/php/orderAdded.php";
	    var estimatedReadyTime = parseInt(doc["pOrderTime"].innerHTML);
	    var vars = "estimatedReadyTime="+estimatedReadyTime+"&total="+total;
	    hr.open("POST", url, true);
	    // Set content type header information for sending url encoded variables in the request
	    hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    // Access the onreadystatechange event for the XMLHttpRequest object
	    hr.onreadystatechange = function() {
		    if(hr.readyState == 4 && hr.status == 200) {
			    var return_data = hr.responseText;
				doc["status"].innerHTML = return_data;
		    }
	    }
	    // Send the data to PHP now... and wait for response to update the status div
	    hr.send(vars); // Actually execute the request
	    doc["status"].innerHTML = "processing...";
	}
	
}

// function getPreviousOrders() {
// 	var xmlhttp = new XMLHttpRequest();
//      xmlhttp.onreadystatechange = function() {
//          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//              console.log( xmlhttp.responseText );
//          }
//      }
//      xmlhttp.open("GET", "php/server.php?orders", true);
//      xmlhttp.send();
// }

function checkout() {
	showElement( "checkoutMenu" );
}

function addToCart() {
	if ( canAddMorePizza ) {
		selected["order"] = pizzas.length;
		pizzas.push( selected );

		addPizzaToList( pizzas[selected["order"]] );

		resetPizza();
	}
}

function addPizzaToList( pizza ) {

	var div = document.createElement( "div" );
	div.className = "pListItem";

	div.innerHTML += "[" + "$" + pizza["price"] + "]";
	total += parseFloat(pizza["price"]);

	for ( type in pizza ) {
		if ( type != "price" ) {
			if ( type == "cheese" || type == "meats" || type == "vegetables" || type == "fruits" ) { // non-unique toppings
				for ( id in pizza[type] ) {
					div.innerHTML += "[" + type + ":" + pizza[type][id] + "] ";
				}
			} else if ( type == "dough" || type == "sauce" || type == "shape" || type == "sliceType" ) { // unique items
				div.innerHTML += "[" + type + ":" + pizza[type] + "] ";
			}
		}
		
	}

	doc["pCart"].appendChild( div );
}

function resetPizza() {
	deselectAll();

	selected = {};
	selected["price"] = 0;

	setSize( "12" );
	setUniqueItem( "shape", "circle" );
	setUniqueItem( "sliceType", "radial" );
	setUniqueItem( "dough", "regular" );
	setUniqueItem( "sauce", "romesco" );

	// add cheddar option later?
	setItem( "cheese", "mozzarella" );

	doc["pizzaCounter"].innerHTML = pizzas.length;
}

function deselectAll() {
	for ( type in selected ) {
		if ( type != "price" ) {
			if ( type == "cheese" || type == "meats" || type == "vegetables" || type == "fruits" ) { // non-unique toppings
				for ( id in selected[type] ) {
					setItem( type, selected[type][id] );
				}
			} else if ( type == "dough" || type == "sauce" || type == "shape" || type == "sliceType" ) { // unique items
				setUniqueItem( type, "default" );
			}
		}
		
	}
}

/* Pizza Settings */

function setSize( size ) {
	doc["pSizeLabel"].innerHTML = size + " in.";

	if ( selected["size"] )
		selected["price"] -= cost[selected["size"]];

	selected["price"] += cost[size];

	selected["size"] = size;

	setPrice();
}

function setSlices( slices ) {
	doc["pSlicesLabel"].innerHTML = slices;
}

function setUniqueItem( type, id ) {

	if ( id == "default" ) {

		if ( selected[type] ) {
			doc[selected[type]].style.backgroundColor = "skyblue";
			delete selected[type];
		}
		
		return;
	}

	if ( selected[type] ) {
		if ( selected[type] != id ) { // New item selected
			doc[id].style.backgroundColor = "lightgreen";
			doc[selected[type]].style.backgroundColor = "skyblue";

			selected["price"] += cost[id];
			selected["price"] -= cost[selected[type]];

			selected[type] = id;
		} else if ( type != "shape" && type != "sliceType" ) { // Item reselected: Deselect
			doc[id].style.backgroundColor = "skyblue";

			selected["price"] -= cost[selected[type]];
			delete selected[type];
		}
	} else { // Newly selected item
		doc[id].style.backgroundColor = "lightgreen";
		selected["price"] += cost[id];
		selected[type] = id;
	}

	switch( type ) {
		case "shape":
			doc["pPaddle"].style.backgroundImage = "url('images/" + id + "Paddle.png')";
			break;
	}

	setPrice();
}

function setItem( type, id ) {
	if ( selected[type] ) {
		if ( selected[type][id] ) { // Deselect
			doc[id].style.backgroundColor = "skyblue";

			selected["price"] -= cost[selected[type][id]];

			delete selected[type][id];
		} else { // Another Select
			selected[type][id] = {};
			selected[type][id] = id;

			selected["price"] += cost[selected[type][id]];

			doc[id].style.backgroundColor = "lightgreen";
		}
	} else { // 1st Select
		selected[type] = {};
		selected[type][id] = {};
		selected[type][id] = id;

		selected["price"] += cost[selected[type][id]];

		doc[id].style.backgroundColor = "lightgreen";
	}

	setPrice();
}

function setPrice() {
	selected["price"] = ( Math.floor( 100 * selected["price"] ) / 100 );
	doc["price"].innerHTML = "$" + selected["price"];
}
