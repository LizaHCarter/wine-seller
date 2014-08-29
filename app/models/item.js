'use strict';

var bcrypt = require('bcrypt'),
    Mongo  = require('mongodb'),
    async  = require('async'),
    Bid    = require('./bid');

function Item(){
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

Item.register = function(o, cb){
  Item.collection.findOne({email:o.email}, function(err, Item){
    if(Item){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    Item.collection.save(o, cb);
  });
};

module.exports = Item;

function getNumberOfBids(item, cb){
  Bid.countItemBids(item._id, function(err, count){
    item.numBids = count;
    cb(null, item);
  });
}

