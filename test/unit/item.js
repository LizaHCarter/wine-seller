/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Item      = require('../../app/models/item'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'wine-seller-test';

describe('Item', function(){
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
    it('should create a new Item object', function(){
      var id   = Mongo.ObjectID(),
          data = {name:'Test', location:'Testville', lat:'0', lng:'0', description:'Is A Test', tags:'tag1, tag2', photo:'url', ownerId:id},
          i    = new Item(data);
      expect(i).to.be.instanceof(Item);
      expect(i.name).to.equal('Test');
      expect(i.location).to.equal('Testville');
      expect(i.lat).to.equal(0);
      expect(i.lng).to.equal(0);
      expect(i.description).to.equal('Is A Test');
      expect(i.tags[1]).to.equal('tag2');
      expect(i.photo).to.equal('url');
      expect(i.ownerId).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('.create', function(){
    it('should save a new Item in the database', function(done){
      var id   = Mongo.ObjectID(),
          data = {name:'Test', location:'Testville', lat:'0', lng:'0', description:'Is A Test', tags:'tag1, tag2', photo:'url', ownerId:id};
      Item.create(data, function(err, i){
        expect(i._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.findAllForUser', function(){
    it('should return all items owned by the user in the database', function(done){
      var id = Mongo.ObjectID('000000000000000000000001');
      Item.findAllForUser(id, function(err, items){
        expect(items).to.have.length(2);
        expect(items[1].numBids).to.equal(2);
        done();
      });
    });
  });

  describe('.findForSale', function(){
    it('should find items in database that are for sale based on query parameters', function(done){
      Item.findForSale({}, function(err, items){
        expect(items).to.have.length(1);
        expect(items[0].name).to.equal('White Wine');
        done();
      });
    });
  });

  describe('.markForSale', function(){
    it('should set an item onSale to true', function(done){
      Item.markOnSale('a00000000000000000000001', function(){
        Item.findById('a00000000000000000000001', function(err, item){
          expect(item.onSale).to.be.true;
          done();
        });
      });
    });
  });

  describe('.findForTrade', function(){
    it('find an item up for trade & all bidded items for it', function(done){
      var ownerId = Mongo.ObjectID('000000000000000000000001');
      Item.findForTrade('a00000000000000000000002', ownerId, function(err, data){
        expect(data.saleItem.name).to.equal('White Wine');
        expect(data.bids).to.have.length(2);
        expect(data.bids[0].item).to.be.ok;
        expect(data.bids[0].itemOfferedId.toString()).to.equal(data.bids[0].item._id.toString());
        done();
      });
    });
  });

});

