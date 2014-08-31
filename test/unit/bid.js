/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Bid       = require('../../app/models/bid'),
    Item      = require('../../app/models/item'),
    Mongo     = require('mongodb'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'wine-seller-test',

    itemUpForBidId = Mongo.ObjectID('a00000000000000000000002'),
    itemOfferedId = Mongo.ObjectID('a00000000000000000000005'),
    upForBidOwnerId = Mongo.ObjectID('000000000000000000000001'),
    offerOwnerId = Mongo.ObjectID('000000000000000000000002');

describe('Bid', function(){
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
    it('should create a new Bid object', function(){
      var data = {itemUpForBidId: itemUpForBidId, itemOfferedId: itemOfferedId, upForBidOwnerId:upForBidOwnerId, offerOwnerId: offerOwnerId},
          i    = new Bid(data);
      expect(i).to.be.instanceof(Bid);
      expect(i.itemUpForBidId).to.be.instanceof(Mongo.ObjectID);
      expect(i.itemOfferedId).to.be.instanceof(Mongo.ObjectID);
      expect(i.upForBidOwnerId).to.be.instanceof(Mongo.ObjectID);
      expect(i.offerOwnerId).to.be.instanceof(Mongo.ObjectID);
      expect(i.isOpen).to.be.true;
    });
  });

  describe('.create', function(){
    it('should save a new Bid in the database and change offered item isBiddable to false', function(done){
      var data = {itemUpForBidId: itemUpForBidId, itemOfferedId: itemOfferedId, upForBidOwnerId:upForBidOwnerId, offerOwnerId: offerOwnerId},
          i    = new Bid(data);
      Bid.create(i, 'a00000000000000000000005', function(){
        Item.findById('a00000000000000000000005', function(err, changedItem){
          expect(changedItem.isBiddable).to.be.false;
          done();
        });
      });
    });
  });

  describe('.accept', function(){
    it('should close auction and change ownership of items', function(done){
      var userId = Mongo.ObjectID('000000000000000000000001');
      Bid.accept('b00000000000000000000001', userId, function(){
        Bid.collection.findOne({_id:Mongo.ObjectID('b00000000000000000000001')}, function(err, bid){
          Item.findById(bid.itemUpForBidId.toString(), function(err, soldItem){
            Item.findById('a00000000000000000000004', function(err, losingBidItem){
              Bid.countItemBids(soldItem._id, function(err, count){
                expect(bid.isOpen).to.equal(false);
                expect(soldItem.ownerId).to.eql(bid.offerOwnerId);
                expect(losingBidItem.isBiddable).to.equal(true);
                expect(count).to.equal(0);
                done();
              });
            });
          });
        });
      });
    });
  });

});

