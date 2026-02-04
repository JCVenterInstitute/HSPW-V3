const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

/**
 * Get a parameter stored in AWS Parameter Store by parameter name
 * @param {String} paramName Name of the parameter in parameter store
 * @return {String} Value of parameter in parameter store
 */
exports.getSSMParameter = async (paramName) => {
  console.log(`> Fetching SSM Parameter:`, paramName);

  let paramValue;

  const client = new SSMClient({
    region: process.env.AWS_REGION ?? "us-east-2",
  });

  const command = new GetParameterCommand({
    Name: paramName,
    WithDecryption: true,
  });

  const {
    Parameter: { Value },
  } = await client.send(command);

  paramValue = Value;

  console.log(`> Returning SSM Parameter:`, paramName);
  return paramValue;
};
