const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");

const { ids } = require("./input-ids"); // Just a string array of ids

const SALIVARY_PROTEIN_INDEX = "salivary-proteins-011124";
const STUDY_PROTEIN_INDEX = "study_protein";
const STUDY_INDEX = "study";

const DEV_TWO_OS =
  "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";

const DEV_OPEN_OS =
  "https://search-hspw-dev-open-crluksvxj4mvcgl5nopcl6ykte.us-east-2.es.amazonaws.com";

const getDevTwoClient = async () => {
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
    node: DEV_TWO_OS,
  });
};

const getDevOpenClient = async () => {
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
    node: DEV_OPEN_OS,
  });
};

// Mapping of tissue name to accession id
const tissueToAccession = {
  "parotid gland": "BTO:0001004",
  "sublingual gland": "BTO:0001315",
  "submandibular gland": "BTO:0001316",
  saliva: "BTO:0001202",
  plasma: "BTO:0000131",
};

// Ids that returned no study proteins for calculating
const noStudyProteins = [];

/**
 * Returns salivary protein with the given uniprotId
 * @param {string} uniprotId Uniprot Id of Salivary protein to fetch
 * @param {object} client OpenSearch Client from where to fetch the protein data
 * @param {boolean} debug If true, log out data for debugging, false by default
 * @returns The salivary protein record that matches the uniprot id passed in
 */
const getSalivaryProteinById = async (uniprotId, client, debug = false) => {
  const payload = {
    index: SALIVARY_PROTEIN_INDEX,
    body: {
      track_total_hits: true,
      query: {
        match: {
          _id: {
            query: uniprotId,
          },
        },
      },
      // Update _source if you need other fields returned from records
      _source: [
        "salivary_proteins.uniprot_accession",
        "salivary_proteins.uniprot_secondary_accession",
        "salivary_proteins.alternative_products_isoforms",
      ],
    },
  };

  const response = await client.search(payload);

  if (debug) {
    console.log("\n> Salivary Protein Query\n", JSON.stringify(payload.body));
  }

  const { hits } = response.body.hits;

  if (hits.length !== 0) {
    return response.body.hits.hits[0];
  }

  return {};
};

/**
 * Returns list of sample proteins for the uniprot ids passed in
 * @param {string[]} uniprotIds String array of uniprot ids to look for
 * @param {object} client OpenSearch Client used for query
 * @param {boolean} debug Console log statements for debugging, false by default
 */
const getStudyProteinForProtein = async (uniprotIds, client, debug = false) => {
  const payload = {
    index: STUDY_PROTEIN_INDEX,
    body: {
      size: 10000,
      track_total_hits: true,
      query: {
        bool: {
          must: [
            {
              terms: {
                "Uniprot_id.keyword": uniprotIds,
              },
            },
          ],
        },
      },
      // Update _source if you need other fields returned from records
      _source: [
        "Uniprot_id",
        "experiment_protein_count",
        "experiment_peptide_count",
        "abundance",
        "peptide_count",
        "abundance_cleavages",
        "peptide_cleavages",
        "protein_sequence_length",
        "experiment_id_key",
      ],
    },
  };

  const response = await client.search(payload);
  const { hits, total } = response.body.hits;

  if (debug) {
    console.log(
      "\n> Index: study_protein, Total Study Proteins found:\n",
      total
    );
    console.log("\n> Study Proteins Query:\n", JSON.stringify(payload.body));
  }

  return { totalCount: total.value, hits: hits.map((rec) => rec._source) };
};

/**
 * Returns experiment data for all experiment ids passed in
 * @param {string[]} experimentIds List of experiment ids to fetch
 * @param {object} client OpenSearch Client used for query
 * @param {boolean} debug Console log statements for debugging, false by default
 */
