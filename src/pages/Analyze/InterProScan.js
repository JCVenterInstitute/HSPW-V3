import React from "react";
import main_feature from "../../components/hero.jpeg";
import { Typography, Container } from "@mui/material";
import InterProScanSequenceParameters from "../../components/MultipleSequenceAlignment/InterProScanSequenceParameters";

const InterProScan = () => {
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
          InterProScan 5
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
          InterProScan is a tool that combines different protein signature
          recognition methods into one resource. The number of signature
          databases and their associated scanning tools, as well as the further
          refinement procedures, increases the complexity of the problem.
        </p>
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
        <InterProScanSequenceParameters url="iprscan5" />
      </Container>
    </>
  );
};

export default InterProScan;
