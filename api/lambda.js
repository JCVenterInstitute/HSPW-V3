const serverlessExpress = require("@vendia/serverless-express");
const { server } = require("./server");

exports.handler = async (event, context) => {
  const expressServer = serverlessExpress({ app: server });
  return expressServer(event, context);
};
