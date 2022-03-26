/* eslint-disable camelcase */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

const afterGoogleLogin = async (accessToken, refreshToken, profile, cb) => {
  try {
    // getting user data from google
    const { given_name, family_name, picture, email } = profile._json;
    const user = await User.findOne({ email });

    if (user) {
      // if user exists, create token and send it back
      return cb(null, user);
    }
    const newUser = await User.create({
      username: `${email.split('@')[0]}google`,
      firstName: given_name,
      lastName: family_name,
      email,
      avatar: picture,
    });
    //  if user doesn't exist, create new user and create token and send it back
    return cb(null, newUser.toJSON());
  } catch (err) {
    return cb(err);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_BASE_URL}/api/auth/google/callback`,
    },
    afterGoogleLogin
  )
);
