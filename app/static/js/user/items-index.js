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
        addMarker(map, parseFloat($(row).attr('data-lat')), parseFloat($(row).attr('data-lng')), $(row).attr('data-loc'), '/img/marker.png');
      });
    }
  });

})();

