import React from "react";

import CitationTable from "../../components/CitationTable";
import main_feature from "../../components/hero.jpeg";
import "../style.css";

const CitationPage = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${main_feature})`,
        }}
        className="head_background"
      >
        <h1
          className="head_title"
          align="left"
        >
          Citation
        </h1>
        <p
          style={{
            textAlign: "left",
            color: "white",
            paddingBottom: "15px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
          className="head_text"
        >
          PubMed is a service of the U.S. National Library of Medicine that
          includes over 17 million citations from MEDLINE and other life science
          journals for biomedical articles back to the 1950s. PubMed includes
          links to full text articles and other related resources.
        </p>
      </div>
      <h2 style={{ textAlign: "center", marginTop: "10px" }}>
        PubMed Citations
      </h2>
      <CitationTable />
    </>
  );
};

export default CitationPage;
