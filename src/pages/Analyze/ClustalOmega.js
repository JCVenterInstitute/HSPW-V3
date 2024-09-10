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
      <BreadCrumb path={breadcrumbPath} />
      <div
        className="head_background"
        style={{ backgroundImage: `url(${main_feature})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Multiple Sequence Alignment</h1>
          <p className="head_text">
            Multiple sequence alignment program that detects similarities and
            differences among DNA or protein sequences to predict the functions
            and structures of proteins and to identify new members of protein
            families. Clustal Omega is a new multiple sequence alignment program
            that uses seeded guide trees and HMM profile-profile techniques to
            generate alignments between three or more sequences. This service is
            provided by the European Bioinformatics Institute (EBI).
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
