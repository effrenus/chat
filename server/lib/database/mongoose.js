var mongoose = require('mongoose');
var config = require('./../../config');
console.log('===========', config.get('mongoose:uri'));
mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

module.exports = mongoose;
