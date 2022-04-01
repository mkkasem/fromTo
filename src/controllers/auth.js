const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  isCorrectPassword,
  createToken,
  verifySignUpData,
} = require('../util/authHelperFunctions');

const signIn = async (req, res) => {
  const { username, email, password, rememberMe } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
    const validPassword = await isCorrectPassword(user, password);

    if (!user || !validPassword) {
      throw new Error('Wrong username or password');
    }
    createToken(user, rememberMe, res);
    return res.redirect('/');
    // return res.json({ message: 'Successfully signed in' });
  } catch (err) {
    return res.render('signin', {
      error: err.message,
    });
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

const thirdPartyCallBack = async (req, res) => {
  createToken(req.user, false, res);
  res.redirect('/');
};

module.exports = {
  signIn,
  signUp,
  signOut,
  thirdPartyCallBack,
};
