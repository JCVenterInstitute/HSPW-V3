export const salivaryProtein = {
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

export const salivaryProteinMapping = {
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

export const salivarySummary = {
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

export const citationMapping = {
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

export const citationReqBody = {
  filters: [
    {
      bool: {
        filter: [
          {
            regexp: {
              "PubMed_ID.keyword": {
                value: "1884.*",
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

export const citation = {
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

export const salivarySummaryReqBody = {
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

export const salivarySummaryMapping = {
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

export const proteinSignature = {
  "InterPro ID": "",
  Type: "",
  Name: "",
  "# of Members": [""],
  ReferencesID: "",
  Signature: "",
  Abstract: "",
  "GO Annotations": "",
};

export const proteinSignatureMapping = {
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

export const proteinSignatureReqBody = {
  filters: [
    {
      bool: {
        filter: [
          {
            regexp: {
              Name: {
                value: "NUDIX.*",
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

export const genes = {
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

export const genesMapping = {
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

export const geneReqBody = {
  filters: [
    {
      bool: {
        filter: [
          {
            regexp: {
              "Gene Name": {
                value: "ATP.*",
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

export const studyProtein = {
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

export const studyProteinMapping = {
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

export const proteinClusterMapping = {
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

export const proteinCluster = {
  uniprot_id: "",
  cluster_members: [""],
  number_of_members: 0,
  protein_name: "",
};

export const proteinClusterReqBody = {
  filters: [
    {
      bool: {
        filter: [
          {
            regexp: {
              "uniprot_id.keyword": {
                value: "Q10.*",
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

export const study = {
  contact_name: "",
  experiment_title: "",
  sequence_mapped_swiss_count: "0",
  Taxononomy_Species: "",
  condition_type: "",
  contact_information: "",
  experiment_peptide_count: "0",
  sample_type: "",
  experiment_id_key: 0,
  institution: "",
  bto_term_list: [""],
  experiment_protein_count: "0",
  Study_name: "",
  reference_line: "0",
  bto_ac: [""],
  sample_description_comment: "",
  experiment_created_date: "",
  experiment_group_id: 0,
  PubMed_ID: "",
  experiment_short_title: "",
  Taxononomy_ID: "",
  search_engine: "",
  sample_name: "",
};

export const studyMapping = {
  study: {
    mappings: {
      properties: {
        0: {
          properties: {
            bto_ac: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            bto_term_list: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            disease: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            experiment_group_id: {
              type: "long",
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
            experiment_short_title: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            experiment_title: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            sample_description_comment: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            sample_name: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            sequence_mapped_swiss_count: {
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
        PubMed_ID: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        Study_name: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        Taxononomy_ID: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        Taxononomy_Species: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        bto_ac: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        bto_term_list: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        condition_type: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        contact_information: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        contact_name: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        disease: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        experiment_created_date: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        experiment_group_id: {
          type: "long",
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
        experiment_short_title: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        experiment_title: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        institution: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        reference_line: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        sample_description_comment: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        sample_name: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        sample_type: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        search_engine: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        sequence_mapped_swiss_count: {
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

export const studyAbundance = {
  tissue_id: "",
  tissue_term: "",
  disease_state: "",
  isoform: [""],
  experiment_count: 0,
  peptide_count: 0,
  abundance_score: 0.0,
  uniprot_id: "",
};

export const studyAbundanceMapping = {
  study_peptide_abundance: {
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
        abundance_score: {
          type: "float",
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
        disease_state: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        experiment_count: {
          type: "long",
        },
        isoform: {
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
        peptide_count: {
          type: "long",
        },
        tissue_id: {
          type: "text",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        tissue_term: {
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
