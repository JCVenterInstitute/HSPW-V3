const fs = require("fs");
const path = require("path");
const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");

const host =
  "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";

const indexName = "study_protein_012924"; // Replace with index name to index into
const dataDirectoryPath = "../../../../data_from_harinder/"; // Replace this with the path to your directory with the study protein data to load
const typeName = "_doc"; // Change this if you are using a different type

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

const readAndProcessFiles = async (directoryPath) => {
  try {
    const client = await getClient();

    // Read files in the directory
    const files = await fs.readdirSync(directoryPath);

    const proteinFiles = files.filter((file) =>
      file.toLowerCase().startsWith("protein")
    );

    // Process each file
    for (const file of proteinFiles) {
      console.log("> Loading file", file);

      const filePath = path.join(directoryPath, file);
      const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

      const body = jsonData
        .map((record) => [
          { index: { _index: indexName, _type: typeName } },
          record,
        ])
        .flat();

      // Bulk insert into OpenSearch
      await client
        .bulk({ body })
        .then((response) => {
          if (response.body.errors) {
            console.error(
              `Error bulk uploading data from file ${file}:`,
              response.body.errors
            );
          } else {
            console.log(`Successfully uploaded data from file ${file}`);
          }
        })
        .catch((error) => {
          console.error(`Error uploading data from file ${file}:`, error);
        });
    }

    console.log("All files processed successfully");
  } catch (err) {
    console.error("Error reading or processing files:", err);
  }
};

readAndProcessFiles(dataDirectoryPath);
