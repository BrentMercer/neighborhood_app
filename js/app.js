'use strict';


// Model
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
let markers = [];


// Viewmodel

function AppViewModel () {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 38.833882, lng: -104.821363},
		zoom: 13
	});
}



let largeInfoWindow = new google.maps.InfoWindow();
let bounds = new google.maps.LatLngBounds();



for (let i = 0; i < locations.length; i++) {
	let position = locations[i].location;
	let title = locations[i].title;
	let marker = new google.maps.Marker({
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
	bounds.extend(markers[i].position);
	map.fitBounds(bounds);
}


function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick',function(){
			infowindow.setMarker = null;
		});
	}
}


applyBindings(new AppViewModel());