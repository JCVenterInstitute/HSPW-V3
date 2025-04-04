const { getClient } = require("../utils");

/**
 * Return Salivary Protein by ID
 * @param {string} req.id - Id of protein to return
 */
const getSalivaryProteinById = async (req, res) => {
  const { id } = req.params;

  const client = await getClient();

  const query = {
    query: {
      bool: {
        filter: [
          {
            term: {
              "salivary_proteins.uniprot_accession.keyword": id,
            },
          },
        ],
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_SALIVARY_PROTEIN,
    body: query,
  });

  res.json(response.body.hits.hits);
};

/**
 * Query data used for Salivary Protein page table
 * @param {Number} size Number of records to return
 * @param {Number} from Starting point for the data page to return
 * @param {Object[]} filter All applied filters applied by user in facet menu
 * @param {Object[]} sort Sort query for column selected to sort by from table
 * @param {Object} keyword String entered by user into search bar
 * @param {Boolean} filterByOr True if using or filters, false otherwise
 */
const querySalivaryProtein = async (req, res) => {
  const { filters, sort, keyword, filterByOr } = req.body;
  const { size, from } = req.params;

  const client = await getClient();

  const payload = {
    index: process.env.INDEX_SALIVARY_SUMMARY,
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
          ...(filterByOr === true
            ? { should: { filter: filters } }
            : { filter: filters }),
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
  getSalivaryProteinById,
  querySalivaryProtein,
};
