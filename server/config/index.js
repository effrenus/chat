var nconf = require('nconf');
var defaultConfig = require('./default');

nconf.env().argv();
nconf.defaults(defaultConfig);

module.exports = nconf;
