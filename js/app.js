//'use strict';


// MODEL
let locations = [
	{title: 'Bristol Brewing Company', location: { lat: 38.811236, lng: -104.827392 }},
	{title: 'Phantom Canyon', location: { lat: 38.834232, lng: -104.824948 }},
	{title: 'Cerberus Brewing Company', location: { lat: 38.833016, lng: -104.837419 }},
	{title: 'Fieldhouse Brewing Company', location: { lat: 38.825982, lng: -104.823627 }},
	{title: 'Red Leg Brewing Company', location: { lat: 38.898022, lng: -104.841796 }},
	{title: 'Cogstone Brewing Company', location: { lat: 38.880052, lng: -104.755481 }},
	{title: 'Gold Camp Brewing Company', location: { lat: 38.819571, lng: -104.823610 }}
]

let map;
let largeInfoWindow;
let marker;
let markers = [];
let bounds;
let service;


function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 38.833882, lng: -104.821363},
		zoom: 13
	});

	largeInfoWindow = new google.maps.InfoWindow();

	createMarkersForPlace();
	showListings();
}


function showListings() {
	bounds = new google.maps.LatLngBounds();
	// Extend the boundaries of the map for each marker and display the marker
	for (let i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}


// Create array of marker objects for each item in location array
function createMarkersForPlace() {
	for (let i = 0; i < locations.length; i++) {
		let position = locations[i].location;
		let title = locations[i].title;
		marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});
		markers.push(marker);
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfoWindow);
		});
	}
}

// Populate info into marker window popup
function populateInfoWindow(marker, infowindow) {
	// Make sure the infowindow isn't already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.setContent('');
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick',function(){
			infowindow.setMarker = null;
		});
		infowindow.open(map, marker);
	}
}






// VIEWMODEL
function AppViewModel () {
	var self = this;
	console.log(self);
	console.log(locations);

	this.myObservable = ko.observable("");
	this.myObservable(locations);
}

let appViewModel = new AppViewModel();
ko.applyBindings(appViewModel);