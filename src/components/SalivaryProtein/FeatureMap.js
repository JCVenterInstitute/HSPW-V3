import { useEffect, useState } from "react";
import ProtvistaUniprot from "protvista-uniprot";

if (!window.customElements.get("protvista-uniprot")) {
  window.customElements.define("protvista-uniprot", ProtvistaUniprot);
}

const UNIPROT_ENTRY_API = "https://www.ebi.ac.uk/proteins/api/proteins";

const message = {
  fontFamily: "Lato",
  fontSize: "14px",
  color: "black",
};

// protvista-uniprot throws and renders nothing when UniProt has no entry for
// the accession, so resolve the entry first and only mount the element once we
// know it has a sequence to draw.
const FeatureMap = ({ accession }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let ignore = false;

    const loadEntry = async () => {
      if (!accession) {
        setStatus("unavailable");
        return;
      }

      try {
        const response = await fetch(`${UNIPROT_ENTRY_API}/${accession}`);

        if (!response.ok) {
          throw new Error(`UniProt responded with ${response.status}`);
        }

        const entry = await response.json();

        if (!ignore) {
          setStatus(entry?.sequence?.sequence ? "available" : "unavailable");
        }
      } catch (error) {
        console.error(
          `Could not load the UniProt entry for ${accession}`,
          error
        );

        if (!ignore) {
          setStatus("unavailable");
        }
      }
    };

    loadEntry();

    return () => {
      ignore = true;
    };
  }, [accession]);

  if (status === "loading") {
    return <p style={message}>Loading feature map...</p>;
  }

  if (status === "unavailable") {
    return (
      <p style={message}>
        Feature map data is currently unavailable
        {accession ? ` for ${accession}` : ""} because UniProt returned no entry
        for it.{" "}
        {accession && (
          <a
            target="_blank"
            rel="noreferrer"
            style={{ color: "#0b5989" }}
            href={`https://www.uniprot.org/uniprotkb/${accession}`}
          >
            Check the entry at UniProt
          </a>
        )}
      </p>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <protvista-uniprot accession={accession}></protvista-uniprot>
    </div>
  );
};

export default FeatureMap;
