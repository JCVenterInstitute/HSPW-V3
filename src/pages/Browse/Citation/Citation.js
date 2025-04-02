import React from "react";

import CitationTable from "../../../components/Tables/CitationTable";
import PageHeader from "../../../components/Layout/PageHeader";
import "../../style.css";

const CitationPage = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Browse" },
    { path: "Publication" },
  ];

  return (
    <>
      <PageHeader
        tabTitle={"HSP | Publications"}
        title={"Publication"}
        breadcrumb={breadcrumbPath}
        description={
          "Publications page includes id, authors and links to full text\
            articles."
        }
      />
      <CitationTable />
    </>
  );
};

export default CitationPage;
