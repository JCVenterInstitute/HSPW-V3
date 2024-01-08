const { Client } = require("@opensearch-project/opensearch");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const fs = require("fs");
const csv = require("csv-parser");

const host =
  "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";

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

// Read CSV and update OpenSearch
const updateUniprotIds = async () => {
  const client = await getClient();
  const results = [];

  fs.createReadStream("/Users/iwu/Desktop/HSPW/HSPW_Map_to_Uniport.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      // Process each row
      for (let mapping of results) {
        console.log(mapping);
        try {
          const response = await client.updateByQuery({
            index: "study_protein",
            body: {
              script: {
                source: "ctx._source.Uniprot_id = params.new_id",
                lang: "painless",
                params: {
                  new_id: mapping.uniprot_ac,
                },
              },
              query: {
                match: {
                  Uniprot_id: mapping.submitted_accession,
                },
              },
            },
          });
        } catch (error) {
          console.log(mapping);
          console.error("Error updating document:", error);
        }
      }
    });
};

// Run the update function
updateUniprotIds();
