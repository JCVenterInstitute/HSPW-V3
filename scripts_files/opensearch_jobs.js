const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csv-parser");

var host =
  "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";

var host1 =
  "https://search-hspw-dev-open-crluksvxj4mvcgl5nopcl6ykte.us-east-2.es.amazonaws.com";

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

const getClient1 = async () => {
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
    node: host1,
  });
};

async function updateSpecificity() {
  var client = await getClient();
  let json = require("/Users/wchoi/backend/json/specificity.json");
  let temp = [];
  await json.forEach(({ Uniprot, Specificity, Specificity_Score }) => {
    const indexName = "saliva_protein_test";
    const query = {
      query: {
        match: {
          uniprot_accession: Uniprot,
        },
      },
    };
    const { body: searchResponse } = client.search({
      index: indexName,
      body: query,
    });
    console.log(JSON.stringify(searchResponse));
    if (searchResponse && searchResponse.hits && searchResponse.hits.hits) {
      // Update documents with Specificity and Specificity-Score
      const documentIds = searchResponse.hits.hits.map((hit) => hit._id);
      const updatePromises = documentIds.map((documentId) => {
        return client.update({
          index: indexName,
          id: documentId,
          body: {
            doc: {
              Specificity: Specificity,
              "Specificity-Score": Specificity_Score,
            },
          },
        });
      });
      Promise.all(updatePromises);
      console.log(`Updated documents with Uniprot ID ${uniprotId}`);
    } else {
      console.error("Error: Unexpected response format");
    }
  });
}

