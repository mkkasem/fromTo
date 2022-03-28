/* eslint-disable camelcase */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

const afterLogin = async (accessToken, refreshToken, profile, cb) => {
  try {
    const receivedUser = profile._json;

    const given_name = receivedUser.given_name || receivedUser.first_name;
    const family_name = receivedUser.family_name || receivedUser.last_name;
    const { email } = receivedUser;
    const picture = receivedUser.picture?.data?.url
      ? receivedUser.picture.data.url
      : receivedUser.picture;

    const user = await User.findOne({ email });
    if (user) {
      // if user exists, create token and send it back
      return cb(null, user);
    }
    const newUser = await User.create({
      username: `${email.split('@')[0]}${profile.provider}`,
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
    afterLogin
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_BASE_URL}/api/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'email', 'name', 'photos'],
      enableProof: true,
    },
    afterLogin
  )
);
