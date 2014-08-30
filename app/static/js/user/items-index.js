/* jshint unused:false, camelcase:false */
/* global google, cartographer, addMarker */

(function(){
  'use strict';

  var map;

  $(document).ready(function(){
    map = cartographer('marketplace-map', 39.8282, -98.5795, 4);
    var rows = $('.item').toArray();
    if(rows.length){
      rows.forEach(function(row){
        addMarker(map, $(row).attr('data-loc'), $(row).attr('data-lat'), $(row).attr('data-lng'), '/img/marker.png');
      });
    }
  });

})();

