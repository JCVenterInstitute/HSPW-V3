import { Container, Typography } from "@mui/material";

import SalivaryProtein from "@Assets/icons/icon-salivary-protein.png";
import Analysis from "@Assets/icons/icon-analyze.png";
import Download from "@Assets/icons/icon-download.png";
import Upload from "@Assets/icons/icon-upload.png";
import Publications from "@Assets/icons/icon-publications.png";
import Gene from "@Assets/icons/icon-gene.png";
import ProteinCluster from "@Assets/icons/icon-clustering.png";
import Api from "@Assets/icons/icon-api.png";

const liStyle = {
  padding: "5px 15px",
};

/**
 * Content for the home page cards
 */
export const cardData = {
  layout: "fixed",
  basicCards: [
    {
      imageSrc: SalivaryProtein,
      title: "Salivary Protein",
      blurb: "Search for specific salivary proteins found in our database.",
      location: "/salivary-protein",
    },
    {
      imageSrc: Analysis,
      title: "Protein Analysis",
      blurb: "Evaluate proteins, quantify abundance and perform statistics.",
      location: "/analysis-home",
    },
    {
      imageSrc: Upload,
      title: "Upload Experiment",
      blurb:
        "Upload experiment to the database. Files have to be in mzTab format.",
      location: "/upload-experiment",
    },
    {
      imageSrc: Download,
      title: "Download Datasets",
      blurb:
        "Download datasets from database with protein abundance and sequence.",
      location: "/download",
    },
    {
      imageSrc: Publications,
      title: "Publications",
      blurb:
        "Includes links to full text articles and other related resources.",
      location: "/citation",
    },
    {
      imageSrc: Gene,
      title: "Find Gene",
      blurb:
        "A locatable region of genomic sequence, corresponding to a unit of inheritance.",
      location: "/gene",
    },
    {
      imageSrc: ProteinCluster,
      title: "Protein Cluster",
      blurb:
        "Search clusters that share one or more common proteins are merged further.",
      location: "/protein-cluster",
    },
    {
      imageSrc: Api,
      title: "API",
      blurb:
        "Allows access to the datasets by retrieving requested data in JSON format.",
      location: "/api-description",
    },
    {
      destination: false,
      rawContent: (
        <div className="basic-card-content basic-card-content-centered">
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <iframe
                src="https://www.linkedin.com/embed/feed/update/urn:li:share:7171986524798984192"
                height="780"
                width="340"
                frameBorder="0"
                allowFullScreen=""
                title="Embedded post"
              ></iframe>
              <iframe
                src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7171010609839370240"
                height="1560"
                width="340"
                frameBorder="0"
                allowFullScreen=""
                title="Embedded post"
              ></iframe>
              <iframe
                src="https://www.linkedin.com/embed/feed/update/urn:li:share:7166890619200598016"
                height="460"
                width="340"
                frameBorder="0"
                allowFullScreen=""
                title="Embedded post"
              ></iframe>
              <iframe
                src="https://www.linkedin.com/embed/feed/update/urn:li:share:7150141766891892736"
                height="520"
                width="340"
                frameBorder="0"
                allowFullScreen=""
                title="Embedded post"
              ></iframe>
            </div>
          </div>
        </div>
      ),
    },
    {
      blurb: "Overview of the proteomics data stored:",
      destination: false,
      location: "/experiment-search",
      rawContent: (
        <Container style={{ padding: "10px" }}>
          <Typography
            component="div"
            sx={{
              fontFamily: "Lato",
              fontSize: "18px",
              fontWeight: "600",
              textTransform: "uppercase",
              margin: "10px",
            }}
          >
            HSP Statistics
          </Typography>
          <span
            style={{
              fontSize: "16px",
              fontFamily: "Lato",
              color: "rgba(0, 0, 0, 0.6)",
              paddingLeft: "10px",
              marginBottom: "10px",
            }}
          >
            Overview of the proteomics data stored:
          </span>
          <div
            style={{
              marginLeft: "30px",
              fontSize: "16px",
              fontFamily: "Lato",
              color: "rgba(0, 0, 0, 0.6)",
              letterSpacing: ".9px",
              paddingBottom: "90px",
              paddingTop: "30px",
            }}
          >
            <ul>
              <li style={liStyle}>7 Contributing Institutions</li>
              <li style={liStyle}>7 Studies</li>
              <li style={liStyle}>1246 Datasets</li>
              <li style={liStyle}>5 Tissue Types</li>
              <li style={liStyle}>4 Diseases + Healthy Controls</li>
            </ul>
          </div>
        </Container>
      ),
    },
    {
      size: "2",
      destination: false,
      rawContent: (
        <div
          className="basic-card-content basic-card-content-centered embed-responsive"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <iframe
            className="embed-responsive-item"
            title="youtube"
            src="https://youtube.com/embed/u4JN1FmLGE4"
            width="100%"
          ></iframe>
        </div>
      ),
    },
  ],
};
