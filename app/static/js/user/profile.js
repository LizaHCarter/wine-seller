/* jshint unused:false, camelcase:false */
/* global google */

(function(){
  'use strict';

  $(document).ready(function(){
    $('#submitItem').click(geocodeAndSubmit);
  });

  function geocodeAndSubmit(e){
    var location = $('input[name=location]').val();
    geocode(location, function(name, lat, lng){
      $('input[name=location]').val(name);
      $('#newItem').append('<input name="lat" value="'+lat+'" type="hidden">');
      $('#newItem').append('<input name="lng" value="'+lng+'" type="hidden">');
      $('#newItem').submit();
    });
    e.preventDefault();
  }

  function geocode(address, cb){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address:address}, function(results, status){
      //console.log('results', results);
      var name = results[0].formatted_address,
          lat  = results[0].geometry.location.lat(),
          lng  = results[0].geometry.location.lng();
      cb(name, lat, lng);
    });
  }

})();

