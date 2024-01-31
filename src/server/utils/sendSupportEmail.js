const nodemailer = require("nodemailer");
const { getSSMParameter } = require("./utils");
require("dotenv").config();

// Function to send email
async function sendEmail({ message, timestamp }) {
  // Get the user and password from AWS parameter store
  const user = await getSSMParameter(`${process.env.SMTP_USER}`);
  const password = await getSSMParameter(`${process.env.SMTP_PASSWORD}`);

  // Nodemailer transport configuration
  const transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-2.amazonaws.com",
    port: 587,
    secure: false,
    auth: {
      user: user,
      pass: password,
    },
  });

  // Email content
  const mailOptions = {
    from: "noreply@salivaryproteome.org", // Sender address
    to: "help@salivaryproteome.org", // Your helpdesk email
    subject: `New Issue from differential-expression page`,
    text:
      `Message: ${message}\n` +
      `Timestamp: ${timestamp.year}-${timestamp.month}-${timestamp.day} ${timestamp.hours}:${timestamp.minutes}:${timestamp.seconds}\n` +
      `Page URL: /differential-expression\n`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

exports.sendSupportEmail = async ({ message, timestamp }) => {
  try {
    // Send email notification
    await sendEmail({
      message,
      timestamp,
    });

    return;
  } catch (error) {
    console.error("Error creating contact record: ", error);
    throw error;
  }
};
