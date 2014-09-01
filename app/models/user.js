'use strict';

var bcrypt = require('bcrypt'),
    Mongo  = require('mongodb'),
    Message = require('./message'),
    _      = require('lodash');

function User(){
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(User.prototype, obj));
  });
};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    User.collection.save(o, cb);
  });
};

User.authenticate = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(o.password, user.password);
    if(!isOk){return cb();}
    cb(user);
  });
};

User.prototype.unread = function(cb){
  Message.unread(this._id, cb);
};

User.prototype.save = function(o, cb){
  var properties = Object.keys(o),
      self       = this;
  properties.forEach(function(property){
    self[property] = o[property];
  });
  delete this.unread;
  User.collection.save(self, cb);
};

User.findAll = function(cb){
  User.collection.find().toArray(cb);
};

User.findOne = function(filter, cb){
  User.collection.findOne(filter, cb);
};

User.prototype.messages = function(cb){
  Message.messages(this._id, cb);
};

User.prototype.send = function(receiver, obj, cb){
  Message.send(this._id, receiver._id, obj.message, cb);
};



module.exports = User;

