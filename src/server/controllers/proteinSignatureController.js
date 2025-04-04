const { getClient } = require("../utils");

const getProteinSignatureById = async (req, res) => {
  const { id } = req.params;

  const client = await getClient();

  const query = {
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

  const response = await client.search({
    index: process.env.INDEX_PROTEIN_SIGNATURE,
    body: query,
  });

  res.json(response.body.hits.hits);
};

const queryProteinSignature = async (req, res) => {
  const { size, from, filter, sort = null, keyword = null } = req.body;

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

  res.json(response.body);
};

module.exports = {
  getProteinSignatureById,
  queryProteinSignature,
};
