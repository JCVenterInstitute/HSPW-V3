import React from "react";
import {
  Typography,
  Container,
  Grid,
  Box,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import main_feature from "../assets/hero.jpeg";
import FontAwesome from "react-fontawesome";

const sharedStyles = {
  padding: "20px",
  bgcolor: "#ededed",
  fontSize: "16px",
  flexGrow: 1,
  display: "flex",
};

const ApiSection = ({
  name,
  schema,
  requestBody,
  queryParamDescription,
  mapping,
  endpoint = "",
  description = "",
  exampleExplanation = "",
}) => {
  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        item
        xs={12}
      >
        <Typography>
          <b>GET: </b> https://dev.salivaryproteome.org{endpoint}
          <br />
          {queryParamDescription}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
      >
        <Typography>
          <b>Description: </b>
          {description}
        </Typography>
      </Grid>
      <Grid
        item
        lg={12}
      >
        <Accordion sx={{ boxShadow: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h4>Data Schema</h4>
          </AccordionSummary>
          <AccordionDetails sx={sharedStyles}>
            <pre>{JSON.stringify(mapping, null, 2)}</pre>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid
        item
        lg={12}
      >
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h4>Data Structure</h4>
          </AccordionSummary>
          <AccordionDetails sx={sharedStyles}>
            <pre>{JSON.stringify(schema, null, 2)}</pre>
          </AccordionDetails>
        </Accordion>
      </Grid>

      {Object.keys(requestBody).length !== 0 ? (
        <Grid
          item
          lg={12}
        >
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h4>Request Body Example</h4>
            </AccordionSummary>
            <AccordionDetails sx={sharedStyles}>
              <Typography>
                <div>{exampleExplanation}</div>
                <div>
                  <pre>{JSON.stringify(requestBody, null, 2)}</pre>
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ) : null}
    </Grid>
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ApiPage = () => {
  const [value, setValue] = React.useState(0);

  const sections = [
    "Salivary Summary",
    "Salivary Proteins",
    "Citations",
    "Protein Signatures",
    "Genes",
    "Study Proteins",
    "Protein Cluster",
    "Study",
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const salivaryProtein = {
    id: "",
    salivary_proteins: {
      uniprot_accession: "",
      uniprot_secondary_accession: [""],
      status: "",
      gene_symbol: "",
      protein_name: "",
      protein_alternate_names: [],
      alternative_products_isoforms: [],
      expert_opinion: "",
      protein_sequence_length: 0,
      protein_sequence: "",
      reference_sequence: [""],
      mass: 0,
      primary_gene_names: [""],
      protein_names: [],
      p_db: [],
      alpha_fold_db: [""],
      intact: [""],
      peptide_atlas: [""],
      massive: [""],
      pride: [],
      ensembl: [""],
      ensembl_g: "",
      entrez_gene_id: [""],
      kegg: [""],
      gene_cards: [""],
      glygen: "",
      created_on: "",
      last_modified: "",
      uniparc_id: "",
      plasma_abundance: "",
      ev_abundance: "",
      cites: [""],
      keywords: [
        {
          id: "",
          keyword: "",
        },
      ],
      ihc: "",
      atlas: [
        {
          tissue: "",
          nx: "",
          score: "",
          enriched: "",
        },
      ],
      annotations: [
        {
          annotation_type: "",
          annotation_description: [
            {
              description: "",
              evidences: [
                {
                  evidenceCode: "",
                },
              ],
            },
          ],
          features: [],
        },
      ],
      glycans: [],
    },
  };

  const salivaryProteinReqBody = {};

  const salivaryProteinMapping = {
    salivary_proteins: {
      mappings: {
        properties: {
          id: {
            type: "text",
          },
          salivary_proteins: {
            properties: {
              alpha_fold_db: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              alternative_products_isoforms: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              annotations: {
                properties: {
                  annotation_description: {
                    properties: {
                      description: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                      evidences: {
                        properties: {
                          evidenceCode: {
                            type: "text",
                            fields: {
                              keyword: {
                                type: "keyword",
                                ignore_above: 256,
                              },
                            },
                          },
                          id: {
                            type: "text",
                            fields: {
                              keyword: {
                                type: "keyword",
                                ignore_above: 256,
                              },
                            },
                          },
                          source: {
                            type: "text",
                            fields: {
                              keyword: {
                                type: "keyword",
                                ignore_above: 256,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  annotation_type: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  features: {
                    properties: {
                      description: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                      evidences: {
                        properties: {
                          evidenceCode: {
                            type: "text",
                            fields: {
                              keyword: {
                                type: "keyword",
                                ignore_above: 256,
                              },
                            },
                          },
                          id: {
                            type: "text",
                            fields: {
                              keyword: {
                                type: "keyword",
                                ignore_above: 256,
                              },
                            },
                          },
                          source: {
                            type: "text",
                            fields: {
                              keyword: {
                                type: "keyword",
                                ignore_above: 256,
                              },
                            },
                          },
                        },
                      },
                      id: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                      position: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                      type: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                    },
                  },
                },
              },
              atlas: {
                properties: {
                  enriched: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  nx: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  score: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  tissue: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                },
              },
              cites: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              created_on: {
                type: "date",
              },
              ensembl: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              ensembl_g: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              entrez_gene_id: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              ev_abundance: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              expert_opinion: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              gene_cards: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              gene_symbol: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              glycans: {
                properties: {
                  glytoucan_accession: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  image: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  mass: {
                    type: "float",
                  },
                  note: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  residue: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  source: {
                    properties: {
                      database: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                      id: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                      url: {
                        type: "text",
                        fields: {
                          keyword: {
                            type: "keyword",
                            ignore_above: 256,
                          },
                        },
                      },
                    },
                  },
                  type: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                },
              },
              glygen: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              ihc: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              intact: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              kegg: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              keywords: {
                properties: {
                  id: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                  keyword: {
                    type: "text",
                    fields: {
                      keyword: {
                        type: "keyword",
                        ignore_above: 256,
                      },
                    },
                  },
                },
              },
              last_modified: {
                type: "date",
              },
              mass: {
                type: "long",
              },
              massive: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              p_db: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              peptide_atlas: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              plasma_abundance: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              pride: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              primary_gene_names: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              protein_alternate_names: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              protein_name: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              protein_names: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              protein_sequence: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              protein_sequence_length: {
                type: "long",
              },
              reference_sequence: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              status: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              uniparc_id: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              uniprot_accession: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
              uniprot_secondary_accession: {
                type: "text",
                fields: {
                  keyword: {
                    type: "keyword",
                    ignore_above: 256,
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const salivarySummary = {
    uniprot_accession: "",
    "sm/sl_peptide_count": 0.0,
    "sm/sl_abundance": 0.0,
    saliva_peptide_count: 0,
    saliva_abundance: 0.0,
    parotid_gland_peptide_count: 0,
    parotid_gland_abundance: 0.0,
    EV_abundance: "",
    mRNA: 0.0,
    specificity: "",
    specificity_score: "",
    plasma_abundance: 0.0,
    IHC: "",
    "Protein Name": "",
    expert_opinion: "",
    "Gene Symbol": "",
  };

  const citationMapping = {
    citation: {
      mappings: {
        properties: {
          Abstract: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          PubDate: {
            type: "date",
            format: "yyyy/MM/dd HH:mm:ss||yyyy/MM/dd||epoch_millis",
          },
          PubMed_ID: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          PubYear: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          Title: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          affiliation: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          author_names: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          journal_title: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          keywords: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
        },
      },
    },
  };

  const citationReqBody = {
    filters: [
      {
        bool: {
          filter: [
            {
              regexp: {
                "PubMed_ID.keyword": {
                  value: "18849968.*",
                  flags: "ALL",
                  case_insensitive: true,
                },
              },
            },
          ],
        },
      },
    ],
  };

  const citation = {
    PubMed_ID: "",
    PubDate: "",
    author_names: [""],
    journal_title: "Cell",
    keywords: [],
    affiliation: "",
    Title: "",
    Abstract: "",
    PubYear: "",
  };

  const salivarySummaryReqBody = {
    filters: [
      {
        bool: {
          filter: [
            {
              regexp: {
                "uniprot_accession.keyword": {
                  value: "P0D.*",
                  flags: "ALL",
                  case_insensitive: true,
                },
              },
            },
          ],
        },
      },
    ],
    filterByOr: false,
  };

  const salivarySummaryMapping = {
    salivary_summary: {
      mappings: {
        properties: {
          EV_abundance: {
            type: "float",
          },
          "Gene Symbol": {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          IHC: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          "Protein Name": {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          Specificity: {
            type: "long",
          },
          Specificity_Score: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          "UniProt Accession": {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          expert_opinion: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          mRNA: {
            type: "float",
          },
          parotid_gland_abundance: {
            type: "float",
          },
          parotid_gland_peptide_count: {
            type: "long",
          },
          plasma_abundance: {
            type: "long",
          },
          saliva_abundance: {
            type: "float",
          },
          saliva_peptide_count: {
            type: "long",
          },
          "sm/sl_abundance": {
            type: "long",
          },
          "sm/sl_peptide_count": {
            type: "long",
          },
          specificity: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          specificity_score: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          uniprot_accession: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
        },
      },
    },
  };

  const proteinSignature = {
    "InterPro ID": "",
    Type: "",
    Name: "",
    "# of Members": [""],
    ReferencesID: "",
    Signature: "",
    Abstract: "",
    "GO Annotations": "",
  };

  const proteinSignatureMapping = {
    protein_signature: {
      mappings: {
        properties: {
          "# of Members": {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          Abstract: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          "GO Annotations": {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          "InterPro ID": {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          Name: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          ReferencesID: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          Signature: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          Type: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
        },
      },
    },
  };

  const proteinSignatureReqBody = {};

  const requestBody = {};

  const genes = {
    GeneID: "",
    "Gene Symbol": "",
    "Gene Name": "",
    Aliases: "",
    Location: "",
    Chromosome: "",
    organism: "",
    Summary: "",
    "Gene Products": [""],
  };

  const genesMapping = {
    gene: {
      mappings: {
        properties: {
          Aliases: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          Chromosome: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          "Gene Name": {
            type: "keyword",
            fields: {
              text: {
                type: "text",
              },
            },
          },
          "Gene Products": {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          "Gene Symbol": {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          GeneID: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          Location: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          Summary: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          organism: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
        },
      },
    },
  };

  const geneReqBody = {};

  const studyProtein = {
    experiment_id_key: 0,
    Uniprot_id: "",
    submitted_protein_database: "",
    submitted_protein_db_version: "",
    protein_sequence_length: "",
    abundance: "",
    protein_name: "",
    protein_score: "",
    peptide_count: "",
    experiment_protein_count: "0",
    experiment_peptide_count: "0",
    peptide_cleavages: "0",
    abundance_cleavages: "0.0",
    mz_number: "0",
    protein_threshold: "0.0",
    uparc: "",
  };

  const studyProteinMapping = {
    study_protein: {
      mappings: {
        properties: {
          Uniprot_id: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          abundance: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          abundance_cleavages: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          experiment_id_key: {
            type: "long",
          },
          experiment_peptide_count: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          experiment_protein_count: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          mz_number: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          peptide_cleavages: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          peptide_count: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          protein_name: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          protein_score: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          protein_sequence_length: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          protein_threshold: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          submitted_protein_database: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          submitted_protein_db_version: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          uparc: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
        },
      },
    },
  };

  const studyProteinReqBody = {};

  const proteinClusterMapping = {
    protein_cluster: {
      mappings: {
        properties: {
          cluster_members: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          number_of_members: {
            type: "long",
          },
          protein_name: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          uniprot_id: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
        },
      },
    },
  };

  const proteinCluster = {
    uniprot_id: "",
    cluster_members: [""],
    number_of_members: 0,
    protein_name: "",
  };

  const proteinClusterReqBody = {};

  return (
    <>
      <div
        className="head_background"
        style={{ backgroundImage: `url(${main_feature})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">API</h1>
          <p className="head_text">
            Our Apis use OpenSearch query DSL. For more details please checkout
            the OpenSearch{" "}
            <a
              href="https://opensearch.org/docs/latest/query-dsl/"
              target="_blank"
            >
              {"documentation "}
              <FontAwesome
                className="super-crazy-colors"
                name="external-link"
                style={{
                  textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                }}
              />
              {"."}
            </a>
          </p>
        </Container>
      </div>
      <Container
        maxWidth="xl"
        sx={{ mt: 4 }}
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              {sections.map((sec, i) => (
                <Tab
                  label={`${sec}`}
                  {...a11yProps(i)}
                />
              ))}
            </Tabs>
          </Box>
          <CustomTabPanel
            value={value}
            index={0}
          >
            <ApiSection
              name={"Salivary Summary"}
              schema={salivarySummary}
              mapping={salivarySummaryMapping}
              requestBody={salivarySummaryReqBody}
              endpoint={"/api/salivary-proteins/:size/:from/"}
              queryParamDescription={
                "Query params `:size` and `:from` used for pagination. Size is the number of records to return. From is where to start for the next set of records"
              }
              description={
                "Api to Query data our salivary proteins summary data."
              }
              exampleExplanation={
                "Query all salivary summary records that have uniprot_accession starting with P0D."
              }
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={1}
          >
            <ApiSection
              name={"Salivary Proteins"}
              schema={salivaryProtein}
              mapping={salivaryProteinMapping}
              requestBody={requestBody}
              endpoint={"/api/salivary-proteins/:size/:from/"}
              queryParamDescription={
                "Query params `:size` and `:from` used for pagination. Size is the number of records to return. From is where to start for the next set of records"
              }
              description={"Api to query our salivary proteins data."}
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={2}
          >
            <ApiSection
              name={"Citations"}
              schema={citation}
              endpoint={"/api/citations/:size/:from/"}
              mapping={citationMapping}
              requestBody={citationReqBody}
              queryParamDescription={
                "Query params `:size` and `:from` used for pagination. Size is the number of records to return. From is where to start for the next set of records"
              }
              description={"Api to query our citations data."}
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={3}
          >
            <ApiSection
              name={"Protein Signatures"}
              schema={proteinSignature}
              endpoint={"/api/protein-signature/:size/:from/"}
              mapping={proteinSignatureMapping}
              requestBody={proteinSignatureReqBody}
              queryParamDescription={
                "Query params `:size` and `:from` used for pagination. Size is the number of records to return. From is where to start for the next set of records"
              }
              description={"Api to query our protein signature data."}
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={4}
          >
            <ApiSection
              name={"Genes"}
              schema={genes}
              endpoint={"/api/genes/:size/:from/"}
              mapping={genesMapping}
              requestBody={geneReqBody}
              queryParamDescription={
                "Query params `:size` and `:from` used for pagination. Size is the number of records to return. From is where to start for the next set of records"
              }
              description={"Api to query our gene data."}
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={5}
          >
            <ApiSection
              name={"Study Protein"}
              schema={studyProtein}
              endpoint={"/api/study-protein-uniprot/:id"}
              mapping={studyProteinMapping}
              requestBody={"N/A"}
              queryParamDescription={
                "Query params `:id`. Used to fetch a specific study protein with the uniprot id"
              }
              description={"Api to query a specific study protein record."}
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={6}
          >
            <ApiSection
              name={"Protein Cluster"}
              schema={proteinCluster}
              endpoint={"/api/protein-cluster/:size/:from/"}
              mapping={proteinClusterMapping}
              requestBody={proteinClusterReqBody}
              queryParamDescription={
                "Query params `:size` and `:from` used for pagination. Size is the number of records to return. From is where to start for the next set of records"
              }
              description={"Api to query protein cluster data."}
            />
          </CustomTabPanel>
        </Box>
      </Container>
    </>
  );
};

export default ApiPage;
