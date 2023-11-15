const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const fs = require("fs");
const { exec } = require("child_process");
const { s3Upload } = require("./utils/s3Upload");

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

async function search_gene(size, from) {
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
    index: "genes",
    body: query,
    _source: ["GeneID", "Gene Name", "Location"],
  });
  return response.body.hits;
}

app.get("/genes/:size/:from", (req, res) => {
  let a = search_gene(req.params.size, req.params.from);
  a.then(function (result) {
    console.log(result);
    res.json(result);
  });
});

async function search_proteinID(id) {
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
    index: "salivary-proteins-102023",
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

async function search_signature(size, from) {
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
    index: "protein_signature",
    body: query,
    _source: ["InterPro ID", "Type", "Name", "# of Members"],
  });
  return response.body.hits;
}

app.get("/protein_signature/:size/:from", (req, res) => {
  let a = search_signature(req.params.size, req.params.from);
  a.then(function (result) {
    console.log(result);
    res.json(result);
  });
});

async function and_search_signature(size, from, wildQuery, scriptQuery) {
  var client = await getClient();
  console.log(wildQuery);
  wildQuery = JSON.parse(wildQuery);
  scriptQuery = JSON.parse(scriptQuery);

  var query = {
    size: size,
    from: from,
    aggs: {
      Type: {
        terms: {
          field: "Type.keyword",
        },
      },
    },
    query: {
      bool: {
        filter: wildQuery,
      },
    },
  };

  var response = await client.search({
    index: "protein_signature",
    body: query,
  });

  return response.body;
}

app.get("/signature_search/:size/:from/:query/:script", (req, res) => {
  const query = JSON.parse(req.params.query);

  let a = and_search_signature(
    req.params.size,
    req.params.from,
    req.params.query,
    req.params.script
  );
  a.then(function (result) {
    res.json(result);
  });
});

async function and_search_gene(size, from, wildQuery) {
  var client = await getClient();

  var query = {
    size: size,
    from: from,
    query: {
      bool: {
        filter: wildQuery,
      },
    },
  };

  var response = await client.search({
    index: "genes",
    body: query,
  });

  return response.body;
}

app.post("/genes_search/:size/:from/", (req, res) => {
  console.log("315" + JSON.stringify(req.body));
  let a = and_search_gene(req.params.size, req.params.from, req.body);
  a.then(function (result) {
    res.json(result);
  });
});

async function multi_search(index, text) {
  var client = await getClient();
  var query;
  console.log(index);
  if (index === "saliva_protein_test") {
    query = {
      query: {
        query_string: {
          query: text,
          fields: ["UniProt Accession", "Gene Symbol", "Protein Name"],
        },
      },
    };
  }

  var response = await client.search({
    index: index,
    body: query,
  });

  return response.body;
}

app.get("/multi_search/:index/:text", (req, res) => {
  console.log(543);
  let a = multi_search(req.params.index, req.params.text);
  console.log(234);
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
      match_all: {},
    },
  };

  var response = await client.search({
    index: "saliva_protein_test",
    body: query,
  });
  return response.body;
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

async function and_search_exclude(
  size,
  from,
  accesion,
  gene_symbol,
  protein_name,
  expert_opinion,
  start_ws,
  end_ws,
  start_par,
  end_par,
  start_p,
  end_p,
  start_ss,
  end_ss,
  start_mRNA,
  end_mRNA,
  IHC
) {
  if (IHC === "not_detected*") {
    IHC = "not\\ detected*";
  } else if (IHC === "n_a*") {
    IHC = "n\\/a*";
  }
  var client = await getClient();
  const response = await client.search({
    index: "saliva_protein_test",
    body: {
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
          must: [
            { range: { saliva_abundance: { gte: start_ws, lte: end_ws } } },
            {
              range: {
                parotid_gland_abundance: { gte: start_par, lte: end_par },
              },
            },
            { range: { "sm/sl_abundance": { gte: start_ss, lte: end_ss } } },
            { range: { mRNA: { gte: start_mRNA, lte: end_mRNA } } },
          ],
          must_not: [
            { range: { plasma_abundance: { gte: start_p, lte: end_p } } },
          ],
          filter: [
            {
              wildcard: {
                "UniProt Accession": {
                  value: accesion,
                  case_insensitive: true,
                },
              },
            },
            {
              wildcard: {
                "Gene Symbol": {
                  value: gene_symbol,
                  case_insensitive: true,
                },
              },
            },
            {
              wildcard: {
                "Protein Name": {
                  value: protein_name,
                  case_insensitive: true,
                },
              },
            },
            {
              wildcard: {
                expert_opinion: {
                  value: expert_opinion,
                  case_insensitive: true,
                },
              },
            },
            {
              query_string: {
                fields: ["IHC.keyword"],
                query: IHC,
                analyzer: "keyword",
              },
            },
          ],
        },
      },
    },
  });
  return response.body;
}

