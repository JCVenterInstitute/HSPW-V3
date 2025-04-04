const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const path = require("path");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const { processGroupData } = require("./utils/processGroupData");
const { processFile } = require("./utils/processFile");
const { s3Download, checkFileExists } = require("./utils/s3Download");
const { formQuery } = require("./utils/formQuery");
const { generatePresignedUrls } = require("./utils/generatePresignedUrls");
const { createContact } = require("./utils/createContact");
const { getSSMParameter } = require("./utils/utils");
const { sendSupportEmail } = require("./utils/sendSupportEmail");
const salivaryProteinRouter = require("./routes/salivaryProteinRouter");
const proteinClusterRouter = require("./routes/proteinClusterRouter");

const app = express();
app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(express.static("build"));
app.use("/static", express.static(path.join(__dirname, "./build/static")));
app.use("/doc", express.static(path.join(__dirname, "./documentation/")));

app.use("/api/salivary-proteins", salivaryProteinRouter);

app.use("/api/protein-cluster", proteinClusterRouter);

const host = process.env.OS_HOSTNAME;

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

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({ region: "us-east-2" });
const docClient = DynamoDBDocumentClient.from(ddbClient);

/*****************************
 * Salivary Proteins Endpoints
 *****************************/

async function queryProteins(size, from, filter, sort = null, keyword = null) {
  const client = await getClient();

  const payload = {
    index: process.env.INDEX_SALIVARY_PROTEIN,
    body: {
      track_total_hits: true,
      size: size,
      from: from,
      query: {
        bool: {
          should: [...filter],
        },
      },
      ...(sort && { sort }), // Apply sort if present
    },
  };

  const response = await client.search(payload);

  return response.body;
}

// Used by Protein Search to get back matches to a list of salivary protein ids
app.post("/api/proteins/:size/:from/", (req, res) => {
  const { filters, sort, keyword } = req.body;
  const { size, from } = req.params;

  const results = queryProteins(size, from, filters, sort, keyword);

  results.then((result) => {
    res.json(result);
  });
});

/****************
 * Gene Endpoints
 ****************/

async function getGeneById(id) {
  var client = await getClient();

  var query = {
    query: {
      bool: {
        filter: [
          {
            term: {
              "GeneID.keyword": id,
            },
          },
        ],
      },
    },
  };

  var response = await client.search({
    index: process.env.INDEX_GENE,
    body: query,
  });

  return response.body.hits.hits;
}

app.get("/genes/:id", (req, res) => {
  let a = getGeneById(req.params.id);

  a.then(function (result) {
    res.json(result);
  });
});

async function queryGenes(size, from, filter, sort = null, keyword = null) {
  const client = await getClient();

  const payload = {
    index: process.env.INDEX_GENE,
    body: {
      track_total_hits: true,
      size: size,
      from: from,
      query: {
        bool: {
          ...(filter && { filter }),
          ...(keyword && { must: [keyword] }), // Apply global search if present
        },
      },
      ...(sort && { sort }), // Apply sort if present
    },
  };

  const response = await client.search(payload);

  return response.body;
}

// Used by Gene Browse Page table
app.post("/api/genes/:size/:from/", (req, res) => {
  const { filters, sort, keyword } = req.body;
  const { size, from } = req.params;

  const results = queryGenes(size, from, filters, sort, keyword);

  results.then((result) => {
    res.json(result);
  });
});

/*****************************
 * Protein Signature Endpoints
 *****************************/

async function getProteinSignatureById(id) {
  var client = await getClient();

  var query = {
    query: {
      bool: {
        filter: [
          {
            term: {
              "InterPro ID.keyword": id,
            },
          },
        ],
      },
    },
  };

  var response = await client.search({
    index: process.env.INDEX_PROTEIN_SIGNATURE,
    body: query,
  });

  return response.body.hits.hits;
}

app.get("/api/protein-signature/:id", (req, res) => {
  let a = getProteinSignatureById(req.params.id);

  a.then(function (result) {
    res.json(result);
  });
});

async function queryProteinSignature(
  size,
  from,
  filter,
  sort = null,
  keyword = null
) {
  const client = await getClient();

  const payload = {
    index: process.env.INDEX_PROTEIN_SIGNATURE,
    body: {
      track_total_hits: true,
      size: size,
      from: from,
      query: {
        bool: {
          ...(filter && { filter }),
          ...(keyword && { must: [keyword] }), // Apply global search if present
        },
      },
      ...(sort && { sort }), // Apply sort if present
      aggs: {
        Type: {
          terms: {
            field: "Type.keyword",
          },
        },
      },
    },
  };

  const response = await client.search(payload);

  return response.body;
}

// Used by Protein Signature Browse page table
app.post("/api/protein-signature/:size/:from/", (req, res) => {
  const { filters, sort, keyword } = req.body;
  const { size, from } = req.params;

  const results = queryProteinSignature(size, from, filters, sort, keyword);

  results.then((result) => {
    res.json(result);
  });
});

/********************
 * Citation Endpoints
 ********************/

