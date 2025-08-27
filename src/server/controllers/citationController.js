const { getClient } = require("../utils");

const getCitationById = async (req, res) => {
  const client = await getClient();

  const { id } = req.params;

  const query = {
    query: {
      match: {
        "PubMed_ID.keyword": id,
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_CITATION,
    body: query,
  });

  res.json(response.body.hits.hits);
};

const queryCitationData = async (req, res) => {
  const { filters, sort, keyword } = req.body;
  const { size, from } = req.params;
  const client = await getClient();

  const payload = {
    index: process.env.INDEX_CITATION,
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
      _source: ["PubMed_ID", "PubDate", "Title", "journal_title"],
    },
  };

  const response = await client.search(payload);

  res.json(response.body);
};

module.exports = {
  getCitationById,
  queryCitationData,
};
