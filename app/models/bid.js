'use strict';

var Mongo  = require('mongodb');

function Bid(){
}

Object.defineProperty(Bid, 'collection', {
  get: function(){return global.mongodb.collection('bids');}
});

Bid.countItemBids = function(itemId, cb){
  Bid.collection.count({itemUpForBidId:itemId, isOpen:true}, cb);
};

Bid.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Bid.collection.findOne({_id:_id}, cb);
};

module.exports = Bid;

