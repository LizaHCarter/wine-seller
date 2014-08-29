'use strict';

var User = require('../models/user');

exports.authenticate = function(req, res, next){
  if(!req.session.userId){return next();}

  User.findById(req.session.userId, function(err, user){
    res.locals.user = user;
    next();
  });
};

exports.bounce = function(req, res, next){
  if(res.locals.user){
    next();
  }else{
    res.redirect('/login');
  }
};

