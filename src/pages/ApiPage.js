import React from "react";
import main_feature from "../assets/hero.jpeg";
import { Typography, Container } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";

const ApiPage = () => {
  return (
    <>
      <div
        className="head_background"
        style={{ backgroundImage: `url(${main_feature})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">API</h1>
          <p className="head_text">Up Coming Soon</p>
        </Container>
      </div>
      <Container
        maxWidth="xl"
        sx={{ mt: 4 }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Up Coming Soon
        </Typography>
        {/* <Typography sx={{ fontFamily: "Lato", fontSize: "18px" }}>
          New evidence improved our understanding of salivary contributions to
          human health. In March 2008, an NIDCR-supported team of biologists,
          chemists, engineers and computer scientists at five research
          institutions across the country mapped the salivary proteome, or
          "dictionary," of proteins present in human saliva. Representing saliva
          samples from two dozen women and men of various ethnic backgrounds,
          the saliva catalog contains over a thousand proteins. Over half of the
          proteins in saliva were also present in blood, and nearly one quarter
          were the same as those in tears. To learn more about the project,
          please read this{" "}
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/18361515/"
            title="PubMed:18361515"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            this seminal paper
            <OpenInNewIcon sx={{ fontSize: "medium" }} />
          </a>
          .
        </Typography>
        <Typography sx={{ mt: 2, fontFamily: "Lato", fontSize: "18px" }}>
          This work was supported mainly by U.S. Public Health Service Grants
          R01 DE016937-16 (Parent Grant PI: Floyd Dewhirst, Forsyth; Supplement
          Consortium PI: Marcelo Freire, JCVI) from the National Institutes of
          Health/National Institute of Dental and Craniofacial Research.
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          A Community-based Web Portal
        </Typography>
        <Typography sx={{ fontFamily: "Lato", fontSize: "18px" }}>
          The experimental data from the project as well as information from
          popular knowledge bases such as UniProt and PubMed are now available
          online in the Human Salivary Proteome (HSP). A group of scientists
          have evolved from one study to multi-center analysis of various
          datasets to develop the{" "}
          <a
            href="https://journals.sagepub.com/doi/abs/10.1177/00220345211014432?journalCode=jdrb"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            HSP
            <OpenInNewIcon sx={{ fontSize: "medium" }} />
          </a>
          . Saliva tests based on these biomarkers offer many advantages over
          blood tests that require a needle stick and can pose contamination
          risks from blood-borne diseases. However, much effort is still
          required to enrich and refine the salivary ontology and functions.
        </Typography>
        <Typography sx={{ mt: 2, fontFamily: "Lato", fontSize: "18px" }}>
          The HSP committee members are recognized researchers in the oral
          biology community. They are tasked to develop curation guidelines,
          review annotations submitted by the community, and promote the HSP.
          Click{" "}
          <Link
            to="/team"
            style={{ textDecoration: "none" }}
          >
            here
            <OpenInNewIcon
              sx={{ fontSize: "medium", verticalAlign: "middle" }}
            />
          </Link>{" "}
          to see who they are.
        </Typography>
        <Typography sx={{ mt: 2, fontFamily: "Lato", fontSize: "18px" }}>
          To improve our efforts to a functional era of big data, our team has
          joined the team from{" "}
          <a
            href="http://www.homd.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            HOMD
            <OpenInNewIcon sx={{ fontSize: "medium" }} />
          </a>
          . We aim to integrate our datasets and bring our human derived data
          with microbial derived information. This will provide our teams with
          new knowledge of how and why complex host-microbial interactions
          govern health and disease.
        </Typography>
        <Typography sx={{ mt: 2, mb: 2, fontFamily: "Lato", fontSize: "18px" }}>
          Thank you for your participation!
        </Typography> */}
      </Container>
    </>
  );
};

export default ApiPage;
