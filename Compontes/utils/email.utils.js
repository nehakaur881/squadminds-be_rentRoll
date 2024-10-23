const dotenv = require("dotenv");
dotenv.config();
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

const arrivedEmail = async (email, name, arrival_date, departure_date) => {
  const mailOptions1 = {
    from: process.env.VITE_NODEMODILER_FROM,
    to: email,
    subject:
      "Reminder: Your Booking Confirmation for Furnished Tokyo Hotel Stay",
      html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #2b7a78;">Hello ${name},</h2>
        <p>We are excited to welcome you soon to our hotel! This is a friendly reminder about your upcoming stay.</p>
        
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Guest Name:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Arrival Date:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${arrival_date}</td>
          </tr>
        </table>
        
        <p>If you have any special requests or need to make changes to your reservation, please let us know at your earliest convenience.</p>
        <p>We look forward to your arrival!</p>
        
        <p style="color: #999;">Warm regards,</p>
        <p style="font-weight: bold;"> Furnished Tokyo Team</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions1);
};

module.exports = { sendResetEmail, arrivedEmail };
