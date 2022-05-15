const bcrypt = require('bcrypt');
const User = require('../models/user');
const { createToken } = require('../util/authHelperFunctions');

//  errors messages
const authorizationError = { message: 'you dont have this authorization' };
const passwordDontMatchError = { message: 'passwords dont match.' };

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({ isAdmin: false });
      res.status(200).json(users);
    } catch (e) {
      res.status(422).json({ message: e.message });
    }
  },
  getOneUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (e) {
      res.status(422).json({ message: e.message });
    }
  },
  getAllAdmins: async (req, res) => {
    try {
      const admins = await User.find({ isAdmin: true });
      res.status(200).json(admins);
    } catch (e) {
      res.status(422).json({ message: e.message });
    }
  },
  searchForUser: async (req, res) => {
    const { userName } = req.query;

    const [firstName, lastName] = userName.toLowerCase().split(' ');

    try {
      const users = await User.find({
        $and: [
          {
            $or: [
              { firstName },
              { lastName: lastName !== undefined ? lastName : firstName },
              {
                $and: [{ firstName }, { lastName }],
              },
            ],
          },
          { isTutor: true },
        ],
      });
      return res.status(200).json(users);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },
  editProfile: async (req, res) => {
    const { id } = req.params;
    const { password, passwordConfirm } = req.body;
    const canChange = [
      'firstName',
      'lastName',
      'password_hash',
      'email',
      'phone',
      'isAdmin',
      'avatar',
    ];
    try {
      //  check authority for the user
      // admin can not update other admin profile
      const user = await User.findById(id);

      if (user.isAdmin && req.user._id !== user.id) throw authorizationError;

      if ((password || passwordConfirm) && password !== passwordConfirm) {
        throw passwordDontMatchError;
      } else if (password) {
        req.body.password_hash = await bcrypt.hash(password, 10);
        delete req.body.password;
      }
      Object.keys(req.body).forEach((key) => {
        if (!canChange.includes(key)) {
          delete req.body[key];
        }
      });
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        returnDocument: 'after',
      });
      createToken(updatedUser, false, res);
      return res.redirect(`/api/users/profile`);
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      //  check authority for the user
      // admin can not delete another admin profile
      const user = await User.findById(id);
      if (id && !user.isAdmin) {
        const deletedUser = await User.findByIdAndDelete(id);
        return res.status(200).json(deletedUser);
      }
      throw authorizationError;
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  },
};
