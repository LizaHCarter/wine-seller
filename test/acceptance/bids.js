/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'wine-seller-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('users', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=nodeapptest%2Bbob%40gmail.com&password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('post /bid', function(){
    it('should redirect to marketplace page', function(done){
      request(app)
      .post('/bidding/a00000000000000000000001')
      .set('cookie', cookie)
      .send('itemUpForBidId=a00000000000000000000006&itemOfferedId=a00000000000000000000001&offerOwnerId=000000000000000000000001&upForBidOwnerId=000000000000000000000002')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/marketplace');
        done();
      });
    });
  });

});

