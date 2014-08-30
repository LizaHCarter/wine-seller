/* jshint unused:false, camelcase:false */
/* global google, geocode */

(function(){
  'use strict';

  $(document).ready(function(){
    $('button[type=submit]').click(geocodeAndSubmit);
  });

  function geocodeAndSubmit(e){
    var location = $('input[name=location]').val();
    geocode(location, function(name, lat, lng){
      $('input[name=location]').val(name);
      $('form').append('<input name="lat" value="'+lat+'" type="hidden">');
      $('form').append('<input name="lng" value="'+lng+'" type="hidden">');
      $('form').submit();
    });
    e.preventDefault();
  }

})();

