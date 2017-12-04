//'use strict';


// MODEL
let locations = [
	{title: 'Bristol Brewing Company', location: { lat: 38.811236, lng: -104.827392 }, fsID: '4af49ef4f964a5206af421e3', visible: true, stars: 5},
	{title: 'Phantom Canyon', location: { lat: 38.834232, lng: -104.824948 }, fsID: '4ab97703f964a5207e7f20e3', visible: true, stars: 5},
	{title: 'Cerberus Brewing Company', location: { lat: 38.833016, lng: -104.837419 }, fsID: '57c878a1498e9ad24cf1158d', visible: true, stars: 4},
	{title: 'Fieldhouse Brewing Company', location: { lat: 38.825982, lng: -104.823627 }, fsID: '5390a6b2498e4fea4875bfef', visible: true, stars: 3},
	{title: 'Trinity Brewing Company', location: { lat: 38.897450, lng: -104.854339 }, fsID: '4b118eadf964a5203c7f23e3', visible: true, stars: 3},
	{title: 'Cogstone Brewing Company', location: { lat: 38.880052, lng: -104.755481 }, fsID: '56a418f7498eb236c64f6300', visible: true, stars: 4},
	{title: 'Gold Camp Brewing Company', location: { lat: 38.819571, lng: -104.823610 }, fsID: '54a5ff5e498e3dc75acd6ea4', visible: true, stars: 4}
]

let map;
let largeInfoWindow;
let markers = [];
let bounds;
let service;


// Initialize map on page load.
function initMap() {

	// Grab new map from Google Maps api.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 38.833882, lng: -104.821363},
		zoom: 13
	});

	// Grab new infowindow box from Google Maps api.
	largeInfoWindow = new google.maps.InfoWindow();

	// Run function to create markers.
	createMarkers();
}


// Create array of marker objects for each item in location array.
function createMarkers() {
	bounds = new google.maps.LatLngBounds();
	for (let i = 0; i < locations.length; i++) {
		let position = locations[i].location;
		let title = locations[i].title;
		const marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: locations[i].fsID
		});
		locations[i].marker = marker;
		bounds.extend(marker.position);

		// Add listener to marker, when clicked populate infowindow
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfoWindow);
		});

		// Add marker to markers array
		markers.push(marker);

	}
	map.fitBounds(bounds);
}


// Clear out markers
function clearMarkers(){
	for(let i = 0; i < locations.length; i++){
		locations[i].marker.setMap(null);
	}
}


// Throw error if Google Maps api fails to load
function mapError() {
  alert("Map did not load");
}


// Populate info into marker window popup
function populateInfoWindow(marker, infowindow) {
	let self = marker;

	// Make marker bounce 3 times or so
	self.setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(function(){ 
		marker.setAnimation(null); 
	}, 2200);

	// Call Foursquare api function (below)
	fourSQ(marker, infowindow);

	// Make sure the infowindow isn't already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.setContent('');
		infowindow.marker = marker;

		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick',function(){
			infowindow.setMarker = null;
		});		
	}
}


// Foursquare API
function fourSQ(marker, infowindow){
	// Set Foursquare API url 
	let fsurl = 'https://api.foursquare.com/v2/venues/' + marker.id + 
	'?client_id=Z5WTAAN5CPS2SPIUL2QQ405SOK1PPZ314A2ZVWO5PYNVUF0E' +
	'&client_secret=OO43DGDQPPP13G5ERTF2WH4IVJ4DTUILZUWVN3OFZPB0XQYX' +
	'&v=20171122';
	
	// Run Foursquare Ajax request
	$.ajax(fsurl)

	// If successful...
	.done(function(data) {
		
		// Push Foursquare API data to marker object
		street = data.response.venue.location.address;
		city = data.response.venue.location.city;
		phone = data.response.venue.contact.phone;

		// Set Foursquare content to infowindow
		infowindow.setContent(
			'<div class="title content">' + marker.title + '</div>' + 
			'<div class="street content">' + street + '</div>' +
			'<div class="city content">' + city + '</div>' +
			'<div class="phone content"> <a href=tel:' + phone + '>' + phone + '</div>'
		);

		// Open infowindow
		infowindow.open(map, marker);
	})

	// If unsuccessful...
	.fail(function() {
		// Throw error
		alert( "Foursquare API error. Please refresh page." );
	})
}






// // Filter locations
// console.log(locations);
// function filter() {
// 	for (let i = 0; i < locations.length; i++){
// 		if (locations[i].show == false) {
// 			locations[i].marker.setMap(null);
// 		}
// 	}
// }

// KO creating filtered arrays, as per Sharynne suggestion.
// computed() and arrayFilter() and compareArrays()




