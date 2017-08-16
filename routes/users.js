var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
	knex.select().from('users')
		.then(function(users) {
			console.log(users)
			res.render('users', {users: users});
		});
});

router.get('/new', function(req, res, next) {
  res.render('new_user');
});

router.get('/:id/edit', function(req, res, next) {
	knex.select().from('users').where({id: req.params.id})
		.then(function(user) {
			res.render('edit_user', {user: user[0]});
		})
});

router.get('/:id', function(req, res, next) {
	knex.select().from('users').where({id: req.params.id})
		.then(function(user) {
			res.render('show_user', {user: user[0], cookies: req.cookies.user_id});
		})
});

router.post('/', function(req, res, next) {
  var user = req.body;
  if (user.password === user.confirm) {
  	bcrypt.hash(user.password, 8, function(err, hash) {
  		knex('users')
  			.insert({username: `${user.username}`,
  							email: `${user.email}`,
  							age: user.age,
  							password: `${hash}`})
  			.then(function(users) {
  				res.redirect('/home');
  			});
  	});
  } else {
  	res.send('passwords do not match');
  }
});

router.post('/:id', function(req, res, next) {
  var user = req.body;
  if (user.password === user.confirm) {
  	bcrypt.hash(user.password, 8, function(err, hash) {
  		knex('users').where({id: req.params.id})
  			.update({username: `${user.username}`,
  							email: `${user.email}`,
  							age: user.age})
  			.then(function(users) {
  				res.redirect(`/users/${req.params.id}`);
  			});
  	});
  } else {
  	res.send('passwords do not match');
  }
});

router.get('/:id/delete', function(req, res, next) {
	knex('users').where({id: req.params.id}).del()
		.then(function(user) {
			res.clearCookie('user_id');
			res.redirect('/')
		})
});

module.exports = router;
