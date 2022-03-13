const express = require('express');

const router = express.Router();

const postController = require('../controllers/post');

router.get('/', postController.getAllPosts);

module.exports = router;
