const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {
		firstName: {type: String, required: true},
		lastName: {type: String, required: true}
	}
});

postSchema.virtual('authorJoin').get(function() {
	return `${this.author.firstName} ${this.author.lastName}`.trim();
});

postSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		title: this.title,
		content: this.content,
		author: this.authorJoin
	}
}

const Post = mongoose.model('Post', postSchema);

module.exports = {Post};