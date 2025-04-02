import React from "react";
import { Typography, Container } from "@mui/material";

import PsiBlastSequenceParameters from "../../components/MultipleSequenceAlignment/PsiBlastSequenceParameters";
import PageHeader from "../../components/Layout/PageHeader";

const PSIBlast = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Analyze" },
    { path: "Protein Similarity Search" },
  ];

  return (
    <>
      <PageHeader
        tabTitle={`HSP | Protein Similarity Search`}
        title={`Protein Similarity Search`}
        breadcrumb={breadcrumbPath}
        description={`BLAST stands for Basic Local Alignment Search Tool. The emphasis of
            this tool is to find regions of sequence similarity, which will
            yield functional and evolutionary clues about the structure and
            function of your novel sequence. Position specific iterative BLAST
            (PSI-BLAST) refers to a feature of BLAST 2.0 in which a profile is
            automatically constructed from the first set of BLAST alignments.
            PSI-BLAST is similar to NCBI BLAST2 except that it uses
            position-specific scoring matrices derived during the search, this
            tool is used to detect distant evolutionary relationships. PHI-BLAST
            functionality is available to use patterns to restrict search
            results.`}
      />
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