app.get(
  "/and_search_exclude/:size/:from/:accession/:gene_symbol/:protein_name/:expert_opinion/:start_ws/:end_ws/:start_par/:end_par/:start_p/:end_p/:start_ss/:end_ss/:start_mRNA/:end_mRNA,:IHC",
  (req, res) => {
    let a = and_search_exclude(
      req.params.size,
      req.params.from,
      req.params.accession,
      req.params.gene_symbol,
      req.params.protein_name,
      req.params.expert_opinion,
      req.params.start_ws,
      req.params.end_ws,
      req.params.start_par,
      req.params.end_par,
      req.params.start_p,
      req.params.end_p,
      req.params.start_ss,
      req.params.end_ss,
      req.params.start_mRNA,
      req.params.end_mRNA,
      req.params.IHC
    );
    a.then(function (result) {
      res.json(result);
    });
  }
);

async function and_search(
  size,
  from,
  accesion,
  gene_symbol,
  protein_name,
  expert_opinion,
  start_ws,
  end_ws,
  start_par,
  end_par,
  start_p,
  end_p,
  start_ss,
  end_ss,
  start_mRNA,
  end_mRNA,
  IHC
) {
  if (IHC === "not_detected*") {
    IHC = "not\\ detected*";
  } else if (IHC === "n_a*") {
    IHC = "n\\/a*";
  }
  var client = await getClient();
  const response = await client.search({
    index: "saliva_protein_test",
    body: {
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
          must: [
            { range: { saliva_abundance: { gte: start_ws, lte: end_ws } } },
            {
              range: {
                parotid_gland_abundance: { gte: start_par, lte: end_par },
              },
            },
            { range: { plasma_abundance: { gte: start_p, lte: end_p } } },
            { range: { "sm/sl_abundance": { gte: start_ss, lte: end_ss } } },
            { range: { mRNA: { gte: start_mRNA, lte: end_mRNA } } },
            {
              match: {
                Specificity: 2,
              },
            },
          ],
          filter: [
            {
              wildcard: {
                "UniProt Accession": {
                  value: accesion,
                  case_insensitive: true,
                },
              },
            },
            {
              wildcard: {
                "Gene Symbol": {
                  value: gene_symbol,
                  case_insensitive: true,
                },
              },
            },
            {
              wildcard: {
                "Protein Name": {
                  value: protein_name,
                  case_insensitive: true,
                },
              },
            },
            {
              wildcard: {
                expert_opinion: {
                  value: expert_opinion,
                  case_insensitive: true,
                },
              },
            },
            {
              query_string: {
                fields: ["IHC.keyword"],
                query: IHC,
                analyzer: "keyword",
              },
            },
          ],
        },
      },
    },
  });
  return response.body;
}

app.get(
  "/and_search/:size/:from/:accession/:gene_symbol/:protein_name/:expert_opinion/:start_ws/:end_ws/:start_par/:end_par/:start_p/:end_p/:start_ss/:end_ss/:start_mRNA/:end_mRNA,:IHC",
  (req, res) => {
    let a = and_search(
      req.params.size,
      req.params.from,
      req.params.accession,
      req.params.gene_symbol,
      req.params.protein_name,
      req.params.expert_opinion,
      req.params.start_ws,
      req.params.end_ws,
      req.params.start_par,
      req.params.end_par,
      req.params.start_p,
      req.params.end_p,
      req.params.start_ss,
      req.params.end_ss,
      req.params.start_mRNA,
      req.params.end_mRNA,
      req.params.IHC
    );
    a.then(function (result) {
      res.json(result);
    });
  }
);

