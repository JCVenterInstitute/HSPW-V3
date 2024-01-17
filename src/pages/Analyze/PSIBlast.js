import React from "react";
import main_feature from "../../assets/hero.jpeg";
import { Typography, Container } from "@mui/material";
import PsiBlastSequenceParameters from "../../components/MultipleSequenceAlignment/PsiBlastSequenceParameters";

const PSIBlast = () => {
  return (
    <>
      <div
        className="head_background"
        style={{ backgroundImage: `url(${main_feature})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Protein Similarity Search</h1>
          <p className="head_text">
            BLAST stands for Basic Local Alignment Search Tool. The emphasis of
            this tool is to find regions of sequence similarity, which will
            yield functional and evolutionary clues about the structure and
            function of your novel sequence. Position specific iterative BLAST
            (PSI-BLAST) refers to a feature of BLAST 2.0 in which a profile is
            automatically constructed from the first set of BLAST alignments.
            PSI-BLAST is similar to NCBI BLAST2 except that it uses
            position-specific scoring matrices derived during the search, this
            tool is used to detect distant evolutionary relationships. PHI-BLAST
            functionality is available to use patterns to restrict search
            results.
          </p>
        </Container>
      </div>
      <Container maxWidth="xl">
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mt: 3, color: "black" }}
        >
          Sequence Search:
        </Typography>
      </Container>
      <Container
        maxWidth="xl"
        sx={{ mt: 3 }}
      >
        <PsiBlastSequenceParameters url="psiblast" />
      </Container>
    </>
  );
};

export default PSIBlast;
