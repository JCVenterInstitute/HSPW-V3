import * as React from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import { LinkedInEmbed } from "react-social-media-embed";

import Carousel from "../components/Carousel.js";
import salivary_protein from "../assets/icon-salivary-protein.png";
import analysis from "../assets/icon-analyze.png";
import download from "../assets/icon-download.png";
import upload from "../assets/icon-upload.png";
import pubmed from "../assets/icon-pubmed.png";
import gene from "../assets/icon-gene.png";
import protein_cluster from "../assets/icon-clustering.png";
import api from "../assets/icon-api.png";
import help from "../assets/icon-help.png";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";

import "../components/BasicCard.css";

/*
  Note: I've tried to be non-destructive with the changes where I can.  Depending on what
  you keep, you likely can remove reference to unused components and libraries.
*/

/*
  A React Component that controls the operation of the application.
  
  The data loading the state of this component likely needs to be refactored and expanded,
  but it serves as a jumping off point for styling simply the front page.
  
  The state is set up ultimately so that page changes can be handled here, so that in the
  future, updating the activePage variable should be enough to load future page content.
  Properties:
    activePage (string) : Used to specify which current page is loaded.
    pages (Object): A list of path:option pairs with information regarding page content.
    pages.layout (string): Either 'fixed' or 'fluid'.  'fixed' constrains the page width
      to the defined maximum in the CSS while 'fluid' allows the page to expand to take up
      all of the browser width.
    pages.hero (Object): An object containing configuration for a Hero element.
    pages.basicCards (Array): A list of configurations used to populate BasicCards on the 
      page.
*/
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
              imageSrc: pubmed,
              title: "PubMed",
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
            },
            {
              destination: false,
              rawContent: (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "300px%",
                  }}
                >
                  <LinkedInEmbed
                    url="https://www.linkedin.com/embed/feed/update/urn:li:share:7150141766891892736"
                    postUrl="https://www.linkedin.com/posts/salivary-proteome_thehuman-salivary-proteome-wikiis-a-collaborative-activity-7150141767646945280-3nBJ?utm_source=share&utm_medium=member_desktop"
                    width={430}
                  />
                </div>
              ),
            },
            {
              imageSrc: help,
              title: "Information for HSPW Users",
              blurb:
                "The new HSPW is built on the AWS system. Data and analysis tools and services from HSPW have now been integrated into the resource.",
              destination: false,
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
      <React.StrictMode>
        <StyledEngineProvider injectFirst>
          <div
            id="application"
            data-layout={page.layout}
          >
            <Carousel />
            <Container
              maxWidth="xl"
              sx={{ backgroundColor: "#f9f8f7", paddingY: "20px" }}
            >
              <Grid
                container
                spacing={2}
                sx={{ marginY: "20px" }}
              >
                {page.basicCards.map((props, i) => {
                  console.log(props.size);

                  return (
                    <Grid
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
                                      variant="h6"
                                      component="div"
                                    >
                                      {props.title}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
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
    );
  }
}

export default Home;
