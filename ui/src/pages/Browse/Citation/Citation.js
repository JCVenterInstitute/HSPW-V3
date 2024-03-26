import React from "react";

import CitationTable from "../../../components/CitationTable";
import MainFeature from "../../../assets/hero.png";
import "../../style.css";
import { Container } from "@mui/material";
import BreadCrumb from "../../../components/Breadcrumbs";
import { Helmet } from "react-helmet";

const CitationPage = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Browse" },
    { path: "Publication" },
  ];

  return (
    <>
      <Helmet>
        <title>HSP | Publications</title>
      </Helmet>
      <BreadCrumb path={breadcrumbPath} />
      <div
        style={{
          backgroundImage: `url(${MainFeature})`,
        }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Publication</h1>
          <p className="head_text">
            Publications page includes id, authors and links to full text
            articles.
          </p>
        </Container>
      </div>
      <CitationTable />
    </>
  );
};

export default CitationPage;
