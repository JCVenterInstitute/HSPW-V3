import React from "react";
import { Container } from "@mui/material";
import { Helmet } from "react-helmet";

import DownloadTable from "../../components/Download/DownloadTable.js";
import MainFeature from "../../assets/hero.jpeg";
import BreadCrumb from "../../components/Layout/Breadcrumbs.js";
import "../style.css";

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
      <BreadCrumb path={breadcrumbPath} />
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
