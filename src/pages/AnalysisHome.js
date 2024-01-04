import React from "react";
import main_feature from "../assets/hero.jpeg";
import differential from "../assets/icon-heatmap.png";
import BasicCard from "../components/BasicCard";
import { StyledEngineProvider } from "@mui/material/styles";

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
              imageSrc: differential,
              title: "Multiple Sequence Alignment",
              blurb:
                "Shows the difference in protein abundance between samples in Groups A and B.",
            },
            {
              imageSrc: differential,
              title: "Differential Expression",
              blurb:
                "Shows the difference in protein abundance between samples in Groups A and B.",
            },
            {
              imageSrc: differential,
              title: "Protein Signature Search",
              blurb:
                "Shows the difference in protein abundance between samples in Groups A and B.",
            },
            {
              imageSrc: differential,
              title: "Protein Similarity Search",
              blurb:
                "Shows the difference in protein abundance between samples in Groups A and B.",
            },
          ],
          // basicCards: [
          //   {
          //     // size: "1",
          //     imageSrc: filtering,
          //     title: "Filtering",
          //     blurb:
          //       "Improve quality of raw data collected from various sources.",
          //   },
          //   {
          //     // size: "1",
          //     imageSrc: normalization,
          //     title: "Normalization",
          //     blurb:
          //       "Adjust values measured on different scales to a notionally common scale.",
          //   },
          //   {
          //     // size: "1",
          //     imageSrc: heatmap,
          //     title: "Heatmap",
          //     blurb:
          //       "Shows the correlation of protein abundance between two sets.",
          //   },
          //   {
          //     // size: "1",
          //     imageSrc: ranking,
          //     title: "Ranking",
          //     blurb:
          //       "Use ranking scores to find the correlation of protein abundance between two sets.",
          //   },
          //   {
          //     // size: "1",
          //     imageSrc: volcano_plot,
          //     title: "Volcano Plot",
          //     blurb:
          //       "Shows the difference in protein abundance between samples in Groups A and B.",
          //   },
          //   {
          //     // size: "1",
          //     imageSrc: network_analysis,
          //     title: "Network Analysis",
          //     blurb: "Find correlated protein in our dataset.",
          //   },
          // ],
        },
      },
    };
  }

  render() {
    let page = this.state.pages[this.state.activePage];
    return (
      <React.StrictMode>
        <StyledEngineProvider injectFirst>
          <div style={{ height: "100%", width: "100%" }}>
            <div style={{ backgroundImage: `url(${main_feature})` }}>
              <h1
                style={{
                  color: "white",
                  display: "left",
                  marginLeft: "20px",
                  marginBottom: "1rem",
                  paddingTop: "25px",
                  paddingLeft: "40px",
                }}
              >
                Analysis
              </h1>
              <p
                style={{
                  textAlign: "left",
                  color: "white",
                  fontSize: "18px",
                  paddingBottom: "25px",
                  marginLeft: "20px",
                  marginRight: "20px",
                  paddingLeft: "40px",
                  paddingRight: "40px",
                }}
              >
                Analysis will identify proteins with differential abundance
                between experiments in Groups A and B based on their normalized
                spectral counts.
              </p>
            </div>
          </div>
          <div
            id="application"
            data-layout={page.layout}
          >
            <div id="page-content">
              <div className="basic-card-container">
                {page.basicCards.map((props, i) => {
                  return (
                    <BasicCard
                      key={i}
                      rawContent={props.rawContent}
                      size={props.size}
                      destination={props.destination}
                      imageSrc={props.imageSrc}
                      title={props.title}
                      blurb={props.blurb}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </StyledEngineProvider>
      </React.StrictMode>
    );
  }
}

export default analysisHome;
