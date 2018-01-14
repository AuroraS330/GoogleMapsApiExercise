var map;
var varMFX = {lat: 43.8020757, lng: -79.529857 };//MFX
var markersArray = [];
function initMap() {
     map = new google.maps.Map(document.getElementById('map'), {
     zoom: 10,
     center: varMFX
   });
   var image = 'https://memofixdatarecovery.com/favicon.ico';//MFX icon instead of beachflag 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
   var marker = new google.maps.Marker({
   position: varMFX,
   map: map,
   title: 'Memofix Lab.',
   icon: image
 });
};
$(document).ready(function(){
   $("#btnsubmit").click(function(){
   var location = $("#txtlocation").val();
   var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+location;//+',+CA';
   $.getJSON(url, function(data,statusTxt, xhr){
      $("#coordinates").html(statusTxt);
     var vlat, vlng;
     vlat = data['results'][0]['geometry']['location']['lat'];
     vlng = data['results'][0]['geometry']['location']['lng'];
      $("#coordinates").html(statusTxt+"<br/>Latitude: "+vlat+"<br/>Longitude: "+vlng);
   addMarker(vlat,vlng,location);
   $("#txtlocation").val("");
   var bounds = new google.maps.LatLngBounds;
   var geocoder = new google.maps.Geocoder;
   var service = new google.maps.DistanceMatrixService;
          service.getDistanceMatrix({
            origins: [varMFX],
            destinations: [location],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
          }, function(response, status) {
            if (status !== 'OK') {
              alert('Error was: ' + status);
			    outputDiv.innerHTML = status;
            } else {
              var originList = response.originAddresses;
              var destinationList = response.destinationAddresses;
              var outputDiv = document.getElementById('output');
              outputDiv.innerHTML = '';
             // deleteMarkers(markersArray);

             var showGeocodedAddressOnMap = function(asDestination) {
                //var icon = asDestination ? destinationIcon : originIcon;
                return function(results, status) {
                  if (status === 'OK') {
                    map.fitBounds(bounds.extend(results[0].geometry.location));
                    markersArray.push(new google.maps.Marker({
                      map: map,
                      position: results[0].geometry.location
                     // icon: icon
                    }));
                  } else {
                    alert('Geocode was not successful due to: ' + status);
                  }
                };
              };

              for (var i = 0; i < originList.length; i++) {
                var results = response.rows[i].elements;
                geocoder.geocode({'address': originList[i]},
                    showGeocodedAddressOnMap(false));
                for (var j = 0; j < results.length; j++) {
                  geocoder.geocode({'address': destinationList[j]},
                      showGeocodedAddressOnMap(false));//true
                  outputDiv.innerHTML += originList[i] + ' to <br>' + destinationList[j] +
                      '<br> distance is: ' + results[j].distance.text + ' in ' +
                      results[j].duration.text + '<br>';
                }
              }
            }
          });
   });
 });//click
});//ready

function addMarker(plat,plng,loc){
   var marker = new google.maps.Marker({
     position: {lat: plat, lng: plng },
     map: map,
     title: loc
   });
   map.setCenter( {lat: plat, lng: plng} );
 }
