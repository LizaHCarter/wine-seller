'use strict';

var chalk = require('chalk');

exports.info = function(req, res, next){
  var debug = process.env.DEBUG * 1,
      log;
  log = debug ? logToScreen(chalk.bgRed('--------------------------------------------------------------------------------')) : 0;
  // standard logging info
  log = debug ? logToScreen(chalk.bold.red('TIME    :'), chalk.bold.blue(new Date())) : 0;
  log = debug ? logToScreen(chalk.bold.red('PORT    :'), process.env.PORT) : 0;
  log = debug ? logToScreen(chalk.bold.red('DB      :'), process.env.DB) : 0;
  log = debug ? logToScreen(chalk.bold.red('URL     :'), req.url) : 0;
  log = debug ? logToScreen(chalk.bold.red('VERB    :'), req.method) : 0;
  log = debug ? logToScreen(chalk.bold.red('PARAMS  :'), req.params) : 0;
  log = debug ? logToScreen(chalk.bold.red('QUERY   :'), req.query) : 0;
  log = debug ? logToScreen(chalk.bold.red('BODY    :'), req.body) : 0;
  log = debug ? logToScreen(chalk.bold.red('LOCALS  :'), res.locals) : 0;
  log = debug ? logToScreen(chalk.bold.red('SESSION :'), req.session) : 0;
  log = debug ? logToScreen(chalk.bold.red('SESSID  :'), req.sessionID) : 0;
  // sensitive process and enviroment info NOT FOR TRAVIS-CI
  log = debug === 2 ? logToScreen(chalk.bgBlue('--------------------------------------------------------------------------------')) : 0;
  log = debug === 2 ? logToScreen(chalk.bold.red('HEADERS :'), req.headers) : 0;
  log = debug === 2 ? logToScreen(chalk.bgBlue('--------------------------------------------------------------------------------')) : 0;
  log = debug === 2 ? logToScreen(chalk.bold.red('ENV     :'), process.env) : 0;
  // end
  log = debug ? logToScreen(chalk.bgRed('--------------------------------------------------------------------------------')) : 0;

  next();
};

function logToScreen(a, b){
  if(b){
    console.log(a, b);
  }else{
    console.log(a);
  }
  return 1;
}