async function getCitationById(index, id) {
  var client = await getClient();

  var query = {
    query: {
      match: {
        "PubMed_ID.keyword": id,
      },
    },
  };

  var response = await client.search({
    index: index,
    body: query,
  });
  return response.body.hits.hits;
}

app.get("/api/citation/:id", (req, res) => {
  let a = getCitationById(process.env.INDEX_CITATION, req.params.id);

  a.then(function (result) {
    res.json(result);
  });
});

async function queryCitationData(
  size,
  from,
  filter,
  sort = null,
  keyword = null
) {
  const client = await getClient();

  const returnFields = ["PubMed_ID", "PubDate", "Title", "journal_title"];

  const payload = {
    index: process.env.INDEX_CITATION,
    body: {
      track_total_hits: true,
      size: size,
      from: from,
      query: {
        bool: {
          ...(filter && { filter }),
          ...(keyword && { must: [keyword] }), // Apply global search if present
        },
      },
      ...(sort && { sort }), // Apply sort if present
      _source: returnFields,
    },
  };

  console.log("> payload", JSON.stringify(payload.body));

  const response = await client.search(payload);

  return response.body;
}

// Used by Citation Browse page table
app.post("/api/citations/:size/:from/", (req, res) => {
  const { filters, sort, keyword } = req.body;
  const { size, from } = req.params;

  const results = queryCitationData(size, from, filters, sort, keyword);

  results.then((result) => {
    res.json(result);
  });
});

/******************************
 * For Homepage Chord Component
 ******************************/

async function getCount() {
  var client = await getClient();

  const response = await client.search({
    index: process.env.INDEX_SALIVARY_SUMMARY, // Replace with your index name
    body: {
      size: 0,
      aggs: {
        filter_whole_saliva: {
          filter: {
            bool: {
              must: [{ range: { saliva_abundance: { gt: 0 } } }],
            },
          },
        },
        filter_whole_saliva_only: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { gt: 0 } } },
                { range: { "sm/sl_abundance": { lte: 0 } } },
                { range: { plasma_abundance: { lte: 0 } } },
                { range: { parotid_gland_abundance: { lte: 0 } } },
              ],
            },
          },
        },
        filter_smsl_glands: {
          filter: {
            bool: {
              must: [{ range: { "sm/sl_abundance": { gt: 0 } } }],
            },
          },
        },
        filter_smsl_glands_only: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { lte: 0 } } },
                { range: { "sm/sl_abundance": { gt: 0 } } },
                { range: { plasma_abundance: { lte: 0 } } },
                { range: { parotid_gland_abundance: { lte: 0 } } },
              ],
            },
          },
        },
        filter_blood_plasma: {
          filter: {
            bool: {
              must: [{ range: { plasma_abundance: { gt: 0 } } }],
            },
          },
        },
        filter_blood_plasma_only: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { lte: 0 } } },
                { range: { "sm/sl_abundance": { lte: 0 } } },
                { range: { plasma_abundance: { gt: 0 } } },
                { range: { parotid_gland_abundance: { lte: 0 } } },
              ],
            },
          },
        },
        filter_parotid_glands: {
          filter: {
            bool: {
              must: [{ range: { parotid_gland_abundance: { gt: 0 } } }],
            },
          },
        },
        filter_parotid_glands_only: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { lte: 0 } } },
                { range: { "sm/sl_abundance": { lte: 0 } } },
                { range: { plasma_abundance: { lte: 0 } } },
                { range: { parotid_gland_abundance: { gt: 0 } } },
              ],
            },
          },
        },
        filter_whole_saliva_and_smsl_glands: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { gt: 0 } } },
                { range: { "sm/sl_abundance": { gt: 0 } } },
              ],
            },
          },
        },
        filter_whole_saliva_and_blood_plasma: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { gt: 0 } } },
                { range: { plasma_abundance: { gt: 0 } } },
              ],
            },
          },
        },
        filter_whole_saliva_and_parotid_glands: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { gt: 0 } } },
                { range: { parotid_gland_abundance: { gt: 0 } } },
              ],
            },
          },
        },
        filter_smsl_glands_and_blood_plasma: {
          filter: {
            bool: {
              must: [
                { range: { "sm/sl_abundance": { gt: 0 } } },
                { range: { plasma_abundance: { gt: 0 } } },
              ],
            },
          },
        },
        filter_smsl_glands_and_parotid_glands: {
          filter: {
            bool: {
              must: [
                { range: { "sm/sl_abundance": { gt: 0 } } },
                { range: { parotid_gland_abundance: { gt: 0 } } },
              ],
            },
          },
        },
        filter_blood_plasma_and_parotid_glands: {
          filter: {
            bool: {
              must: [
                { range: { plasma_abundance: { gt: 0 } } },
                { range: { parotid_gland_abundance: { gt: 0 } } },
              ],
            },
          },
        },
      },
    },
  });

  return response.body.aggregations;
}

app.get("/api/getChordPlotCount", (req, res) => {
  getCount().then((result) => res.json(result));
});

/*******************
 * Go Node Endpoints
 *******************/

