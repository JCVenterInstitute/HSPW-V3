import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import NavBar from "./components/Layout/NavBar.js";
import Home from "./pages";
import Download from "./pages/Help/Download.js";
import AnalysisHome from "./pages/AnalysisHome";
import Gene from "./pages/Browse/Gene/Gene.js";
import Contact from "./pages/Help/Contact.js";
import Footer from "./components/Layout/Footer.js";
import ProteinSignature from "./pages/Browse/ProteinSignature/ProteinSignature.js";
import ProteinCluster from "./pages/Browse/ProteinCluster/ProteinCluster.js";
import GeneDetail from "./pages/Browse/Gene/GeneDetail.js";
import SalivaryProtein from "./pages/Browse/SalivaryProtein/SalivaryProtein";
import ProteinDetail from "./pages/Browse/SalivaryProtein/ProteinDetail";
import Citation from "./pages/Browse/Citation/Citation";
import CitationDetail from "./pages/Browse/Citation/CitationDetail";
import ProteinSignatureDetail from "./pages/Browse/ProteinSignature/ProteinSignatureDetail.js";
import ExperimentProteinDetail from "./pages/Search/ExperimentSearch/ExperimentProteinDetail.js";
import ExperimentSearchDetail from "./pages/Search/ExperimentSearch/ExperimentSearchDetail.js";
import ExperimentSearch from "./pages/Search/ExperimentSearch/ExperimentSearch.js";
import ProteinSetSearch from "./pages/Search/ProteinSetSearch.js";
import ProteinClusterDetail from "./pages/Browse/ProteinCluster/ProteinClusterDetail.js";
import ClustalOmegaResults from "./pages/Analyze/ClustalOmegaResults";
import ClustalOmega from "./pages/Analyze/ClustalOmega";
import InterProScanResults from "./pages/Analyze/InterProScanResults";
import InterProScan from "./pages/Analyze/InterProScan";
import PSIBlastResults from "./pages/Analyze/PSIBlastResults";
import PSIBlast from "./pages/Analyze/PSIBlast";
import About from "./pages/Help/About";
import Team from "./pages/Help/Team";
import DifferentialExpression from "./pages/Analyze/DifferentialExpression.js";
import DifferentialExpressionResults from "./pages/Analyze/DifferentialExpressionResults.js";
import GlobalSearch from "./pages/Search/GlobalSearch";
import AdvancedSearch from "./pages/Search/AdvancedSearch.js";
import ProteinSequence from "./pages/Browse/SalivaryProtein/ProteinDetailSequence.js";
import GoNodes from "./pages/GoTerms/GoNode";
import GoTable from "./pages/GoTerms/GoTable";
import PrivacyPolicyPage from "./pages/Footer/PrivacyPolicy.js";
import CopyrightPage from "./pages/Footer/Copyright.js";
import DisclaimerPage from "./pages/Footer/Disclaimer.js";
import AccessibilityPage from "./pages/Footer/Accessibility.js";

// Google Analytics
import ReactGA from "react-ga4";
import NotFoundPage from "./pages/NotFoundPage.js";
import UploadExperiment from "./pages/UploadExperiment.js";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ScrollToTop from "./components/ScrollToTop.js";
import ApiPage from "./pages/ApiPage.js";
ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1100,
      xl: 1536,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ScrollToTop />
        <div className="content-wrapper">
          <div className="main-content">
            <NavBar />
            <Routes>
              <Route
                exact
                path="/"
                element={<Home />}
              />
              <Route
                path="/salivary-protein"
                element={<SalivaryProtein />}
              />
              <Route
                path="/protein/:proteinid"
                element={<ProteinDetail />}
              />
              <Route
                path="/protein-cluster"
                element={<ProteinCluster />}
              />
              <Route
                path="/protein-cluster/:clusterid"
                element={<ProteinClusterDetail />}
              />
              <Route
                path="/protein-signature"
                element={<ProteinSignature />}
              />
              <Route
                path="/protein-signature/:interproid"
                element={<ProteinSignatureDetail />}
              />
              <Route
                path="/gene"
                element={<Gene />}
              />
              <Route
                path="/gene/:geneid"
                element={<GeneDetail />}
              />
              <Route
                path="/global-search"
                element={<GlobalSearch />}
              ></Route>
              <Route
                path="/advanced-search"
                element={<AdvancedSearch />}
              ></Route>
              <Route
                path="/experiment-protein/:uniprotid"
                element={<ExperimentProteinDetail />}
              />
              <Route
                path="/experiment-search/:id"
                element={<ExperimentSearchDetail />}
              />
              <Route
                path="/experiment-search"
                element={<ExperimentSearch />}
              />
              <Route
                path="/Protein-Set-Search"
                element={<ProteinSetSearch />}
              />
              <Route
                path="/clustalo/results/:jobId"
                element={<ClustalOmegaResults />}
              />
              <Route
                path="/clustalo"
                element={<ClustalOmega />}
              />
              <Route
                path="/differential-expression/results/:jobId"
                element={<DifferentialExpressionResults />}
              />
              <Route
                path="/differential-expression"
                element={<DifferentialExpression />}
              />
              <Route
                path="/iprscan5/results/:jobId"
                element={<InterProScanResults />}
              />
              <Route
                path="/iprscan5"
                element={<InterProScan />}
              />
              <Route
                path="/psiblast/results/:jobId"
                element={<PSIBlastResults />}
              />
              <Route
                path="/psiblast"
                element={<PSIBlast />}
              />
              <Route
                path="/citation"
                element={<Citation />}
              />
              <Route
                path="/citation/:citationid"
                element={<CitationDetail />}
              />
              <Route
                path="/about"
                element={<About />}
              />
              <Route
                path="/download"
                element={<Download />}
              />
              <Route
                path="/team"
                element={<Team />}
              />
              <Route
                path="/contact"
                element={<Contact />}
              />
              <Route
                path="/protein-sequence/:proteinid"
                element={<ProteinSequence />}
              />
              <Route
                path="go-nodes/:id"
                element={<GoNodes />}
              />
              <Route
                path="go-table"
                element={<GoTable />}
              />
              <Route
                path="/analysis-home"
                element={<AnalysisHome />}
              />
              <Route
                path="/upload-experiment"
                element={<UploadExperiment />}
              />
              <Route
                path="/api-description"
                element={<ApiPage />}
              />
              <Route
                path="/privacy-policy"
                element={<PrivacyPolicyPage />}
              />
              <Route
                path="/copyrights"
                element={<CopyrightPage />}
              />
              <Route
                path="/disclaimers"
                element={<DisclaimerPage />}
              />
              <Route
                path="/accessibility"
                element={<AccessibilityPage />}
              />
              <Route
                path="*"
                element={<NotFoundPage />}
              />
            </Routes>
            <Footer />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
