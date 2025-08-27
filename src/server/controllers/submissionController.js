const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
  PutCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({ region: "us-east-2" });
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Fetch a submission by id
const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("> Fetch submission with id", id);

    const command = new GetCommand({
      TableName: `hsp-analysis-submissions-${process.env.DEPLOY_ENV.toUpperCase()}`,
      Key: { id },
    });

    const data = await docClient.send(command);

    console.log("> Data", data);

    if (data.Item) {
      res.status(200).json(data.Item);
    } else {
      res.status(404).json({ message: "No submissions found for this user." });
    }
  } catch (error) {
    console.error("Error fetching submission:", error);
    res.status(500).json({ error: "Failed to fetch submission" });
  }
};

/**
 * Fetch all submissions for a specific user
 */
const fetchSubmissionByUser = async (req, res) => {
  try {
    console.log("> Fetching submissions for user", req.params);

    const { username } = req.params;

    const params = {
      TableName: `hsp-analysis-submissions-${process.env.DEPLOY_ENV.toUpperCase()}`,
      IndexName: "username-index", // If you're using a GSI based on username
      KeyConditionExpression: "#username = :username",
      ExpressionAttributeNames: {
        "#username": "username",
      },
      ExpressionAttributeValues: {
        ":username": username, // Use the provided username in the request params
      },
    };

    const data = await docClient.send(new QueryCommand(params));

    if (data.Items) {
      // Send the retrieved items as a response
      res.status(200).json(data.Items);
    } else {
      // Handle case where no items are found
      res.status(404).json({ message: "No submissions found for this user." });
    }
  } catch (err) {
    // Handle any errors
    console.error("Error querying DynamoDB:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

/**
 * Create a new submission
 */
const createSubmission = async (req, res) => {
  try {
    console.log("> Creating new submission: %o", req.body);

    const { user, type, submissionDate, link, id, name, status } = req.body;

    const params = {
      TableName: `hsp-analysis-submissions-${process.env.DEPLOY_ENV.toUpperCase()}`,
      Item: {
        id: id ? id : uuidv4(),
        important: false,
        link,
        status: status ? status : "Running",
        submission_date: submissionDate
          ? submissionDate
          : new Date().toISOString(),
        type,
        username: user,
        name,
      },
    };

    const command = new PutCommand(params);

    const result = await docClient.send(command);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Update a submission by ID
 */
const updateSubmission = async (req, res) => {
  console.log("> Updating Submission", req.body);
  try {
    const { id } = req.params;
    const updateFields = req.body; // Expecting dynamic fields in the request body, e.g. { important: true, name: "New Name" }

    // Dynamically construct the UpdateExpression and ExpressionAttribute values
    let UpdateExpression = "SET";
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};

    // Loop through the fields in the request body and build the update parameters
    Object.keys(updateFields).forEach((key, index) => {
      const comma = index === 0 ? "" : ",";
      UpdateExpression += `${comma} #${key} = :${key}`;
      ExpressionAttributeNames[`#${key}`] = key;
      ExpressionAttributeValues[`:${key}`] = updateFields[key];
    });

    const params = {
      TableName: `hsp-analysis-submissions-${process.env.DEPLOY_ENV.toUpperCase()}`,
      Key: { id }, // Primary key for the table
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: "ALL_NEW", // Return all updated values
    };

    const result = await docClient.send(new UpdateCommand(params));
    res.status(200).json(result.Attributes); // Respond with updated attributes
  } catch (error) {
    console.error("Error updating submission:", error);
    res.status(500).json({ error: "Failed to update submission" });
  }
};

module.exports = {
  getSubmissionById,
  fetchSubmissionByUser,
  createSubmission,
  updateSubmission,
};
