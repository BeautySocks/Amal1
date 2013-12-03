//Initialize
$(document).ready(function() {
	alert('function1');
	//document.addEventListener("deviceready", onDeviceReady, false);
});
// Global variables
var lat, lon, latlon, mylocation;
var proxm, proxkm;
var totaloffers, offermarker;
var zoomlevel, dzoom, bounds, distance;
var jsonFile="offers.json";
var sortedoffer;
totaloffers=0;
// PhoneGap is loaded and it is now safe to make calls 
//function onDeviceReady() {
//	 iOS. BB. Android
//	alert('OnDeviceReady');
	loadScript();
//	document.addEventListener("offline", onOffline, false);
//	document.addEventListener("online", onOnline, false);
//}
//function onOffline() {
//	//When device goes offline, throw an error
//	alert('onOffline');
//	onGetLocationError(4);
//}
//function onOnline() {
//	//When the device is back online, go to index
//	alert('onOnline');
//    $.mobile.changePage("#index");
//}

// Load the Google maps API script with zoom level and desired proximity
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
	proxm = 10000;
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
		$.each(data.offer,function(index,value){ 
		alert('In the first $.each ');
		//console.log( offer.offerid[4].location[0].Latitude );
		//alert(value.location.Latitude);
		renderOffer(pm, index+1,value.name, value.location.Latitude, value.location.Longitude, value.description);
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
function renderOffer(prox,label,name,olat,olon,desc) {
	alert('render offer');
	var offerlatlon=new google.maps.LatLng(olat, olon);
	alert(offerlatlon);
	distance = (google.maps.geometry.spherical.computeDistanceBetween (offerlatlon, latlon)/1000).toFixed(1);
	// Process only if within requested distance
	alert(parseFloat(distance,2));
	alert(parseFloat(prox/1000,2));
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
		$("#list").append('<li id="'+label+'"><a class="dlink" href="#details" data-rel="popup" id="'+label+'">'+name+'('+distance+'KM)</a><span class="ui-li-count ui-btn-corner-all">'+label+'</span></li>');
				
//	$("#list").listview('refresh');
//	$("#totaloffers").html(totaloffers);
} // End renderOffer Function


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
/* ================================================= 
   ================ Events Section ================= 
   ================================================= */

$('#gohome').on('click', function (e)  {
	if ($("#list li.onestore").length) {$('#list li.onestore').remove();}
	if ($("#list li.nostore").length) {$('#list li.nostore').remove();}
});

$('#goback').on('tap', function ()  {
	if ($("#detailslist li.oneitem").length) {$('#detailslist li.oneitem').remove();}
	$("#detailslist").listview('refresh');
	$.mobile.changePage("#results");
	e.stopPropagation();
    e.preventDefault();

});


$('#options').delegate('.option', 'tap', function ()  {
	connectionStatus = navigator.onLine ? 'online' : 'offline';
	if(connectionStatus=='offline')
	{
		onGetLocationError(4);
	}
	else
	{
		if($(this).attr('id')=="reload")
		{
			loadScript(12,10000);
			//location.reload();
		} else if($(this).attr('id')=="get20") 
		{
			loadScript(11,20000);
		}
		else if($(this).attr('id')=="get50") 
		{
			loadScript(10,50000);
		}
		else if($(this).attr('id')=="getall") 
		{
			loadScript(9,500000);
		}
		$("#errorholder").hide();
		$("#mapholder").show();
	} // End else network
});