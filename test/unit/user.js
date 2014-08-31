/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'wine-seller-test';

describe('User', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new User object', function(){
      var u = new User();
      expect(u).to.be.instanceof(User);
    });
  });

  describe('#save', function(){
    it('should save a user to the database', function(done){
      console.log('*****Made it to line 34');
      var mark = {name:'Mark', email:'mark@gmail.com', photo:'http://mark.img', phone:'615-555-5555', password:'5555'};
      User.findById('000000000000000000000001', function(err, user){
        console.log(user);
        user.save(mark, function(){
          expect(user.name).to.equal('Mark');
          done();
        });
      });
    });
  });

  describe('.find', function(){
    it('should find users', function(done){
      User.findAll(function(err, users){
        expect(users).to.have.length(2);
        done();
      });
    });
  });

  describe('.findOne', function(){
    it('should find a specific user', function(done){
      User.findOne({email:'nodeapptest+bob@gmail.com'}, function(err, user){
        expect(user.email).to.equal('nodeapptest+bob@gmail.com');
        done();
      });
    });
  });
});


