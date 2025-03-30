import React from "react";

import DownloadTable from "../../components/Download/DownloadTable.js";
import PageHeader from "../../components/Layout/PageHeader.js";
import "../style.css";

const Download = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Help" },
    { path: "Download" },
  ];

  return (
    <>
      <PageHeader
        tabTitle={"HSP | Download"}
        title={"Data Download"}
        breadcrumb={breadcrumbPath}
        description={
          " Search and Download data in Zip, MzTab and Metadata Formats. *If you\
            cite or display any content, or reference our organization, in any\
            format Please follow these guidelines: Include a reference to a\
            Primary publication: The Human Salivary Proteome: A Community Driven\
            Research Platform OR Include a reference to our website:\
            SalivaryProteome.org"
        }
      />
      <DownloadTable />
    </>
  );
};

export default Download;
