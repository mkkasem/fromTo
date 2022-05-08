const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');
const userController = require('../controllers/user');
const onlyAdmin = require('../middlewares/onlyAdmin');
const isAuthenticated = require('../middlewares/isAuth');

// router.use(onlyAdmin);

router.get('/', userController.getAllUsers);

router.get('/profile', isAuthenticated, (req, res) => {
  const { token } = req.cookies;
  let user;
  if (token) ({ user } = jwt.verify(token, process.env.JWT_SECRET));
  const loggedIn = !!user || false;
  res.render('profile', { user: req.user, loggedIn });
});

router.get('/search', userController.searchForUser);
router.get('/admins', userController.getAllAdmins);
router.get('/:id', userController.getOneUser);
router.put('/:id', isAuthenticated, userController.editProfile);
router.delete('/:id', userController.deleteUser);

module.exports = router;
