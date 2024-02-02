const fs = require("fs");
const path = require("path");
const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");

// Study Protein: study_protein_012924
// Study Peptide: peptide_013024
// Protein Signature: protein_signature_013024
// Protein Cluster: protein_cluster_013024
// Salivary Protein: salivary-proteins-013024

const getClient = async () => {
  const host =
    "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";

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

const getClientDevOpen = async () => {
  const host =
    "https://search-hspw-dev-open-crluksvxj4mvcgl5nopcl6ykte.us-east-2.es.amazonaws.com";

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

// ---------------------------------------------------------------------------------------------------------------

// Update Uniprot_id for study_proteins index
const updateStudyProtein = async (index, scriptName) => {
  try {
    const client = await getClient();

    const mappings = await fs
      .readFileSync("./id-mapping.tsv", "utf-8")
      .split("\n");

    // Process each file
    for (const mapping of mappings) {
      // [uniprot_accession, submitted_accession, Updated Accession]
      const ids = mapping.split("\t");

      console.log("> Ids", ids);

      const { body } = await client.updateByQuery({
        index,
        refresh: true,
        body: {
          script: {
            id: scriptName,
            params: {
              newId: ids[2],
              idAttribute: "Uniprot_id",
            },
          },
          query: {
            terms: {
              [`Uniprot_id.keyword`]: [ids[0], ids[1]],
            },
          },
        },
      });

      console.log(body);
    }
  } catch (err) {
    console.error("Error reading or processing updates:", err);
  }
};

// PUT /_scripts/update_study_protein_script
// {
//   "script": {
//     "lang": "painless",
//     "source": "ctx._source.Uniprot_id = params.newId;"
//   }
// }

// updateStudyProtein("study_protein_012924", "update_study_protein_script");

// ---------------------------------------------------------------------------------------------------------------

const updateStudyPeptide = async (index, scriptName) => {
  try {
    const client = await getClient();

    const mappings = await fs
      .readFileSync("./id-mapping.tsv", "utf-8")
      .split("\n");

    // Process each file
    for (const mapping of mappings) {
      // [uniprot_accession, submitted_accession, Updated Accession]
      const ids = mapping.split("\t");

      console.log("> Ids", ids);

      const { body } = await client.updateByQuery({
        index,
        refresh: true,
        body: {
          script: {
            id: scriptName,
            params: {
              newId: ids[2],
              idAttribute: "Uniprot_accession",
            },
          },
          query: {
            terms: {
              [`Uniprot_accession.keyword`]: [ids[0], ids[1]],
            },
          },
        },
      });

      console.log(body);
    }
  } catch (err) {
    console.error("Error reading or processing updates:", err);
  }
};

// PUT /_scripts/update_study_peptide_script
// {
//   "script": {
//     "lang": "painless",
//     "source": "ctx._source.Uniprot_accession = params.newId;"
//   }
// }

// updateStudyPeptide("peptide_013024", "update_study_peptide_script");

// ---------------------------------------------------------------------------------------------------------------

const updateProteinSignature = async (index) => {
  try {
    const client = await getClient();

    const mappings = await fs
      .readFileSync("./id-mapping.tsv", "utf-8")
      .split("\n");

    // Process each file
    for (const mapping of mappings) {
      // [uniprot_accession, submitted_accession, Updated Accession]
      const ids = mapping.split("\t");

      console.log("> Ids", ids);

      const response = await client.search({
        index,
        body: {
          query: {
            bool: {
              filter: [
                {
                  terms: {
                    "# of Members.keyword": [
                      `HSPW:${ids[0]}`,
                      `HSPW:${ids[1]}`,
                    ],
                  },
                },
              ],
            },
          },
        },
      });

      console.log(response.body.hits.hits);

      for (hit of response.body.hits.hits) {
        // Add update logic here for records found
      }
    }
  } catch (err) {
    console.error("Error reading or processing updates:", err);
  }
};

// PUT /_scripts/update_protein_signature_script
// {
//   "script": {
//     "lang": "painless",
//     "source": "ctx._source.Uniprot_accession = params.newId;"
//   }
// }

// updateProteinSignature("protein_signature_013024");

// ---------------------------------------------------------------------------------------------------------------

const updateProteinCluster = async (index) => {
  try {
    const client = await getClient();

    const mappings = await fs
      .readFileSync("./diff-mapping.tsv", "utf-8")
      .split("\n");

    // Process each file
    for (const mapping of mappings) {
      // [uniprot_accession, submitted_accession, Updated Accession]
      const ids = mapping.split("\t");

      console.log("> Ids", ids);

      const response = await client.search({
        index,
        body: {
          query: {
            bool: {
              filter: [
                {
                  terms: {
                    "cluster_members.keyword": [ids[0], ids[1]],
                  },
                },
              ],
            },
          },
        },
      });

      console.log(response.body.hits.hits);

      for (hit of response.body.hits.hits) {
        // Add update logic here for records found
      }
    }
  } catch (err) {
    console.error("Error reading or processing updates:", err);
  }
};

// PUT /_scripts/update_protein_signature_script
// {
//   "script": {
//     "lang": "painless",
//     "source": "ctx._source.Uniprot_accession = params.newId;"
//   }
// }

// updateProteinCluster("protein_cluster_013024");

// ---------------------------------------------------------------------------------------------------------------

const updateProtein = async (index) => {
  try {
    const client = await getClientDevOpen();

    const mappings = await fs
      .readFileSync("./id-mapping.tsv", "utf-8")
      .split("\n");

    // Process each file
    for (const mapping of mappings) {
      // [uniprot_accession, submitted_accession, Updated Accession]
      const ids = mapping.split("\t");

      console.log("> Ids", ids);

      // Fetch salivary protein with either of the old ids
      const response = await client.search({
        index,
        body: {
          query: {
            bool: {
              filter: [
                {
                  terms: {
                    "salivary_proteins.uniprot_accession.keyword": [
                      ids[0],
                      ids[1],
                    ],
                  },
                },
              ],
            },
          },
        },
      });

      console.log(response.body.hits.hits);

      for (hit of response.body.hits.hits) {
        // Add update logic here for records found
      }
    }
  } catch (err) {
    console.error("Error reading or processing updates:", err);
  }
};

// PUT /_scripts/update_protein_signature_script
// {
//   "script": {
//     "lang": "painless",
//     "source": "ctx._source.Uniprot_accession = params.newId;"
//   }
// }

// updateProtein("salivary-proteins-013024");

// Delete study protein with ids in delete-ids.tsv file
const deleteStudyProteins = async (index) => {
  try {
    const client = await getClient();

    const ids = await fs.readFileSync("./delete-ids.tsv", "utf-8").split("\n");

    // Ids to delete
    for (const id of ids) {
      console.log("> Id", id);

      const response = await client.deleteByQuery({
        index,
        body: {
          query: {
            bool: {
              filter: [
                {
                  terms: {
                    "Uniprot_id.keyword": [id],
                  },
                },
              ],
            },
          },
        },
      });

      console.log(response);
    }
  } catch (err) {
    console.error("Error reading or processing updates:", err);
  }
};

// deleteStudyProteins("study_protein_012924");

// ---------------------------------------------------------------------------------------------------------------

// Delete study protein with ids in delete-ids.tsv file
const deleteStudyPeptide = async (index) => {
  try {
    const client = await getClient();

    const ids = await fs.readFileSync("./delete-ids.tsv", "utf-8").split("\n");

    // Ids to delete
    for (const id of ids) {
      console.log("> Id", id);

      const response = await client.deleteByQuery({
        index,
        body: {
          query: {
            bool: {
              filter: [
                {
                  terms: {
                    "Uniprot_accession.keyword": [id],
                  },
                },
              ],
            },
          },
        },
      });

      //   console.log(response.body.hits.hits);
      console.log(response.body);
    }
  } catch (err) {
    console.error("Error reading or processing updates:", err);
  }
};

// deleteStudyPeptide("peptide_013024");

// ---------------------------------------------------------------------------------------------------------------

// Delete protein signatures with ids in delete-ids.tsv file
const deleteProteinSignature = async (index) => {
  try {
    const client = await getClient();

    const ids = await fs.readFileSync("./delete-ids.tsv", "utf-8").split("\n");

    // Ids to delete
    for (const id of ids) {
      console.log("> Id", id);

      const response = await client.deleteByQuery({
        index,
        body: {
          query: {
            bool: {
              filter: [
                {
                  terms: {
                    "# of Members.keyword": [`HSPW:${id}`],
                  },
                },
              ],
            },
          },
        },
      });

      //   console.log(response.body.hits.hits);
      console.log(response.body);
    }
  } catch (err) {
    console.error("Error reading or processing updates:", err);
  }
};

// deleteProteinSignature("protein_signature_013024");

// ---------------------------------------------------------------------------------------------------------------

// Delete protein clusters with ids in delete-ids.tsv file
const deleteProteinCluster = async (index) => {
  try {
    const client = await getClient();

    const ids = await fs.readFileSync("./delete-ids.tsv", "utf-8").split("\n");

    // Ids to delete
    for (const id of ids) {
      console.log("> Id", id);

      const response = await client.deleteByQuery({
        index,
        body: {
          query: {
            bool: {
              filter: [
                {
                  terms: {
                    "uniprot_id.keyword": [id],
                  },
                },
              ],
            },
          },
        },
      });

      //   console.log(response.body.hits.hits);
      console.log(response.body);
    }
  } catch (err) {
    console.error("Error reading or processing updates:", err);
  }
};

// deleteProteinCluster("protein_cluster_013024");

// ---------------------------------------------------------------------------------------------------------------

// Delete salivary protein with ids in delete-ids.tsv file
const deleteSalivaryProtein = async (index) => {
  try {
    const client = await getClientDevOpen();

    const ids = await fs.readFileSync("./delete-ids.tsv", "utf-8").split("\n");

    // Ids to delete
    for (const id of ids) {
      console.log("> Id", id);

      const response = await client.deleteByQuery({
        index,
        body: {
          query: {
            bool: {
              filter: [
                {
                  terms: {
                    "salivary_proteins.uniprot_accession.keyword": [id],
                  },
                },
              ],
            },
          },
        },
      });

      console.log(response.body);
    }
  } catch (err) {
    console.error("Error reading or processing updates:", err);
  }
};

// deleteSalivaryProtein("salivary-proteins-013024");
