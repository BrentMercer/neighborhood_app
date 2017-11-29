//'use strict';


// MODEL
let locations = [
	{title: 'Bristol Brewing Company', location: { lat: 38.811236, lng: -104.827392 }, fsID: '4af49ef4f964a5206af421e3'},
	{title: 'Phantom Canyon', location: { lat: 38.834232, lng: -104.824948 }, fsID: '4ab97703f964a5207e7f20e3' },
	{title: 'Cerberus Brewing Company', location: { lat: 38.833016, lng: -104.837419 }, fsID: '57c878a1498e9ad24cf1158d'},
	{title: 'Fieldhouse Brewing Company', location: { lat: 38.825982, lng: -104.823627 }, fsID: '5390a6b2498e4fea4875bfef'},
	{title: 'Red Leg Brewing Company', location: { lat: 38.898022, lng: -104.841796 }, fsID: 'redlegbrewco'},
	{title: 'Cogstone Brewing Company', location: { lat: 38.880052, lng: -104.755481 }, fsID: '56a418f7498eb236c64f6300'},
	{title: 'Gold Camp Brewing Company', location: { lat: 38.819571, lng: -104.823610 }, fsID: '54a5ff5e498e3dc75acd6ea4'}
]

let map;
let largeInfoWindow;
let markers = [];
let bounds;
let service;
let street = '';
let city = '';
let phone;


function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 38.833882, lng: -104.821363},
		zoom: 13
	});

	largeInfoWindow = new google.maps.InfoWindow();

	createMarkersForPlace();
}



// Create array of marker objects for each item in location array
function createMarkersForPlace() {
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
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfoWindow);
		});
		markers.push(marker);
	}
	map.fitBounds(bounds);
}

// Populate info into marker window popup
function populateInfoWindow(marker, infowindow) {

	let self = marker;
	self.setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(function(){ 
		marker.setAnimation(null); 
	}, 2200);

	// Make sure the infowindow isn't already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.setContent('');
		infowindow.marker = marker;
		console.log(marker);
		fourSQ(marker);
		infowindow.setContent('<div>' + self.title + '</div>' +
		'<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>" +
        '<div class="content">' + self.phone + "</div></div>");
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick',function(){
			infowindow.setMarker = null;
		});
		infowindow.open(map, marker);
	}
}


function mapError() {
  alert("Map did not load");
}


// Foursquare API
function fourSQ(marker){
	let fsurl = 'https://api.foursquare.com/v2/venues/' + marker.id + '&client_id=Z5WTAAN5CPS2SPIUL2QQ405SOK1PPZ314A2ZVWO5PYNVUF0E&client_secret=OO43DGDQPPP13G5ERTF2WH4IVJ4DTUILZUWVN3OFZPB0XQYX&v=20171122';

	$.ajax(fsurl)
	.done(function(data) {
		let street = data.response.venue.contact.street;
		let city = data.response.venue.contact.city;
		let phone = data.response.venue.contact.phone;
		//open window
	})
	.fail(function() {
		alert( "Foursquare API error. Please refresh page." );
	})

}





// VIEWMODEL
function AppViewModel () {
	var self = this;
	console.log(self);
	console.log(locations);

	this.myObservable = ko.observableArray(locations);

	self.showInfo = function(location) {
		google.maps.event.trigger(location.marker,'click');
	}

}

let appViewModel = new AppViewModel();
ko.applyBindings(appViewModel);