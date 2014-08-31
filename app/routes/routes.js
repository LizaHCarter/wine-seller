'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    security       = require('../lib/security'),
    debug          = require('../lib/debug'),
    home           = require('../controllers/home'),
    items          = require('../controllers/items'),
    bids         = require('../controllers/bids'),
    users          = require('../controllers/users');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());
  app.use(session({store:new RedisStore(), secret:'my super secret key', resave:true, saveUninitialized:true, cookie:{maxAge:null}}));

  app.use(security.authenticate);
  app.use(debug.info);

  app.get('/', home.index);
  app.get('/register', users.new);
  app.post('/register', users.create);
  app.get('/login', users.login);
  app.post('/login', users.authenticate);

  app.use(security.bounce);
  app.delete('/logout', users.logout);
  app.get('/profile/edit', users.edit);
  app.put('/profile', users.update);
  app.get('/profile', users.profile);
  app.get('/users', users.index);
  app.get('/users/:email', users.trader);
  app.post('/items', items.create);
  app.get('/marketplace', items.index);
  app.put('/items/:itemId', items.markOnSale);
  app.get('/trade/:itemId', items.showTrade);
  app.put('/trade', items.trade);
  app.get('/bid/:itemId', items.itemBidPage);
  app.post('/bidding/:itemOfferedId', bids.create);

  console.log('Express: Routes Loaded');
};

