/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Bid       = require('../../app/models/bid'),
    Item      = require('../../app/models/item'),
    Mongo     = require('mongodb'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'wine-seller-test';

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

