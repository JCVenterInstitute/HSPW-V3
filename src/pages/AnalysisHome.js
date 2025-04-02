import React from "react";
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

import PageHeader from "../components/Layout/PageHeader";
import differential from "../assets/icons/icon-heatmap.png";
import msa from "../assets/icons/icon-msa-alignment.png";
import blast from "../assets/icons/icon-protein-blast.png";
import signature from "../assets/icons/icon-protein-signature.png";

class analysisHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: "/",
      breadcrumbPath: [{ path: "Home", link: "/" }, { path: "Analysis" }],
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
        <PageHeader
          tabTitle={`HSP | Analysis`}
          title={`Analysis`}
          breadcrumb={this.state.breadcrumbPath}
          description={` Analysis will identify proteins with differential abundance
                between experiments in Groups A and B based on their normalized
                spectral counts.`}
        />
        <StyledEngineProvider injectFirst>
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
