import React from "react";
import main_feature from "../../assets/hero.jpeg";
import { Typography, Container } from "@mui/material";
import InterProScanSequenceParameters from "../../components/MultipleSequenceAlignment/InterProScanSequenceParameters";
import { Helmet } from "react-helmet";
import BreadCrumb from "../../components/Breadcrumbs";

const InterProScan = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Analyze" },
    { path: "Protein Signature Search" },
  ];

  return (
    <>
      <Helmet>
        <title>HSP | Protein Signature Search</title>
      </Helmet>
      <BreadCrumb path={breadcrumbPath} />
      <div
        className="head_background"
        style={{ backgroundImage: `url(${main_feature})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Protein Signature Search</h1>
          <p className="head_text">
            InterProScan is a tool that combines different protein signature
            recognition methods into one resource. The number of signature
            databases and their associated scanning tools, as well as the
            further refinement procedures, increases the complexity of the
            problem.
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
        <InterProScanSequenceParameters url="iprscan5" />
      </Container>
    </>
  );
};

export default InterProScan;
