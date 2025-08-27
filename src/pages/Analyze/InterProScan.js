import React from "react";
import { Typography, Container } from "@mui/material";

import InterProScanSequenceParameters from "@Components/MultipleSequenceAlignment/InterProScanSequenceParameters";
import PageHeader from "@Components/Layout/PageHeader";

const InterProScan = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Analyze" },
    { path: "Protein Signature Search" },
  ];

  return (
    <>
      <PageHeader
        tabTitle={`HSP | Protein Signature Search`}
        title={`Protein Signature Search`}
        breadcrumb={breadcrumbPath}
        description={`InterProScan is a tool that combines different protein signature
            recognition methods into one resource. The number of signature
            databases and their associated scanning tools, as well as the
            further refinement procedures, increases the complexity of the
            problem.`}
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
        <InterProScanSequenceParameters url="iprscan5" />
      </Container>
    </>
  );
};

export default InterProScan;
