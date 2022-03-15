const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  confirmPassword,
  createToken,
  verifySignUpData,
} = require('../util/authHelperFunctions');

const signIn = async (req, res) => {
  const { username, email, password, rememberMe } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      throw new Error('Wrong username or email');
    }
    confirmPassword(user, password);

    createToken(user, rememberMe, res);

    return res.json({ message: 'Successfully signed in' });
  } catch (err) {
    return res.status(422).json({ message: err.message ?? err });
  }
};

const signUp = async (req, res) => {
  try {
    const { body } = req;
    const saltRounds = 10;

    await verifySignUpData(body);

    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    req.body.password_hash = passwordHash;

    const newUser = await User.create(req.body);

    return res.json(newUser);
  } catch (err) {
    return res.status(422).json({ message: err.message ?? err });
  }
};

const signOut = (req, res) => {
  try {
    res.clearCookie('token');
    return res.json({ success: true });
  } catch (err) {
    return res.status(422).json({ message: err.message ?? err });
  }
};

module.exports = {
  signIn,
  signUp,
  signOut,
};
