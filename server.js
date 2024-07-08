const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', {})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Schema for blog posts
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render('home', { posts: posts });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });

  try {
    await post.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
