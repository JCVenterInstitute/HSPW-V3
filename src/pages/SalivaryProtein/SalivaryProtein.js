import Protein from "../../components/SalivaryProtein/SalivaryProteinTable.js";
import main_feature from "../../assets/hero.jpeg";
import "../style.css";

const Salivary_Protein = () => {
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
          Salivary Protein
        </h1>
        <p className="head_text">
          Proteins listed below have been manually reviewed and annotated by{" "}
          <a
            href="https://www.uniprot.org/"
            className="linksa"
          >
            UniProt
          </a>
          , and have evidence of existence in human saliva through{" "}
          <a
            href="https://en.wikipedia.org/wiki/Tandem_mass_spectrometry"
            className="linksa"
          >
            tandem mass spectrometry (MS/MS)
          </a>{" "}
          experiments using whole saliva or glandular secretion samples
          collected from healthy subjects. The list is updated automatically
          based on current supporting evidence derived from data uploaded to the
          wiki or retrieved from external sources, such as the{" "}
          <a
            href="https://www.proteinatlas.org/"
            className="linksa"
          >
            Human Protein Atlas
          </a>
          .
        </p>
      </div>
      <Protein />
    </>
  );
};

export default Salivary_Protein;
