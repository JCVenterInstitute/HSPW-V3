const { getClient } = require("../utils");

const getGeneById = async (req, res) => {
  const { id } = req.params;

  const client = await getClient();

  const query = {
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

  const response = await client.search({
    index: process.env.INDEX_GENE,
    body: query,
  });

  res.json(response.body.hits.hits);
};

const queryGenes = async (req, res) => {
  const { filters, sort, keyword } = req.body;
  const { size, from } = req.params;

  const client = await getClient();

  const payload = {
    index: process.env.INDEX_GENE,
    body: {
      track_total_hits: true,
      size: size,
      from: from,
      query: {
        bool: {
          ...(filters && { filter: filters }),
          ...(keyword && { must: [keyword] }), // Apply global search if present
        },
      },
      ...(sort && { sort }), // Apply sort if present
    },
  };

  const response = await client.search(payload);

  res.json(response.body);
};

module.exports = {
  getGeneById,
  queryGenes,
};
