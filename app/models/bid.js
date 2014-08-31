'use strict';

var Mongo  = require('mongodb'),
    async  = require('async');

function Bid(o){
  this.itemUpForBidId = o.itemUpForBidId;
  this.itemOfferedId = o.itemOfferedId;
  this.upForBidOwnerId = o.upForBidOwnerId;
  this.offerOwnerId = o.offerOwnerId;
  this.isOpen = true;
}

Object.defineProperty(Bid, 'collection', {
  get: function(){return global.mongodb.collection('bids');}
});

Bid.create = function(data,itemOfferedId, cb){
  var offeredItemId = Mongo.ObjectID(itemOfferedId),
      i = new Bid(data);
  Bid.collection.save(i, function(){
    require('./item').collection.update({_id: offeredItemId},{$set: {isBiddable: false}},cb);
  });
};

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

Bid.accept = function(bidId, userId, cb){
  bidId = Mongo.ObjectID(bidId);
  Bid.collection.findAndModify({_id:bidId, upForBidOwnerId:userId}, [], {$set:{isOpen:false}}, function(err, winningBid){
    if(!winningBid){return cb();}
    Bid.collection.find({itemUpForBidId:winningBid.itemUpForBidId, isOpen:true}).toArray(function(err, bids){
      if(bids.length){
        async.each(bids, closeAndReleaseLosers, function(err){
          swapOwnership(winningBid, cb);
        });
      }else{
        swapOwnership(winningBid, cb);
      }
    });
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

function closeAndReleaseLosers(bid, cb){
  Bid.collection.update({_id:bid._id}, {$set:{isOpen:false}}, function(){
    require('./item').collection.update({_id:bid.itemOfferedId}, {$set:{isBiddable:true}}, function(err2, numUpdates){
      cb(err2);
    });
  });
}

function swapOwnership(bid, cb){
  require('./item').collection.update({_id:bid.itemUpForBidId}, {$set:{ownerId:bid.offerOwnerId}}, function(){
    require('./item').collection.update({_id:bid.itemOfferedId}, {$set:{ownerId:bid.upForBidOwnerId}}, function(){
      cb();
    });
  });
}

