const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const buildPayload = (userData) => ({
  user: {
    username: userData.username,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    _id: userData._id.toString(),
  },
});

const confirmPassword = async (user, password) => {
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) throw new Error('Wrong password');
};

const createToken = (user, rememberMe, res) => {
  const payload = buildPayload(user);
  let cookieAge = 24 * 3600 * 1000; // Default cookie expiry time is 1 day

  if (rememberMe) {
    cookieAge *= 14; // Remember me setting extends cookie expiry time to 2 weeks
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: cookieAge,
    subject: user._id.toString(),
  });

  res.cookie('token', token, {
    maxAge: cookieAge,
    httpOnly: true,
  });
};

const verifySignUpData = async (data) => {
  const { username, email, password, passwordConfirm, acceptTerms } = data;

  if (!acceptTerms) {
    throw new Error('You must accept the terms and conditions');
  }
  if (await User.exists({ username })) {
    throw new Error('Username already used');
  }
  if (await User.exists({ email })) {
    throw new Error('Email already used');
  }
  if (password !== passwordConfirm) {
    throw new Error('Passwords do not match');
  }
};

module.exports = {
  confirmPassword,
  createToken,
  verifySignUpData,
};
