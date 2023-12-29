const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const fs = require("fs");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const fse = require("fs-extra");
const path = require("path");
const { processGroupData } = require("./utils/processGroupData");
const { processFile } = require("./utils/processFile");
const { s3Upload } = require("./utils/s3Upload");
const { s3Download } = require("./utils/s3Download");
const { formQuery } = require("./utils/formQuery");
const { generatePresignedUrls } = require("./utils/generatePresignedUrls");
const { createContact } = require("./utils/createContact");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use("/static", express.static(path.join(__dirname, "./build/static")));

const host =
  "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com";

const host1 =
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

/***************************
 * Protein Cluster Endpoints
 ***************************/

async function getClusterMemberCount() {
  var client = await getClient();

  var response = await client.search({
    index: "protein_cluster",
    body: {
      size: 0,
      aggs: {
        number_of_members_2: {
          filter: {
            term: {
              number_of_members: 2,
            },
          },
        },
        number_of_members_3: {
          filter: {
            term: {
              number_of_members: 3,
            },
          },
        },
        number_of_members_4: {
          filter: {
            term: {
              number_of_members: 4,
            },
          },
        },
        number_of_members_5: {
          filter: {
            term: {
              number_of_members: 5,
            },
          },
        },
        number_of_members_6: {
          filter: {
            term: {
              number_of_members: 6,
            },
          },
        },
        number_of_members_7: {
          filter: {
            term: {
              number_of_members: 7,
            },
          },
        },
        number_of_members_8: {
          filter: {
            term: {
              number_of_members: 8,
            },
          },
        },
        number_of_members_9: {
          filter: {
            term: {
              number_of_members: 9,
            },
          },
        },
        number_of_members_10_or_more: {
          filter: {
            script: {
              script: {
                source: "doc['number_of_members'].value >= params.param1",
                params: {
                  param1: 10,
                },
              },
            },
          },
        },
      },
    },
  });
  return response.body.aggregations;
}

app.get("/api/protein-cluster-member-count", (req, res) => {
  let a = getClusterMemberCount();

  a.then(function (result) {
    res.json(result);
  });
});

async function getAllProteinSearchClusterData() {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: 10000,
    query: {
      match_all: {},
    },
  };

  var response = await client.search({
    index: "protein_cluster",
    body: query,
  });

  return response.body.hits.hits;
}

app.get("/api/protein-cluster", (req, res) => {
  let a = getAllProteinSearchClusterData();

  a.then(function (result) {
    res.json(result);
  });
});

async function getProteinClusterById(id) {
  var client = await getClient();

  var query = {
    query: {
      match: {
        _id: {
          query: id,
        },
      },
    },
  };

  var response = await client.search({
    index: "protein_cluster",
    body: query,
  });

  return response.body.hits.hits;
}

app.get("/api/protein-cluster/:id", (req, res) => {
  let a = getProteinClusterById(req.params.id);

  a.then(function (result) {
    res.json(result);
  });
});

