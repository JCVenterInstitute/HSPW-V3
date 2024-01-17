const { Client } = require("@opensearch-project/opensearch");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const axios = require("axios");
const xml2js = require("xml2js");
const he = require("he");
const csvWriter = require("csv-write-stream");

// OpenSearch connection details
const host =
  "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";
const indexName = "genes-011724"; // Specify your index name here
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

// Function to find GeneIDs in OpenSearch index that are not in the uploaded file
const findMissingGeneIdsInFile = async (client, geneIds) => {
  let missingCount = 0;
  let missingGeneIds = new Set();
  const scrollDuration = "1m"; // Keep the scroll context alive for 1 minute

  // Initiate the scroll query
  let response = await client.search({
    index: "genes",
    scroll: scrollDuration,
    size: 100, // Adjust the batch size as needed
    _source: ["GeneID"], // Fetch only the GeneID field
    body: {
      query: {
        match_all: {},
      },
    },
  });

  while (response.body.hits.hits.length) {
    // Process the batch
    response.body.hits.hits.forEach((hit) => {
      const geneId = hit._source.GeneID;
      if (!geneIds.has(geneId)) {
        missingCount++;
        missingGeneIds.add(geneId);
      }
    });

    // Fetch the next batch
    response = await client.scroll({
      scrollId: response.body._scroll_id,
      scroll: scrollDuration,
    });
  }

  // Close the scroll context
  await client.clearScroll({ scrollId: response.body._scroll_id });

  return [missingGeneIds, missingCount];
};

const writeGeneIdsToCSV = (geneIds, filePath) => {
  const csvContent = Array.from(geneIds).join("\n");
  fs.writeFileSync(filePath, csvContent);
};

// Function to check each GeneID and write the results to a CSV file
const checkGeneIdsAndWriteToCSV = async (client, geneIds, outputFilePath) => {
  const writer = csvWriter();
  writer.pipe(fs.createWriteStream(outputFilePath));

  for (const geneId of geneIds) {
    console.log("> Checking GeneID: ", geneId);
    const response = await client.search({
      index: "salivary-proteins-011124",
      body: {
        query: {
          term: {
            "salivary_proteins.entrez_gene_id": geneId,
          },
        },
      },
    });

    const hits = response.body.hits.hits;
    console.log("> Writing GeneID: ", geneId);
    if (hits.length > 0) {
      // Assuming the first hit's uniprot_accession is what we need
      const uniprotAccession =
        hits[0]._source.salivary_proteins.uniprot_accession;
      writer.write({
        GeneID: geneId,
        ProteinID: uniprotAccession,
        Found: "Yes",
      });
    } else {
      writer.write({ GeneID: geneId, ProteinID: "missing", Found: "No" });
    }
  }

  writer.end();
};

const getFirstHundredGeneIds = async () => {
  const client = await getClient();

  const response = await client.search({
    index: "genes",
    body: {
      size: 100,
      sort: [
        {
          _script: {
            type: "number",
            script: {
              lang: "painless",
              source: "Integer.parseInt(doc['_id'].value)",
            },
            order: "asc",
          },
        },
      ],
      _source: ["GeneID"], // Assuming the gene ID field is named 'GeneID'
    },
  });

  const geneIds = response.body.hits.hits.map((hit) => hit._source.GeneID);
  return geneIds;
};

// Function to read TSV and create records in OpenSearch
const createGenesRecordsInOpenSearch = async (geneIds) => {
  const client = await getClient();
  await ensureIndexExists(client); // Ensure index exists before proceeding

  // Count missing GeneIDs in the index
  // const [missingGeneIds, missingCount] = await findMissingGeneIdsInFile(
  //   client,
  //   geneIds
  // );
  // console.log(`GeneIDs in index but not in file:`, [...missingGeneIds]);
  // console.log(`Number of GeneIDs in index but not in file: ${missingCount}`);

  // Write the missing GeneIDs to a CSV file
  // const outputFilePath = "/Users/iwu/Desktop/HSPW/missingGeneIds.csv"; // Replace with your desired output path
  // await checkGeneIdsAndWriteToCSV(client, missingGeneIds, outputFilePath);
  // writeGeneIdsToCSV(missingGeneIds, outputFilePath);

  const parser = fs
    .createReadStream("/Users/iwu/Desktop/HSPW/data.tsv")
    .pipe(csv({ separator: "\t" }));

  let count = 0;
  for await (const row of parser) {
    const geneId = row.GeneID;

    // geneIds.has(geneId)
    if (geneIds.includes(geneId)) {
      count++;
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
          id: geneId,
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
    if (count === 100) {
      break;
    }
  }
};

// Main execution
(async () => {
  try {
    // const geneIds = await readGeneIDsFromFile(uploadedFilePath);
    const geneIds = await getFirstHundredGeneIds();
    // console.log(`Number of GeneIDs from the file: ${geneIds.size}`);
    await createGenesRecordsInOpenSearch(geneIds);
  } catch (error) {
    console.error("Error:", error);
  }
})();
