const fs = require("fs");
const { pipeline } = require("stream");
const { parser } = require("stream-json");
const { streamArray } = require("stream-json/streamers/StreamArray");
const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");

const host =
  "https://search-hspw-prod-y77jqnl5zklvuwu3k66anbowhi.us-east-2.es.amazonaws.com";
const index = "study_protein";
const filePath =
  "/Users/iwu/repo/HSPW-V3/src/server/download-script/study_protein_012924.json"; // Update this to the path of your JSON file
const batchSize = 1000;

const getClient = async () => {
  const awsCredentials = await defaultProvider()();
  const connector = createAwsOpensearchConnector({
    credentials: awsCredentials,
    region: process.env.AWS_REGION ?? "us-east-2",
  });

  return new Client({
    ...connector,
    node: host,
  });
};

async function insertBatch(client, batch) {
  const body = batch.flatMap((doc) => [
    { index: { _index: index } },
    doc.value,
  ]);

  try {
    const { body: response } = await client.bulk({ refresh: true, body });
    if (response.errors) {
      console.error("Error inserting batch:", response.errors);
    } else {
      console.log("Batch inserted successfully");
    }
  } catch (error) {
    console.error("Bulk insert error:", error);
  }
}

async function insertRecordsFromStream(filePath, batchSize) {
  const client = await getClient();
  let batch = [];

  const jsonStream = pipeline(
    fs.createReadStream(filePath),
    parser(),
    streamArray(),
    async (err) => {
      if (err) {
        console.error("Pipeline failed.", err);
      } else {
        console.log("Pipeline succeeded.");
      }
    }
  );

  for await (const data of jsonStream) {
    batch.push(data);
    if (batch.length >= batchSize) {
      await insertBatch(client, batch);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await insertBatch(client, batch);
  }
}

insertRecordsFromStream(filePath, batchSize)
  .then(() => console.log("All records inserted successfully"))
  .catch((error) => console.error("Error inserting records:", error));
