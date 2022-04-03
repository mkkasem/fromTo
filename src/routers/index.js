const express = require('express');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const logger = require('../services/logger');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { token } = req.cookies;
    let user;
    if (token) ({ user } = jwt.verify(token, process.env.JWT_SECRET));

    // check if user is logged in from cookie
    const loggedIn = !!user || false;
    // draw posts when user is logged in
    const posts = loggedIn
      ? await Post.find({}).populate('owner').populate('comments.creator')
      : [];

    // TOFIX: only user necessary attributes should be sent , not all
    user = user || {};

    res.render('post', { post: posts[0] }); // { posts, loggedIn, user });
  } catch (error) {
    logger.error(error);
  }
});

module.exports = router;
