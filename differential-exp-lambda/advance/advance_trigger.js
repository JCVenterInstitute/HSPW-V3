const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const lambdaClient = new LambdaClient({ region: "us-east-2" });

exports.handler = async (event) => {
  console.log("> Event", event);

  const command = new InvokeCommand({
    FunctionName: `Differential-Analysis-Advance-${process.env.DEPLOY_ENV}`,
    InvocationType: "Event",
    Payload: JSON.stringify(event),
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
