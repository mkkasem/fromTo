require('dotenv').config();
const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { token } = req.cookies;
  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    // if verified pass the user to the next function with the req object
    req.user = user;
    next();
  } catch (error) {
    // delete the token when it is invalid
    res.clearCookie('token');
    return res.redirect('/signin');
  }
};
