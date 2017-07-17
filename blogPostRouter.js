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
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

router.get('/:id', (req, res) => {
	Post.findById(req.params.id).exec()
		.then(post => res.json(post.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

router.post('/', (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Post.create({
  	title: req.body.title,
  	content: req.body.content,
  	author: req.body.author
  })
  .then(post => res.status(201).json(post.apiRepr()))
  .catch(err => {
  	console.error(err);
  	res.status(500).json({message: 'Internal server error'});
  });
});

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  const update = {};
  const updateable = ['title', 'content', 'author'];

  updateable.forEach(field => {
  	if (field in req.body) {
  		update[field] = req.body[field];
  	}
  });

  Post.findByIdAndUpdate(req.params.id, {$set: update}).exec()
  .then(post => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server error'}));
})

const {Post} = require('./models');



module.exports = router;