async function queryProteinCluster(
  size,
  from,
  filter,
  sort = null,
  keyword = null
) {
  const client = await getClient();

  const payload = {
    index: "protein_cluster",
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

app.post("/api/protein-cluster/:size/:from/", (req, res) => {
  const { filters, sort, keyword } = req.body;
  const { size, from } = req.params;

  const results = queryProteinCluster(size, from, filters, sort, keyword);

  results.then((result) => {
    res.json(result);
  });
});

/*****************************
 * Salivary Proteins Endpoints
 *****************************/

async function getSalivaryProteinById(id) {
  var client = await getClient1();

  var query = {
    query: {
      match: {
        _id: {
          query: id,
        },
      },
    },
  };

  var response = await client.search({
    index: "salivary-proteins-112023",
    body: query,
  });

  return response.body.hits.hits;
}

app.get("/api/salivary-protein/:id", (req, res) => {
  let a = getSalivaryProteinById(req.params.id);
  a.then(function (result) {
    res.json(result);
  });
});

/**
 * Query data used for Salivary Protein page table
 * @param {Number} size Number of records to return
 * @param {Number} from Starting point for the data page to return
 * @param {Object[]} filter All applied filters applied by user in facet menu
 * @param {Object[]} sort Sort query for column selected to sort by from table
 * @param {Object} keyword String entered by user into search bar
 * @param {Boolean} filterByOr True if using or filters, false otherwise
 */
async function querySalivaryProtein(
  size,
  from,
  filter,
  sort = null,
  keyword = null,
  filterByOr = false
) {
  const client = await getClient();

  const payload = {
    index: "new_saliva_protein_test",
    body: {
      track_total_hits: true,
      size: size,
      from: from,
      aggs: {
        IHC: {
          terms: {
            field: "IHC.keyword",
          },
        },
        expert_opinion: {
          terms: {
            field: "expert_opinion.keyword",
          },
        },
      },
      query: {
        bool: {
          ...(filterByOr === true ? { should: filter } : { filter }),
          ...(keyword && { must: [keyword] }), // Apply global search if present
        },
      },
      ...(sort && { sort }), // Apply sort if present
    },
  };

  const response = await client.search(payload);

  return response.body;
}

// Used by Salivary Proteins table
app.post("/api/salivary-proteins/:size/:from/", (req, res) => {
  const { filters, sort, keyword, filterByOr } = req.body;
  const { size, from } = req.params;

  const results = querySalivaryProtein(
    size,
    from,
    filters,
    sort,
    keyword,
    filterByOr
  );

  results.then((result) => {
    res.json(result);
  });
});

async function queryProteins(size, from, filter, sort = null, keyword = null) {
  const client = await getClient1();

  const payload = {
    index: "salivary-proteins-112023",
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
      match: {
        _id: {
          query: id,
        },
      },
    },
  };

  var response = await client.search({
    index: "genes",
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
    index: "genes",
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
      match: {
        _id: {
          query: id,
        },
      },
    },
  };

  var response = await client.search({
    index: "protein_signature",
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
    index: "protein_signature",
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
  var client = await getClient1();

  var query = {
    query: {
      match: {
        _id: {
          query: id,
        },
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
  let a = getCitationById("citation", req.params.id);

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
  const client = await getClient1();

  const returnFields = ["PubMed_ID", "PubDate", "Title", "journal_title"];

  const payload = {
    index: "citation",
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

async function search_protein_count_SP() {
  var client = await getClient();
  const response = await client.search({
    index: "new_saliva_protein_test", // Replace with your index name
    body: {
      size: 0,
      aggs: {
        filter_ws_par: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { gt: 0 } } },
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

async function search_protein_count_SB() {
  var client = await getClient();

  const response = await client.search({
    index: "new_saliva_protein_test", // Replace with your index name
    body: {
      size: 0,
      aggs: {
        filter_ws_p: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { gt: 0 } } },
                { range: { plasma_abundance: { gt: 0 } } },
              ],
            },
          },
        },
      },
    },
  });

  return response.body.aggregations;
}

async function search_protein_count_SSS() {
  var client = await getClient();

  const response = await client.search({
    index: "new_saliva_protein_test", // Replace with your index name
    body: {
      size: 0,
      aggs: {
        filter_ss_ws: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { gt: 0 } } },
                { range: { "sm/sl_abundance": { gt: 0 } } },
              ],
            },
          },
        },
      },
    },
  });

  return response.body.aggregations;
}

async function search_count_Pa() {
  var client = await getClient();

  const response = await client.search({
    index: "new_saliva_protein_test", // Replace with your index name
    body: {
      size: 0,
      aggs: {
        filter_par: {
          filter: {
            bool: {
              must: [{ range: { parotid_gland_abundance: { gt: 0 } } }],
            },
          },
        },
      },
    },
  });

  return response.body.aggregations;
}

