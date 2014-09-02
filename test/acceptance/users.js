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
    it('should redirect to the register page(duplicate email in system)', function(done){
      request(app)
      .post('/register')
      .send('name=John+Jones&photo=http%3A%2F%2Fdabfam.com%2Fbasics%2Fwp-content%2Fuploads%2F2012%2F05%2Fjohn-jones-pic.jpg&email=nodeapptest%2bbob%40gmail.com&phone=316-650-0346&password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/register');
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
        expect(res.headers.location).to.equal('/marketplace');
        done();
      });
    });
    it('should redirect to login page (incorrect credentials)', function(done){
      request(app)
      .post('/login')
      .send('email=nodeapptest%2Bbob%40gmail.com&password=12354')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        done();
      });
    });
  });

  describe('delete /logout', function(){
    it('should redirect to the home page', function(done){
      request(app)
      .post('/logout')
      .set('cookie', cookie)
      .send('_method=delete')
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
    it('should bounce unauthenticated user to login page', function(done){
      request(app)
      .get('/profile')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        done();
      });
    });
  });

  describe('get /profile/edit', function(){
    it('should show the update/edit profile page', function(done){
      request(app)
      .get('/profile/edit')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('name');
        expect(res.text).to.include('email');
        done();
      });
    });
  });

  describe('put /profile', function(){
    it('should show updated profile page', function(done){
      request(app)
      .put('/profile')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/profile');
        done();
      });
    });
  });

  describe('get /users', function(){
    it('should show all winos', function(done){
      request(app)
      .get('/users')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('nodeapptest+bob@gmail.com');
        done();
      });
    });
  });

  describe('get /users/nodeapptest+bob@gmail.com', function(){
    it('should show a specific wino', function(done){
      request(app)
      .get('/users/nodeapptest+bob@gmail.com')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Red Wine');
        expect(res.text).to.include('White Wine');
        done();
      });
    });
    it('should redirect to users (invalid email)', function(done){
      request(app)
      .get('/users/nodeapptest+idontexistatall@gmail.com')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users');
        done();
      });
    });
  });

  describe('get /messages', function(){
    it('should return the messages page', function(done){
      request(app)
      .get('/messages')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Message');
        done();
      });
    });
  });

  describe('post /messages/3', function(){
    it('should send a user a message', function(done){
      request(app)
      .post('/messages/000000000000000000000001')
      .set('cookie', cookie)
      .send('mtype=internal&message=hi')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users/nodeapptest+bob@gmail.com');
        done();
      });
    });
  });

  describe('get /messages/messageId', function(){
    it('should return a message for the user', function(done){
      request(app)
      .get('/messages/c00000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Hey Bob,');
        done();
      });
    });
  });

});

