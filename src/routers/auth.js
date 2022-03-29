const express = require('express');
const passport = require('passport');

const router = express.Router();

const authController = require('../controllers/auth');

router.post('/signin', authController.signIn);
router
  .route('/signup')
  .post(authController.signUp)
  .get((req, res) => {
    res.render('signup');
  });

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
