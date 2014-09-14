var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var HeroSchema   = new Schema({
	name: String,
        power: String
});

module.exports = mongoose.model('Hero', HeroSchema);
