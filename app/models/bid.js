'use strict';

var Mongo  = require('mongodb'),
    async  = require('async');

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

Bid.getBids = function(itemUpForBidId, cb){
  Bid.collection.find({itemUpForBidId:itemUpForBidId, isOpen:true}).toArray(function(err, bids){
    if(bids.length){
      async.map(bids, attachItem, cb);
    }else{
      cb(err, bids);
    }
  });
};

module.exports = Bid;

// Helper Functions
function attachItem(bid, cb){
  require('./item').findById(bid.itemOfferedId.toString(), function(err, item){
    bid.item = item;
    cb(null, bid);
  });
}
