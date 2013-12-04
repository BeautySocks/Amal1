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
		$.each(data.offer,function(index,value){ 
		//alert(data.offer[0].offerid);
		renderOffer(pm, index+1,value.name, value.location.Latitude, value.location.Longitude, value.description);
		});
		// Done with offer, update message
		updateAll();
	});		

function renderOffer(prox,label,name,olat,olon,desc) {	
		//$("#list").append('<li id="'+label+'"><a href="#offerdetails" id="'+label+'"><span dir="rtl">'+name+' ('+distance+'KM)</span></a></li>');
		$("#searchPickPlace").append('<li id="'+label+'"><a id="'+label+'" href="#">'+name+'</a></li>');
		//<li data-name="Remuera"><a data-transition="slide" id="Remuera" href="search-list.html">Remuera</a></li>
		//if(parseFloat(distance,2)<=parseFloat(prox/1000,2)) {
		//alert('yay we passed the if');
		//$("#listH").append('<li id="'+label+'"><a href="#offerdetails"id="'+label+'">asd'+name+'</a></li>');
//	} // End if	
	//$('#listH').listview('refresh');
//	$("#list").listview('refresh');
//	$("#totaloffers").html(totaloffers);

} 
$('#searchPickPlace').delegate('li', 'click', function() {
 //alert($(this).text());
 var Oid= this.id;
 if (Oid)
 {
	 $.getJSON(jsonFile, function(data) {
		$.each(data.offer,function(index,value){ 
		if(Oid == value.offerid)
		{
		$("#details").empty()
		$("#details").append('<p>'+value.description+'</p>')
		$("#details").listview("refersh");
		}
		});
	 });
	 }
 //alert(this.id);
});
//$('#searchPickPlace').children('li').bind('touchstart mousedown', function(e) {
//    alert('Selected Name=' + $(this).attr('data-name'));
//});
// End renderOffer Function


