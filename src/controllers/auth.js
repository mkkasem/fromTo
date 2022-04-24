const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendEmail } = require('../services/mail');
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

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.render('forgetPassword', {
      error: ['Email not found'],
    });
  }
  const payload = {
    id: user._id,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET + user.password_hash, {
    expiresIn: '2h',
  });
  const link = `${process.env.SERVER_BASE_URL}/api/auth/reset-password/${user.id}/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Reset password',
    html: ` 
     Please click this link to reset your password:
     <strong>
      <a href="${link}" target="_blank">Link</a>
     </strong>
     <br>
    Note: This link will expire in 2 hours.`,
  };
  await sendEmail(mailOptions);
  return res.send('Please check your email');
};
const getResetPassword = async (req, res) => {
  const { token, id } = req.params;
  if (!token) {
    return res.send('<h1>Invalid Link<h1/>');
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      res.send('<h1>Invalid Link<h1/>');
    }
    if (id !== user.id) {
      return res.send('<h1>Invalid Link<h1/>');
    }
    jwt.verify(token, process.env.JWT_SECRET + user.password_hash);
    return res.render('resetPassword', {
      error: [],
      id,
      token,
    });
  } catch (error) {
    return res.send('<h1>Invalid Link<h1/>');
  }
};
const postResetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id, token } = req.params;
  if (!token) {
    return res.send('<h1>Invalid Link<h1/>');
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      res.send('<h1>Invalid Link<h1/>');
    }
    if (id !== user.id) {
      return res.send('<h1>Invalid Link<h1/>');
    }

    jwt.verify(token, process.env.JWT_SECRET + user.password_hash);

    if (password !== confirmPassword) {
      return res.render('resetPassword', {
        error: ['Password and confirm password does not match'],
        id,
        token,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password_hash = hashedPassword;
    await user.save();
    return res.redirect('/');
  } catch (error) {
    return res.render('resetPassword', {
      error: ['Invalid Link'],
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
  forgetPassword,
  getResetPassword,
  postResetPassword,
  thirdPartyCallBack,
};
