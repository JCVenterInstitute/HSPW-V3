const { Client } = require("@opensearch-project/opensearch");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const fs = require("fs");

// OpenSearch connection details
const host =
  "https://search-hspw-dev-open-crluksvxj4mvcgl5nopcl6ykte.us-east-2.es.amazonaws.com";
const indexName = "citation"; // Specify your index name here

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

const formatDate = (dateString) => {
  const parts = dateString.split("/"); // Split the date by '/'

  // Pad the month and day with a leading zero if necessary
  const year = parts[0];
  const month = parts[1].padStart(2, "0");
  const day = parts[2].padStart(2, "0");

  return `${year}/${month}/${day}`; // Reassemble in yyyy/MM/dd format
};

// Function to create citation records in OpenSearch
const createCitationRecordsInOpenSearch = async () => {
  const client = await getClient();

  const citationData = JSON.parse(
    fs.readFileSync("/Users/iwu/Desktop/test6/output_data_5.json", "utf8")
  );

  for (const citation of citationData) {
    const pubmedId = citation.PubMed_ID;
    const pubDate = formatDate(citation.PubDate);
    const authors = citation.author_names;
    const journalTitle = citation.journal_title;
    const keywords = citation.keywords;
    const affiliation = citation.affiliation;
    const title = citation.Title;
    const abstract = citation.Abstract;
    const pubYear = citation.PubYear;

    // Create a record in OpenSearch
    try {
      await client.index({
        index: indexName,
        id: `${pubmedId}`,
        body: {
          PubMed_ID: pubmedId,
          PubDate: pubDate,
          author_names: authors,
          journal_title: journalTitle,
          keywords: keywords,
          affiliation: affiliation,
          Title: title,
          Abstract: abstract,
          PubYear: pubYear,
        },
      });
      console.log(`Record created for Citation: ${citation.PubMed_ID}`);
    } catch (error) {
      console.error("Error creating record in OpenSearch:", error);
    }
  }
};

// Run the function to create records
createCitationRecordsInOpenSearch();