async function search_count_S() {
  var client = await getClient();

  const response = await client.search({
    index: "new_saliva_protein_test", // Replace with your index name
    body: {
      size: 0,
      aggs: {
        filter_ws: {
          filter: {
            bool: {
              must: [{ range: { saliva_abundance: { gt: 0 } } }],
            },
          },
        },
      },
    },
  });

  return response.body.aggregations;
}

async function search_count_Pl() {
  var client = await getClient();

  const response = await client.search({
    index: "new_saliva_protein_test", // Replace with your index name
    body: {
      size: 0,
      aggs: {
        filter_p: {
          filter: {
            bool: {
              must: [{ range: { plasma_abundance: { gt: 0 } } }],
            },
          },
        },
      },
    },
  });

  return response.body.aggregations;
}

async function search_count_SS() {
  var client = await getClient();

  const response = await client.search({
    index: "new_saliva_protein_test", // Replace with your index name
    body: {
      size: 0,
      aggs: {
        filter_ss: {
          filter: {
            bool: {
              must: [{ range: { "sm/sl_abundance": { gt: 0 } } }],
            },
          },
        },
      },
    },
  });

  return response.body.aggregations;
}

async function search_protein_count_SSP() {
  var client = await getClient();

  const response = await client.search({
    index: "new_saliva_protein_test", // Replace with your index name
    body: {
      size: 0,
      aggs: {
        filter_ss_p: {
          filter: {
            bool: {
              must: [
                { range: { plasma_abundance: { gt: 0 } } },
                { range: { "sm/sl_abundance": { gt: 0 } } },
              ],
            },
          },
        },
      },
    },
  });

  return response.body.aggregations;

  return body;
}

async function search_protein_count_SSPa() {
  var client = await getClient();

  const response = await client.search({
    index: "new_saliva_protein_test", // Replace with your index name
    body: {
      size: 0,
      aggs: {
        filter_ss_par: {
          filter: {
            bool: {
              must: [
                { range: { parotid_abundance: { gt: 0 } } },
                { range: { "sm/sl_abundance": { gt: 0 } } },
              ],
            },
          },
        },
      },
    },
  });

  return response.body.aggregations;
}

async function search_protein_count_PPa() {
  var client = await getClient();

  const response = await client.search({
    index: "new_saliva_protein_test", // Replace with your index name
    body: {
      size: 0,
      aggs: {
        filter_p_par: {
          filter: {
            bool: {
              must: [
                { range: { plasma_abundance: { gt: 0 } } },
                { range: { parotid_abundance: { gt: 0 } } },
              ],
            },
          },
        },
      },
    },
  });

  return response.body.aggregations;
}

