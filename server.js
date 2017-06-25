
const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostsRouter = require('./routes/blogPostsRouter'); // router

app.use('/blog-posts', blogPostsRouter); // http://localhost:8080/blog-posts/

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
