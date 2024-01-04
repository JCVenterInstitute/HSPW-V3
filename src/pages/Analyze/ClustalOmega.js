import React from "react";
import main_feature from "../../assets/hero.jpeg";
import { Typography, Container } from "@mui/material";
import ClustalOmegaSequenceParameters from "../../components/MultipleSequenceAlignment/ClustalOmegaSequenceParameters";

const ClustalOmega = () => {
  return (
    <>
      <div style={{ backgroundImage: `url(${main_feature})` }}>
        <h1
          style={{
            color: "white",
            display: "left",
            marginLeft: "20px",
            marginBottom: "1rem",
            paddingTop: "25px",
            paddingLeft: "40px",
          }}
        >
          Multiple Sequence Alignment
        </h1>
        <p
          style={{
            textAlign: "left",
            color: "white",
            fontSize: "18px",
            paddingBottom: "25px",
            marginLeft: "20px",
            marginRight: "20px",
            paddingLeft: "40px",
            paddingRight: "40px",
          }}
        >
          ClustalW is a general purpose multiple sequence alignment program for
          DNA or proteins. It produces biologically meaningful multiple sequence
          alignments of divergent sequences. It calculates the best match for
          the selected sequences, and lines them up so that the identities,
          similarities and differences can be seen. This service is provided by
          the European Bioinformatics Institute (EBI).
        </p>
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
