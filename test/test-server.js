const chai = require('chai');
const chaiHttp = require('chai-http');

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
    .get('/blog-posts')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');

      res.body.length.should.be.at.least(1);

      const expectedKeys = ['title', 'content', 'author'];
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys);
      });
    });
  });

  it('should add a blog post on POST', function() {
    const newBlogPost = {title: 'Cool Posts Only', content: 'Unbelievable cool content', author: 'A Cool Person', publishDate: 1499302999927 };
    return chai.request(app)
      .post('/blog-posts')
      .send(newBlogPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('title', 'content', 'author', 'publishDate');
        res.body.id.should.not.be.null;

        res.body.should.deep.equal(Object.assign(newBlogPost, { id: res.body.id }));
      });
  });

  it('should update blog posts on PUT', function() {
    const updateBlogPost = {
      title: 'An Open Letter to Nintendo',
      content: 'Will Yoshi get the recognition he deserves?',
      author: 'Coalition Against Virtual Dinosaur Abuse'
    };

    return chai.request(app)
      .get('/blog-posts/')
      .then(function(res) {
        updateBlogPost.id = res.body[0].id
        return chai.request(app)
          .put(`/blog-posts/${updateBlogPost.id}`)
          .send(updateBlogPost)
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        delete res.body.publishDate;
        res.body.should.deep.equal(updateBlogPost);
      });
  });

  it('should delete blog posts on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts/')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

});
