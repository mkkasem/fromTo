const express = require('express');

const router = express.Router();

const postController = require('../controllers/post');

const isAuthenticated = require('../middlewares/isAuth');
const onlyAdmin = require('../middlewares/onlyAdmin');

router.get('/', postController.getAllPosts);

router.post('/', isAuthenticated, postController.addNewPost);

router.get('/pendingPosts', onlyAdmin, (req, res) => {
  res.render('pendingPosts', { user: req.user, loggedIn: true });
});
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