const getStudy = async (experimentIds, client, debug = false) => {
  const queryArray = experimentIds.map((id) => {
    return {
      term: {
        experiment_id_key: id,
      },
    };
  });

  const payload = {
    index: STUDY_INDEX,
    body: {
      size: 10000,
      track_total_hits: true,
      query: {
        bool: {
          filter: {
            bool: {
              should: queryArray,
            },
          },
        },
      },
      // Update _source if you need other fields returned from records
      _source: [
        "bto_ac",
        "bto_term_list",
        "experiment_peptide_count",
        "experiment_protein_count",
        "condition_type",
        "experiment_id_key",
      ],
    },
  };

  const response = await client.search(payload);
  const { hits, total } = response.body.hits;

  if (debug) {
    console.log("\n> Index: study, Total:\n", total);
    console.log("\n> Study Query:\n", JSON.stringify(payload.body));
  }

  return { totalCount: total.value, hits: hits.map((rec) => rec._source) };
};

/**
 * Return aggregates for tissue type of all study data
 * @param {object} client OpenSearch Client used for query
 */
const getTissueExperimentCounts = async (client) => {
  const payload = {
    index: "study",
    body: {
      track_total_hits: true,
      size: 0,
      query: {
        match_all: {},
      },
      aggs: {
        tissueStudyCount: {
          terms: {
            field: "bto_term_list.keyword",
            size: 100,
          },
        },
      },
    },
  };

  const response = await client.search(payload);
  const { aggregations } = response.body;
  const tissueToCount = {};

  for (const tissueType of aggregations.tissueStudyCount.buckets) {
    const { key, doc_count } = tissueType;

    const tissue = key.toLowerCase();

    if (tissueToCount[tissue]) {
      tissueToCount[tissue] += doc_count;
    } else {
      tissueToCount[tissue] = doc_count;
    }
  }

  return tissueToCount;
};

/**
 * Calculates and gathers abundance data for a single protein
 * @param {string} proteinId Uniprot ID of protein
 * @param {object} tissueStudyCounts Object containing aggregates for different tissue studies
 * @param {boolean} debug Console log statements for debugging, false by default
 */
