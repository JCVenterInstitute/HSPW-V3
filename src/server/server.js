const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const fs = require("fs");

app.use(cors());
app.use(express.json());

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

async function getMapping() {
  var client = await getClient();
  var response = await client.indices.getMapping({
    index: "protein_cluster",
  });
  return Object.keys(
    response.body["protein_cluster"]["mappings"]["properties"]
  );
  console.log(
    Object.keys(response.body["protein_cluster"]["mappings"]["properties"])
  );
}

app.get("/a123", (req, res) => {
  let a = getMapping();
  a.then(function (result) {
    console.log(result);
    res.json(result);
  });
});

async function search_cluster() {
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
  console.log(
    Object.keys(JSON.parse(JSON.stringify(response.body.hits.hits))).length
  );
  console.log(
    JSON.stringify(response.body.hits.hits[0]["_source"]["Cluster ID"])
  );
  return response.body.hits.hits;
}

app.get("/protein_cluster", (req, res) => {
  let a = search_cluster();
  a.then(function (result) {
    console.log(result);
    res.json(result);
  });
});

async function search_clusterID(id) {
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
  console.log(
    Object.keys(JSON.parse(JSON.stringify(response.body.hits.hits))).length
  );
  return response.body.hits.hits;
}

app.get("/protein_cluster/:id", (req, res) => {
  console.log(req.params.id);
  let a = search_clusterID(req.params.id);
  a.then(function (result) {
    console.log(result);
    res.json(result);
  });
});

async function search_gene() {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: 10000,
    query: {
      match_all: {},
    },
  };

  var response = await client.search({
    index: "genes",
    body: query,
  });
  return response.body.hits.hits;
}

app.get("/genes", (req, res) => {
  let a = search_gene();
  a.then(function (result) {
    console.log(result);
    res.json(result);
  });
});

async function search_proteinID(id) {
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
    index: "protein",
    body: query,
  });
  console.log(
    Object.keys(JSON.parse(JSON.stringify(response.body.hits.hits))).length
  );
  return response.body.hits.hits;
}

async function search_geneID(id) {
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
  console.log(
    Object.keys(JSON.parse(JSON.stringify(response.body.hits.hits))).length
  );
  return response.body.hits.hits;
}

app.get("/genes/:id", (req, res) => {
  console.log(req.params.id);
  let a = search_geneID(req.params.id);
  a.then(function (result) {
    console.log(result);
    res.json(result);
  });
});

async function search_signature() {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: 10000,
    query: {
      match_all: {},
    },
  };

  var response = await client.search({
    index: "protein_signature",
    body: query,
  });
  console.log(
    Object.keys(JSON.parse(JSON.stringify(response.body.hits.hits))).length
  );
  console.log(
    JSON.stringify(response.body.hits.hits[0]["_source"]["InterPro ID"])
  );
  return response.body.hits.hits;
}

app.get("/protein_signature", (req, res) => {
  let a = search_signature();
  a.then(function (result) {
    console.log(result);
    res.json(result);
  });
});

async function search_signatureID(id) {
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
  console.log(
    Object.keys(JSON.parse(JSON.stringify(response.body.hits.hits))).length
  );
  console.log(
    JSON.stringify(response.body.hits.hits[0]["_source"]["InterPro ID"])
  );
  return response.body.hits.hits;
}

app.get("/protein_signature/:id", (req, res) => {
  console.log(req.params.id);
  let a = search_signatureID(req.params.id);
  a.then(function (result) {
    console.log(result);
    res.json(result);
  });
});

async function search_withID(index, id) {
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
    index: index,
    body: query,
  });
  return response.body.hits.hits;
}

app.get("/citation/:id", (req, res) => {
  console.log(req.params.id);
  let a = search_withID("citation", req.params.id);
  a.then(function (result) {
    console.log(result);
    res.json(result);
  });
});

async function search_citation_field() {
  // Initialize the client.
  var client = await getClient();

  var response = await client.indices.getFieldMapping({
    index: "citation",
  });
  console.log("123");
  return response.body.hits.hits;
}

app.get("/citation/field", (req, res) => {
  let a = search_citation_field();
  a.then(function (result) {
    console.log("321:" + result);
    res.json(result);
  });
});

async function search_citation() {
  // Initialize the client
  var client = await getClient();

  var query = {
    size: 10000,
    query: {
      match_all: {},
    },
  };

  var response = await client.search({
    index: "citation",
    body: query,
  });
  return response.body.hits.hits;
}

app.get("/citation", (req, res) => {
  let a = search_citation();
  a.then(function (result) {
    console.log(result);
    res.json(result);
  });
});