async function updateDocumentsWithJsonData(jsonFilePath) {
  var client = await getClient();
  try {
    const indexName = "saliva_protein_test"; // Replace with your actual index name

    // Read the JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

    // Iterate through the data and update documents
    for (const item of jsonData) {
      const uniprotId = item.Uniprot;
      const specificity = item.Specificity;
      const specificityScore = item["Specificity_Score"];

      const query = {
        query: {
          match: {
            uniprot_accession: uniprotId,
          },
        },
      };

      const { body: searchResponse } = await client.search({
        index: indexName,
        body: query,
      });

      if (searchResponse && searchResponse.hits && searchResponse.hits.hits) {
        const documentIds = searchResponse.hits.hits.map((hit) => hit._id);

        const updatePromises = documentIds.map(async (documentId) => {
          await client.update({
            index: indexName,
            id: documentId,
            body: {
              doc: {
                Specificity: specificity,
                Specificity_Score: specificityScore,
              },
            },
          });
        });

        await Promise.all(updatePromises);

        console.log(`Updated documents with Uniprot ID ${uniprotId}`);
      } else {
        console.error(`Error: No documents found for Uniprot ID ${uniprotId}`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

//updateDocumentsWithJsonData('/Users/wchoi/backend/json/specificity.json');

async function updateIndexWithTitles(filePath) {
  try {
    // Create an OpenSearch client - replace this with your specific OpenSearch client setup
    const client = await getClient1();

    // Read the JSON file content
    const content = fs.readFileSync(filePath, "utf8");

    try {
      // Parse the entire JSON array
      const jsonArray = JSON.parse(content);

      // Create an array to store promises for parallel processing
      const updatePromises = [];
      const notFoundPubMedIDs = [];

      // Iterate over each object in the array
      for (const jsonData of jsonArray) {
        const updatePromise = (async () => {
          try {
            // Access the PubMedID and Title from the JSON data
            const pubMedIDToUpdate = jsonData.PubMedID;
            const titleToUpdate = jsonData.Title;

            // Define the OpenSearch update query
            const updateParams = {
              index: "citation", // Replace with your index name
              body: {
                script: {
                  source: "ctx._source.Title = params.Title",
                  lang: "painless",
                  params: {
                    Title: titleToUpdate,
                  },
                },
                query: {
                  match: {
                    "PubMed ID": pubMedIDToUpdate,
                  },
                },
              },
            };

            // Perform the OpenSearch update
            const response = await client.updateByQuery(updateParams);
            const updatedDocuments = response.body.updated;

            if (updatedDocuments > 0) {
              console.log(
                `PubMedID ${pubMedIDToUpdate} updated with Title: ${titleToUpdate}`
              );
            } else {
              console.log(
                `PubMedID ${pubMedIDToUpdate} not found in the index.`
              );
              notFoundPubMedIDs.push(pubMedIDToUpdate);
            }

            // Add a short delay between updates (adjust as needed)
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (parseError) {
            console.error(`Error parsing JSON object: ${parseError}`);
          }
        })();

        updatePromises.push(updatePromise);
      }

      // Wait for all update promises to resolve (execute in parallel)
      await Promise.all(updatePromises);

      // Write not found PubMedIDs to a CSV file
      if (notFoundPubMedIDs.length > 0) {
        const csvContent = notFoundPubMedIDs.map((id) => `${id}\n`).join("");
        fs.writeFileSync("not_found_pubmed_ids.csv", csvContent);
        console.log("Not found PubMedIDs written to not_found_pubmed_ids.csv");
      }
    } catch (parseError) {
      console.error(`Error parsing JSON array: ${parseError}`);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
// Example usage
const filePath = "/Users/wchoi/backend/json/output_data.json"; // Change this to the path of your file
//updateIndexWithTitles(filePath);

async function update() {
  var client = await getClient1();
  let json = require("/Users/wchoi/backend/json/check.json");
  let temp = [];
  json.forEach(({ ID, HSPW_Status }) => {
    client
      .update({
        index: "salivary-proteins",
        id: ID,
        body: {
          doc: {
            salivary_proteins: {
              expert_opinion: HSPW_Status,
            },
          },
        },
      })
      .then((response) => {
        console.log(
          `Document with ID ${ID} updated successfully ${HSPW_Status}`
        );
      })
      .catch((error) => {
        console.error(`Error updating document with ID ${ID}:`, error);
      });
  });
}

//update();

async function search() {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: 0,

    aggs: {
      langs: {
        terms: { field: "Cluster ID.keyword", size: 500 },
      },
    },
  };

  var response = await client.search({
    index: "testing",
    body: query,
  });
  console.log("aggs");
  response.body.aggregations.langs.buckets.map((lang) =>
    console.log(JSON.stringify(lang.key))
  );
}

async function search_cluster() {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: 5000,
    query: {
      match_all: {},
    },
  };

  var response = await client.search({
    index: "protein_cluster",
    body: query,
  });
  console.log(
    Object.keys(JSON.parse(JSON.stringify(response.body.hits.hits))).length
  );
}

async function search_cluster_count() {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: 0,

    aggs: {
      sum_all: {
        count: { field: "# of Members Salivary Protein.keyword" },
      },
    },
  };

  var response = await client.search({
    index: "protein_cluster",
    body: query,
  });
  console.log("aggs");
  response.body.aggregations.langs.buckets.map((lang) =>
    console.log(JSON.stringify(lang.key))
  );
}

async function index() {
  var client = await getClient();
  var index_name = "saliva_protein";

  var response = await client.indices.create({
    index: index_name,
  });

  console.log("Creating index:");
  console.log(response.body);
}

async function bulk() {
  let temp = [];
  let temp1 = [];
  let temp2 = "";
  let temp3 = "";
  let json = require("/Users/wchoi/backend/json/go.json");

  for (let i = 0; i < json.graphs.nodes.length; i++) {
    temp.push({
      index: { _index: "go_nodes", _id: json.graphs.nodes[i]["id"] },
    });
    temp.push(json.graphs.nodes[i]);
  }

  console.log(temp.length);
  let j = 0;
  var client = await getClient();

  const addJson = temp.map(JSON.stringify).join("\n") + "\n";
  client.bulk({ body: addJson }, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      j++;
      console.log(j);
      console.log(data);
    }
  });
}

function arrayT() {
  let temp = [];
  let json = require("/Users/wchoi/backend/json/cluster.json");
  for (let i = 0; i < 3; i++) {
    console.log("diu" + json[i]["# of Members Salivary Protein"]);
    temp = json[i]["# of Members Salivary Protein"].split(",");
    json[i]["# of Members Salivary Protein"] = temp;
    console.log(json[i]["# of Members Salivary Protein"]);
  }
}

async function bulk1(file) {
  let temp = [];
  let temp1 = [];
  let temp2 = "";
  let temp3 = "";
  let json = require("/Users/wchoi/backend/json/" + file);

  temp.push({ index: { _index: "genes", _id: json["GeneID"] } });
  temp.push(json);

  let j = 0;
  var client = await getClient();

  const addJson = temp.map(JSON.stringify).join("\n") + "\n";
  client.bulk({ body: addJson }, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      j++;
      console.log(j);
      console.log(temp);
    }
  });
}

async function bulk4() {
  let temp = [];
  let json = require(`/Users/wchoi/backend/output_cluster.json`);
  for (let i = 0; i < json.length; i++) {
    // Add to the temp array for bulk indexing
    temp.push({
      index: { _index: "protein_cluster", _id: json[i]["uniprot_id"] },
    });
    temp.push(json[i]);
  }
  // Assuming getClient1 returns an Elasticsearch client
  var client = await getClient();

  const addJson = temp.map(JSON.stringify).join("\n") + "\n";

  client.bulk({ body: addJson }, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(temp);
    }
  });
}

