import * as React from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import { Helmet } from "react-helmet";

import Banner from "../components/Carousel.js";
import salivary_protein from "../assets/icon-salivary-protein.png";
import analysis from "../assets/icon-analyze.png";
import download from "../assets/icon-download.png";
import upload from "../assets/icon-upload.png";
import publications from "../assets/icon-publications.png";
import gene from "../assets/icon-gene.png";
import protein_cluster from "../assets/icon-clustering.png";
import api from "../assets/icon-api.png";
import "../components/BasicCard.css";

import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";

const liStyle = {
  padding: "5px 15px",
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: "/",
      pages: {
        "/": {
          layout: "fixed",
          basicCards: [
            {
              imageSrc: salivary_protein,
              title: "Salivary Protein",
              blurb:
                "Search for specific salivary proteins found in our database.",
              location: "/salivary-protein",
            },
            {
              imageSrc: analysis,
              title: "Protein Analysis",
              blurb:
                "Evaluate proteins, quantify abundance and perform statistics.",
              location: "/analysis-home",
            },
            {
              imageSrc: upload,
              title: "Upload Experiment",
              blurb:
                "Upload experiment to the database. Files have to be in mzTab format.",
              location: "/upload-experiment",
            },
            {
              imageSrc: download,
              title: "Download Datasets",
              blurb:
                "Download datasets from database with protein abundance and sequence.",
              location: "/download",
            },
            {
              imageSrc: publications,
              title: "Publications",
              blurb:
                "Includes links to full text articles and other related resources.",
              location: "/citation",
            },
            {
              imageSrc: gene,
              title: "Find Gene",
              blurb:
                "A locatable region of genomic sequence, corresponding to a unit of inheritance.",
              location: "/gene",
            },
            {
              imageSrc: protein_cluster,
              title: "Protein Cluster",
              blurb:
                "Search clusters that share one or more common proteins are merged further.",
              location: "/protein-cluster",
            },
            {
              imageSrc: api,
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
        },
      },
    };
  }

  render() {
    let page = this.state.pages[this.state.activePage];

    return (
      <>
        <React.StrictMode>
          <Helmet>
            <title>HSP | Home</title>
          </Helmet>
          <StyledEngineProvider injectFirst>
            <div id="application" data-layout={page.layout}>
              <section style={{ backgroundColor: "#e6eeaf" }}>
                <Container
                  maxWidth="xl"
                  sx={{
                    fontSize: "18px",
                    paddingY: "12px",
                    borderRadius: "16px",
                  }}
                >
                  {`Our team is thrilled to release the Human Salivary Proteome
                (HSP) version 2.0 with our goal to accelerate breakthroughs in
                biomarker discovery, foster collaborative research, and impact
                precision medicine. More information can be found `}
                  <a
                    href={`${process.env.REACT_APP_PUBLIC_STATIC_S3_HOST}/web-static/HSP2.0_Flyer.pdf`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    here
                  </a>
                  {` for a quick snapshot.`}
                </Container>
              </section>
              <Banner />
              <Container
                maxWidth="xl"
                sx={{
                  backgroundColor: "#f9f8f7",
                  paddingBottom: "12px",
                  borderRadius: "16px",
                }}
              >
                <Grid container spacing={2} sx={{ marginY: "12px" }}>
                  {page.basicCards.map((props, i) => {
                    return (
                      <Grid
                        key={i}
                        item
                        xs={12}
                        sm={props.size ? 12 : 6}
                        md={props.size ? 8 : 4}
                        lg={props.size ? 6 : 3}
                      >
                        <Link
                          href={props.location}
                          sx={{ textDecoration: "none" }}
                        >
                          <Card
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              height: "100%",
                              borderRadius: "16px",
                              minHeight: "400px",
                            }}
                          >
                            {props.rawContent ? (
                              props.rawContent
                            ) : (
                              <>
                                <CardContent className="card-content">
                                  {props.rawContent ? (
                                    props.rawContent
                                  ) : (
                                    <>
                                      <Typography
                                        component="div"
                                        sx={{
                                          fontFamily: "Lato",
                                          fontSize: "18px",
                                          fontWeight: "600",
                                          textTransform: "uppercase",
                                        }}
                                      >
                                        {props.title}
                                      </Typography>
                                      <Typography
                                        color="text.secondary"
                                        sx={{
                                          fontFamily: "Lato",
                                          fontSize: "16px",
                                        }}
                                      >
                                        {props.blurb}
                                      </Typography>
                                    </>
                                  )}
                                </CardContent>
                                <CardMedia
                                  component={"img"}
                                  image={props.imageSrc}
                                  sx={{ marginY: "30px" }}
                                />
                              </>
                            )}
                          </Card>
                        </Link>
                      </Grid>
                    );
                  })}
                </Grid>
              </Container>
            </div>
          </StyledEngineProvider>
        </React.StrictMode>
      </>
    );
  }
}

export default Home;
