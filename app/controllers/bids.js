'use strict';

var Bid  = require('../models/bid');

exports.create = function(req, res){
  // console.log('********REQ BODY', req.body);
  Bid.create(req.body, req.params.itemOfferedId, function(){
    res.redirect('/marketplace');
  });
};
