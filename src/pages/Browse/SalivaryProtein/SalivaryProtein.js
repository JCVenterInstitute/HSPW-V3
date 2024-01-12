import FontAwesome from "react-fontawesome";

import Protein from "../../../components/SalivaryProtein/SalivaryProteinTable.js";
import MainFeature from "../../../assets/hero.jpeg";
import "../../style.css";
import { Container } from "@mui/material";

const SalivaryProtein = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${MainFeature})`,
        }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Salivary Protein</h1>
          <p className="head_text">
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
            based on current supporting evidence derived from data uploaded to
            the wiki or retrieved from external sources, such as the{" "}
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
          </p>
        </Container>
      </div>
      <Protein />
    </>
  );
};

export default SalivaryProtein;
