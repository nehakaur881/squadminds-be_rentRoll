const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.VITE_NODEMODILER_USER,
    pass: process.env.VITE_NODEMODILER_PASS,
  },
  rateLimit: 5,
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

const departureEmail = async (email, name, departure_date) => {
  const mailOption2 = {
    from: process.env.VITE_NODEMODILER_FROM,
    to: email,
    subject: "Friendly Reminder: Upcoming Departure from Furnished Tokyo Hotel",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #2b7a78;">Dear ${name},</h2>
        <p>We hope you've enjoyed a comfortable stay with us. This is a kind reminder that your departure is scheduled for the date below:</p>
        
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Guest Name:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Departure Date:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${departure_date}</td>
          </tr>
        </table>
        
        <p>If there’s anything we can assist with, or if you have questions about check-out, please reach out to our front desk. We’re here to make your departure as seamless as possible.</p>
        <p>Additionally, we value your feedback! Please feel free to share any comments with our receptionist to help us improve our services.</p>
        
        <p style="color: #999;">Warm regards,</p>
        <p style="font-weight: bold;">Furnished Tokyo Team</p>
        <p style="color: #999;">Contact us: [Hotel Contact Information]</p>
      </div>
    `,
    
  };
  await transporter.sendMail(mailOption2);
};

const cleanerEmail = async (email, departure_date) => {
  if(!email){
    console.error("email not provided from cleaner function")
  }
  const mailOption3 = {
    from: process.env.VITE_NODEMODILER_FROM,
    to: email,
    subject: "Cleaning Reminder: Room Cleanup Required After Departure",
    text: `
      Dear Cleaner,
      This is a reminder that a room requires cleaning following the guest's departure on ${departure_date}.

      Please ensure the room is cleaned and prepared for the next guest by the end of the day. Make sure to follow all cleaning protocols and double-check all amenities are in place.

      Thank you for your attention to detail and for helping maintain our high standards of cleanliness.

      Best regards,
      [Your Hotel/Management Team Name]
    `,
  };
  await transporter.sendMail(mailOption3)
  
};


module.exports = { sendResetEmail, arrivedEmail , departureEmail , cleanerEmail };
