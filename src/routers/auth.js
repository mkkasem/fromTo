const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { userValidationRules, validate } = require('../middlewares/validator');

const router = express.Router();

const authController = require('../controllers/auth');

const redirectToHomeIfAuthenticated = (req, res, next) => {
  let loggedIn;
  if (req.cookies?.token) {
    loggedIn = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  }
  if (loggedIn) {
    return res.redirect('/');
  }
  return next();
};
router
  .route('/signin')
  .post(authController.signIn)
  .get(redirectToHomeIfAuthenticated, (req, res) => res.render('signin'));

router
  .route('/signup')
  .post(userValidationRules(), validate, authController.signUp)
  .get(redirectToHomeIfAuthenticated, (req, res) => {
    res.render('signup', {
      errors: [],
    });
  });

router.get('/signout', authController.signOut);

router
  .route('/forget-password')
  .get((req, res) => res.render('forgetPassword', { error: [] }))
  .post(authController.forgetPassword);

router
  .route('/reset-password/:id/:token')
  .get(authController.getResetPassword)
  .post(authController.postResetPassword);

router.get(
  '/google',
  redirectToHomeIfAuthenticated,
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);
router.get(
  '/google/callback',
  redirectToHomeIfAuthenticated,
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  authController.thirdPartyCallBack
);

router.get(
  '/facebook',
  redirectToHomeIfAuthenticated,
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/callback',
  redirectToHomeIfAuthenticated,
  passport.authenticate('facebook', { failureRedirect: '/', session: false }),
  authController.thirdPartyCallBack
);
module.exports = router;
