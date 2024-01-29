const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");

// File with records to index
const records = require("./output");

const host =
  "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";

// Name of index to write to
const index = "citation-011124";

const getClient = async () => {
  const awsCredentials = await defaultProvider()();

  const connector = createAwsOpensearchConnector({
    credentials: awsCredentials,
    region: process.env.AWS_REGION ?? "us-east-2",
    getCredentials: function (cb) {
      return cb();
    },
  });

  return new Client({
    ...connector,
    node: host,
  });
};

// Function to insert records in batches
async function insertRecordsInBatches(records, batchSize) {
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await insertBatch(batch);
  }
}

// Function to insert a batch of records
async function insertBatch(batch) {
  const client = await getClient();
  const body = [];

  // Prepare the bulk insert operation
  for (const record of batch) {
    body.push({ index: { _index: index } });
    body.push(record);
  }

  const { body: response } = await client.bulk({ refresh: true, body });

  if (response.errors) {
    console.error("Error inserting batch:", response.errors);
  } else {
    console.log("Batch inserted successfully");
  }
}

// Number of recs to index per batch
const batchSize = 500;

insertRecordsInBatches(records, batchSize)
  .then(() => console.log("All records inserted successfully"))
  .catch((error) => console.error("Error inserting records:", error));
