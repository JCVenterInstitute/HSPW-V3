import React from "react";
import { Typography, Container } from "@mui/material";

import ClustalOmegaSequenceParameters from "@Components/MultipleSequenceAlignment/ClustalOmegaSequenceParameters";
import PageHeader from "@Components/Layout/PageHeader";

const ClustalOmega = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Analyze" },
    { path: "Multiple Sequence Alignment" },
  ];

  return (
    <>
      <PageHeader
        tabTitle={`HSP | Multiple Sequence Alignment`}
        title={`Multiple Sequence Alignment`}
        breadcrumb={breadcrumbPath}
        description={`Multiple sequence alignment program that detects similarities and
            differences among DNA or protein sequences to predict the functions
            and structures of proteins and to identify new members of protein
            families. Clustal Omega is a new multiple sequence alignment program
            that uses seeded guide trees and HMM profile-profile techniques to
            generate alignments between three or more sequences. This service is
            provided by the European Bioinformatics Institute (EBI).`}
      />
      <Container maxWidth="xl">
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mt: 3, color: "black" }}
        >
          Sequence Alignment Options:
        </Typography>
      </Container>
      <Container
        maxWidth="xl"
        sx={{ mt: 3 }}
      >
        <ClustalOmegaSequenceParameters url="clustalo" />
      </Container>
    </>
  );
};

export default ClustalOmega;
