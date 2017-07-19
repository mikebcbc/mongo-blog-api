const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {Post} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedData() {
	console.info('inserting data into db');
	const data = [];

	for(let i=1; i<=10; i++) {
		data.push(generateData());
	}
	return Post.insertMany(data);
}

function generateData() {
	return {
		title: faker.lorem.sentence(),
		content: faker.lorem.paragraph(),
		author: {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		}
	}
}

function destroyDb() {
	console.warn('Destroying database');
	return mongoose.connection.dropDatabase();
}


describe('Blog API', function() {
	
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedData();
	});

	afterEach(function() {
		return destroyDb();
	});

	after(function() {
		return closeServer();
	});

	describe('GET endpoint', function() {
		it('should return all posts', function() {
			let res;
			return chai.request(app)
				.get('/posts')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.body.posts.should.have.length.of.at.least(1);
					return Post.count();
				})
				.then(function(count) {
					res.body.posts.should.have.length(count);
				});
		});

		it('should have right fields & formatted author', function() {
			let aPost;
			return chai.request(app)
				.get('/posts')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.posts.should.be.a('array');
					res.body.posts.should.have.length.of.at.least(1);

					res.body.posts.forEach(function(post) {
						post.should.be.a('object');
						post.should.include.keys('id', 'title', 'content', 'author');
						post.author.should.be.a('string');
					});
					aPost = res.body.posts[0];
					return Post.findById(aPost.id);
				})
				.then(function(post) {
					aPost.id.should.equal(post.id);
					aPost.title.should.equal(post.title);
					aPost.content.should.equal(post.content);
					aPost.author.should.contain(post.author.firstName);
					aPost.author.should.contain(post.author.lastName);
				});
		});


	})
})


