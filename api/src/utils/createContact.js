const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const nodemailer = require("nodemailer");
const { getSSMParameter } = require("./utils");
require("dotenv").config();

// Initialize the DynamoDB client
const ddbClient = new DynamoDBClient({ region: "us-east-2" });
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Function to send email
async function sendContactEmail({
  name,
  email,
  pageUrl,
  topic,
  message,
  s3Locations,
  ratings,
  timestamp,
}) {
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
    subject: `New Issue from ${name}: ${topic}`,
    text:
      `You have received a new message from ${name} (${email}).\n\n` +
      `Topic: ${topic}\n` +
      `Message: ${message}\n` +
      `Attachments: ${s3Locations.join(", ")}\n` +
      `Rating: ${JSON.stringify(ratings)}\n` +
      `Timestamp: ${timestamp.year}-${timestamp.month}-${timestamp.day} ${timestamp.hours}:${timestamp.minutes}:${timestamp.seconds}\n` +
      `Page URL: ${pageUrl}\n`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

exports.createContact = async ({
  name,
  email,
  pageUrl,
  topic,
  message,
  s3Locations,
  ratings,
  timestamp,
}) => {
  const contactId = `${topic}-${timestamp.year}${timestamp.month}${timestamp.day}-${timestamp.hours}${timestamp.minutes}${timestamp.seconds}`;
  const time = `${timestamp.year}${timestamp.month}${timestamp.day}-${timestamp.hours}${timestamp.minutes}${timestamp.seconds}`;
  const params = {
    TableName: process.env.CONTACT_TABLE,
    Item: {
      contactId: contactId,
      name,
      email,
      pageUrl,
      topic,
      message,
      s3Locations,
      ratings,
      timestamp: time,
    },
  };

  try {
    // Save the item to DynamoDB using the new command pattern
    await docClient.send(new PutCommand(params));
    console.log("Contact record created successfully");

    // Send email notification
    await sendContactEmail({
      name,
      email,
      pageUrl,
      topic,
      message,
      s3Locations,
      ratings,
      timestamp,
    });

    // Return success response or the created item
    return params.Item;
  } catch (error) {
    console.error("Error creating contact record: ", error);
    throw error;
  }
};