app.get("/api/countPPa", (req, res) => {
  let a = search_protein_count_PPa();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/api/countSSP", (req, res) => {
  let a = search_protein_count_SSP();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/api/countSSPa", (req, res) => {
  let a = search_protein_count_SSPa();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/api/countProteinPa", (req, res) => {
  let a = search_count_Pa();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/api/countProteinS", (req, res) => {
  let a = search_count_S();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/api/countProteinPl", (req, res) => {
  let a = search_count_Pl();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/api/countProteinSS", (req, res) => {
  let a = search_count_SS();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/api/countSPa", (req, res) => {
  let a = search_protein_count_SP();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/api/countSPl", (req, res) => {
  let a = search_protein_count_SB();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/api/countSSS", (req, res) => {
  let a = search_protein_count_SSS();
  a.then(function (result) {
    res.json(result);
  });
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
    index: "go_nodes",
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
    index: "go_nodes",
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
    index: "go_edges",
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
  var client = await getClient1();

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
    index: "salivary-proteins-112023",
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
    index: "study",
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
    index: "study",
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
    index: "study",
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
    index: "study_protein",
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
    index: "study_protein",
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
    index: "study_protein",
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
    index: "protein_signature",
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
    index: "genes",
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
      foldChangeThreshold,
      pValueThreshold,
      pValueType,
      parametricTest,
      timestamp,
      formattedDate,
      workingDirectory,
    } = req.body;
    const scriptPath = "/home/ec2-user/r4test1/test";

    // Create the working directory and copy the R script
    await fse.ensureDir(workingDirectory);
    await processGroupData(req.body, workingDirectory);
    await fse.copy(
      path.join(scriptPath, "generate-data-new.R"),
      path.join(workingDirectory, "generate-data-new.R")
    );
    // Execute the R script from the working directory
    const command = `Rscript generate-data-new.R ${logNorm} ${foldChangeThreshold} ${pValueThreshold} ${pValueType} ${parametricTest}`;
    const { stdout } = await execPromise(command, {
      cwd: workingDirectory,
    });

    if (parametricTest === "F") {
      const renameCommand = "mv t_test.csv statistical_parametric_test.csv";
      await execPromise(renameCommand, { cwd: workingDirectory });
    } else {
      const renameCommand =
        "mv wilcox_rank.csv statistical_parametric_test.csv";
      await execPromise(renameCommand, { cwd: workingDirectory });
    }
    // Compress the contents of the working directory
    const compressCommand =
      "zip -r data_set.zip volcano_0_dpi72.png volcano.csv heatmap_1_dpi72.png heatmap_0_dpi72.png tt_0_dpi72.png statistical_parametric_test.csv fc_0_dpi72.png fold_change.csv pca_score2d_0_dpi72.png pca_score.csv venn-dimensions.png venn_out_data.txt norm_0_dpi72.png data_normalized.csv data_original.csv all_data.tsv";
    await execPromise(compressCommand, { cwd: workingDirectory });

    // S3 upload parameters
    const params = {
      bucketName: "differential-expression-result-dev",
      s3KeyPrefix: `${timestamp.year}-${timestamp.month}-${timestamp.day}/differential-expression-${formattedDate}`,
      contentType: "text/plain",
      directoryPath: workingDirectory,
    };
    // Perform the s3 upload
    await s3Upload(params);
    console.log(`stdout:\n${stdout}`);
    res.status(200).send(`Output: ${stdout}`);
  } catch (error) {
    console.error(`Error during file operations: ${error.message}`);
    res.status(500).send(`Server Error: ${error.message}`);
  }
  // res.status(200).send("Good");
});

app.post("/api/differential-expression/analyze-file", async (req, res) => {
  try {
    const {
      inputData,
      logNorm,
      foldChangeThreshold,
      pValueThreshold,
      pValueType,
      parametricTest,
      timestamp,
      formattedDate,
      workingDirectory,
    } = req.body;
    const scriptPath = "/home/ec2-user/r4test1/test";

    // Create the working directory and copy the R script
    await fse.ensureDir(workingDirectory);
    await processFile(inputData, workingDirectory);
    await fse.copy(
      path.join(scriptPath, "generate-data-new.R"),
      path.join(workingDirectory, "generate-data-new.R")
    );
    // Execute the R script from the working directory
    const command = `Rscript generate-data-new.R ${logNorm} ${foldChangeThreshold} ${pValueThreshold} ${pValueType} ${parametricTest}`;
    const { stdout } = await execPromise(command, {
      cwd: workingDirectory,
    });

    if (parametricTest === "F") {
      const renameCommand = "mv t_test.csv statistical_parametric_test.csv";
      await execPromise(renameCommand, { cwd: workingDirectory });
    } else {
      const renameCommand =
        "mv wilcox_rank.csv statistical_parametric_test.csv";
      await execPromise(renameCommand, { cwd: workingDirectory });
    }
    // Compress the contents of the working directory
    const compressCommand =
      "zip -r data_set.zip volcano_0_dpi72.png volcano.csv heatmap_1_dpi72.png heatmap_0_dpi72.png tt_0_dpi72.png statistical_parametric_test.csv fc_0_dpi72.png fold_change.csv pca_score2d_0_dpi72.png pca_score.csv venn-dimensions.png venn_out_data.txt norm_0_dpi72.png data_normalized.csv data_original.csv all_data.tsv";
    await execPromise(compressCommand, { cwd: workingDirectory });

    // S3 upload parameters
    const params = {
      bucketName: "differential-expression-result-dev",
      s3KeyPrefix: `${timestamp.year}-${timestamp.month}-${timestamp.day}/differential-expression-${formattedDate}`,
      contentType: "text/plain",
      directoryPath: workingDirectory,
    };
    // Perform the s3 upload
    await s3Upload(params);
    console.log(`stdout:\n${stdout}`);
    res.status(200).send(`Output: ${stdout}`);
  } catch (error) {
    console.error(`Error during file operations: ${error.message}`);
    res.status(500).send(`Server Error: ${error.message}`);
  }
});