const runCalculation = async (proteinId, tissueStudyCounts, debug = false) => {
  const proteinIds = new Set([proteinId]);
  const experimentIdToDataMap = {};
  const experimentByType = {};
  const results = {};

  // Get OpenSearch Clients
  const client = await getDevTwoClient();
  const devOpen = await getDevOpenClient();

  if (debug) console.log("> Protein ID", proteinId);

  // Get aggregate for all the different experiment type counts (Eg: {'parotid gland': 345, saliva: 344 ...})
  // const tissueStudyCounts = await getTissueExperimentCounts(client);

  // Get Protein Record from Salivary Protein index
  const proteinData = await getSalivaryProteinById(proteinId, devOpen, debug);

  const {
    uniprot_accession,
    uniprot_secondary_accession,
    alternative_products_isoforms,
  } = proteinData._source.salivary_proteins;

  // Check if protein has any secondary accessions if present add
  if (uniprot_secondary_accession) {
    uniprot_secondary_accession.forEach((id) => proteinIds.add(id));
  }

  if (debug) {
    console.log("\n> Protein Data:\n", JSON.stringify(proteinData));
    console.log(`\n> Primary Accessions\n`, uniprot_accession);
    console.log(`\n> Secondary Accessions:\n`, uniprot_secondary_accession);
    console.log(`\n> Protein Ids\n`, proteinIds);
  }

  // Get all records from study_protein index that have the given accession ids
  const studyProteinData = await getStudyProteinForProtein(
    [...proteinIds],
    client,
    debug
  );

  // Get all experiment ids from study proteins returned above
  const experimentIds = studyProteinData.hits.map(
    (rec) => rec.experiment_id_key
  );

  // Get a list of the unique experiment ids
  const uniqueExperimentIds = new Set(experimentIds);

  // Fetch study data (from study index) for all of the experiments
  const experimentData = await getStudy(
    [...uniqueExperimentIds],
    client,
    debug
  );

  if (debug) {
    console.log(`\n> Tissue Study Counts\n`, tissueStudyCounts);
    console.log(`\n> Study Proteins:\n`, JSON.stringify(studyProteinData));
    console.log(`\n> Total Unique Experiments:\n`, uniqueExperimentIds.size);
    console.log(`\n> Experiment Ids:\n`, JSON.stringify(experimentIds));
    console.log(
      `\n> Experiment (Study) Data:\n`,
      JSON.stringify(experimentData)
    );
  }

  // Create mapping of experiment_key_id to experiment data
  // E.g {"experiment_key_id": {...experiment data...}, ...}
  for (const experiment of experimentData.hits) {
    const { experiment_id_key, bto_term_list } = experiment;
    const experimentType = bto_term_list[0].toLowerCase();

    // Map experiment to experiment id
    experimentIdToDataMap[experiment_id_key] = experiment;

    // Map experiment to experiment type
    if (experimentByType[experimentType]) {
      experimentByType[experimentType].push(experiment);
    } else {
      experimentByType[experimentType] = [experiment];
    }
  }

  if (debug) {
    console.log("> ------------------------------");
    console.log(`\n> Experiment by Type:\n`, experimentByType);
    console.log("> ------------------------------");
  }

  for (const studyProtein of studyProteinData.hits) {
    const {
      experiment_id_key, // experiment_ac
      Uniprot_id, // protein_ac
      peptide_count, // peptide_count
      peptide_cleavages, // num_cleavage
      abundance_cleavages, // abundance
    } = studyProtein;

    const { condition_type, bto_term_list } =
      experimentIdToDataMap[experiment_id_key];

    const factor =
      Number(peptide_count) /
      Number(peptide_cleavages) /
      Number(abundance_cleavages);

    const tissue = bto_term_list[0].toLowerCase();

    const disease =
      condition_type === "" || condition_type.toLowerCase() === "healthy"
        ? "disease free"
        : condition_type.toLowerCase();

    if (
      // results[Uniprot_id]?.[bto_term_list[0]]?.[condition_type]?.[peptide_count]
      results[Uniprot_id] &&
      results[Uniprot_id][tissue] &&
      results[Uniprot_id][tissue][disease] &&
      results[Uniprot_id][tissue][disease]["peptideCount"]
    ) {
      const { peptideCount, normalizedPeptideCount, abundanceScalingFactor } =
        results[Uniprot_id][tissue][disease];

      results[Uniprot_id][tissue][disease]["experimentIds"].push(
        experiment_id_key
      );

      results[Uniprot_id][tissue][disease] = {
        ...results[Uniprot_id][tissue][disease],
        peptideCount: Number(peptideCount) + Number(peptide_count),
        normalizedPeptideCount:
          Number(normalizedPeptideCount) +
          Number(peptide_count) / Number(peptide_cleavages),
        abundanceScalingFactor: Number(abundanceScalingFactor) + Number(factor),
      };
      // }
    } else {
      if (debug) {
        console.log(
          "> Number(peptide_count)",
          Number(peptide_count),
          "  Number(peptide_cleavages)",
          Number(peptide_cleavages),
          "Number(peptide_count) / Number(peptide_cleavages),",
          Number(peptide_count) / Number(peptide_cleavages)
        );
      }

      const initialData = {
        peptideCount: Number(peptide_count),
        normalizedPeptideCount:
          Number(peptide_count) / Number(peptide_cleavages),
        abundanceScalingFactor: Number(factor),
        experimentIds: [experiment_id_key],
      };

      if (!results[Uniprot_id]) {
        results[Uniprot_id] = {};
      }

      if (!results[Uniprot_id][tissue]) {
        results[Uniprot_id][tissue] = {};
      }

      results[Uniprot_id][tissue][disease] = initialData;
    }

    if (debug) {
      console.log("\n> Study Protein:\n", studyProtein);

      console.log(
        "\n> Experiment Mapped to Study:\n",
        experimentIdToDataMap[experiment_id_key]
      );

      console.log(
        `\n> Calculating Factor. Peptide Count: ${peptide_count}, Peptide Cleavage: ${peptide_cleavages}, Abundance Cleavage: ${abundance_cleavages}, Calculated Factor: ${factor}\n`
      );

      console.log("> ------------------------------");
    }
  }

  const records = [];

  if (!results[proteinId]) {
    // For proteins with no study protein data
    noStudyProteins.push(proteinId);

    records.push({
      tissue_id: "N/A",
      tissue_term: "N/A",
      disease_state: "N/A",
      isoform: [],
      experiment_count: 0,
      peptide_count: 0,
      abundance_score: 0,
      uniprot_id: proteinId,
    });
  } else {
    for (const tissue of Object.keys(results[proteinId])) {
      for (const condition of Object.keys(results[proteinId][tissue])) {
        const {
          normalizedPeptideCount,
          abundanceScalingFactor,
          experimentIds,
          peptideCount,
        } = results[proteinId][tissue][condition];

        const experimentCount = experimentIds.length;
        let abundance = 0;
        let scalingFactor = abundanceScalingFactor;
        let tissueExperimentCount = tissueStudyCounts[tissue];

        if (scalingFactor > 0) {
          scalingFactor =
            (scalingFactor / experimentCount) * tissueExperimentCount;

          abundance = (
            (1000000 * normalizedPeptideCount) /
            scalingFactor
          ).toFixed(2);

          results[proteinId][tissue][condition]["abundance"] = abundance;

          if (debug) {
            console.log("\n> Record", results[proteinId][tissue][condition]);

            console.log(
              "\n> Scaling Factor:",
              scalingFactor,
              " Experiment Count: ",
              experimentCount,
              " Tissue Experiment Count: ",
              tissueExperimentCount
            );

            console.log(
              "> ",
              (scalingFactor / experimentCount) * tissueExperimentCount
            );

            console.log("\n> Abundance:\n", abundance);
          }

          const record = {
            tissue_id: tissueToAccession[tissue],
            tissue_term: tissue === "plasma" ? "blood plasma" : tissue,
            disease_state: condition,
            isoform: alternative_products_isoforms,
            experiment_count: experimentCount,
            peptide_count: peptideCount,
            abundance_score: Number(abundance),
            uniprot_id: proteinId,
          };

          records.push(record);
        }
      }
    }
  }

  if (debug) {
    console.log(`\n> Results:\n`, JSON.stringify(results));
    console.log(`\n> Records:\n`, JSON.stringify(records));
  }

  return records;
};

