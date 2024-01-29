import React from "react";
import main_feature from "../assets/hero.jpeg";
import differential from "../assets/icon-heatmap.png";
import msa from "../assets/icon-msa-alignment.png";
import blast from "../assets/icon-protein-blast.png";
import signature from "../assets/icon-protein-signature.png";
import { StyledEngineProvider } from "@mui/material/styles";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";

class analysisHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: "/",
      pages: {
        "/": {
          layout: "fixed",
          hero: {
            width: "fullscreen",
            title: "Analysis",
            blurb:
              "Analysis will identify proteins with differential abundance between experiments in Groups A and B based on their normalized spectral counts.",
          },
          basicCards: [
            {
              imageSrc: msa,
              title: "Multiple Sequence Alignment",
              blurb:
                "ClustalW is a general purpose multiple sequence alignment program for DNA or proteins.",
              location: "/clustalo",
            },
            {
              imageSrc: differential,
              title: "Differential Expression",
              blurb:
                "Shows the difference in protein abundance between samples in Groups A and B.",
              location: "/differential-expression",
            },
            {
              imageSrc: blast,
              title: "Protein Signature Search",
              blurb:
                "Finds regions of sequence similarity, which will yield functional and evolutionary clues about the structure and function of your novel sequence. ",
              location: "/iprscan5",
            },
            {
              imageSrc: signature,
              title: "Protein Similarity Search",
              blurb:
                "InterProScan is a tool that combines different protein signature recognition methods into one resource.",
              location: "/psiblast",
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
            style={{
              backgroundImage: `url(${main_feature})`,
            }}
            className="head_background"
          >
            <Container maxWidth="xl">
              <h1 className="head_title">Analysis</h1>
              <p className="head_text">
                Analysis will identify proteins with differential abundance
                between experiments in Groups A and B based on their normalized
                spectral counts.
              </p>
            </Container>
          </div>
          <div
            id="application"
            data-layout={page.layout}
          >
            <Container
              maxWidth="xl"
              sx={{
                marginTop: "24px",
                paddingY: "24px",
                backgroundColor: "#f9f8f7",
                borderRadius: "16px",
              }}
            >
              <Grid
                container
                spacing={3}
              >
                {page.basicCards.map((props, i) => {
                  return (
                    <Grid
                      key={i}
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={3}
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
                            justifyContent: "space-between",
                            borderRadius: "16px",
                          }}
                        >
                          <CardContent>
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
                              sx={{ fontFamily: "Lato", fontSize: "16px" }}
                            >
                              {props.blurb}
                            </Typography>
                          </CardContent>
                          <CardMedia
                            component={"img"}
                            image={props.imageSrc}
                          />
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

export default analysisHome;
