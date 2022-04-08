const bcrypt = require('bcrypt');
const User = require('../models/user');

const {
  isCorrectPassword,
  createToken,
} = require('../util/authHelperFunctions');

const signIn = async (req, res) => {
  const { usernameOrEmail, password, rememberMe } = req.body;
  try {
    const username = usernameOrEmail;
    const email = usernameOrEmail;

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
    const validPassword = await isCorrectPassword(user, password);

    if (!user || !validPassword) {
      throw new Error('Wrong username or password');
    }
    createToken(user, rememberMe, res);
    // res.cookie('posts', [{ title: 'Hello world', price: '20$' }]);
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
    const { avatar } = req.files;
    const { body } = req;
    const saltRounds = 10;

    const urlImage = `/profiles/${req.body.username}.${
      avatar.mimetype.split('/')[1]
    }`;
    req.body.avatar = urlImage;

    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    req.body.password_hash = passwordHash;
    const newUser = await User.create(req.body);

    // save image to server if user has been created
    await avatar.mv(
      `${__dirname}/../images/profiles/${req.body.username}.${
        avatar.mimetype.split('/')[1]
      }`
    );

    return res.json(newUser);
  } catch (err) {
    return res.render('signup', {
      errors: [err.message],
    });
  }
};

const signOut = (req, res) => {
  try {
    res.clearCookie('token');
    return res.redirect('/');
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
