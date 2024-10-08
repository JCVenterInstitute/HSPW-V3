module.exports = {
  apps: [
    {
      name: "hspw",
      script: "./src/server/server.js",
      instances: "2",
      exec_mode: "cluster",
      env_dev: {
        DEPLOY_ENV: "dev",
        SMTP_USER: "/CONTACT/USER",
        SMTP_PASSWORD: "/CONTACT/PASSWORD",
        RECAPTCHA_SECRET_KEY: "/RECAPTCHA/SECRET_KEY",
        DIFFERENTIAL_S3_BUCKET: "hspw-data-dev-v2",
        R_SCRIPT_PATH: "/home/ec2-user/r4test1/test",
        R_SCRIPT_FILE_NAME: "generate-data-new-heat.R",
        CONTACT_TABLE: "hspw-dev-contact-detail",
        CONTACT_S3_BUCKET: "hspw-dev-contact-attachments",
        INDEX_PROTEIN_CLUSTER: "protein_cluster_013024",
        INDEX_SALIVARY_PROTEIN: "salivary-proteins-013024",
        INDEX_GENE: "genes",
        INDEX_PROTEIN_SIGNATURE: "protein_signature_013024",
        INDEX_CITATION: "citation_021324",
        INDEX_SALIVARY_SUMMARY: "salivary_summary_062624",
        INDEX_GO_NODES: "go_nodes",
        INDEX_GO_EDGES: "go_edges",
        INDEX_STUDY: "study",
        INDEX_STUDY_PROTEIN: "study_protein_012924",
        INDEX_PEPTIDE: "peptide_013024",
        INDEX_STUDY_PEPTIDE_ABUNDANCE: "study_peptide_abundance_020124",
        OS_HOSTNAME:
          "https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com",
        API_ENDPOINT: "http://localhost:8000",
      },
      env_prod: {
        DEPLOY_ENV: "prod",
        SMTP_USER: "/CONTACT/USER",
        SMTP_PASSWORD: "/CONTACT/PASSWORD",
        RECAPTCHA_SECRET_KEY: "/RECAPTCHA/SECRET_KEY",
        DIFFERENTIAL_S3_BUCKET: "hspw-data-prod-v2",
        R_SCRIPT_PATH: "/home/ec2-user/r4test1/test",
        R_SCRIPT_FILE_NAME: "generate-data-new-heat.R",
        CONTACT_TABLE: "hspw-prod-contact-detail",
        CONTACT_S3_BUCKET: "hspw-prod-contact-attachments",
        INDEX_PROTEIN_CLUSTER: "protein_cluster",
        INDEX_SALIVARY_PROTEIN: "salivary_proteins",
        INDEX_GENE: "genes",
        INDEX_PROTEIN_SIGNATURE: "protein_signature",
        INDEX_CITATION: "citation",
        INDEX_SALIVARY_SUMMARY: "salivary_summary",
        INDEX_GO_NODES: "go_nodes",
        INDEX_GO_EDGES: "go_edges",
        INDEX_STUDY: "study",
        INDEX_STUDY_PROTEIN: "study_protein",
        INDEX_PEPTIDE: "peptide",
        INDEX_STUDY_PEPTIDE_ABUNDANCE: "study_peptide_abundance",
        OS_HOSTNAME:
          "https://search-hspw-prod-y77jqnl5zklvuwu3k66anbowhi.us-east-2.es.amazonaws.com",
        API_ENDPOINT: "http://localhost:8000",
      },
    },
  ],
};
