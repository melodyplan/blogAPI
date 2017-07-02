
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('../model');

// not sure if we need the publishDate?
BlogPosts.create('Blog Example Title', 'Interesting content', 'Author Person');
BlogPosts.create('How to: Glass of Water', 'Glass, 8oz water, optional: ice', 'Some Dude');
BlogPosts.create('Why It\'s Not Working', 'Questions you should ask: Is it plugged in? Is it on? Did you check the batteries?-- Okay are you sure it\'s plugged in?', 'Author Person');

// when the root of this router is called with GET, return
// all current BlogPosts
router.get('/', (req, res) => { // localhost:8080/blog-posts/
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  // still not sure if we need publish date as a required field
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPosts.update` with updated item.

router.put('/:id', jsonParser, (req, res) => {
  //still not sure if we need publish date
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.id !== req.body.id) {
    console.log('here');
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog \`${req.params.id}\``);
  BlogPosts.update({
    //still not sure if we need publish date
    title: req.params.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(204).end();
});

// when DELETE request comes in with an id in path,
// try to delete that item from BlogPosts.

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
});

//what's this?
module.exports = router;
