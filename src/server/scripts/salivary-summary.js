const fs = require("fs");
const path = require("path");
const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");

const proteinAtlasData = require("./proteinatlas.json");

const ids = require("./salivary-summary-ids");

const getClient = async (host) => {
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

const parseProteinAtlasDataFile = () => {
  const neededData = {};

  for (const protein of proteinAtlasData) {
    // console.log("> Protein", protein);
    let specificity = "";

    const {
      Uniprot,
      "RNA tissue specificity": specificity_score,
      "RNA tissue specific nTPM": specificityTissues,
      "Blood concentration - Conc. blood MS [pg/L]": plasmaVal,
    } = protein;

    const tissuesPresent = specificityTissues
      ? Object.keys(specificityTissues)
      : [];

    // If only contains salivary gland specificity is 1,
    // If there are other tissues including salivary gland specificity is 2
    if (tissuesPresent.includes("salivary gland")) {
      if (tissuesPresent.length === 1) {
        specificity = 1;
      } else {
        specificity = 2;
      }
    }

    neededData[Uniprot] = {
      specificity,
      specificity_score,
      plasma_abundance: plasmaVal ? Number(Math.log(plasmaVal).toFixed(2)) : 0,
    };
  }

  return neededData;
};

const getAbundanceData = async (id) => {
  const host =
    "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";

  try {
    const client = await getClient(host);

    const { body } = await client.search({
      index: "study_peptide_abundance_020124",
      body: {
        query: {
          bool: {
            filter: [
              {
                term: {
                  "uniprot_id.keyword": id,
                },
              },
              {
                term: {
                  "disease_state.keyword": "disease free",
                },
              },
            ],
          },
        },
      },
    });

    return body.hits.hits;
  } catch (err) {
    console.log("> Err (abundance)", err);
    console.log("> Id", id);
  }
};

const getExpertOpinion = async (id) => {
  const host =
    "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";

  try {
    const client = await getClient(host);

    const { body } = await client.search({
      index: "salivary_summary",
      body: {
        track_total_hits: true,
        query: {
          bool: {
            filter: [
              {
                term: {
                  "uniprot_accession.keyword": id,
                },
              },
            ],
          },
        },
        _source: ["expert_opinion"],
      },
    });

    return body.hits.hits[0]._source.expert_opinion;
  } catch (err) {
    console.log("> Id (get expert opinion)", id);
  }
};

const getSalivaryProteinData = async (id) => {
  const host =
    "https://search-hspw-dev-open-crluksvxj4mvcgl5nopcl6ykte.us-east-2.es.amazonaws.com";

  try {
    const client = await getClient(host);

    const { body } = await client.search({
      index: "salivary-proteins-013024",
      body: {
        track_total_hits: true,
        query: {
          bool: {
            filter: [
              {
                term: {
                  "salivary_proteins.uniprot_accession.keyword": id,
                },
              },
            ],
          },
        },
        _source: [
          "salivary_proteins.gene_symbol",
          "salivary_proteins.protein_name",
          "salivary_proteins.ihc",
          "salivary_proteins.atlas",
        ],
      },
    });

    return body.hits.hits;
  } catch (err) {
    console.log(err);
    console.log("> Id", id);
  }
};

const createSalivarySummary = async (uniprot_id, parsedProteinAtlasData) => {
  const summary = {
    uniprot_accession: uniprot_id,
    "sm/sl_peptide_count": 0,
    "sm/sl_abundance": 0,
    saliva_peptide_count: 0,
    saliva_abundance: 0,
    parotid_gland_peptide_count: 0,
    parotid_gland_abundance: 0,
    EV_abundance: "",
    mRNA: "",
    ...parsedProteinAtlasData[uniprot_id],
  };

  try {
    console.log("> Id", uniprot_id);

    const [abundanceData, salivaryProteinData, expert_opinion] =
      await Promise.all([
        getAbundanceData(uniprot_id),
        getSalivaryProteinData(uniprot_id).then((res) => {
          if (res.length === 1) {
            return res[0]._source.salivary_proteins;
          } else {
            return undefined;
          }
        }),
        getExpertOpinion(uniprot_id),
      ]);

    const { atlas, ihc, protein_name, gene_symbol } = salivaryProteinData;

    summary["IHC"] = ihc;
    summary["Protein Name"] = protein_name;
    summary["expert_opinion"] = expert_opinion;

    const gene = gene_symbol.split(";");

    if (gene.length === 1) {
      summary["Gene Symbol"] = gene[0];
    } else {
      summary["Gene Symbol"] = gene[1];
    }

    const atlasSalivaryGland = atlas.filter(
      (rec) => rec.tissue === "salivary gland"
    );

    summary["mRNA"] =
      atlasSalivaryGland.length === 1 ? Number(atlasSalivaryGland[0].nx) : 0;

    for (const rec of abundanceData) {
      const { tissue_term, peptide_count, abundance_score } = rec._source;

      if (
        tissue_term === "submandibular gland" ||
        tissue_term === "sublingual gland"
      ) {
        summary["sm/sl_peptide_count"] = peptide_count;
        summary["sm/sl_abundance"] = abundance_score;
      } else if (tissue_term === "saliva") {
        summary["saliva_peptide_count"] = peptide_count;
        summary["saliva_abundance"] = abundance_score;
      } else if (tissue_term === "parotid gland") {
        summary["parotid_gland_peptide_count"] = peptide_count;
        summary["parotid_gland_abundance"] = abundance_score;
      }
    }
  } catch (err) {
    console.log("Failed for", uniprot_id);
  }

  console.log("> Summary", summary);
  return summary;
};

function saveToFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Data saved to ${filename}`);
}

const processSalivarySummary = async () => {
  const parsedProteinAtlasData = parseProteinAtlasDataFile();
  const summaryData = [];
  const idBatches = [];

  while (ids.length > 0) {
    const batchSize = 20;
    idBatches.push(ids.splice(0, batchSize));
  }

  // Process batches sequentially
  for (const batch of idBatches) {
    const data = await processBatch(batch, parsedProteinAtlasData);
    summaryData.push(...data);
  }

  saveToFile("salivary-summary.json", summaryData);
};

// Process a single batch of ids in parallel
async function processBatch(batch, parsedProteinAtlasData) {
  const promises = batch.map(async (id) => {
    return createSalivarySummary(id, parsedProteinAtlasData);
  });

  // Wait for all Promises in the batch to resolve
  return Promise.all(promises);
}

processSalivarySummary();
