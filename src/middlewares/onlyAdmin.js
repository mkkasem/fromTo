require('dotenv').config();
const jwt = require('jsonwebtoken');

//  error messages
const sessionNotFoundError = {
  meesage: 'you are not signed in. Please sign in',
};

// eslint-disable-next-line consistent-return
module.exports = function onlyAdmin(req, res, next) {
  const { token } = req.cookies;
  try {
    if (token == null) return res.status(401).json(sessionNotFoundError);
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    if (!user.isAdmin) return res.redirect('/');
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json(sessionNotFoundError);
  }
};
