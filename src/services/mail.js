const nodemailer = require('nodemailer');
const logger = require('./logger');

module.exports = {
  sendEmail: async (emailOptions) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const res = await transporter.sendMail(emailOptions);
      return res;
    } catch (error) {
      logger.error(error);
      return error;
    }
  },
};
