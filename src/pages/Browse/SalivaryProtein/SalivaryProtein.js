import React from "react";
import FontAwesome from "react-fontawesome";

import Protein from "../../../components/SalivaryProtein/SalivaryProteinTable.js";
import PageHeader from "../../../components/Layout/PageHeader.js";
import "../../style.css";

const SalivaryProtein = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Browse" },
    { path: "Salivary Protein" },
  ];

  return (
    <>
      <PageHeader
        tabTitle={"HSP | Salivary Proteins"}
        title={"Salivary Protein"}
        breadcrumb={breadcrumbPath}
        description={
          <React.Fragment>
            Proteins listed below have been manually reviewed and annotated by{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.uniprot.org/"
              className="linksa"
            >
              {"UniProt "}
              <FontAwesome
                className="super-crazy-colors"
                name="external-link"
                style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
              />
            </a>{" "}
            , and have evidence of existence in human saliva through{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://en.wikipedia.org/wiki/Tandem_mass_spectrometry"
              className="linksa"
            >
              {"tandem mass spectrometry (MS/MS) "}
              <FontAwesome
                className="super-crazy-colors"
                name="external-link"
                style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
              />
            </a>{" "}
            experiments using whole saliva or glandular secretion samples
            collected from healthy subjects. The list is updated automatically
            based on current supporting evidence derived from data uploaded or
            retrieved from external sources, such as the{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.proteinatlas.org/"
              className="linksa"
            >
              {"Human Protein Atlas "}
            </a>
            <FontAwesome
              className="super-crazy-colors"
              name="external-link"
              style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
            />
            .
          </React.Fragment>
        }
      />
      <Protein />
    </>
  );
};

export default SalivaryProtein;
