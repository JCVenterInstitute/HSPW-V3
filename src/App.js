import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import NavBar from "./components/NavBar.js";
import Home from "./pages";
import Download from "./pages/Help/Download.js";
import AnalysisHome from "./pages/AnalysisHome";
import Gene from "./pages/Browse/Gene/Gene.js";
import Contact from "./pages/Help/Contact.js";
import Footer from "./components/Footer.js";
import ProteinSignature from "./pages/Browse/ProteinSignature/ProteinSignature.js";
import ProteinCluster from "./pages/Browse/ProteinCluster/ProteinCluster.js";
import GeneDetail from "./pages/Browse/Gene/GeneDetail.js";
import Salivary_Protein from "./pages/Browse/SalivaryProtein/SalivaryProtein";
import Protein_Detail from "./pages/Browse/SalivaryProtein/ProteinDetail";
import Analysis from "./pages/Analysis.js";
import Citation from "./pages/Browse/Citation/Citation";
import CitationDetail from "./pages/Browse/Citation/CitationDetail";
import ProteinSignatureDetail from "./pages/Browse/ProteinSignature/ProteinSignatureDetail.js";
import ExperimentSearch from "./pages/Search/ExperimentSearch.js";
import ProteinSetSearch from "./pages/ProteinSetSearch.js";
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
import AdvancedSearch from "./pages/Search/AdvancedSearch.js";
import ProteinSequence from "./pages/Browse/SalivaryProtein/ProteinDetailSequence.js";
import GoNodes from "./pages/GoTerms/GoNode";
import GoTable from "./pages/GoTerms/GoTable";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          exact
          path="/"
          element={<Home />}
        />
        <Route
          path="/download"
          element={<Download />}
        />
        <Route
          path="/contact"
          element={<Contact />}
        />
        <Route
          path="/analysis-home"
          element={<AnalysisHome />}
        />
        <Route
          path="/gene"
          element={<Gene />}
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
          path="/protein-cluster"
          element={<ProteinCluster />}
        />
        <Route
          path="/gene/:geneid"
          element={<GeneDetail />}
        />
        <Route
          path="/protein-cluster/:clusterid"
          element={<ProteinClusterDetail />}
        />
        <Route
          path="/salivary-protein"
          element={<Salivary_Protein />}
        />
        <Route
          path="/protein/:proteinid"
          element={<Protein_Detail />}
        />
        <Route
          path="/analysis"
          element={<Analysis />}
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
          path="/differential-expression/results/:jobId"
          element={<DifferentialExpressionResults />}
        />
        <Route
          path="/differential-expression"
          element={<DifferentialExpression />}
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
          path="/advanced-search"
          element={<AdvancedSearch />}
        ></Route>
        <Route
          path="/experiment-search"
          element={<ExperimentSearch />}
        />
        <Route
          path="/Protein-Set-Search"
          element={<ProteinSetSearch />}
        />
        <Route
          path="/About"
          element={<About />}
        />
        <Route
          path="/Team"
          element={<Team />}
        />
        <Route
          path="protein-sequence/:proteinid"
          element={<ProteinSequence />}
        />
        <Route
          path="GoNodes/:id"
          element={<GoNodes />}
        />
        <Route
          path="GoTable"
          element={<GoTable />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
