'use strict';

var Item = require('../models/item');

exports.create = function(req, res){
  req.body.ownerId = res.locals.user._id;
  Item.create(req.body, function(){
    res.redirect('/profile');
  });
};

exports.markonsale = function(req, res){
  Item.markOnSale(req.params.itemId, function(){
    res.redirect('/profile');
  });
};

