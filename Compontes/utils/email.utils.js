const dotenv = require('dotenv');
 dotenv.config()
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.VITE_NODEMODILER_USER,
    pass: process.env.VITE_NODEMODILER_PASS,
  },
});

const sendResetEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: process.env.VITE_NODEMODILER_FROM,
    to: email,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
