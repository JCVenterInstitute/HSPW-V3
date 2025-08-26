export const menuData = [
  {
    mainMenu: { label: "Home", link: "/" },
  },
  {
    mainMenu: { label: "Browse" },
    subMenu: [
      {
        link: "/salivary-protein",
        label: "Salivary Proteins",
      },
      {
        link: "/protein-cluster",
        label: "Protein Clusters",
      },
      {
        link: "/protein-signature",
        label: "Protein Signatures",
      },
      {
        link: "/gene",
        label: "Genes",
      },
      {
        link: "/citation",
        label: "Publications",
      },
    ],
  },
  {
    mainMenu: { label: "Search" },
    subMenu: [
      {
        link: "/global-search",
        label: "Global Search",
      },
      {
        link: "/advanced-search",
        label: "Advanced Search",
      },
      {
        link: "/experiment-search",
        label: "Experiment Search",
      },
      {
        link: "/protein-set-search",
        label: "Protein Search By Identifiers",
      },
    ],
  },
  {
    mainMenu: { label: "Analyze" },
    subMenu: [
      {
        link: "/clustalo",
        label: "Multiple Sequence Alignment",
      },
      {
        link: "/differential-expression",
        label: "Differential Expression Analysis",
      },
      {
        link: "/iprscan5",
        label: "Protein Signature Search",
      },
      {
        link: "/psiblast",
        label: "Protein Similarity Search (BLAST)",
      },
    ],
  },
  {
    mainMenu: { label: "Help" },
    subMenu: [
      {
        link: "/about",
        label: "About",
      },
      {
        link: "http://hsp-documentation.s3-website.us-east-2.amazonaws.com",
        label: "Documentation",
      },
      {
        link: "/download",
        label: "Data Download",
      },
      {
        link: "/upload-experiment",
        label: "Upload Experiment",
      },
      {
        link: "/team",
        label: "Team",
      },
      {
        link: "/contact",
        label: "Contact Us",
      },
    ],
  },
];
