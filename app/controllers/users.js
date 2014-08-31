'use strict';

var User = require('../models/user'),
    Message = require('../models/message'),
    Item = require('../models/item');

exports.new = function(req, res){
  res.render('users/new');
};

exports.login = function(req, res){
  res.render('users/login');
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.create = function(req, res){
  User.register(req.body, function(err, user){
    if(user){
      res.redirect('/');
    }else{
      res.redirect('/register');
    }
  });
};

exports.authenticate = function(req, res){
  User.authenticate(req.body, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id;
        req.session.save(function(){
          res.redirect('/');
        });
      });
    }else{
      res.redirect('/login');
    }
  });
};

exports.profile = function(req, res){
  Item.findAllForUser(res.locals.user._id, function(err, items){
    res.render('users/profile', {items:items});
  });
};
exports.edit = function(req, res){
  res.render('users/edit');
};

exports.update = function(req, res){
  res.locals.user.save(req.body, function(){
    res.redirect('/profile');
  });
};

exports.index = function(req, res){
  User.findAll(function(err, users){
    res.render('users/index', {users:users});
  });
};

exports.trader = function(req, res){
  User.findOneAndItems({email:req.params.email}, function(err, trader, biddableItems, saleItems){
    if(trader){
      res.render('users/trader', {trader:trader, biddableItems:biddableItems, saleItems:saleItems});
    }else{
      res.redirect('/users');
    }
  });
};

exports.send = function(req, res){
  User.findById(req.params.userId, function(err, receiver){
    res.locals.user.send(receiver, req.body, function(){
      res.redirect('/users/' + receiver.email);
    });
  });
};

exports.messages = function(req, res){
  res.locals.user.messages(function(err, msgs){
    res.render('users/messages', {msgs:msgs});
  });
};

exports.message = function(req, res){
  Message.read(req.params.msgId, function(err, msg){
    res.render('users/message', {msg:msg});
  });
};


