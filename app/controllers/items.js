'use strict';

var Item = require('../models/item');

exports.create = function(req, res){
  req.body.ownerId = res.locals.user._id;
  Item.create(req.body, function(){
    res.redirect('/profile');
  });
};

exports.index = function(req, res){
  Item.findForSale(req.query, function(err, items){
    res.render('items/index', {items:items});
  });
};

exports.markonsale = function(req, res){
  Item.markOnSale(req.params.itemId, function(){
    res.redirect('/profile');
  });
};

exports.showTrade = function(req, res){
  Item.findForTrade(req.params.itemId, res.locals.user._id, function(err, data){
    if(data){
      res.render('items/show-trade', {data:data});
    }else{
      res.redirect('/marketplace');
    }
  });
};
