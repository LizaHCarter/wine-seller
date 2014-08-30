/* jshint unused:false, camelcase:false */
/* global google, geocode */

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

})();

