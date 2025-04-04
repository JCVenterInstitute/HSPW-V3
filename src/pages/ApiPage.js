import React from "react";
import {
  Typography,
  Container,
  Grid,
  Box,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FontAwesome from "react-fontawesome";

import MainFeature from "@Assets/backgrounds/hero.jpeg";

import {
  salivaryProtein,
  salivaryProteinMapping,
  salivarySummary,
  citationMapping,
  citationReqBody,
  citation,
  salivarySummaryReqBody,
  salivarySummaryMapping,
  proteinSignature,
  proteinSignatureMapping,
  proteinSignatureReqBody,
  genes,
  genesMapping,
  geneReqBody,
  studyProtein,
  studyProteinMapping,
  proteinClusterMapping,
  proteinCluster,
  proteinClusterReqBody,
  study,
  studyMapping,
  studyAbundance,
  studyAbundanceMapping,
} from "../utils/ApiDocData";
import BreadCrumb from "@Components/Layout/Breadcrumbs";
import { Helmet } from "react-helmet";

const sharedStyles = {
  padding: "20px",
  bgcolor: "#ededed",
  fontSize: "16px",
  flexGrow: 1,
  display: "flex",
};

const ApiSection = ({
  name,
  schema,
  requestBody = {},
  queryParamDescription,
  mapping,
  endpoint = "",
  description = "",
  exampleExplanation = "",
}) => {
  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        item
        xs={12}
      >
        <Typography>
          <b>GET: </b> {process.env.REACT_APP_API_ENDPOINT}
          {endpoint}
          <br />
          {queryParamDescription}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
      >
        <Typography>
          <b>Description: </b>
          {description}
        </Typography>
      </Grid>
      <Grid
        item
        lg={12}
      >
        <Accordion sx={{ boxShadow: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h4>Data Schema</h4>
          </AccordionSummary>
          <AccordionDetails sx={sharedStyles}>
            <pre>{JSON.stringify(mapping, null, 2)}</pre>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid
        item
        lg={12}
      >
        <Accordion sx={{ boxShadow: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h4>Data Structure</h4>
          </AccordionSummary>
          <AccordionDetails sx={sharedStyles}>
            <pre>{JSON.stringify(schema, null, 2)}</pre>
          </AccordionDetails>
        </Accordion>
      </Grid>

      {Object.keys(requestBody).length !== 0 ? (
        <Grid
          item
          lg={12}
        >
          <Accordion sx={{ boxShadow: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h4>Request Body Example</h4>
            </AccordionSummary>
            <AccordionDetails sx={sharedStyles}>
              <Typography>
                <div>{exampleExplanation}</div>
                <div>
                  <pre>{JSON.stringify(requestBody, null, 2)}</pre>
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ) : null}
    </Grid>
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ApiPage = () => {
  const [value, setValue] = React.useState(0);

  const breadcrumbPath = [{ path: "Home", link: "/" }, { path: "API" }];

  const sections = [
    "Salivary Summary",
    "Salivary Proteins",
    "Citations",
    "Protein Signatures",
    "Genes",
    "Study Proteins",
    "Protein Cluster",
    "Study",
    "Abundance",
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title>HSP | API Docs</title>
      </Helmet>
      <BreadCrumb path={breadcrumbPath} />
      <div
        className="head_background"
        style={{ backgroundImage: `url(${MainFeature})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">API</h1>
          <p className="head_text">
            Our Apis use OpenSearch query DSL. For more details please checkout
            the OpenSearch{" "}
            <a
              href="https://opensearch.org/docs/latest/query-dsl/"
              target="_blank"
              rel="noreferrer"
            >
              {"documentation "}
              <FontAwesome
                className="super-crazy-colors"
                name="external-link"
                style={{
                  textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                }}
              />
              {"."}
            </a>
          </p>
        </Container>
      </div>
      <Container
        maxWidth="xl"
        sx={{ mt: 4 }}
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
            >
              {sections.map((sec, i) => (
                <Tab
                  label={`${sec}`}
                  {...a11yProps(i)}
                />
              ))}
            </Tabs>
          </Box>
          <CustomTabPanel
            value={value}
            index={0}
          >
            <ApiSection
              name={"Salivary Summary"}
              schema={salivarySummary}
              mapping={salivarySummaryMapping}
              requestBody={salivarySummaryReqBody}
              endpoint={"/api/salivary-proteins/:size/:from/"}
              queryParamDescription={
                "Query params `:size` and `:from` used for pagination. Size is the number of records to return. From is where to start for the next set of records."
              }
              description={
                "Api to Query data our salivary proteins summary data."
              }
              exampleExplanation={
                "Query all salivary summary records that have uniprot_accession starting with P0D."
              }
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={1}
          >
            <ApiSection
              name={"Salivary Proteins"}
              schema={salivaryProtein}
              mapping={salivaryProteinMapping}
              endpoint={"/api/salivary-proteins/:uniprot-id"}
              queryParamDescription={
                "Query params `:uniprot-id`. Uniprot id of salivary protein to fetch."
              }
              description={
                "Api to query a specific salivary protein record by uniprot id."
              }
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={2}
          >
            <ApiSection
              name={"Citations"}
              schema={citation}
              endpoint={"/api/citations/:size/:from/"}
              mapping={citationMapping}
              requestBody={citationReqBody}
              queryParamDescription={
                "Query params `:size` and `:from` used for pagination. Size is the number of records to return. From is where to start for the next set of records."
              }
              description={"Api to query our citations data."}
              exampleExplanation={
                "Query all citations records that have pubmed ids starting with 1884."
              }
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={3}
          >
            <ApiSection
              name={"Protein Signatures"}
              schema={proteinSignature}
              endpoint={"/api/protein-signature/:size/:from/"}
              mapping={proteinSignatureMapping}
              requestBody={proteinSignatureReqBody}
              queryParamDescription={
                "Query params `:size` and `:from` used for pagination. Size is the number of records to return. From is where to start for the next set of records."
              }
              description={"Api to query our protein signature data."}
              exampleExplanation={
                "Query all citations records that have a name starting with NUDIX."
              }
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={4}
          >
            <ApiSection
              name={"Genes"}
              schema={genes}
              endpoint={"/api/genes/:size/:from/"}
              mapping={genesMapping}
              requestBody={geneReqBody}
              queryParamDescription={
                "Query params `:size` and `:from` used for pagination. Size is the number of records to return. From is where to start for the next set of records."
              }
              description={"Api to query our gene data."}
              exampleExplanation={
                "Query all citations records that have a name starting with ATP."
              }
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={5}
          >
            <ApiSection
              name={"Study Protein"}
              schema={studyProtein}
              endpoint={"/api/study-protein/:experiment-id-key"}
              mapping={studyProteinMapping}
              queryParamDescription={
                "Query params `:experiment-id-key`. Used to fetch all study proteins with the given experiment id key."
              }
              description={
                "Api to query a study proteins for a specific study."
              }
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={6}
          >
            <ApiSection
              name={"Protein Cluster"}
              schema={proteinCluster}
              endpoint={"/api/protein-cluster/:size/:from/"}
              mapping={proteinClusterMapping}
              requestBody={proteinClusterReqBody}
              queryParamDescription={
                "Query params `:size` and `:from` used for pagination. Size is the number of records to return. From is where to start for the next set of records."
              }
              description={"Api to query protein cluster data."}
              exampleExplanation={
                "Query all protein clusters that have a representative protein starting with Q10."
              }
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={7}
          >
            <ApiSection
              name={"Study"}
              schema={study}
              endpoint={"/api/study/:experiment-id-key"}
              mapping={studyMapping}
              queryParamDescription={
                "Query params `:experiment-id-key`. Fetch data for a specific study using the experiment id key."
              }
              description={"Api to query a study record by experiment id key."}
            />
          </CustomTabPanel>
          <CustomTabPanel
            value={value}
            index={8}
          >
            <ApiSection
              name={"Abundance"}
              schema={studyAbundance}
              endpoint={"/api/abundance-score/:uniprot-id"}
              mapping={studyAbundanceMapping}
              queryParamDescription={
                "Query params `:experiment-id-key`. Fetch abundance data for a specific salivary protein using a uniprot id."
              }
              description={
                "Api to query the abundance data for a specific salivary protein."
              }
            />
          </CustomTabPanel>
        </Box>
      </Container>
    </>
  );
};

export default ApiPage;
