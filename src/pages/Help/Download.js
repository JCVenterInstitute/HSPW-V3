import React from "react";
import DownloadTable from "../../components/Download/DownloadTable.js";
import "../style.css";

import MainFeature from "../../assets/hero.jpeg";
import { Container } from "@mui/material";
import BreadCrumb from "../../components/Breadcrumbs.js";
import { Helmet } from "react-helmet";

const Download = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Help" },
    { path: "Download" },
  ];

  return (
    <>
      <Helmet>
        <title>HSP | Download</title>
      </Helmet>
      <div
        className="head_background"
        style={{ backgroundImage: `url(${MainFeature})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Data Download</h1>
          <p className="head_text">
            Search and Download data in Zip, MzTab and Metadata Formats. *If you
            cite or display any content, or reference our organization, in any
            format Please follow these guidelines: Include a reference to a
            Primary publication: The Human Salivary Proteome: A Community Driven
            Research Platform OR Include a reference to our website:
            SalivaryProteome.org
          </p>
        </Container>
      </div>
      <DownloadTable />
    </>
  );
};

export default Download;
