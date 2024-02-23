import React from "react";
import main_feature from "../../assets/hero.jpeg";
import { Typography, Container } from "@mui/material";
import ClustalOmegaSequenceParameters from "../../components/MultipleSequenceAlignment/ClustalOmegaSequenceParameters";
import { Helmet } from "react-helmet";
import BreadCrumb from "../../components/Breadcrumbs";

const ClustalOmega = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Analyze" },
    { path: "Multiple Sequence Alignment" },
  ];

  return (
    <>
      <Helmet>
        <title>HSP | Multiple Sequence Alignment</title>
      </Helmet>
      <div
        className="head_background"
        style={{ backgroundImage: `url(${main_feature})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Multiple Sequence Alignment</h1>
          <p className="head_text">
            ClustalW is a general purpose multiple sequence alignment program
            for DNA or proteins. It produces biologically meaningful multiple
            sequence alignments of divergent sequences. It calculates the best
            match for the selected sequences, and lines them up so that the
            identities, similarities and differences can be seen. This service
            is provided by the European Bioinformatics Institute (EBI).
          </p>
        </Container>
      </div>
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