bulk4();

async function bulk3() {
  for (var i = 1; i <= 18; i++) {
    let temp = [];
    let json = require(`/Users/wchoi/backend/test4/output_data_${i}.json`);

    for (let i = 0; i < json.length; i++) {
      // Add leading zeros to month and date in PubDate
      const pubDateParts = json[i]["PubDate"].split("/");
      const paddedMonth = pubDateParts[1].padStart(2, "0");
      const paddedDay = pubDateParts[2].padStart(2, "0");
      json[i]["PubDate"] = `${pubDateParts[0]}/${paddedMonth}/${paddedDay}`;

      // Add to the temp array for bulk indexing
      temp.push({ index: { _index: "citation", _id: json[i]["PubMed_ID"] } });
      temp.push(json[i]);
    }

    // Assuming getClient1 returns an Elasticsearch client
    var client = await getClient1();

    const addJson = temp.map(JSON.stringify).join("\n") + "\n";

    client.bulk({ body: addJson }, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(temp);
      }
    });
  }
}
//bulk3();

async function bulk2() {
  try {
    let temp = [];

    let jsonData = require("/Users/wchoi/backend/json/genesX.json");
    const batchSize = 2000; // Adjust the batchSize as needed

    for (let i = 0; i < jsonData.length; i++) {
      try {
        temp.push({ index: { _index: "genes", _id: jsonData[i]["GeneID"] } });
        temp.push(jsonData[i]);

        if (temp.length >= 2 * batchSize) {
          await processBatch(temp);
          temp = [];
        }
      } catch (error) {
        console.error("Error processing JSON object at index", i, ":", error);
        // Handle the error, e.g., log and continue
      }
    }

    // Process any remaining data
    if (temp.length > 0) {
      await processBatch(temp);
    }
  } catch (error) {
    console.error("Error in bulk processing:", error);
    // Handle the error, e.g., log and continue
  }
}

