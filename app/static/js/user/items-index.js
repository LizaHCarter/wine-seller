/* jshint unused:false, camelcase:false */
/* global google, cartographer, addMarker */

(function(){
  'use strict';

  var map;

  $(document).ready(function(){
    map = cartographer('marketplace-map', 39.8282, -98.5795, 4);
    var rows = $('.item').toArray();
    // console.log(rows);
    if(rows.length){
      rows.forEach(function(row){
        // console.log(row);
        var lat = parseFloat($(row).attr('data-lat')),
            lng = parseFloat($(row).attr('data-lng')),
            name = $(row).attr('data-loc'),
            marker = $(row).attr('data-marker') || '/img/marker.png';
        addMarker(map, lat, lng, name, marker);
      });
    }
  });

})();

