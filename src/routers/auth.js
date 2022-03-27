const express = require('express');
const passport = require('passport');

const router = express.Router();

const authController = require('../controllers/auth');

router.post('/signin', authController.signIn);
router.post('/signup', authController.signUp);
router.get('/signout', authController.signOut);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  authController.googleCallBack
);
module.exports = router;
