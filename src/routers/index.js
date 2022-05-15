const express = require('express');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const logger = require('../services/logger');
const itemTree = require('../item factory/catagoriesTree.json');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { token } = req.cookies;
    let user;
    if (token) ({ user } = jwt.verify(token, process.env.JWT_SECRET));

    // check if user is logged in from cookie
    const loggedIn = !!user || false;
    // draw posts when user is logged in
    const posts = await Post.find({ status: 'approved' })
      .populate('owner')
      .populate('comments.creator');

    // TOFIX: only user necessary attributes should be sent , not all
    user = user || {};
    const tree = JSON.parse(JSON.stringify(itemTree));
    res.render('home', { posts, loggedIn, user, tree });
  } catch (error) {
    logger.error(error);
  }
});

module.exports = router;
