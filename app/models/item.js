'use strict';

var Mongo  = require('mongodb'),
    async  = require('async'),
    Bid    = require('./bid');

function Item(o){
  this.name = o.name;
  this.location = o.location;
  this.lat = o.lat * 1;
  this.lng = o.lng * 1;
  this.description = o.description;
  this.tags = o.tags.split(',').map(function(s){return s.trim();});
  this.photo = o.photo;
  this.ownerId = o.ownerId;
  this.isBiddable = true;
  this.onSale = false;
  this.datePosted = new Date();
}

Object.defineProperty(Item, 'collection', {
  get: function(){return global.mongodb.collection('items');}
});

Item.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Item.collection.findOne({_id:_id}, cb);
};

Item.findAllForUser = function(userId, cb){
  Item.collection.find({ownerId:userId}).toArray(function(err, items){
    async.map(items, getNumberOfBids, cb);
  });
};

Item.create = function(data, cb){
  var i = new Item(data);
  Item.collection.save(i, cb);
};

Item.findForSale = function(query, cb){
  var filter = {onSale:true},
      sort   = {};
  if(query.sort){sort[query.sort] = query.order * 1;}
  Item.collection.find(filter).sort(sort).toArray(function(err, items){
    if(items.length){
      async.map(items, getOwnerInfo, cb);
    }else{
      cb();
    }
  });
};

Item.findForTrade = function(itemId, ownerId, cb){
  var id = Mongo.ObjectID(itemId);
  Item.collection.findOne({_id:id, ownerId:ownerId}, function(err, saleItem){
    if(!saleItem){return cb();}

    Bid.getBids(saleItem._id, function(err2, bids){
      var data = {saleItem:saleItem, bids:bids};
      cb(err2, data);
    });
  });
};

Item.markOnSale = function(itemId, cb){
  var _id = Mongo.ObjectID(itemId);
  Item.collection.update({_id:_id}, {$set: {onSale: true, isBiddable:false}}, cb);
};

Item.findTradeAndBiddableItems = function(itemId, userId, cb){
  Item.findById(itemId, function(err, itemForTrade){
    Item.collection.find({ownerId:userId, isBiddable: true}).toArray(function(err, bidItems){
      cb(null, itemForTrade, bidItems);
    });
  });
};

Item.remove = function(itemId, userId, cb){
  itemId = Mongo.ObjectID(itemId);
  Item.collection.remove({_id:itemId, ownerId:userId}, cb);
};

module.exports = Item;

function getNumberOfBids(item, cb){
  Bid.countItemBids(item._id, function(err, count){
    item.numBids = count;
    cb(null, item);
  });
}

function getOwnerInfo(item, cb){
  require('./user').collection.findOne({_id:item.ownerId}, {fields:{name:1, email:1}}, function(err, data){
    item.owner = data;
    cb(null, item);
  });
}