const searchGoNodesType = async (type) => {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: 10000,
    query: {
      query_string: {
        query: `*type*`,
        fields: [],
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_GO_NODES,
    body: query,
  });
  return response.body.hits.hits;
};

app.get("/api/go-nodes-type/:type", (req, res) => {
  let a = searchGoNodesType(req.params.type);
  a.then(function (result) {
    res.json(result);
  });
});

const searchGoNodes = async (id) => {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: 10000,
    query: {
      query_string: {
        default_field: "id",
        query: id,
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_GO_NODES,
    body: query,
  });
  return response.body.hits.hits;
};

app.get("/api/go-nodes/:id", (req, res) => {
  let a = searchGoNodes(req.params.id);
  a.then(function (result) {
    res.json(result);
  });
});

const searchGoEdges = async (id) => {
  var client = await getClient();

  var query = {
    size: 10000,
    query: {
      query_string: {
        query: `*GO*${id}*`,
        fields: [],
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_GO_EDGES,
    body: query,
  });

  return response.body.hits.hits;
};

app.get("/api/go-edges/:id", (req, res) => {
  let a = searchGoEdges(req.params.id);
  a.then(function (result) {
    res.json(result);
  });
});

const searchGoNodesUsage = async (id) => {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: 10000,
    _source: ["id"],
    query: {
      query_string: {
        query: `*GO*${id}*`,
        fields: [],
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_SALIVARY_PROTEIN,
    body: query,
  });
  return response.body.hits.hits;
};

app.get("/api/go-nodes-usage/:id", (req, res) => {
  let a = searchGoNodesUsage(req.params.id);
  a.then(function (result) {
    res.json(result);
  });
});

/******************
 * Study Endpoints
 *****************/

const searchAllStudy = async () => {
  // Initialize the client.
  const client = await getClient();

  const query = {
    size: 10000,
    query: {
      match_all: {},
    },
    aggs: {
      sample_type: {
        terms: {
          field: "sample_type.keyword",
        },
      },
      institution: {
        terms: {
          field: "institution.keyword",
        },
      },
      condition_type: {
        terms: {
          field: "condition_type.keyword",
        },
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_STUDY,
    body: query,
  });

  return response.body;
};

app.get("/api/study/", async (req, res) => {
  searchAllStudy().then((response) => {
    res.json(response);
  });
});

const searchStudy = async (id) => {
  // Initialize the client.
  const client = await getClient();

  const query = {
    size: 10000,
    query: {
      query_string: {
        default_field: "experiment_id_key",
        query: id,
      },
    },
    aggs: {
      sample_type: {
        terms: {
          field: "sample_type.keyword",
        },
      },
      institution: {
        terms: {
          field: "institution.keyword",
        },
      },
      condition_type: {
        terms: {
          field: "condition_type.keyword",
        },
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_STUDY,
    body: query,
  });

  return response.body.hits.hits;
};

app.get("/api/study/:id", async (req, res) => {
  searchStudy(req.params.id).then((response) => {
    res.json(response);
  });
});

// Used for Cluster Details page
const bulkStudySearch = async (ids) => {
  // Initialize the client.
  const client = await getClient();

  const query = {
    size: 10000,
    query: {
      terms: {
        experiment_id_key: ids,
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_STUDY,
    body: query,
  });

  return response.body.hits.hits;
};

app.post("/api/study/", async (req, res) => {
  bulkStudySearch(req.body.ids).then((response) => {
    res.json(response);
  });
});

/*************************
 * Study Protein Endpoints
 ************************/

const searchStudyProtein = async (experiment_id_key) => {
  // Initialize the client.
  const client = await getClient();

  const query = {
    size: 10000,
    query: {
      query_string: {
        default_field: "experiment_id_key",
        query: experiment_id_key,
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_STUDY_PROTEIN,
    body: query,
  });

  return response.body.hits.hits;
};

app.get("/api/study-protein/:id", async (req, res) => {
  searchStudyProtein(req.params.id).then((response) => {
    res.json(response);
  });
});

const searchStudyProteinUniprot = async (uniprot_id) => {
  // Initialize the client.
  const client = await getClient();

  const query = {
    size: 10000,
    query: {
      query_string: {
        default_field: "Uniprot_id",
        query: uniprot_id,
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_STUDY_PROTEIN,
    body: query,
  });

  return response.body.hits.hits;
};

app.get("/api/study-protein-uniprot/:id", async (req, res) => {
  searchStudyProteinUniprot(req.params.id).then((response) => {
    res.json(response);
  });
});

// Used for Cluster Details page
const bulkStudyProteins = async (ids) => {
  // Initialize the client.
  const client = await getClient();

  const query = {
    size: 10000,
    query: {
      terms: {
        ["Uniprot_id.keyword"]: ids,
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_STUDY_PROTEIN,
    body: query,
  });

  return response.body.hits.hits;
};

app.post("/api/study-protein/", async (req, res) => {
  bulkStudyProteins(req.body.ids).then((response) => {
    res.json(response);
  });
});

/**********************************
 * For Protein Signature Pie Chart
 *********************************/

async function getProteinSignatureTypeCounts() {
  var client = await getClient();

  const response = await client.search({
    index: process.env.INDEX_PROTEIN_SIGNATURE,
    body: {
      size: 0,
      aggs: {
        langs: {
          terms: { field: "Type.keyword", size: 500 },
        },
      },
    },
  });
  return response.body.aggregations.langs.buckets;
}

app.get("/api/signature-type-counts/", (req, res) => {
  let a = getProteinSignatureTypeCounts();
  a.then(function (result) {
    res.json(result);
  });
});

/*************************
 * For Gene Page Bar Graph
 *************************/

async function getGeneLocationCounts() {
  var client = await getClient();

  const response = await client.search({
    index: process.env.INDEX_GENE,
    body: {
      size: 0,
      aggs: {
        1: {
          filter: {
            regexp: {
              Location: "1[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        2: {
          filter: {
            regexp: {
              Location: "2[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        3: {
          filter: {
            regexp: {
              Location: "3[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        4: {
          filter: {
            regexp: {
              Location: "4[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        5: {
          filter: {
            regexp: {
              Location: "5[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        6: {
          filter: {
            regexp: {
              Location: "6[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        7: {
          filter: {
            regexp: {
              Location: "7[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        8: {
          filter: {
            regexp: {
              Location: "8[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        9: {
          filter: {
            regexp: {
              Location: "9[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        10: {
          filter: {
            regexp: {
              Location: "10[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        11: {
          filter: {
            regexp: {
              Location: "11[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        12: {
          filter: {
            regexp: {
              Location: "12[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        13: {
          filter: {
            regexp: {
              Location: "13[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        14: {
          filter: {
            regexp: {
              Location: "14[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        15: {
          filter: {
            regexp: {
              Location: "15[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        16: {
          filter: {
            regexp: {
              Location: "16[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        17: {
          filter: {
            regexp: {
              Location: "17[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        18: {
          filter: {
            regexp: {
              Location: "18[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        19: {
          filter: {
            regexp: {
              Location: "19[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        20: {
          filter: {
            regexp: {
              Location: "20[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        21: {
          filter: {
            regexp: {
              Location: "21[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        22: {
          filter: {
            regexp: {
              Location: "22[qp].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        X: {
          filter: {
            regexp: {
              Location: "x[pq].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
        Y: {
          filter: {
            regexp: {
              Location: "y[pq].*",
            },
          },
          aggs: {
            doc_count: {
              value_count: {
                field: "_id",
              },
            },
          },
        },
      },
    },
  });
  return response.body.aggregations;
}

app.get("/api/gene-location-counts/", (req, res) => {
  let a = getGeneLocationCounts();
  a.then(function (result) {
    res.json(result);
  });
});

/***********************************
 * Differential Expression Endpoints
 ***********************************/

app.post("/api/differential-expression/analyze", async (req, res) => {
  try {
    const {
      logNorm,
      numberOfDifferentiallyAbundantProteinsInHeatmap,
      foldChangeThreshold,
      pValueThreshold,
      pValueType,
      parametricTest,
      timestamp,
      formattedDate,
      groupNames,
      username,
    } = req.body;

    console.log(
      `> Log Norm: ${logNorm}, Heatmap #: ${numberOfDifferentiallyAbundantProteinsInHeatmap}, Fold Threshold: ${foldChangeThreshold}, P Val Threshold: ${pValueThreshold}, P Value Type: ${pValueType}, Parametric Test: ${parametricTest}`
    );

    const inputFile = await processGroupData(
      req.body,
      timestamp,
      formattedDate,
      groupNames
    );

    const basicAnalysisRequestBody = {
      username: username ? username : "test-user-local",
      input_file: inputFile,
      log_normalized: logNorm,
      stat_test: parametricTest,
      p_raw: pValueType,
      foldChangeThreshold,
      pValueThreshold,
      heat_map_number: numberOfDifferentiallyAbundantProteinsInHeatmap,
    };

    console.log("> Input file location", inputFile);
    console.log("> Request Body", basicAnalysisRequestBody);

    // Run basic differential expression analysis
    const basicResponse = await axios
      .post(process.env.BASIC_ANALYSIS_API, basicAnalysisRequestBody)
      .then((res) => res.data);

    console.log("> Basic Analysis Response", basicResponse);

    const advanceAnalysisRequestBody = {
      input_file: inputFile,
      pValueCutoff: 0.85,
      qValueCutoff: 0.8,
      submission_id: basicResponse.submission_id,
    };

    // Start advance differential expression analysis
    const advanceResponse = await axios.post(
      process.env.ADVANCE_ANALYSIS_API,
      advanceAnalysisRequestBody,
      {
        timeout: 60000,
      }
    );

    console.log("> Advance Analysis Response", advanceResponse.message);

    res.status(200).send("Docker run complete");
  } catch (error) {
    console.log("> Error", error);
    console.error(`Error during file operations: ${error.message}`);
    res.status(500).send(`Server Error: ${error.message}`);
  }
});

app.post("/api/differential-expression/analyze-file", async (req, res) => {
  try {
    const {
      inputData,
      logNorm,
      numberOfDifferentiallyAbundantProteinsInHeatmap,
      foldChangeThreshold,
      pValueThreshold,
      pValueType,
      parametricTest,
      timestamp,
      formattedDate,
      groupNames,
      username,
    } = req.body;

    console.log(
      `> Log Norm: ${logNorm}, Heatmap #: ${numberOfDifferentiallyAbundantProteinsInHeatmap}, Fold Threshold: ${foldChangeThreshold}, P Val Threshold: ${pValueThreshold}, P Value Type: ${pValueType}, Parametric Test: ${parametricTest}`
    );

    const inputFile = await processFile(inputData, timestamp, formattedDate);

    const basicAnalysisRequestBody = {
      username: username ? username : "test-user-local",
      input_file: inputFile,
      log_normalized: logNorm,
      stat_test: parametricTest,
      p_raw: pValueType,
      foldChangeThreshold,
      pValueThreshold,
      heat_map_number: numberOfDifferentiallyAbundantProteinsInHeatmap,
    };

    console.log("> Input file location", inputFile);
    console.log("> Request Body", basicAnalysisRequestBody);

    // Run basic differential expression analysis
    const basicResponse = await axios
      .post(process.env.BASIC_ANALYSIS_API, basicAnalysisRequestBody)
      .then((res) => res.data);

    console.log("> Basic Analysis Response", basicResponse);

    const advanceAnalysisRequestBody = {
      input_file: inputFile,
      pValueCutoff: 0.65,
      qValueCutoff: 0.25,
      submission_id: basicResponse.submission_id,
    };

    // Start advance differential expression analysis
    const advanceResponse = await axios
      .post(process.env.ADVANCE_ANALYSIS_API, advanceAnalysisRequestBody, {
        timeout: 60000,
      })
      .then((res) => res.data);

    console.log("> Advance Analysis Response", advanceResponse.message);

    res.status(200).send("Docker run complete");
  } catch (error) {
    console.error(`Error during file operations: ${error.message}`);
    res.status(500).send(`Server Error: ${error.message}`);
  }
});

app.post(
  "/api/differential-expression/send-support-email",
  async (req, res) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const timestamp = {
      year,
      month,
      day,
      hours,
      minutes,
      seconds,
    };
    try {
      const { message } = req.body;

      const newEmail = await sendSupportEmail({
        message,
        timestamp,
      });

      console.log("Support email sent.");
      res.status(201).json({ message: "Support email sent.", newEmail });
    } catch (error) {
      console.error("Error in API endpoint: ", error);
      res.status(500).send("Error sending email");
    }
  }
);

/*********************
 * Misc Util Endpoints
 *********************/

app.get("/api/submissions/:username", async (req, res) => {
  const { username } = req.params;

  const params = {
    TableName: "hsp-analysis-submissions-DEV",
    IndexName: "username-index", // If you're using a GSI based on username
    KeyConditionExpression: "#username = :username",
    ExpressionAttributeNames: {
      "#username": "username",
    },
    ExpressionAttributeValues: {
      ":username": username, // Use the provided username in the request params
    },
  };

  try {
    // Perform the DynamoDB query
    const data = await docClient.send(new QueryCommand(params));

    if (data.Items) {
      // Send the retrieved items as a response
      res.status(200).json(data.Items);
    } else {
      // Handle case where no items are found
      res.status(404).json({ message: "No submissions found for this user." });
    }
  } catch (err) {
    // Handle any errors
    console.error("Error querying DynamoDB:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

app.put("/api/submissions/:id", async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body; // Expecting dynamic fields in the request body, e.g. { important: true, name: "New Name" }

  // Dynamically construct the UpdateExpression and ExpressionAttribute values
  let UpdateExpression = "SET";
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  // Loop through the fields in the request body and build the update parameters
  Object.keys(updateFields).forEach((key, index) => {
    const comma = index === 0 ? "" : ",";
    UpdateExpression += `${comma} #${key} = :${key}`;
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = updateFields[key];
  });

  const params = {
    TableName: "hsp-analysis-submissions-DEV", // Update to match your table name
    Key: { id }, // Primary key for the table
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW", // Return all updated values
  };

  try {
    const result = await docClient.send(new UpdateCommand(params));
    res.status(200).json(result.Attributes); // Respond with updated attributes
  } catch (error) {
    console.error("Error updating submission:", error);
    res.status(500).json({ error: "Failed to update submission" });
  }
});

app.get("/api/download-template-data", async (req, res) => {
  // S3 download parameters
  const params = {
    bucketName: `${process.env.DIFFERENTIAL_S3_BUCKET}`,
    s3Key: "inputdata.csv",
  };

  const presignedUrl = await s3Download(params);
  res.send({ url: presignedUrl });
});

app.get("/api/download-data-standard", async (req, res) => {
  // S3 download parameters
  const params = {
    bucketName: `${process.env.DIFFERENTIAL_S3_BUCKET}`,
    s3Key: "example_inputdata_template.xlsx",
  };

  const presignedUrl = await s3Download(params);
  res.send({ url: presignedUrl });
});

app.get("/api/go-kegg-check/:jobId/:fileName", async (req, res) => {
  const jobId = req.params.jobId;
  const fileName = req.params.fileName;

  const datePart = jobId.split("-")[2];
  const year = datePart.substring(0, 4);
  const month = datePart.substring(4, 6);
  const day = datePart.substring(6, 8);
  const s3Key = `jobs/${year}-${month}-${day}/${jobId}/${fileName}`;

  const fileExists = await checkFileExists(
    process.env.DIFFERENTIAL_S3_BUCKET,
    s3Key
  );

  console.log("> File Exists", fileExists);
  return res.send({ exists: fileExists });
});

app.get("/api/s3Download/:jobId/:fileName", async (req, res) => {
  const jobId = req.params.jobId;
  const fileName = req.params.fileName;
  console.log("> Processing jobId: ", jobId);
  console.log("> Getting file: ", fileName);

  const datePart = jobId.split("-")[2];

  // Split the date part into year, month, and day
  const year = datePart.substring(0, 4);
  const month = datePart.substring(4, 6);
  const day = datePart.substring(6, 8);

  // S3 download parameters
  const params = {
    bucketName: `${process.env.DIFFERENTIAL_S3_BUCKET}`,
    s3Key: `jobs/${year}-${month}-${day}/${jobId}/${fileName}`,
  };

  try {
    const presignedUrl = await s3Download(params);
    res.send({ url: presignedUrl }); // Send the presigned URL to the client
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating presigned URL");
  }
});

const getProperties = async (index) => {
  // Initialize the client.
  const client = await getClient();

  try {
    // Get the mapping of the specified index.
    const response = await client.indices.getMapping({ index: index });
    return response.body[`${index}`].mappings.properties;
  } catch (error) {
    // Handle any errors that occur during the API call.
    console.error("Error getting mapping:", error);
    throw error;
  }
};

const getSalivaryProperties = async (index) => {
  // Initialize the client.
  const client = await getClient();

  try {
    // Get the mapping of the specified index.
    const response = await client.indices.getMapping({ index: index });

    // return response.body[`${index}`].mappings.properties["Salivary Proteins"]
    //   .properties;
    return response.body[`${index}`].mappings.properties["salivary_proteins"]
      .properties;
  } catch (error) {
    // Handle any errors that occur during the API call.
    console.error("Error getting mapping:", error);
    throw error;
  }
};

app.get("/api/properties/:entity", async (req, res) => {
  const entity = req.params.entity;
  console.log(`Getting properties for entity: ${entity}`);

  const entityIndexMapping = {
    Genes: process.env.INDEX_GENE,
    "Protein Clusters": process.env.INDEX_PROTEIN_CLUSTER,
    "Protein Signatures": process.env.INDEX_PROTEIN_SIGNATURE,
    Proteins: process.env.INDEX_STUDY_PROTEIN,
    "PubMed Citations": process.env.INDEX_CITATION,
    "Salivary Proteins": process.env.INDEX_SALIVARY_PROTEIN,
    Annotations: process.env.INDEX_SALIVARY_PROTEIN,
  };

  if (entity === "Salivary Proteins") {
    await getSalivaryProperties(entityIndexMapping[entity]).then(
      (properties) => {
        const result = [];
        for (const [key, value] of Object.entries(properties)) {
          if (key !== "annotations" && key !== "atlas" && key !== "glycans") {
            if (value.properties) {
              for (const subKey in value.properties) {
                if (value.properties[subKey].properties) {
                  // Handle another level of nested properties
                  for (const nestedKey in value.properties[subKey].properties) {
                    result.push(`${key}.${subKey}.${nestedKey}`);
                  }
                } else {
                  result.push(`${key}.${subKey}`);
                }
              }
            } else {
              result.push(key);
            }
          }
        }
        res.json(result);
      }
    );
  } else if (entity === "Annotations") {
    await getSalivaryProperties(entityIndexMapping[entity]).then(
      (properties) => {
        const result = [];
        for (const [key, value] of Object.entries(properties)) {
          if (key === "annotations") {
            if (value.properties) {
              for (const subKey in value.properties) {
                if (subKey !== "features") {
                  if (value.properties[subKey].properties) {
                    // Handle another level of nested properties
                    for (const nestedKey in value.properties[subKey]
                      .properties) {
                      if (nestedKey !== "evidences") {
                        result.push(`${subKey}.${nestedKey}`);
                      }
                    }
                  } else {
                    result.push(`${subKey}`);
                  }
                }
              }
            }
          } else if (key === "uniprot_accession") {
            result.push(key);
          }
        }
        res.json(result);
      }
    );
  } else {
    await getProperties(entityIndexMapping[entity]).then((properties) => {
      const result = [];
      for (const [key, value] of Object.entries(properties)) {
        result.push(key);
      }
      res.json(result);
    });
  }
});

const advancedSearch = async ({
  entity,
  rows,
  booleanOperator,
  selectedProperties,
  size,
  from,
  paginationKey,
  sortedColumn,
}) => {
  // Initialize the client.
  const client = await getClient();

  const entityIndexMapping = {
    Genes: process.env.INDEX_GENE,
    "Protein Clusters": process.env.INDEX_PROTEIN_CLUSTER,
    "Protein Signatures": process.env.INDEX_PROTEIN_SIGNATURE,
    Proteins: process.env.INDEX_STUDY_PROTEIN,
    "PubMed Citations": process.env.INDEX_CITATION,
    "Salivary Proteins": process.env.INDEX_SALIVARY_PROTEIN,
    Annotations: process.env.INDEX_SALIVARY_PROTEIN,
  };

  const query = await formQuery(
    entity,
    rows,
    booleanOperator,
    selectedProperties,
    size,
    from,
    paginationKey,
    sortedColumn
  );

  const response = await client.search({
    index: entityIndexMapping[entity],
    body: query,
  });

  return response.body.hits;
};

app.post("/api/advanced-search/build-query", async (req, res) => {
  try {
    const payload = req.body;

    const result = await advancedSearch(payload);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/contact/generate-presigned-urls", async (req, res) => {
  const { fileNames, topic, timestamp } = req.body;
  const bucketName = process.env.CONTACT_S3_BUCKET;

  try {
    const urls = await generatePresignedUrls(
      bucketName,
      fileNames,
      topic,
      timestamp
    );
    res.json({ urls });
  } catch (error) {
    console.error("Error in endpoint: ", error);
    res.status(500).send("Error generating URLs");
  }
});

const verifyCaptcha = async (captchaResponse) => {
  const secretKey = await getSSMParameter(process.env.RECAPTCHA_SECRET_KEY);
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;

  try {
    const response = await axios.post(verificationUrl);
    const data = response.data;

    // Google reCAPTCHA response contains a success boolean
    if (data.success) {
      console.log("CAPTCHA verification successful");
      return true;
    } else {
      console.log("CAPTCHA verification failed", data["error-codes"]);
      return false;
    }
  } catch (error) {
    console.error("Error during CAPTCHA verification", error);
    return false;
  }
};

app.post("/api/contact/send-form", async (req, res) => {
  try {
    const {
      name,
      email,
      pageUrl,
      topic,
      message,
      s3Locations,
      ratings,
      timestamp,
      captchaResponse,
    } = req.body;

    // Verify the CAPTCHA response
    const isCaptchaValid = await verifyCaptcha(captchaResponse);

    if (!isCaptchaValid) {
      return res
        .status(400)
        .send({ message: "Invalid CAPTCHA. Please try again." });
    }

    const newContact = await createContact({
      name,
      email,
      pageUrl,
      topic,
      message,
      s3Locations,
      ratings,
      timestamp,
    });

    res
      .status(201)
      .json({ message: "Contact created successfully", newContact });
  } catch (error) {
    console.error("Error in API endpoint: ", error);
    res.status(500).send("Error creating contact");
  }
});

const globalSearch = async ({
  entity,
  size,
  from,
  searchText,
  sortedColumn,
}) => {
  // Initialize the client.
  const client = await getClient();

  const entityIndexMapping = {
    Genes: process.env.INDEX_GENE,
    "Protein Clusters": process.env.INDEX_PROTEIN_CLUSTER,
    "Protein Signatures": process.env.INDEX_PROTEIN_SIGNATURE,
    Proteins: process.env.INDEX_STUDY_PROTEIN,
    "PubMed Citations": process.env.INDEX_CITATION,
    "Salivary Proteins": process.env.INDEX_SALIVARY_PROTEIN,
  };

  const escapeSpecialCharacters = (inputVal) => {
    return inputVal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  const escapedInput = escapeSpecialCharacters(searchText);

  const notKeywordList = [
    "Gene Name",
    "number_of_members",
    "experiment_id_key",
    "Name",
    "Date of Publication",
    "PubDate",
    "salivary_proteins.protein_sequence_length",
    "salivary_proteins.mass",
  ];

  const query = {
    track_total_hits: true,
    size,
    from,
    query: {
      query_string: {
        query: `*${escapedInput}*`, // Search for the keyword in all fields
        analyze_wildcard: true, // Enable wildcard search
      },
    },
    ...(sortedColumn && {
      sort: [
        {
          [notKeywordList.includes(sortedColumn.attribute)
            ? `${sortedColumn.attribute}`
            : sortedColumn.attribute === "salivary_proteins.keywords"
              ? `${sortedColumn.attribute}.keyword.keyword`
              : `${sortedColumn.attribute}.keyword`]: {
            order: sortedColumn.order,
          },
        },
      ],
    }),
  };

  const response = await client.search({
    index: entityIndexMapping[entity],
    body: query,
  });

  return response.body.hits;
};

app.post("/api/global-search", async (req, res) => {
  try {
    const payload = req.body;

    const result = await globalSearch(payload);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

const experimentProtein = async ({
  size,
  from,
  experiment_id_key,
  searchText,
  sortedColumn,
}) => {
  // Initialize the client.
  const client = await getClient();

  const escapeSpecialCharacters = (inputVal) => {
    return inputVal.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  // Escape and trim searchText if it is not null or undefined
  const escapedInput = searchText ? escapeSpecialCharacters(searchText) : "";

  const query = {
    track_total_hits: true,
    size,
    from,
    query: {
      bool: {
        must: [
          {
            query_string: {
              default_field: "experiment_id_key",
              query: experiment_id_key,
            },
          },
          // Include searchText condition only if it is non-empty after trimming and escaping
          ...(escapedInput
            ? [
                {
                  query_string: {
                    query: `*${escapedInput}*`,
                    analyze_wildcard: true,
                  },
                },
              ]
            : []),
        ],
      },
    },
    ...(sortedColumn && {
      sort: [
        {
          [`${sortedColumn.attribute}.keyword`]: {
            order: sortedColumn.order,
          },
        },
      ],
    }),
  };

  const response = await client.search({
    index: process.env.INDEX_STUDY_PROTEIN,
    body: query,
  });

  return response.body.hits;
};

app.post("/api/experiment-protein", async (req, res) => {
  try {
    const payload = req.body;

    const result = await experimentProtein(payload);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

const experimentPeptide = async (
  { size, from, searchText, sortedColumn },
  uniprotid
) => {
  // Initialize the client.
  const client = await getClient();

  const escapeSpecialCharacters = (inputVal) => {
    return inputVal.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  // Escape and trim searchText if it is not null or undefined
  const escapedInput = searchText ? escapeSpecialCharacters(searchText) : "";

  const query = {
    track_total_hits: true,
    size,
    from,
    query: {
      bool: {
        must: [
          {
            query_string: {
              default_field: "Uniprot_accession",
              query: uniprotid,
            },
          },
          // Include searchText condition only if it is non-empty after trimming and escaping
          ...(escapedInput
            ? [
                {
                  query_string: {
                    query: `*${escapedInput}*`,
                    analyze_wildcard: true,
                  },
                },
              ]
            : []),
        ],
      },
    },
    ...(sortedColumn && {
      sort: [
        {
          [`${sortedColumn.attribute}.keyword`]: {
            order: sortedColumn.order,
          },
        },
      ],
    }),
  };

  const response = await client.search({
    index: process.env.INDEX_PEPTIDE,
    body: query,
  });

  return response.body.hits;
};

app.post("/api/experiment-protein/:uniprotid", async (req, res) => {
  try {
    const uniprotid = req.params.uniprotid;
    const payload = req.body;

    const result = await experimentPeptide(payload, uniprotid);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

/**********************************
 * For Fetching Abundance Scores
 *********************************/

const getAbundanceData = async (proteinId) => {
  var client = await getClient();

  const response = await client.search({
    index: process.env.INDEX_STUDY_PEPTIDE_ABUNDANCE,
    body: {
      query: {
        bool: {
          filter: [
            {
              term: {
                "uniprot_id.keyword": proteinId,
              },
            },
          ],
        },
      },
    },
  });

  const results = response.body.hits.hits;

  return results.map((res) => res._source);
};

app.get("/api/abundance-score/:id", (req, res) => {
  const abundanceData = getAbundanceData(req.params.id);
  abundanceData.then(function (result) {
    res.json(result);
  });
});

/**********************************
 * Get Max of Whole Saliva, Parotid Glands, SM/SL Glands, Blood, and mRNA
 *********************************/

const getSalivaryMaxAndSum = async () => {
  var client = await getClient();

  const response = await client.search({
    index: process.env.INDEX_SALIVARY_SUMMARY,
    body: {
      size: 0,
      aggs: {
        sm_sl_abundance_max: {
          max: {
            field: "sm/sl_abundance",
          },
        },
        sm_sl_abundance_sum: {
          sum: {
            field: "sm/sl_abundance",
          },
        },
        plasma_abundance_max: {
          max: {
            field: "plasma_abundance",
          },
        },
        plasma_abundance_sum: {
          sum: {
            field: "plasma_abundance",
          },
        },
        mRNA_max: {
          max: {
            field: "mRNA",
          },
        },
        mRNA_sum: {
          sum: {
            field: "mRNA",
          },
        },
        saliva_abundance_max: {
          max: {
            field: "saliva_abundance",
          },
        },
        saliva_abundance_sum: {
          sum: {
            field: "saliva_abundance",
          },
        },
        parotid_gland_abundance_max: {
          max: {
            field: "parotid_gland_abundance",
          },
        },
        parotid_gland_abundance_sum: {
          sum: {
            field: "parotid_gland_abundance",
          },
        },
        SM_max: {
          max: {
            field: "SM",
          },
        },
        SM_sum: {
          sum: {
            field: "SM",
          },
        },
        SL_max: {
          max: {
            field: "SL",
          },
        },
        SL_sum: {
          sum: {
            field: "SL",
          },
        },
        PAR_max: {
          max: {
            field: "PAR",
          },
        },
        PAR_sum: {
          sum: {
            field: "PAR",
          },
        },
      },
    },
  });

  const aggsResults = response.body.aggregations;

  return aggsResults;
};

app.get("/api/get-salivary-max-and-sum", (req, res) => {
  const data = getSalivaryMaxAndSum();
  data.then(function (result) {
    res.json(result);
  });
});

app.get("/doc/*", function (req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "./documentation/"),
  });
});

app.get("*", function (req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "./build/"),
  });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
