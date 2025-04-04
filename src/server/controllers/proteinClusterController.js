const { getClient } = require("../utils");

const getClusterMemberCount = async (req, res) => {
  const client = await getClient();

  const response = await client.search({
    index: process.env.INDEX_PROTEIN_CLUSTER,
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

  res.json(response.body.aggregations);
};

const fetchProteinClusterData = async (req, res) => {
  const client = await getClient();

  const query = {
    size: 10000,
    query: {
      match_all: {},
    },
  };

  const response = await client.search({
    index: process.env.INDEX_PROTEIN_CLUSTER,
    body: query,
  });

  res.json(response.body.hits.hits);
};

/**
 * Fetch protein cluster by id
 */
const getProteinClusterById = async (req, res) => {
  const client = await getClient();

  const { id } = req.params;

  const query = {
    query: {
      bool: {
        filter: [
          {
            term: {
              "uniprot_id.keyword": id,
            },
          },
        ],
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_PROTEIN_CLUSTER,
    body: query,
  });

  res.json(response.body.hits.hits);
};

const queryProteinCluster = async (req, res) => {
  const { filters, sort, keyword } = req.body;
  const { size, from } = req.params;

  const client = await getClient();

  const payload = {
    index: process.env.INDEX_PROTEIN_CLUSTER,
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
  getClusterMemberCount,
  fetchProteinClusterData,
  getProteinClusterById,
  queryProteinCluster,
};