// $('#all').click(function(){
// 	clearMarkers();
// 	locations = [
// 		{title: 'Bristol Brewing Company', location: { lat: 38.811236, lng: -104.827392 }, fsID: '4af49ef4f964a5206af421e3', visible: true, stars: 5},
// 		{title: 'Phantom Canyon', location: { lat: 38.834232, lng: -104.824948 }, fsID: '4ab97703f964a5207e7f20e3', visible: true, stars: 5},
// 		{title: 'Cerberus Brewing Company', location: { lat: 38.833016, lng: -104.837419 }, fsID: '57c878a1498e9ad24cf1158d', visible: true, stars: 4},
// 		{title: 'Cogstone Brewing Company', location: { lat: 38.880052, lng: -104.755481 }, fsID: '56a418f7498eb236c64f6300', visible: true, stars: 4},
// 		{title: 'Gold Camp Brewing Company', location: { lat: 38.819571, lng: -104.823610 }, fsID: '54a5ff5e498e3dc75acd6ea4', visible: true, stars: 4},
// 		{title: 'Fieldhouse Brewing Company', location: { lat: 38.825982, lng: -104.823627 }, fsID: '5390a6b2498e4fea4875bfef', visible: true, stars: 3},
// 		{title: 'Trinity Brewing Company', location: { lat: 38.897450, lng: -104.854339 }, fsID: '4b118eadf964a5203c7f23e3', visible: true, stars: 3}
// 	];
// 	createMarkers();
// });

// $('#good').click(function(){
// 	clearMarkers();
// 	locations = [
// 		{title: 'Fieldhouse Brewing Company', location: { lat: 38.825982, lng: -104.823627 }, fsID: '5390a6b2498e4fea4875bfef', visible: true, stars: 3},
// 		{title: 'Trinity Brewing Company', location: { lat: 38.897450, lng: -104.854339 }, fsID: '4b118eadf964a5203c7f23e3', visible: true, stars: 3}
// 	];
// 	createMarkers();
// });

// $('#better').click(function(){
// 	clearMarkers();
// 	locations = [
// 		{title: 'Cogstone Brewing Company', location: { lat: 38.880052, lng: -104.755481 }, fsID: '56a418f7498eb236c64f6300', visible: true, stars: 4},
// 		{title: 'Gold Camp Brewing Company', location: { lat: 38.819571, lng: -104.823610 }, fsID: '54a5ff5e498e3dc75acd6ea4', visible: true, stars: 4},
// 		{title: 'Cerberus Brewing Company', location: { lat: 38.833016, lng: -104.837419 }, fsID: '57c878a1498e9ad24cf1158d', visible: true, stars: 4}
// 	];
// 	createMarkers();
// });

// $('#best').click(function(){
// 	clearMarkers();
// 	locations = [
// 		{title: 'Bristol Brewing Company', location: { lat: 38.811236, lng: -104.827392 }, fsID: '4af49ef4f964a5206af421e3', visible: true, stars: 5},
// 		{title: 'Phantom Canyon', location: { lat: 38.834232, lng: -104.824948 }, fsID: '4ab97703f964a5207e7f20e3', visible: true, stars: 5}
// 	];
// 	createMarkers();
// });


// NEXT UP
// Now that you have a basic idea of how you can update the markers, time to make the app more robust :) 
// Checkout KO observable's computed() and subscribe() method. 
// So, instead of directly modifying your locations array, see if you can figure out how to use computed create an observable "filteredArray" and "subscribe" to it to track changes that happen.
// Then, to update the frontend, you'd want to swap data-bind="foreach: myObservable" to use the filtered array data-bind="foreach: 
// filteredArray would default to all locations in the beginning and if it changes...

// EXAMPLE FROM SHARYNNE
// self.filteredArray.subscribe(function() {
//     var diff = ko.utils.compareArrays(self.locations(), self.filteredArray());
//     ko.utils.arrayForEach(diff, function(diffItem) {
//       if (diffItem.status === 'deleted') {
//         // do something
//       } else {
//         // do something else
//       }
//     });
// });


// function filterArray() {
// 	let filteredLocations = [];
// 	for (let i = 0; i < locations.length; i++){
// 		if (locations.stars > 1){
// 			filteredLocations.push(locations[i]);
// 		}
// 	}
// 	console.log(filteredLocations);
// 	return filteredLocations;
// }


// VIEWMODEL
function AppViewModel () {
	let self = this;
	let allLocations = locations;

	// let filteredItems = [];
	// allLocations: ko.computed(function(){
	// 	ko.utils.arrayForEach(function() {
	// 		if (self.locations.stars > 1){
	// 			self.filteredItems.push(locations[i]);
	// 		}
	// 	}, self);
	// 	return self.filteredItems;
	// });

	self.myObservable = ko.observableArray(locations);
	console.log(self.myObservable)

	self.allButton = function(allLocations) {
		self.myObservable = [];
		for(let i = 0; i < allLocations.length; i++){
			if (allLocations.stars > 1){
				self.myObservable.push(allLocations[i]);
			}
		}
		return self.myObservable;
	};

	self.goodButton = function(allLocations) {
		self.myObservable = [];
		for(let i = 0; i < allLocations.length; i++){
			if (allLocations.stars == 3){
				self.myObservable.push(allLocations[i]);
			}
		}
		return self.myObservable;
	};

	self.betterButton = function(allLocations) {
		self.myObservable = [];
		for(let i = 0; i < allLocations.length; i++){
			if (allLocations.stars == 4){
				self.myObservable.push(allLocations[i]);
			}
		}
		return self.myObservable;
	};


	self.bestButton = function(allLocations) {
		self.myObservable = [];
		for(let i = 0; i < allLocations.length; i++){
			if (allLocations.stars == 5){
				self.myObservable.push(allLocations[i]);
			}
		}
		return self.myObservable;
	};


	// self.myObservable.subscribe(function(locations) {
	// 	return locations;
	// });

	self.showInfo = function(locations) {
		google.maps.event.trigger(locations.marker,'click');
	}

}

let appViewModel = new AppViewModel();
ko.applyBindings(appViewModel);

