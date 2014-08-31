'use strict';

var Bid  = require('../models/bid');

exports.create = function(req, res){
  // console.log('********REQ BODY', req.body);
  console.log('Res.locals Id' + res.locals.user._id, 'Req.body' + req.body.upForBidOwnerId);
  if (res.locals.user._id.toString() !== req.body.upForBidOwnerId.toString()){
    Bid.create(req.body, req.params.itemOfferedId, function(){
      res.redirect('/marketplace');
    });
  }else{
    res.redirect('/');
  }
};
