import React from "react";

import CitationTable from "../../../components/CitationTable";
import MainFeature from "../../../assets/hero.jpeg";
import "../../style.css";
import { Container } from "@mui/material";

const CitationPage = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${MainFeature})`,
        }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Citation</h1>
          <p className="head_text">
            PubMed is a service of the U.S. National Library of Medicine that
            includes over 17 million citations from MEDLINE and other life
            science journals for biomedical articles back to the 1950s. PubMed
            includes links to full text articles and other related resources.
          </p>
        </Container>
      </div>
      <CitationTable />
    </>
  );
};

export default CitationPage;
