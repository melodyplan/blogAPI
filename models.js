const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  publishDate: {type: Date, default: Date.now()},
  author: {
    firstName: String,
    lastName: String
  }
});

blogSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()});


blogSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    publishDate: this.publishDate,
    author: this.authorName
  };
}

const Blog = mongoose.model('Blog', blogSchema);

module.exports = {Blog};
