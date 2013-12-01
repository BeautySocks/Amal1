// Global variables
var lat, lon, latlon, mylocation;
var proxm, proxkm;
var totaloffers, offermarker;
var zoomlevel, dzoom, bounds, distance;
var jsonFile="offers.json";
var sortedoffer;
totaloffers=0;
loadScript();
function loadScript(zl,pm) {
	alert('Load Script');
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&v=3&libraries=geometry&callback=initialize&async=2";
  document.head.appendChild(script);
  // Any other stuff you want to do here?
}
// The callback function after loading the script
function initialize() {
	alert('initialize');
	$.getScript("js/StyledMarker.js");	
	var geoOptions = {'enableHighAccuracy': true, 'timeout': 10000, 'maximumAge':60000};
	navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationError, geoOptions);
	// Any other stuff you want to do here?
}

function onGetLocationSuccess(position) {
	alert('on get location success');
	lat=position.coords.latitude;
	lon=position.coords.longitude;
	latlon=new google.maps.LatLng(lat, lon);
	mapholder=document.getElementById('mapholder');
	mapholder.style.height='200px';
	mapholder.style.width=window.innerWidth;
	bounds = new google.maps.LatLngBounds(); // Required for zoom level and center
	zoomlevel=100;
	var myOptions={
	zoom:zoomlevel,
	center:latlon,
	mapTypeControl:false,
	navigationControlOptions:{style: google.maps.NavigationControlStyle.SMALL},
	mapTypeId:google.maps.MapTypeId.ROADMAP,
	};
	alert(zoomlevel);
	google.maps.visualRefresh = true;
	map=new google.maps.Map(document.getElementById("mapholder"),myOptions);
	var marker=new google.maps.Marker({
	  position:latlon,
	  map:map,
	  title:"My Location!"
	  });
	mylocation = lat+","+lon;
	bounds.extend(latlon);
	map.fitBounds(bounds);
	proxm = 1000;
	// Now ready to get the stores
	getOffers(mylocation,proxm);
	//alert('asd'+mylocation+' '+proxm);
} // End onGetLocationSuccess
  
function getOffers(ml,pm)
{
	alert('get offers');
	//function sortByDistance(a,b){
//		alert('sort by distance');
//		var aofferlatlon=new google.maps.LatLng(a.location.latitude, a.location.longitude);
//		var bofferlatlon=new google.maps.LatLng(b.location.latitude, b.location.longitude);
//		var adistance = (google.maps.geometry.spherical.computeDistanceBetween (aofferlatlon, latlon)/1000).toFixed(1);
//		var bdistance = (google.maps.geometry.spherical.computeDistanceBetween (bofferlatlon, latlon)/1000).toFixed(1);
//		return parseFloat(adistance,2) > parseFloat(bdistance,2) ? 1 : -1;
//	};
alert('before loaded');
	// Load the JSON
	$.getJSON(jsonFile, function(data) {
		alert('Im loaded');
//		$.each(data.places,function(index,value){ 
//		alert('Key = '+(value.placeid)+' : value = '+value.title+' : latitude = '+value.lat);
//			renderOffer(pm, index+1,value.title, value.lat, value.lng);
			
		$.each(data.offer,function(index,value){ 
		alert(value.location.Latitude);
			renderOffer(pm, index+1,value.name, value.location.Latitude, value.location.Longitude);
//		});
		});
		// Done with offer, update message
		updateAll();
	});		
}

/* 	Function: renderOffer
	updates the map and list for every result within range
	Args: offer info
*/
function renderOffer(prox,label,name,olat,olon) {
	alert('render offer');
	var offerlatlon=new google.maps.LatLng(olat, olon);
	alert(offerlatlon);
	distance = (google.maps.geometry.spherical.computeDistanceBetween (offerlatlon, latlon)/1000).toFixed(1);
	// Process only if within requested distance
	alert(parseFloat(distance,2));
	alert(parseFloat(prox/1000,2));
//	if(parseFloat(distance,2)<=parseFloat(prox/1000,2)) {
		alert('yay we passed the if');
		// Increment total stores
		totaloffers++;
		alert(totaloffers);
		// Extend the map to fit 
		bounds.extend(offerlatlon);
		map.fitBounds(bounds);
		alert('before updating maps with markers');
		// Update map with markers (requires StyledMarker.js) 	
		offermarker = new StyledMarker({
			styleIcon:new StyledIcon(StyledIconTypes.MARKER,
			{color:"FFFF66",text:label.toString()}),
			position:offerlatlon,
			map:map});
		// Append to the list of results
		alert('Appending to list');
		$("#list").append('<li id="'+label+'"><a class="dlink" href="#details">'+name+' ('+distance+'KM)</a><span class="ui-li-count ui-btn-corner-all">'+label+'</span></li>');
	} // End if
	$("#list").listview('refresh');
	$("#totaloffers").html(totaloffers);
//} // End renderStores Function
function onGetLocationError(error)
{
	alert('ongetlocation');
	$("#errorholder").show();
	$("#mapholder").hide();
	var x=document.getElementById("errormsg");
	switch(error.code) 
	{
		case 1:
		  x.innerHTML="User denied the request for Geolocation."
		  break;
		case 2:
		  x.innerHTML="Location information is unavailable."
		  break;
		case 3:
		  x.innerHTML="The request to get user location timed out."
		  break;
		default:
		  x.innerHTML="An unknown error occurred."
		  break;
	} // End switch
} // End onGetLocationError
