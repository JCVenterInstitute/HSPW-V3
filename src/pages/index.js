import * as React from "react";
import ReactDOM from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import Demo from "../components/NavBar1.tsx";
import BasicCard from "../components/basic-card.js";
import Carousel from "../components/carousel";
import Footer from "../components/footer.js";
import salivary_protein from "../components/icon-salivary-protein.png";
import analysis from "../components/icon-analyze.png";
import download from "../components/icon-download.png";
import upload from "../components/icon-upload.png";
import pubmed from "../components/icon-pubmed.png";
import gene from "../components/icon-gene.png";
import protein_cluster from "../components/icon-clustering.png";
import api from "../components/icon-api.png";
import help from "../components/icon-help.png";
import { Timeline } from "react-twitter-widgets";
import Chord from "../components/chord.js";
import { PopupService } from "ag-grid-community";

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
    const base = "/hspw_new/";
    const iconFolder = base + "public/assets/images/icons/";
    this.state = {
      activePage: "/",
      pages: {
        "/": {
          layout: "fixed",
          hero: {
            width: "fullscreen",
            title: "Welcome to the Human Salivary Proteome Wiki (HSPW)",
            blurb:
              "HSPW is a collaborative, community-based Web portal to more than 1,000 unique human saliva proteins identified by high-throughput proteomic technologies. The wiki is developed for the research community and the public to harness the knowledge in the data and to further enhance the value of the proteome. You are very welcome to share your thoughts in the forums; add your own data to the growing database; annotate the proteins; or just explore the site.",
          },
          basicCards: [
            {
              imageSrc: salivary_protein,
              title: "Salivary Protein",
              blurb:
                "Search for specific salivary proteins found in our database.",
              location: "/salivary_protein",
            },
            {
              imageSrc: analysis,
              title: "Protein Analysis",
              blurb:
                "Evaluate proteins, quantify abundance and perform statistics.",
              location: "/analysis_home",
            },
            {
              imageSrc: upload,
              title: "Upload Experiment",
              blurb:
                "Upload experiment to the database. Files have to be in mzTab format.",
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
              location: "/protein_cluster",
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
                <div className="basic-card-content basic-card-content-centered">
                  <Timeline
                    dataSource={{
                      sourceType: "profile",
                      screenName: "reactjs",
                    }}
                    options={{
                      borderColor: "#FF0000",
                      width: "300",
                      height: "310",
                    }}
                  />
                </div>
              ),
            },
            {
              destination: false,
              rawContent: (
                <div className="basic-card-content basic-card-content-centered">
                  <h3>Information for HSPW Users</h3>
                  <img src={help}></img>
                  <ul className="bulletless">
                    <li>
                      The new HSPW is built on the AWS system. Data and analysis
                      tools and services from HSPW have now been integrated into
                      the resource.
                    </li>
                  </ul>
                </div>
              ),
            },
            {
              size: "2",
              destination: false,
              rawContent: (
                <div
                  className="basic-card-content basic-card-content-centered embed-responsive"
                  style={{ height: "300px" }}
                >
                  <iframe
                    className="embed-responsive-item"
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
                      location={props.location}
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

export default Home;
