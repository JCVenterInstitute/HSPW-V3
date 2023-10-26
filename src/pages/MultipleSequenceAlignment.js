import React, { useEffect, useState } from "react";
import main_feature from "../components/hero.jpeg";
import { Typography, Container, TextField, MenuItem } from "@mui/material";

import SequenceParameters from "../components/MultipleSequenceAlignment/SequenceParameters";

const MultipleSequenceAlignment = () => {
  return (
    <>
      <div style={{ backgroundImage: `url(${main_feature})` }}>
        <Typography
          variant="h3"
          sx={{ pt: 3, pb: 2, color: "white", textAlign: "center" }}
        >
          Multiple Sequence Alignment
        </Typography>
        <Container>
          <Typography variant="body1" sx={{ pb: 3, color: "white" }}>
            ClustalW is a general purpose multiple sequence alignment program
            for DNA or proteins. It produces biologically meaningful multiple
            sequence alignments of divergent sequences. It calculates the best
            match for the selected sequences, and lines them up so that the
            identities, similarities and differences can be seen. This service
            is provided by the European Bioinformatics Institute (EBI).
          </Typography>
        </Container>
      </div>
      <Container>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mt: 3, color: "black" }}
        >
          Sequence Alignment Options:
        </Typography>
      </Container>
      <Container sx={{ mt: 3 }}>
        <SequenceParameters />
      </Container>
    </>
  );
};

export default MultipleSequenceAlignment;
