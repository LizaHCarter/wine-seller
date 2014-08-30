'use strict';

var User = require('../models/user'),
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
    console.log(req.body);
    res.redirect('/profile');
  });
};

exports.index = function(req, res){
  User.findAll(function(err, users){
    res.render('users/index', {users:users});
  });
};

exports.trader = function(req, res){
  User.findOne({email:req.params.email}, function(err, trader){
    if(trader){
      res.render('users/trader', {trader:trader});
    }else{
      res.redirect('/users');
    }
  });
};
