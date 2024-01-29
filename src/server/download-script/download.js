const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const fs = require("fs");

const host =
  "https://search-hspw-dev-open-crluksvxj4mvcgl5nopcl6ykte.us-east-2.es.amazonaws.com";

// Index you want to download
const index = "salivary-proteins-011124";

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

function saveToFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Data saved to ${filename}`);
}

const downloadAllRecords = async () => {
  const client = await getClient();
  let allRecords = [];
  let scrollId;

  try {
    const { body: initialResponse } = await client.search({
      index,
      scroll: "1m", // Scroll timeout
      size: 1000,
      body: {
        query: {
          match_all: {},
        },
      },
    });

    scrollId = initialResponse._scroll_id;

    const recs = initialResponse.hits.hits.map((hit) => hit._source);
    allRecords = allRecords.concat(recs);

    while (true) {
      const { body: scrollResponse } = await client.scroll({
        scroll: "1m",
        scrollId,
      });

      if (scrollResponse.hits.hits.length === 0) {
        console.log("> Done");
        break; // No more results
      }

      const records = scrollResponse.hits.hits.map((hit) => hit._source);
      allRecords = allRecords.concat(records);

      console.log("> Records length", allRecords.length);
      console.log("> Continue");

      scrollId = scrollResponse._scroll_id;
    }

    saveToFile("output.json", allRecords);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Clear the scroll ID to release resources on the server
    await client.clearScroll({
      body: {
        scroll_id: [scrollId],
      },
    });

    // Close the OpenSearch client connection
    await client.close();
  }
};

// Call the function to download all records
downloadAllRecords();
