const { Client } = require("@opensearch-project/opensearch");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const fs = require("fs");

const host =
  "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com"; // Replace with your OpenSearch host

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

// Function to write missing PubMed IDs to a CSV file
const writeMissingPubMedIdsToCSV = async (missingPubMedIds) => {
  const stream = fs.createWriteStream("missingPubMedIds.csv");
  for (const id of missingPubMedIds) {
    stream.write(`${id}\n`);
  }
  stream.end();
};

// Function to write missing PubMed IDs to a CSV file
const writePubMedIdsToCSV = async (pubMedIds) => {
  const stream = fs.createWriteStream("pubMedIds.csv");
  for (const id of pubMedIds) {
    stream.write(`${id}\n`);
  }
  stream.end();
};

// Function to write missing PubMed IDs to a CSV file
const writeMissingReferencesIDToCSV = async (missingReferencesID) => {
  const stream = fs.createWriteStream("missingReferenceIds.csv");
  for (const id of missingReferencesID) {
    stream.write(`${id}\n`);
  }
  stream.end();
};

// Function to find missing PubMed IDs
const findMissingPubMedIds = async () => {
  const client = await getClient();

  try {
    const proteinResponse = await client.search({
      index: "protein_signature",
      body: {
        query: {
          match_all: {},
        },
      },
      size: 10000, // Adjust as needed
    });

    const proteinData = proteinResponse.body.hits.hits;
    const pubMedIds = new Set();

    const missingReferencesID = [];
    proteinData.forEach((item) => {
      if (item._source.ReferencesID !== "") {
        const refs = item._source.ReferencesID.split(",");
        if (refs.length !== 0) {
          refs.forEach((ref) => {
            const id = ref.split(":")[1];
            pubMedIds.add(id);
          });
        }
      } else {
        missingReferencesID.push(item._id);
      }
    });
    await writeMissingReferencesIDToCSV(missingReferencesID);
    await writePubMedIdsToCSV(pubMedIds);

    const missingPubMedIds = [];

    for (let id of pubMedIds) {
      console.log("> Checking ID:", id);
      const citationResponse = await client.exists({
        index: "citation",
        id: id,
      });

      if (!citationResponse.body) {
        missingPubMedIds.push(id);
      }
    }

    console.log("Missing PubMed IDs:", missingPubMedIds);

    // Write the missing IDs to a CSV file
    await writeMissingPubMedIdsToCSV(missingPubMedIds);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Run the function
findMissingPubMedIds();
