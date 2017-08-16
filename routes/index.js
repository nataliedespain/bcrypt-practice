var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');
var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {cookies: req.cookies.user_id});
});

router.get('/home', function(req, res, next) {
  if (req.cookies.user_id) {
  	knex.select().from('users').where({id: req.cookies.user_id})
  		.then(function(user) {
  			res.render('home', {user: user[0]});
  		})
  } else {
  	res.render('index');
  }
});

router.get('/login', function(req, res, next) {
		res.render('login');
});

router.post('/login', function(req, res, next) {
  var un = req.body.username;
  var pw = req.body.password;
  knex.select().from('users').where({username: un})
  	.then(function(user) {
  		bcrypt.compare(pw, user[0].password, function(err, resp) {
  			if (resp) {
  				res.cookie('user_id', user[0].id);
					res.redirect('/home');
  			} else {
  				res.send("error");
  			}
  		})
  	})
});

router.get('/logout', function(req, res, next) {
  res.clearCookie('user_id');
	res.redirect('/');
});

module.exports = router;
