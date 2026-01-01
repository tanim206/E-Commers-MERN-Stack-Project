const nodemailer = require("nodemailer");
const { smtpUserName, smtpPassword } = require("../secret");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: smtpUserName,
    pass: smtpPassword,
  },
});

const emailWithNodeMailer = async (emailData) => {
  try {
    const mailOptions = {
      from: smtpUserName,
      to: emailData.email,
      subject: emailData.sebject,
      html: emailData.html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: %s`, info.response);
  } catch (error) {
    console.error(`email occured while sending email:`, error);
    throw error;
  }
};

module.exports = emailWithNodeMailer;
