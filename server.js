// server.js

// BASE SETUP
// =============================================================================
var mongoose   = require('mongoose');
//mongoose.connect('mongodb://admin:12345@proximus.modulusmongo.net:27017/buzIdi2n'); // connect to our database
mongoose.connect('mongodb://localhost/super_heros');

var Hero     = require('./app/models/hero');

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// more routes for our API will happen here

// on routes that end in /heros
// ----------------------------------------------------
router.route('/heros')

	// create a hero (accessed at POST http://localhost:8080/api/heros)
	.post(function(req, res) {
		
		var hero = new Hero(); 		// create a new instance of the Hero model
		hero.name = req.body.name;  // set the heros name (comes from the request)

		// save the hero and check for errors
		hero.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Hero created!' });
		});
		
	})

	// get all the heros (accessed at GET http://localhost:8080/api/heros)
	.get(function(req, res) {
		Hero.find(function(err, heros) {
			if (err)
				res.send(err);

			res.json(heros);
		});
	});


// on routes that end in /heros/:hero_id
// ----------------------------------------------------
router.route('/heros/:hero_id')

	// get the hero with that id (accessed at GET http://localhost:8080/api/heros/:hero_id)
	.get(function(req, res) {
		Hero.findById(req.params.hero_id, function(err, hero) {
			if (err)
				res.send(err);
			res.json(hero);
		});
	})

	// update the hero with this id (accessed at PUT http://localhost:8080/api/heros/:hero_id)
	.put(function(req, res) {

		// use our hero model to find the hero we want
		Hero.findById(req.params.hero_id, function(err, hero) {

			if (err)
				res.send(err);

			hero.name = req.body.name; 	// update the heros info

			// save the hero
			hero.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Hero updated!' });
			});

		});
	})



	// delete the hero with this id (accessed at DELETE http://localhost:8080/api/heros/:hero_id)
	.delete(function(req, res) {
		Hero.remove({
			_id: req.params.hero_id
		}, function(err, hero) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
