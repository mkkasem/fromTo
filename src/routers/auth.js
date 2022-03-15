const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

router.post('/signin', authController.signIn);
router.get('/signup', authController.signUp);
router.get('/signout', authController.signOut);

module.exports = router;
