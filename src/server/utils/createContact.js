const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Initialize the DynamoDB client
const ddbClient = new DynamoDBClient({ region: "us-east-2" });
const docClient = DynamoDBDocumentClient.from(ddbClient);

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
    TableName: "Contact-Detail",
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
    // Return success response or the created item
    return params.Item;
  } catch (error) {
    console.error("Error creating contact record: ", error);
    throw error;
  }
};
