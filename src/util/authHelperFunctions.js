const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const buildPayload = (userData) => ({
  user: {
    username: userData.username,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    isAdmin: userData.isAdmin,
    _id: userData._id.toString(),
    phone: userData?.phone,
    avatar: userData.avatar,
  },
});
/*
this function should be modified
somethimg wrong with it 
*/
// eslint-disable-next-line consistent-return
const isCorrectPassword = async (user, password) => {
  if (user) {
    // eslint-disable-next-line no-return-await
    return await bcrypt.compare(password, user.password_hash);
  }
  return false;
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
    httpOnly: false,
  });
};

module.exports = {
  isCorrectPassword,
  createToken,
};
