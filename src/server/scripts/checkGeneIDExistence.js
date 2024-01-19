const { Client } = require("@opensearch-project/opensearch");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const fs = require("fs");
const { createArrayCsvStringifier } = require("csv-writer");

// OpenSearch connection details
const hostDev2 =
  "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";

const hostDevOpen =
  "https://search-hspw-dev-open-crluksvxj4mvcgl5nopcl6ykte.us-east-2.es.amazonaws.com";

const getClientDev2 = async () => {
  const awsCredentials = await defaultProvider()();
  const connector = createAwsOpensearchConnector({
    credentials: awsCredentials,
    region: process.env.AWS_REGION ?? "us-east-2",
  });
  return new Client({
    ...connector,
    node: hostDev2,
  });
};

const getClientDevOpen = async () => {
  const awsCredentials = await defaultProvider()();
  const connector = createAwsOpensearchConnector({
    credentials: awsCredentials,
    region: process.env.AWS_REGION ?? "us-east-2",
  });
  return new Client({
    ...connector,
    node: hostDevOpen,
  });
};

const fetchAllRecords = async (client) => {
  let allRecords = [];
  let scrollId = null;

  // Initial search
  let response = await client.search({
    index: "salivary-proteins-011124",
    scroll: "1m",
    size: 1000, // Adjust size as needed
    body: {
      query: {
        match_all: {},
      },
    },
  });

  while (response.body.hits.hits.length) {
    // Process current batch
    response.body.hits.hits.forEach((hit) => {
      if (hit._source.salivary_proteins.entrez_gene_id) {
        hit._source.salivary_proteins.entrez_gene_id.forEach((id) => {
          console.log("> Pushing ID: ", id);
          allRecords.push(id);
        });
      }
    });

    scrollId = response.body._scroll_id;

    // Fetch next batch
    response = await client.scroll({
      scrollId: scrollId,
      scroll: "1m",
    });
  }

  return allRecords;
};

// // Function to check records and write non-existing IDs to CSV
// const checkAndWriteNonExistingIDs = async (client, records) => {
//   const idsNotInGenes = [];

//   let count = 0;
//   for (const id of records) {
//     count++;
//     console.log("> Checking ID: ", id);
//     const response = await client.search({
//       index: "genes", // Replace with your genes index name
//       body: {
//         query: {
//           term: {
//             "GeneID.keyword": id, // Adjust field name as per your index mapping
//           },
//         },
//         size: 1,
//       },
//     });

//     if (response.body.hits.total.value === 0) {
//       idsNotInGenes.push(id);
//     }

//     if (count % 50 === 0) {
//       console.log(">>>>>>>>>>> Processed", count);
//     }
//   }

//   // Manually format as CSV
//   const csvContent = idsNotInGenes.join("\n");

//   // Save to CSV file
//   fs.writeFileSync("/Users/iwu/Desktop/HSPW/ids_not_in_genes.csv", csvContent);
//   console.log("CSV file created successfully");
// };

const checkAndWriteNonExistingIDs = async (client, records) => {
  // Prepare the _mget request body
  const mgetBody = {
    docs: records.map((id) => ({ _index: "genes", _id: id })),
  };

  // Make the _mget request
  const response = await client.mget({ body: mgetBody });

  // Filter out IDs not found in the genes index
  const idsNotInGenes = response.body.docs
    .filter((doc) => !doc.found)
    .map((doc) => doc._id);

  // Manually format as CSV
  const csvContent = idsNotInGenes.join("\n");

  // Save to CSV file
  fs.writeFileSync("/Users/iwu/Desktop/HSPW/ids_not_in_genes.csv", csvContent);
  console.log("CSV file created successfully");
};

// Main execution
(async () => {
  try {
    const clientDev2 = await getClientDev2();
    const clientDevOpen = await getClientDevOpen();

    const records = await fetchAllRecords(clientDevOpen);

    // Call the function to check and write non-existing IDs to CSV
    await checkAndWriteNonExistingIDs(clientDev2, records);

    // // Initialize CSV Writer
    // const csvWriter = createArrayCsvStringifier({
    //   header: ["entrez_gene_id"],
    // });

    // // Create a write stream
    // const writeStream = fs.createWriteStream(
    //   "/Users/iwu/Desktop/HSPW/entrez_gene_ids.csv"
    // );

    // // Write the header
    // writeStream.write(csvWriter.getHeaderString());

    // // Write records in chunks
    // const chunkSize = 1000; // Define chunk size
    // for (let i = 0; i < records.length; i += chunkSize) {
    //   const chunk = records.slice(i, i + chunkSize);
    //   writeStream.write(csvWriter.stringifyRecords(chunk.map((id) => [id])));
    // }

    // writeStream.end();

    // console.log("CSV file created successfully");
  } catch (error) {
    console.error("Error:", error);
  }
})();
