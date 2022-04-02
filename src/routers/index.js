const express = require('express');
const Post = require('../models/post');

const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await Post.find({});

  const login = req.cookies.login || false;
  const user = req.cookies.user || {};
  // res.clearCookie('posts');
  res.clearCookie('login');
  res.clearCookie('user');
  res.render('home', { posts, login, user });
});

module.exports = router;
