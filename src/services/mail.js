const nodemailer = require('nodemailer');

module.exports = {
  sendEmail: async (emailOptions) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'fromtopteam@gmail.com',
          pass: 'fromto2022',
        },
      });
      const res = await transporter.sendMail(emailOptions);
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
