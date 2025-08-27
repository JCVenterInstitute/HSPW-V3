const { getClient } = require("../utils");

const searchAllStudy = async (req, res) => {
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

  res.json(response.body);
};

const searchStudy = async (req, res) => {
  const { id } = req.params;

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

  res.json(response.body.hits.hits);
};

const bulkStudySearch = async (req, res) => {
  const { ids } = req.body;

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

  res.json(response.body.hits.hits);
};

module.exports = {
  searchAllStudy,
  searchStudy,
  bulkStudySearch,
};
