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
	for(let i=1; i<10, i++) {
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

describe('Blog API', function() {
	
	before(function() {
		return runServer(TEST_DATABASE_URL);
	})

	beforeEach(function(), {
		return seedData();
	})
})