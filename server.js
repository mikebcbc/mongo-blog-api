const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();

require('dotenv').config();

const {PORT, DATABASE_URL} = require('./config');
const blogPostRouter = require('./blogPostRouter');

app.use(morgan('common'));
app.use(bodyParser.json());

app.use('/posts', blogPostRouter);

let server;

function runServer(dbURL=DATABASE_URL, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(dbURL, err => {
			if(err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`We on port ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Shutting server down');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {runServer, closeServer, app};