// Assume processBatch remains the same
async function processBatch(data) {
  try {
    const client = await getClient();
    const addJson = data.map(JSON.stringify).join("\n") + "\n";

    await new Promise((resolve, reject) => {
      client.bulk({ body: addJson }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error("Error in processing batch:", error);

    // Add the JSON object to the error for further logging
    error.jsonObject = data;
    throw error; // Rethrow the error to propagate it up the call stack
  }
}

//bulk2();

const { promisify } = require("util");

const readFileAsync = promisify(fs.readFile);

async function bulkInsert() {
  let temp = [];

  try {
    // Read the JSON data from the file
    const jsonData = await readFileAsync(
      "/Users/wchoi/backend/json/output_data.json",
      "utf8"
    );
    const json = JSON.parse(jsonData);

    for (let i = 0; i < json.length; i++) {
      // Ensure that outputArray is an array before attempting to use map

      json[i]["Authors"] = outputArray;

      temp.push({ index: { _index: "citation", _id: json[i]["PubMedID"] } });
      temp.push(json[i]);
    }

    const client = await getClient1();

    // Convert temp array to a newline-separated JSON string
    const bulkRequestBody = temp.map(JSON.stringify).join("\n") + "\n";

    const bulkPromise = () => {
      return new Promise((resolve, reject) => {
        client.bulk({ body: bulkRequestBody }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };

    // Wait for the bulk operation to complete
    const result = await bulkPromise();
    console.log(result);
  } catch (error) {
    console.error("Error in bulkInsert:", error);
  }
}
//bulkInsert();

async function count(file) {
  let json = require("/Users/wchoi/backend/json/peptide/" + file);
  console.log(typeof json["Study Peptide"].length);
}

let m = 0;
const directoryPath = path.join(__dirname, "/json/study2");
//passsing directoryPath and callback function
let i = [];

const jsonsInDir = fs
  .readdirSync("/Users/wchoi/backend/json/study2/")
  .filter((file) => path.extname(file) === ".json");

const indexName = "protein";
const scrollSize = 10000;

// Define the CSV file path and header
const csvWriter = createCsvWriter({
  path: "output2.csv",
  header: [
    // Replace with actual field names
    { id: "experiment_id_key", title: "experiment_id_key" },
    { id: "Uniprot_id", title: "Uniprot_id" },
    { id: "abundance", title: "abundance" },
    // Add more fields as needed
  ],
});

async function fetchAndExportArray(indexName, csvFilename) {
  let scrollId;
  let csvData = [];
  var client = await getClient1();
  const scrollResponse = await client.search({
    index: indexName,
    scroll: "30s",
    body: {
      size: 10000,
      sort: ["_doc"],
      query: { match_all: {} },
      _source: ["salivary_proteins.cites"],
    },
  });

  scrollId = scrollResponse.body._scroll_id;
  var hits = scrollResponse.body.hits.hits;

  while (hits.length > 0) {
    hits.forEach((hit) => {
      const cites = hit._source["salivary_proteins"]["cites"];
      if (cites && cites.length > 0) {
        const ids = cites.map((cite) => cite.replace("PubMed:", "")).join("\n");
        csvData += ids + "\n\n"; // Separate sets of IDs with two newlines
      }
    });

    const nextScrollResponse = await client.scroll({
      scrollId,
      scroll: "1m",
    });

    scrollId = nextScrollResponse.body._scroll_id;
    hits = nextScrollResponse.body.hits.hits;
  }

  fs.writeFile(csvFilename, csvData, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Data exported to ${csvFilename}`);
  });
}

const csvFilename1 = "pubmed_id2.csv";

//fetchAndExportArray('salivary-proteins-102023', csvFilename1);

async function fetchAndExport(indexName, csvFilename) {
  let scrollId;
  let csvData = [];
  var client = await getClient1();
  const scrollResponse = await client.search({
    index: indexName,
    scroll: "30s",
    body: {
      size: 10000, // Number of documents per batch
      sort: ["_doc"], // Sorting by default
      query: { match_all: {} },
      _source: ["salivary_proteins.protein_sequence"],
    },
  });

  scrollId = scrollResponse.body._scroll_id;
  var hits = scrollResponse.body.hits.hits;

  while (hits.length > 0) {
    csvData.push(...hits.map((hit) => hit._source));

    const nextScrollResponse = await client.scroll({
      scrollId,
      scroll: "1m",
    });

    scrollId = nextScrollResponse.body._scroll_id;
    hits = nextScrollResponse.body.hits.hits;
  }
  console.log(csvData[0]);

  const csvContent = csvData
    .map((doc) => Object.values(doc).join(","))
    .join("\n");

  fs.writeFile(csvFilename, csvContent, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Data exported to ${csvFilename}`);
  });
}

// Usage
const csvFilename = "sequence_id.csv";

//fetchAndExport('salivary-proteins-112023', csvFilename);

async function fetchAndExport1(indexName, jsonFilename) {
  try {
    let scrollId;
    let jsonData = [];
    const client = await getClient1();

    const scrollResponse = await client.search({
      index: indexName,
      scroll: "30s",
      body: {
        size: 10000, // Number of documents per batch
        sort: ["_doc"], // Sorting by default
        query: { match_all: {} },
        _source: ["salivary_proteins.protein_sequence"],
      },
    });

    scrollId = scrollResponse.body._scroll_id;
    let hits = scrollResponse.body.hits.hits;

    while (hits.length > 0) {
      jsonData.push(...hits.map((hit) => hit._source));

      if (jsonData.length === 1) {
        console.log("First Object:", JSON.stringify(jsonData[0], null, 2));
      }

      const nextScrollResponse = await client.scroll({
        scrollId,
        scroll: "1m",
      });

      scrollId = nextScrollResponse.body._scroll_id;
      hits = nextScrollResponse.body.hits.hits;
    }

    fs.writeFile(jsonFilename, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(`Error writing JSON file: ${err}`);
      } else {
        console.log(`Data exported to ${jsonFilename}`);
      }
    });
  } catch (error) {
    console.error(`Error in fetchAndExport: ${error}`);
  }
}

// Usage
const jsonFilename = "sequence_data.json";
//fetchAndExport1('salivary-proteins-112023', jsonFilename);
/*
const results = [];

fs.createReadStream('upload_unique_protein.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    const jsonData = JSON.stringify(results, null, 2);
    fs.writeFileSync('upload_unique_protein.json', jsonData);
    console.log('Conversion complete.');
  });

jsonsInDir.forEach(file => {
  const fileData = fs.readFileSync(path.join('/Users/wchoi/backend/json/study2/', file));
  var originalObject = JSON.parse(fileData);
  var modifiedObject = {
    ...originalObject.Study, // Spread the values from "Study"
    ...originalObject.Samples // Spread the values from "Samples"
  };

   fs.writeFile('/Users/wchoi/backend/json/study2/'+file, JSON.stringify(modifiedObject), 'utf8', (err) => {

    if (err) {
      console.error(err);
      return;
    }
  });
});

index().catch(console.log);
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        console.log(file);
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file

      fs.readFile('/Users/wchoi/backend/json/study2/'+file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      bulk1(file);

});
    });

});

*/
/*
fs.readFile('/Users/wchoi/backend/json/study2/study529.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const originalObject = JSON.parse(data);
  const modifiedObject = {
  ...originalObject.Study, // Spread the values from "Study"
  ...originalObject.Samples // Spread the values from "Samples"
};
  const modifiedJsonString = JSON.stringify(modifiedObject);
  console.log('1: ' + modifiedJsonString);
   fs.writeFile('/Users/wchoi/backend/json/study2/study529.json', modifiedJsonString, 'utf8', (err) => {

    if (err) {
      console.error(err);
      return;
    }
  });

});
*/

/*
fs.readFile('/Users/wchoi/backend/json/study2/study529.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  var modifiedJsonString = data.replace(/"Samples":\[/g, '"Samples":');
  modifiedJsonString = modifiedJsonString.replace(/}]}/g, '}}')
  console.log('1: ' + modifiedJsonString);
   fs.writeFile('/Users/wchoi/backend/json/study2/study529.json', modifiedJsonString, 'utf8', (err) => {

    if (err) {
      console.error(err);
      return;
    }
  });

});
*/
/*

fs.readFile('/Users/wchoi/backend/json/study_protein/protein4327.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

const modifiedContent = '{"study_protein":'+data + '}';

  // Step 3: Write the modified content back to the same file
  fs.writeFile('/Users/wchoi/backend/json/study_protein/protein4327.json', modifiedContent, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Closing bracket added to the text file.');
  });

  if (data.length >= 2) {
    const modifiedContent = data.slice(0, -2) + data.slice(-1); // Removes the second-to-last character

    // Step 3: Write the modified content back to the same file
    fs.writeFile('/Users/wchoi/backend/json/study_protein/protein4327.json', modifiedContent, 'utf8', (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Second-to-last character removed from the text file.');
    });
  } else {
    console.log('The file does not contain enough characters to remove the second-to-last character.');
  }
});
*/

//index().catch(console.log);
//bulk2().catch(console.log);
//bulk1().catch(console.log);

//bulk().catch(console.log);
//arrayT();
//search_cluster_count().catch(console.log);
//search_cluster().catch(console.log);
//search().catch(console.log);