async function search_protein_count_SP() {
  var client = await getClient();
  const response = await client.search({
    index: "saliva_protein_test", // Replace with your index name
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
  console.log(response.body.aggregations);
  return response.body.aggregations;
}

async function search_protein_count_SB() {
  var client = await getClient();

  const response = await client.search({
    index: "saliva_protein_test", // Replace with your index name
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
    index: "saliva_protein_test", // Replace with your index name
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
    index: "saliva_protein_test", // Replace with your index name
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
    index: "saliva_protein_test", // Replace with your index name
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
    index: "saliva_protein_test", // Replace with your index name
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
    index: "saliva_protein_test", // Replace with your index name
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
    index: "saliva_protein_test", // Replace with your index name
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
    index: "saliva_protein_test", // Replace with your index name
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
    index: "saliva_protein_test", // Replace with your index name
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

app.get("/countPPa", (req, res) => {
  let a = search_protein_count_PPa();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/countSSP", (req, res) => {
  let a = search_protein_count_SSP();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/countSSPa", (req, res) => {
  let a = search_protein_count_SSPa();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/countProteinPa", (req, res) => {
  let a = search_count_Pa();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/countProteinS", (req, res) => {
  let a = search_count_S();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/countProteinPl", (req, res) => {
  let a = search_count_Pl();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/countProteinSS", (req, res) => {
  let a = search_count_SS();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/countSPa", (req, res) => {
  let a = search_protein_count_SP();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/countSPl", (req, res) => {
  let a = search_protein_count_SB();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/countSSS", (req, res) => {
  let a = search_protein_count_SSS();
  a.then(function (result) {
    res.json(result);
  });
});

async function search_saliva_abundance() {
  // Initialize the client.
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
    index: "unique_protein_by_sample_type",
    body: query,
  });

  return response.body.hits.hits;
}

async function saliva_protein_count() {
  // Initialize the client.
  var client = await getClient();

  var response = await client.count({
    // required index
    index: "saliva_protein_test",
    body: {
      // you can count based on specific query or remove body at all
      query: { match_all: {} },
    },
  });

  return response.body;
}

app.get("/saliva_protein_count/", (req, res) => {
  let a = saliva_protein_count();
  a.then(function (result) {
    res.json(result);
  });
});

async function saliva_protein_table(size, from) {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: size,
    from: from,
    query: {
      match_all: {},
    },
  };

  var response = await client.search({
    index: "saliva_protein_test",
    body: query,
  });
  return response.body.hits.hits;
}

app.get("/saliva_protein_table/:size/:from/", (req, res) => {
  let a = saliva_protein_table(req.params.size, req.params.from);
  a.then(function (result) {
    res.json(result);
  });
});

async function opCount() {
  var client = await getClient();

  const response = await client.search({
    index: "saliva_protein_test", // Replace with your index name
    body: {
      size: 0,
      aggs: {
        langs: {
          terms: {
            field: "expert_opinion.keyword",
          },
        },
      },
    },
  });

  return response.body.aggregations.langs.buckets;
}

app.get("/opCount", (req, res) => {
  let a = opCount();
  a.then(function (result) {
    res.json(result);
  });
});

async function searchOp(size, from, text) {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: size,
    from: from,
    query: {
      match: {
        expert_opinion: text,
      },
    },
  };

  var response = await client.search({
    index: "saliva_protein_test",
    body: query,
  });

  return response.body.hits.hits;
}

app.get("/searchOp/:size/:from/:text", (req, res) => {
  let a = searchOp(req.params.size, req.params.from, req.params.text);
  a.then(function (result) {
    res.json(result);
  });
});

async function IHCCount() {
  var client = await getClient();

  const response = await client.search({
    index: "saliva_protein_test", // Replace with your index name
    body: {
      size: 0,
      aggs: {
        langs: {
          terms: {
            field: "IHC.keyword",
          },
        },
      },
    },
  });

  return response.body.aggregations.langs.buckets;
}

app.get("/IHCCount", (req, res) => {
  let a = IHCCount();
  a.then(function (result) {
    res.json(result);
  });
});

async function WSVal() {
  var client = await getClient();

  const response = await client.search({
    index: "saliva_protein_test", // Replace with your index name
    body: {
      query: {
        range: {
          saliva_abundance: {
            gte: 0,
            lte: 10,
          },
        },
      },
    },
  });

  return response.body;
}

app.get("/WSVal", (req, res) => {
  let a = WSVal();
  a.then(function (result) {
    res.json(result);
  });
});

async function filter_search(indexName, field, prefix, size, from) {
  var client = await getClient();

  const response = await client.search({
    index: indexName, // Replace with your index name
    body: {
      size: size,
      from: from,
      query: {
        match_phrase_prefix: {
          [field]: {
            query: prefix,
          },
        },
      },
    },
  });

  return response.body.hits;
}

app.get("/filter_search/:indexName/:field/:prefix/:size/:from", (req, res) => {
  let a = filter_search(
    req.params.indexName,
    req.params.field,
    req.params.prefix,
    req.params.size,
    req.params.from
  );
  a.then(function (result) {
    res.json(result);
  });
});

async function search_protein() {
  // Initialize the client.
  var client = await getClient1();

  var query = {
    size: 10000,
    query: {
      match_all: {},
    },
  };

  var response = await client.search({
    index: "salivary-proteins",
    body: query,
    _source: [
      "salivary_proteins.uniprot_accession",
      "salivary_proteins.gene_symbol",
      "salivary_proteins.protein_name",
      "salivary_proteins.expert_opinion",
      "salivary_proteins.ihc",
      "salivary_proteins.atlas",
      "salivary_proteins.expert_opinion",
    ],
  });
  return response.body.hits.hits;
}

app.get("/protein", (req, res) => {
  let a = search_protein();
  a.then(function (result) {
    res.json(result);
  });
});

app.get("/protein/:id", (req, res) => {
  let a = search_proteinID(req.params.id);
  a.then(function (result) {
    console.log(result);
    res.json(result);
  });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});

search_cluster().catch(console.log);
search_gene().catch(console.log);
search_signature().catch(console.log);
search_citation().catch(console.log);
search_geneID("EntrezGene:1").catch(console.log);
search_proteinID("P04908").catch(console.log);
