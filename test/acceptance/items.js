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

  describe('post /items', function(){
    it('should redirect to the profile page', function(done){
      request(app)
      .post('/items')
      .set('cookie', cookie)
      .send('name=Red+Wine&photo=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fc%2Fcc%2FFrench_beaujolais_red_wine_bottle.jpg&tags=red%2C+wine&location=Nashville%2C+TN%2C+USA&description=Red+Wine')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/profile');
        done();
      });
    });
  });

  describe('get /marketplace', function(){
    it('should display the marketplace page', function(done){
      request(app)
      .get('/marketplace')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Marketplace');
        expect(res.text).to.include('White Wine');
        done();
      });
    });
  });

  describe('put /profile', function(){
    it('should redirect to the profile page after item is put on sale', function(done){
      request(app)
      .post('/items/a00000000000000000000001')
      .send('_method=put')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/profile');
        done();
      });
    });
  });

  describe('get /trade/itemId', function(){
    it('should display the trade confirmation page', function(done){
      request(app)
      .get('/trade/a00000000000000000000002')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Rose Wine');
        expect(res.text).to.include('White Wine');
        expect(res.text).to.include('Green Wine');
        done();
      });
    });
  });

});

