const express = require('express');

const router = express.Router();

const postController = require('../controllers/post');

const isAuthenticated = require('../middlewares/isAuth');
const onlyAdmin = require('../middlewares/onlyAdmin');

router.get('/addPost', postController.getAddPostPage);

router.get('/', postController.getAllPosts);

router.post(
  '/getObjectTemplate',
  isAuthenticated,
  postController.getObjectTemplate
);

router.post('/', isAuthenticated, postController.addNewPost);

router.get('/pendingPosts', onlyAdmin, postController.getPendingPosts);
router.put('/setPostStatus/:id', onlyAdmin, postController.setPostStatus);

router.put('/:id', isAuthenticated, postController.updatePost);

router.delete('/:id', isAuthenticated, postController.deletePost);

router.get('/search', postController.searchForPosts);

router.get('/filter', postController.getFilteredPosts);

router.get('/:id', postController.getOnePost);

router.post('/:id/comments', isAuthenticated, postController.addComment);

router.put(
  '/:id/comments/:commentid',
  isAuthenticated,
  postController.updateComment
);

router.delete(
  '/:id/comments/:commentid',
  isAuthenticated,
  postController.deleteComment
);

module.exports = router;
