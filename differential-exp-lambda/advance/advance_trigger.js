const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const lambdaClient = new LambdaClient({ region: "us-east-2" }); // Replace with your desired region

exports.handler = async (event) => {
  console.log("> Event", event);

  const command = new InvokeCommand({
    FunctionName: `Differential-Analysis-Advance-${process.env.DEPLOY_ENV}`, // Replace with the name of the Lambda function you want to invoke
    InvocationType: "Event", // Asynchronous invocation
    Payload: JSON.stringify(event), // Pass the input event as the payload
  });

  try {
    const response = await lambdaClient.send(command);

    console.log("Invocation succeeded:", response);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Lambda invoked successfully!",
        data: response,
      }),
    };
  } catch (error) {
    console.error("Invocation failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to invoke Lambda.",
        error: error.message,
      }),
    };
  }
};
