const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog API', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list blog posts on GET', function() {
    return chai.request(app)
    .get('/posts')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      // res.body.blogs.should.be.a('array');

      res.body.blogs.length.should.be.at.least(1);

      const expectedKeys = ['title', 'content', 'author'];
      res.body.blogs.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys);
      });
    });
  });

  it('should add a blog post on POST', function() {
    const newBlogPost = {
      title: 'Cool Posts Only',
      content: 'Unbelievable cool content',
      author: {
        firstName: 'Yay',
        lastName: 'Boo'
      },
      publishDate: 1499302999927
    };
    return chai.request(app)
      .post('/posts')
      .send(newBlogPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('title', 'content', 'author', 'publishDate');
        res.body.id.should.not.be.null;
        res.body.title.should.equal(newBlogPost.title)
        res.body.content.should.equal(newBlogPost.content)
        res.body.author.should.equal(newBlogPost.author.firstName + ' ' + newBlogPost.author.lastName)
      });
  });

  it('should update blog posts on PUT', function() {
    const updateBlogPost = {
      title: 'An Open Letter to Nintendo',
      content: 'Will Yoshi get the recognition he deserves?',
      author: {
        firstName: 'Coalition Against',
        lastName: 'Virtual Dinosaur Abuse'
      }
    };

    return chai.request(app)
      .get('/posts')
      .then(function(res) {
        updateBlogPost.id = res.body.blogs[0].id
        return chai.request(app)
          .put(`/posts/${updateBlogPost.id}`)
          .send(updateBlogPost)
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        delete res.body.publishDate;
        res.body.id.should.equal(updateBlogPost.id)
        res.body.title.should.equal(updateBlogPost.title)
        res.body.content.should.equal(updateBlogPost.content)
        res.body.author.should.equal(updateBlogPost.author.firstName + ' ' + updateBlogPost.author.lastName)
      });
  });

  it('should delete blog posts on DELETE', function() {
    return chai.request(app)
      .get('/posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/posts/${res.body.blogs[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

});