async function or_search_exclude(
  size,
  from,
  accesion,
  gene_symbol,
  protein_name,
  expert_opinion,
  start_ws,
  end_ws,
  start_par,
  end_par,
  start_p,
  end_p,
  start_ss,
  end_ss,
  start_mRNA,
  end_mRNA,
  IHC
) {
  if (IHC === "not_detected*") {
    IHC = "not\\ detected*";
  } else if (IHC === "n_a*") {
    IHC = "n\\/a*";
  }
  var client = await getClient();
  const response = await client.search({
    index: "saliva_protein_test",
    body: {
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
          should: [
            {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    wildcard: {
                      "UniProt Accession": {
                        value: accesion,
                        case_insensitive: true,
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    wildcard: {
                      "Gene Symbol": {
                        value: gene_symbol,
                        case_insensitive: true,
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    wildcard: {
                      "Protein Name": {
                        value: protein_name,
                        case_insensitive: true,
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    wildcard: {
                      expert_opinion: {
                        value: expert_opinion,
                        case_insensitive: true,
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    query_string: {
                      fields: ["IHC.keyword"],
                      query: IHC,
                      analyzer: "keyword",
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must: [
                  {
                    range: { saliva_abundance: { gte: start_ws, lte: end_ws } },
                  },
                ],
                must_not: [],
                filter: [],
              },
            },
            {
              bool: {
                must: [
                  {
                    range: {
                      parotid_gland_abundance: { gte: start_par, lte: end_par },
                    },
                  },
                ],
                must_not: [],
                filter: [],
              },
            },
            {
              bool: {
                must: [],
                must_not: [
                  { range: { plasma_abundance: { gte: start_p, lte: end_p } } },
                ],
                filter: [],
              },
            },
            {
              bool: {
                must: [
                  {
                    range: {
                      "sm/sl_abundance": { gte: start_ss, lte: end_ss },
                    },
                  },
                ],
                must_not: [],
                filter: [],
              },
            },
            {
              bool: {
                must: [{ range: { mRNA: { gte: start_mRNA, lte: end_mRNA } } }],
                must_not: [],
                filter: [],
              },
            },
          ],
        },
      },
    },
  });
  return response.body;
}

app.get(
  "/or_search_exclude/:size/:from/:accession/:gene_symbol/:protein_name/:expert_opinion/:start_ws/:end_ws/:start_par/:end_par/:start_p/:end_p/:start_ss/:end_ss/:start_mRNA/:end_mRNA,:IHC",
  (req, res) => {
    let a = or_search_exclude(
      req.params.size,
      req.params.from,
      req.params.accession,
      req.params.gene_symbol,
      req.params.protein_name,
      req.params.expert_opinion,
      req.params.start_ws,
      req.params.end_ws,
      req.params.start_par,
      req.params.end_par,
      req.params.start_p,
      req.params.end_p,
      req.params.start_ss,
      req.params.end_ss,
      req.params.start_mRNA,
      req.params.end_mRNA,
      req.params.IHC
    );
    a.then(function (result) {
      res.json(result);
    });
  }
);

async function or_search(
  size,
  from,
  accesion,
  gene_symbol,
  protein_name,
  expert_opinion,
  start_ws,
  end_ws,
  start_par,
  end_par,
  start_p,
  end_p,
  start_ss,
  end_ss,
  start_mRNA,
  end_mRNA,
  IHC
) {
  if (IHC === "not_detected*") {
    IHC = "not\\ detected*";
  } else if (IHC === "n_a*") {
    IHC = "n\\/a*";
  }
  var client = await getClient();
  const response = await client.search({
    index: "saliva_protein_test",
    body: {
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
          should: [
            {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    wildcard: {
                      "UniProt Accession": {
                        value: accesion,
                        case_insensitive: true,
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    wildcard: {
                      "Gene Symbol": {
                        value: gene_symbol,
                        case_insensitive: true,
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    wildcard: {
                      "Protein Name": {
                        value: protein_name,
                        case_insensitive: true,
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    wildcard: {
                      expert_opinion: {
                        value: expert_opinion,
                        case_insensitive: true,
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    query_string: {
                      fields: ["IHC.keyword"],
                      query: IHC,
                      analyzer: "keyword",
                    },
                  },
                ],
              },
            },
            {
              bool: {
                must: [
                  {
                    range: { saliva_abundance: { gte: start_ws, lte: end_ws } },
                  },
                ],
                must_not: [],
                filter: [],
              },
            },
            {
              bool: {
                must: [
                  {
                    range: {
                      parotid_gland_abundance: { gte: start_par, lte: end_par },
                    },
                  },
                ],
                must_not: [],
                filter: [],
              },
            },
            {
              bool: {
                must: [
                  { range: { plasma_abundance: { gte: start_p, lte: end_p } } },
                ],
                must_not: [],
                filter: [],
              },
            },
            {
              bool: {
                must: [
                  {
                    range: {
                      "sm/sl_abundance": { gte: start_ss, lte: end_ss },
                    },
                  },
                ],
                must_not: [],
                filter: [],
              },
            },
            {
              bool: {
                must: [{ range: { mRNA: { gte: start_mRNA, lte: end_mRNA } } }],
                must_not: [],
                filter: [],
              },
            },
          ],
        },
      },
    },
  });
  return response.body;
}

app.get(
  "/or_search/:size/:from/:accession/:gene_symbol/:protein_name/:expert_opinion/:start_ws/:end_ws/:start_par/:end_par/:start_p/:end_p/:start_ss/:end_ss/:start_mRNA/:end_mRNA,:IHC",
  (req, res) => {
    let a = or_search(
      req.params.size,
      req.params.from,
      req.params.accession,
      req.params.gene_symbol,
      req.params.protein_name,
      req.params.expert_opinion,
      req.params.start_ws,
      req.params.end_ws,
      req.params.start_par,
      req.params.end_par,
      req.params.start_p,
      req.params.end_p,
      req.params.start_ss,
      req.params.end_ss,
      req.params.start_mRNA,
      req.params.end_mRNA,
      req.params.IHC
    );
    a.then(function (result) {
      res.json(result);
    });
  }
);

app.get("/and_search/:size/:from/:wildCardArr", (req, res) => {
  let a = or_search(req.params.size, req.params.from, req.params.wildCardArr);
  a.then(function (result) {
    res.json(result);
  });
});

async function signature_type_counts() {
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

app.get("/signature_type_counts/", (req, res) => {
  let a = signature_type_counts();
  console.log(1);
  a.then(function (result) {
    res.json(result);
  });
});

async function gene_location_counts() {
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

app.get("/gene_location_counts/", (req, res) => {
  let a = gene_location_counts();
  console.log(1);
  a.then(function (result) {
    res.json(result);
  });
});

async function search_opinion(opinion, size, from) {
  var client = await getClient();

  const response = await client.search({
    index: "saliva_protein_test",
    body: {
      size: size,
      from: from,
      query: {
        query_string: {
          query: opinion,
          fields: ["expert_opinion"],
        },
      },
    },
  });
  return response.body;
}

app.get("/search_opinion/:opinion/:size/:from", (req, res) => {
  let a = search_opinion(req.params.opinion, req.params.size, req.params.from);
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

app.post("/api/differential-expression/analyze", (req, res) => {
  const scriptPath = "/Users/iwu/Desktop/HSPW/Test1"; // Path to the directory containing the R script
  const command = "Rscript test.R"; // The R command you want to run

  exec(command, { cwd: scriptPath }, async (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      res.status(500).send(`Error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.status(500).send(`Stderr: ${stderr}`);
      return;
    }

    console.log(`stdout:\n${stdout}`);

    // Get date and time for s3 upload location
    let [date, time] = new Date(new Date() - new Date(4 * 3600000)) // EST TIME
      .toISOString()
      .split("T");
    time = time.match(/([0-9]{1,2}:[0-9]{2}:[0-9]{2}).*/)[1];

    const params = {
      bucketName: "differential-expression-result-dev",
      s3Key: `${date}/${time}`,
      contentType: "text/plain",
      directoryPath: scriptPath,
    };

    await s3Upload(params);

    res.status(200).send(`Output: ${stdout}`);
  });
});

const searchStudy = async () => {
  // Initialize the client.
  const client = await getClient();

  const query = {
    size: 10000,
    query: {
      match_all: {},
    },
  };

  const response = await client.search({
    index: "study",
    body: query,
  });

  return response.body.hits.hits;
};

app.get("/api/study", async (req, res) => {
  searchStudy().then((response) => {
    res.json(response);
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