/*********************
 * Misc Util Endpoints
 *********************/

app.get("/api/download-template-data", async (req, res) => {
  // S3 download parameters
  const params = {
    bucketName: "differential-expression-result-dev",
    s3Key: "inputdata.csv",
  };

  const presignedUrl = await s3Download(params);
  res.send({ url: presignedUrl });
});

app.get("/api/download-data-standard", async (req, res) => {
  // S3 download parameters
  const params = {
    bucketName: "differential-expression-result-dev",
    s3Key: "Example_inputdata_template.xlsx",
  };

  const presignedUrl = await s3Download(params);
  res.send({ url: presignedUrl });
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
    bucketName: "differential-expression-result-dev",
    s3Key: `${year}-${month}-${day}/${jobId}/${fileName}`,
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
  const client = await getClient1();

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
    Genes: "genes",
    "Protein Clusters": "protein_cluster",
    "Protein Signatures": "protein_signature",
    Proteins: "study_protein",
    "PubMed Citations": "citation",
    // "Salivary Proteins": "protein",
    "Salivary Proteins": "salivary-proteins-112023",
    Annotations: "salivary-proteins-112023",
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

const advancedSearch = async (
  entity,
  rows,
  booleanOperator,
  selectedProperties,
  size,
  from,
  paginationKey
) => {
  // Initialize the client.
  let client;
  if (entity === "Salivary Proteins" || entity === "Annotations") {
    client = await getClient1();
  } else {
    client = await getClient();
  }

  const entityIndexMapping = {
    Genes: "genes",
    "Protein Clusters": "protein_cluster",
    "Protein Signatures": "protein_signature",
    Proteins: "study_protein",
    "PubMed Citations": "citation",
    // "Salivary Proteins": "protein",
    "Salivary Proteins": "salivary-proteins-112023",
    Annotations: "salivary-proteins-112023",
  };

  const query = await formQuery(
    entity,
    rows,
    booleanOperator,
    selectedProperties,
    size,
    from,
    paginationKey
  );

  const response = await client.search({
    index: entityIndexMapping[entity],
    body: query,
  });

  return response.body.hits;
};

app.post("/api/advanced-search/build-query", async (req, res) => {
  try {
    const {
      entity,
      rows,
      booleanOperator,
      selectedProperties,
      size,
      from,
      paginationKey,
    } = req.body;

    const result = await advancedSearch(
      entity,
      rows,
      booleanOperator,
      selectedProperties,
      size,
      from,
      paginationKey
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/contact/generate-presigned-urls", async (req, res) => {
  const { fileNames, topic, timestamp } = req.body;
  const bucketName = "contact-attachments-dev";

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
  const secretKey = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; // Replace with your actual secret key
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
  let client;
  if (entity === "Salivary Proteins") {
    client = await getClient1();
  } else {
    client = await getClient();
  }

  const entityIndexMapping = {
    Genes: "genes",
    "Protein Clusters": "protein_cluster",
    "Protein Signatures": "protein_signature",
    Proteins: "study_protein",
    "PubMed Citations": "citation",
    "Salivary Proteins": "salivary-proteins-112023",
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
    index: "study_protein",
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
    index: "peptide",
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

app.get("*", function (req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "./build/"),
  });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
