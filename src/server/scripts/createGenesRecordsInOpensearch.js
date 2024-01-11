const { Client } = require("@opensearch-project/opensearch");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const axios = require("axios");
const xml2js = require("xml2js");
const he = require("he");

// OpenSearch connection details
const host =
  "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";
const indexName = "genes-010824"; // Specify your index name here
const uploadedFilePath = "/Users/iwu/Desktop/HSPW/protein_to_gene_mapping.txt";

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

// Function to read the GeneIDs from the uploaded file
const readGeneIDsFromFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const geneIds = new Set();
    fs.createReadStream(filePath)
      .pipe(csv({ separator: "\t", headers: false }))
      .on("data", (row) => {
        const geneId = row[1]?.split(";")[0].trim();
        if (geneId) {
          geneIds.add(geneId);
        }
      })
      .on("end", () => {
        resolve(geneIds);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

// Check if the index exists and create it if not
const ensureIndexExists = async (client) => {
  const indexExists = await client.indices.exists({ index: indexName });

  if (!indexExists.body) {
    await client.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            Aliases: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            Chromosome: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            "Gene Name": {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            "Gene Products": {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            "Gene Symbol": {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            GeneID: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            Location: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            Summary: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            Organism: {
              properties: {
                scientificName: {
                  type: "text",
                  fields: {
                    keyword: {
                      type: "keyword",
                      ignore_above: 256,
                    },
                  },
                },
                commonName: {
                  type: "text",
                  fields: {
                    keyword: {
                      type: "keyword",
                      ignore_above: 256,
                    },
                  },
                },
                taxonId: {
                  type: "integer", // Assuming taxonId is always an integer
                },
                lineage: {
                  type: "text",
                  fields: {
                    keyword: {
                      type: "keyword",
                      ignore_above: 256,
                    },
                  },
                },
              },
            },
            DbXrefs: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            GeneType: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            "Modification Date": {
              type: "date",
              format: "yyyyMMdd", // Format set to 'yyyymmdd'
            },
          },
        },
      },
    });
  }
};

// Function to fetch summary data from the URL
const fetchSummaryData = async (geneId) => {
  const url = `https://www.ncbi.nlm.nih.gov/gene/${geneId}?report=xml&format=text`;
  const response = await axios.get(url);

  // Decode HTML entities
  const decodedData = he.decode(response.data);

  // Parse the XML
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(decodedData);

  // Check if the parsed result is an object and contains the required data
  if (
    result &&
    result.pre &&
    result.pre.Entrezgene &&
    result.pre.Entrezgene[0].Entrezgene_summary
  ) {
    return result.pre.Entrezgene[0].Entrezgene_summary[0];
  } else {
    console.log(`Summary not found for GeneID ${geneId}`);
    return "";
  }
};

// Function to read TSV and create records in OpenSearch
const createGenesRecordsInOpenSearch = async (geneIds) => {
  const client = await getClient();
  await ensureIndexExists(client); // Ensure index exists before proceeding
  const parser = fs
    .createReadStream("/Users/iwu/Desktop/HSPW/data-test.tsv")
    .pipe(csv({ separator: "\t" }));

  for await (const row of parser) {
    const geneId = row.GeneID;

    if (geneIds.has(geneId)) {
      console.log(`> Processing GeneID: ${row.GeneID}`);
      const geneSymbol = row.Symbol;
      const geneName = row.description;
      const aliases = row.Synonyms.replaceAll("|", ", ");
      const location = row.map_location;
      const chromosome = row.chromosome;
      const dbXrefs = row.dbXrefs.replaceAll("|", ", ");
      const geneType = row.type_of_gene;
      const modificationDate = row.Modification_date;

      const summaryData = await fetchSummaryData(geneId);

      // Create a record in OpenSearch
      try {
        await client.index({
          index: indexName,
          body: {
            GeneID: geneId,
            "Gene Symbol": geneSymbol,
            "Gene Name": geneName,
            Aliases: aliases,
            Location: location,
            Chromosome: chromosome,
            Organism: {
              scientificName: "Homo sapiens",
              commonName: "Human",
              taxonId: 9606,
              lineage: [
                "Eukaryota",
                "Metazoa",
                "Chordata",
                "Craniata",
                "Vertebrata",
                "Euteleostomi",
                "Mammalia",
                "Eutheria",
                "Euarchontoglires",
                "Primates",
                "Haplorrhini",
                "Catarrhini",
                "Hominidae",
                "Homo",
              ],
            },
            DbXrefs: dbXrefs,
            GeneType: geneType,
            "Modification Date": modificationDate,
            Summary: summaryData,
            // Add other fields from the row if needed
          },
        });
      } catch (error) {
        console.error("Error creating record in OpenSearch:", error);
      }
    } else {
      console.log(`> Skipping GeneID: ${geneId}`);
    }
  }
};

// Main execution
(async () => {
  try {
    const geneIds = await readGeneIDsFromFile(uploadedFilePath);
    await createGenesRecordsInOpenSearch(geneIds);
  } catch (error) {
    console.error("Error:", error);
  }
})();