const uploadRecords = async (records, client, indexName) => {
  try {
    const body = records.flatMap((doc) => [
      { index: { _index: indexName } },
      doc,
    ]);

    console.log("> Upload Body", body);

    const { body: bulkResponse } = await client.bulk({ body });

    if (bulkResponse.errors) {
      bulkResponse.items.forEach((item) => {
        if (item.index.error) {
          console.error(
            `Failed to index document: ${item.index._id}, Error: ${item.index.error}`
          );
        }
      });
    } else {
      console.log(
        `Successfully uploaded ${records.length} records to ${indexName}`
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const calculateAndLoadAbundances = async (id, tissueStudyCounts) => {
  const client = await getDevTwoClient(); // OS Domain to index to
  const recs = await runCalculation(id, tissueStudyCounts, false);
  console.log("\n> Recs\n", recs, "\n");
  await uploadRecords(recs, client, "study_peptide_abundance_012424");
};

const calculateAllAbundances = async () => {
  const client = await getDevTwoClient();

  // Get aggregate for all the different experiment type counts (Eg: {'parotid gland': 345, saliva: 344 ...})
  const tissueStudyCounts = await getTissueExperimentCounts(client);

  const proteinIds = ids;

  const idBatches = [];

  while (proteinIds.length > 0) {
    const batchSize = 10;
    idBatches.push(proteinIds.splice(0, batchSize));
  }

  // Process batches sequentially
  for (const batch of idBatches) {
    await processBatch(batch, tissueStudyCounts);
  }
};

// Process a single batch of ids in parallel
async function processBatch(batch, tissueStudyCounts) {
  const promises = batch.map(async (id) => {
    return calculateAndLoadAbundances(id, tissueStudyCounts);
  });

  // Wait for all Promises in the batch to resolve
  return Promise.all(promises);
}

// rm output.txt && node abundance.js >> output.txt
calculateAllAbundances();

const salivaryProteinUniprotId = "P01036";
// calculateAndLoadAbundances(salivaryProteinUniprotId);
// For Testing: rm abundance.output.txt && node abundance.js >> abundance.output.txt
