/* jshint unused:false, camelcase:false */
/* global google */

function geocode(address, cb){
  'use strict';
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address:address}, function(results, status){
    //console.log('results', results);
    var name = results[0].formatted_address,
        lat  = results[0].geometry.location.lat(),
        lng  = results[0].geometry.location.lng();
    cb(name, lat, lng);
  });
}

function cartographer(cssId, lat, lng, zoom){
  'use strict';
  var mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP},
      map = new google.maps.Map(document.getElementById(cssId), mapOptions);

  return map;
}

function addMarker(map, lat, lng, name, icon){
  'use strict';
  var latLng = new google.maps.LatLng(lat, lng);
  // console.log(latLng);
  new google.maps.Marker({map: map, position: latLng, title: name, animation: google.maps.Animation.DROP, icon: icon});
}
