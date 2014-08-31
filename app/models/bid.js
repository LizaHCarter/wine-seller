'use strict';

var Mongo  = require('mongodb'),
    async  = require('async');

function Bid(o){
  this.itemUpForBidId = Mongo.ObjectID(o.itemUpForBidId);
  this.itemOfferedId = Mongo.ObjectID(o.itemOfferedId);
  this.upForBidOwnerId = Mongo.ObjectID(o.upForBidOwnerId);
  this.offerOwnerId = Mongo.ObjectID(o.offerOwnerId);
  this.isOpen = true;
  this.bidDate = new Date();
}

Object.defineProperty(Bid, 'collection', {
  get: function(){return global.mongodb.collection('bids');}
});

Bid.create = function(data,itemOfferedId, cb){
  var offeredItemId = Mongo.ObjectID(itemOfferedId),
      i             = new Bid(data);
  console.log('********BID', i);
  Bid.collection.save(i, function(){
    require('./item').collection.update({_id: offeredItemId},{$set: {isBiddable: false}}, function(err, obj){
      notifySeller(i, function(){
        cb(err, obj);
      });
    });
  });
};

Bid.countItemBids = function(itemId, cb){
  Bid.collection.count({itemUpForBidId:itemId, isOpen:true}, cb);
};

Bid.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Bid.collection.findOne({_id:_id}, cb);
};

Bid.getBids = function(itemUpForBidId, cb){
  Bid.collection.find({itemUpForBidId:itemUpForBidId, isOpen:true}).toArray(function(err, bids){
    if(bids.length){
      async.map(bids, attachItem, cb);
    }else{
      cb(err, bids);
    }
  });
};

Bid.accept = function(bidId, userId, cb){
  bidId = Mongo.ObjectID(bidId);
  // console.log('*********BID ID', bidId);
  // console.log('*********User ID', userId);
  Bid.collection.findAndModify({_id:bidId, upForBidOwnerId:userId}, [], {$set:{isOpen:false}}, function(err, winningBid){
    console.log('*******WINNING BID', winningBid);
    if(!winningBid){return cb();}
    Bid.collection.find({itemUpForBidId:winningBid.itemUpForBidId, isOpen:true}).toArray(function(err, bids){
      if(bids.length){
        async.each(bids, closeAndReleaseLosers, function(err){
          swapOwnership(winningBid, function(){
            notifyBuyer(winningBid, cb);
          });
        });
      }else{
        swapOwnership(winningBid, function(){
          notifyBuyer(winningBid, cb);
        });
      }
    });
  });
};

module.exports = Bid;

// Helper Functions

function notifySeller(bid, cb){
  // console.log('*****bid', bid);
  require('./user').collection.findOne({_id:bid.upForBidOwnerId}, {fields:{name:1, email:1, phone:1}}, function(err, data){
    require('./item').collection.findOne({_id:bid.itemUpForBidId}, {fields:{name:1}}, function(err2, item){
      var message = 'Hey ' + data.name + '\nYou\'ve just recieved an offer for the ' + item.name + ' on Wine Seller';
      sendText(data.phone, message, function(err3, resT){
        // console.log('*************TEXT ERROR:', err3);
        // console.log('*************TEXT RES:', resT);
        sendEmail('nodeapptest@gmail.com', data.email, message, function(err4, resE){
          // console.log('*************EMAIL ERROR:', err4);
          // console.log('*************EMAIL RES:', resE);
          cb();
        });
      });
    });
  });
}

function notifyBuyer(bid, cb){
  require('./user').collection.findOne({_id:bid.offerOwnerId}, {fields:{name:1, email:1, phone:1}}, function(err, data){
    require('./item').collection.findOne({_id:bid.itemOfferedId}, {fields:{name:1}}, function(err2, offerItem){
      require('./item').collection.findOne({_id:bid.itemUpForBidId}, {fields:{name:1}}, function(err3, saleItem){
        var message = 'Hey ' + data.name + '\nYour offer to trade' + offerItem.name + ' for '+saleItem.name+' on Wine Seller was accepted.\nCongrats on the booze.\nThe Wine Seller Team';
        sendText(data.phone, message, function(err4, resT){
          // console.log('*************TEXT ERROR:', err4);
          // console.log('*************TEXT RES:', resT);
          sendEmail('nodeapptest@gmail.com', data.email, message, function(err5, resE){
            // console.log('*************EMAIL ERROR:', err5);
            // console.log('*************EMAIL RES:', resE);
            cb();
          });
        });
      });
    });
  });
}

function sendText(to, body, cb){
  if(!to){return cb();}

  var accountSid = process.env.TWSID,
      authToken  = process.env.TWTOK,
      from       = process.env.FROM,
      client     = require('twilio')(accountSid, authToken);

  client.messages.create({to:to, from:from, body:body}, cb);
}

function sendEmail(sender, to, body, cb){
  if(!sender || !to){return cb();}

  var apiKey  = process.env.MGAPIKEY,
      domain  = process.env.MGDOMAIN,
      Mailgun = require('mailgun-js'),
      mg      = new Mailgun({apiKey: apiKey, domain: domain}),
      subject = 'New Trade Offer On Wine Seller',
      data    = {from:sender, to:to, subject:subject, html:body};

  mg.messages().send(data, cb);
}

function attachItem(bid, cb){
  require('./item').findById(bid.itemOfferedId.toString(), function(err, item){
    bid.item = item;
    cb(null, bid);
  });
}

function closeAndReleaseLosers(bid, cb){
  Bid.collection.update({_id:bid._id}, {$set:{isOpen:false}}, function(){
    require('./item').collection.update({_id:bid.itemOfferedId}, {$set:{isBiddable:true}}, function(err2, numUpdates){
      cb(err2);
    });
  });
}

function swapOwnership(bid, cb){
  require('./item').collection.update({_id:bid.itemUpForBidId}, {$set:{ownerId:bid.offerOwnerId, onSale:false, isBiddable:true}}, function(){
    require('./item').collection.update({_id:bid.itemOfferedId}, {$set:{ownerId:bid.upForBidOwnerId, onSale:false, isBiddable:true}}, function(){
      cb();
    });
  });
}

