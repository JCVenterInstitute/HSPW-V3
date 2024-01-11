import React from "react";
import DownloadTable from "../../components/Download/DownloadTable.js";
import "../style.css";

import MainFeature from "../../assets/hero.jpeg";

const Download = () => {
  return (
    <>
      <div
        className="head_background"
        style={{ backgroundImage: `url(${MainFeature})` }}
      >
        <h1 className="head_title">Data Download</h1>
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
          Search and Download data in Zip, MzTab and Metadata Formats. *If you
          cite or display any content, or reference our organization, in any
          format Please follow these guidelines: Include a reference to a
          Primary publication: The Human Salivary Proteome Wiki: A Community
          Driven Research Platform OR Include a reference to our website:
          SalivaryProteome.org
        </p>
      </div>
      <DownloadTable />
    </>
  );
};

export default Download;
