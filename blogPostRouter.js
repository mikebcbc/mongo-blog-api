const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // make mongoose use ES6 Promises

router.get('/', (req, res) => {
	Post.find().exec()
		.then(posts => {
			res.json({
				posts: posts.map((post) => post.apiRepr())
			});
		})
});

router.get('/:id', (req, res) => {
	Post.findById(req.params.id).exec()
		.then(post => res.json(post.apiRepr()));
});

const {Post} = require('./models');



module.exports = router;