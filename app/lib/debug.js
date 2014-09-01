'use strict';

var chalk = require('chalk');

exports.info = function(req, res, next){
  var debug = process.env.DEBUG * 1;

  if(debug){
    console.log(debug ? chalk.bgRed('--------------------------------------------------------------------------------') : '');
    console.log(debug ? chalk.bold.red('TIME:') : '');
    console.log(debug ? chalk.bold.blue(new Date()) : '');
    console.log(debug ? chalk.bold.red('PORT:') : '');
    console.log(debug ? process.env.PORT : '');
    console.log(debug ? chalk.bold.red('DB:') : '');
    console.log(debug ? process.env.DB : '');
    console.log(debug ? chalk.bold.red('URL:') : '');
    console.log(debug ? req.url : '');
    console.log(debug ? chalk.bold.red('VERB:') : '');
    console.log(debug ? req.method : '');
    console.log(debug ? chalk.bold.green('PARAMS:') : '');
    console.log(debug ? req.params : '');
    console.log(debug ? chalk.bold.green('QUERY:') : '');
    console.log(debug ? req.query : '');
    console.log(debug ? chalk.bold.green('BODY:') : '');
    console.log(debug ? req.body : '');
    console.log(debug ? chalk.bold.green('LOCALS:') : '');
    console.log(debug ? res.locals : '');
    console.log(debug ? chalk.bold.green('SESSION:') : '');
    console.log(debug ? req.session : '');
    console.log(debug ? chalk.bold.red('SESSID:') : '');
    console.log(debug ? req.sessionID : '');

    if(debug === 2){
      console.log(debug === 2 ? chalk.bgBlue('--------------------------------------------------------------------------------') : '');
      console.log(debug === 2 ? chalk.bold.red('HEADERS:') : '');
      console.log(debug === 2 ? req.headers : '');
      console.log(debug === 2 ? chalk.bgBlue('--------------------------------------------------------------------------------') : '');
      console.log(debug === 2 ? chalk.bold.red('ENV:') : '');
      console.log(debug === 2 ? process.env : '');
    }

    console.log(debug ? chalk.bgRed('--------------------------------------------------------------------------------') : '');
  }

  next();
};

