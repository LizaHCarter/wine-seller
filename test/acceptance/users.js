/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'template-test';

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

  describe('get /register', function(){
    it('should show the register page', function(done){
      request(app)
      .get('/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('post /register', function(){
    it('should redirect to the home page', function(done){
      request(app)
      .post('/register')
      .send('name=John+Jones&photo=http%3A%2F%2Fdabfam.com%2Fbasics%2Fwp-content%2Fuploads%2F2012%2F05%2Fjohn-jones-pic.jpg&email=nodetestapp%2Bjohn%40gmail.com&phone=316-650-0346&password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        done();
      });
    });
  });

  describe('get /login', function(){
    it('should return the login page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
        done();
      });
    });
  });

  describe('post /login', function(){
    it('should redirect to the home page', function(done){
      request(app)
      .post('/login')
      .send('email=nodeapptest%2Bbob%40gmail.com&password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        done();
      });
    });
  });

  describe('get /profile', function(){
    it('should show the users profile page', function(done){
      request(app)
      .get('/profile')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Boberson');
        done();
      });
    });
  });

  describe('post /items', function(){
    it('should redirect to the profile page', function(done){
      request(app)
      .post('/items')
      .send('name=Red+Wine&photo=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fc%2Fcc%2FFrench_beaujolais_red_wine_bottle.jpg&tags=red%2C+wine&location=Nashville%2C+TN%2C+USA&description=Red+Wine')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/profile');
        done();
      });
    });
  });

});

