const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');
const onlyAdmin = require('../middlewares/onlyAdmin');

router.use(onlyAdmin);

router.get('/', userController.getAllUsers);
router.get('/admins', userController.getAllAdmins);
router.get('/:id', userController.getOneUser);
router.put('/:id', userController.editProfile);
router.delete('/:id', userController.deleteUser);

module.exports = router;
