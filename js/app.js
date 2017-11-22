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
	getPlacesDetails();
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



// Get location details from Google Places Service
function getPlacesDetails(marker, infowindow) {
	service = new google.maps.places.PlacesService(map);
	service.getDetails({
		placeId: marker.id
	}, function(place, status){
		if (status === google.maps.places.PlacesServiceStatus.OK){
			infowindow.marker = marker;
			let innerHTML = '<div>';
			if (place.name){
				innerHTML += '<strong>' + place.name + '</strong>';
			}
			if (place.formatted_address) {
				innerHTML += '<br>' + place.formatted_address;
			}
			if (place.formatted_phone_number) {
				innerHTML += '<br>' + place.formatted_phone_number;
			}
			if (place.opening_hours) {
				innerHTML += '<br><br><strong>Hours:</strong><br>' +
				place.opening_hours.weekday_text[0] + '<br>' +
				place.opening_hours.weekday_text[1] + '<br>' +
				place.opening_hours.weekday_text[2] + '<br>' +
				place.opening_hours.weekday_text[3] + '<br>' +
				place.opening_hours.weekday_text[4] + '<br>' +
				place.opening_hours.weekday_text[5] + '<br>' +
				place.opening_hours.weekday_text[6];
			}
			if (place.photos) {
				innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
					{maxHeight:100, maxWidth: 200}) + '">';
			}
			innerHTML += '</div>';
			infowindow.setContent(innerHTML);
			infowindow.open(map, marker);
			// Make sure the marker property is cleared if the infowindow is closed.
			infowindow.addListener('closeclick', function() {
				infowindow.marker = null;
          });

		}
	});
}


// VIEWMODEL
function AppViewModel () {
	var self = this;
	console.log(self);
	this.myObservable = ko.observable("");
}

let appViewModel = new AppViewModel();
ko.applyBindings(appViewModel);