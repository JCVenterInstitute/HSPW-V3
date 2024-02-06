const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const fs = require("fs");
const { createWriteStream } = require("fs");

// const host =
//   "https://search-hspw-dev-open-crluksvxj4mvcgl5nopcl6ykte.us-east-2.es.amazonaws.com";

const host =
  "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";

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

const downloadAllRecords = async (index, fileName) => {
  const client = await getClient();
  let scrollId;
  const fileStream = createWriteStream(fileName, { encoding: "utf-8" });
  console.log(`Start streaming data to ${filename}`);

  try {
    const { body: initialResponse } = await client.search({
      index,
      scroll: "1m", // Scroll timeout
      size: 10000,
      body: {
        query: {
          match_all: {},
        },
      },
    });

    scrollId = initialResponse._scroll_id;
    initialResponse.hits.hits.forEach((hit) =>
      fileStream.write(JSON.stringify(hit._source) + "\n")
    );

    while (true) {
      const { body: scrollResponse } = await client.scroll({
        scroll: "1m",
        scrollId,
      });

      if (scrollResponse.hits.hits.length === 0) {
        console.log("> Done");
        break; // No more results
      }

      scrollResponse.hits.hits.forEach((hit) =>
        fileStream.write(JSON.stringify(hit._source) + "\n")
      );
      console.log("> Records fetched", scrollResponse.hits.hits.length);
      console.log("> Continue");

      scrollId = scrollResponse._scroll_id;
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    fileStream.end(); // Make sure to close the stream
    console.log(`Finished streaming data to ${fileName}`);

    // Clear the scroll ID to release resources on the server
    if (scrollId) {
      await client.clearScroll({
        body: {
          scroll_id: [scrollId],
        },
      });
    }

    // Close the OpenSearch client connection
    await client.close();
  }
};

// Index you want to download
const index = "citation-011124";
const fileName = "citation-011124.json";

// Call the function to download all records
downloadAllRecords(index, fileName);
