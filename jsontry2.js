// Global variables
var lat, lon, latlon, mylocation;
var proxm, proxkm;
var totaloffers, offermarker;
var zoomlevel, dzoom, bounds, distance;
var jsonFile="offers.json";
var sortedoffer;
totaloffers=0;
var pm=50000;

	$.getJSON(jsonFile, function(data) {
		alert('Im loaded');
		$.each(data.offer,function(index,value){ 
		alert('each');
		renderOffer(pm, index+1,value.name, value.location.Latitude, value.location.Longitude, value.description);
		});
		// Done with offer, update message
		alert('Amal');
		updateAll();
	});		

function renderOffer(prox,label,name,olat,olon,desc) {
	alert('render offer');
	
		$("#list").append('<li id="'+label+'"><a href="#offerdetails" id="'+label+'"><span dir="rtl">'+name+' ('+distance+'KM)</span></a></li>');
		
		//if(parseFloat(distance,2)<=parseFloat(prox/1000,2)) {
		//alert('yay we passed the if');
		$("#listH").append('<li id="'+label+'"><a href="#offerdetails"id="'+label+'">asd'+name+'</a></li>');
		
//	} // End if	
	$('#listH').listview('refresh');
//	$("#list").listview('refresh');
//	$("#totaloffers").html(totaloffers);
} 
// End renderOffer Function