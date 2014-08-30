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
  this.isBiddable = false;
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

module.exports = Item;

function getNumberOfBids(item, cb){
  Bid.countItemBids(item._id, function(err, count){
    item.numBids = count;
    cb(null, item);
  });
}

