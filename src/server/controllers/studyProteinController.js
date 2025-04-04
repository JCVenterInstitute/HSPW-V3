const { getClient } = require("../utils");

const searchStudyProtein = async (req, res) => {
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
  };

  const response = await client.search({
    index: process.env.INDEX_STUDY_PROTEIN,
    body: query,
  });

  res.json(response.body.hits.hits);
};

const searchStudyProteinUniprot = async (req, res) => {
  const { id } = req.params;

  const client = await getClient();

  const query = {
    size: 10000,
    query: {
      query_string: {
        default_field: "Uniprot_id",
        query: id,
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_STUDY_PROTEIN,
    body: query,
  });

  res.json(response.body.hits.hits);
};

const bulkStudyProteins = async (req, res) => {
  const { ids } = req.body;

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

  res.json(response.body.hits.hits);
};

module.exports = {
  searchStudyProtein,
  searchStudyProteinUniprot,
  bulkStudyProteins,
};
