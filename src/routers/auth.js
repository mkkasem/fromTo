const express = require('express');
const passport = require('passport');

const router = express.Router();

const authController = require('../controllers/auth');

router.post('/signin', authController.signIn);

router.post('/signup', authController.signUp);
router.get('/signout', authController.signOut);

router.get('/signin', (req, res) => res.render('signin'));

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  authController.thirdPartyCallBack
);

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/', session: false }),
  authController.thirdPartyCallBack
);
module.exports = router;
