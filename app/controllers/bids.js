'use strict';

var Bid  = require('../models/bid');

exports.create = function(req, res){
  req.body.upForBidOwnerId = res.locals.user._id;
  Bid.create(req.body, req.params.itemOfferedId, function(){
    res.redirect('/marketplace');
  });
};
