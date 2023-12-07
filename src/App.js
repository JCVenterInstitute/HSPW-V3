import React from "react";
import "./App.css";
import Navbar from "./components/index";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages";
import Download from "./pages/Download/download";
import Analysis_Home from "./pages/analysis_home";
import Gene from "./pages/gene";
import Contact from "./pages/contact";
import Footer from "./components/footer.js";
import Signature from "./pages/signature";
import Cluster from "./pages/cluster";
import Gene_Detail from "./pages/gene_detail";
import Salivary_Protein from "./pages/saliva_protein/salivary_protein";
import Protein_Detail from "./pages/saliva_protein/protein_detail";
import Analysis from "./pages/analysis";
import Citation from "./pages/Citation/citation";
import Citation_Detail from "./pages/Citation/citation_detail";
import Signature_Detail from "./pages/signature_detail";
import Basic_Search from "./pages/basic_search";
import Experiment_Search from "./pages/experiment_search";
import Protein_Set_Search from "./pages/protein_set_search";
import Cluster_detail from "./pages/cluster_detail";
import ClustalOmegaResults from "./pages/Analyze/ClustalOmegaResults";
import ClustalOmega from "./pages/Analyze/ClustalOmega";
import InterProScanResults from "./pages/Analyze/InterProScanResults";
import InterProScan from "./pages/Analyze/InterProScan";
import PSIBlastResults from "./pages/Analyze/PSIBlastResults";
import PSIBlast from "./pages/Analyze/PSIBlast";
import About from "./pages/Help/About";
import Team from "./pages/Help/Team";

import ProteinSequence from "./pages/saliva_protein/protein_detail_sequence";

import DifferentialExpression from "./pages/Analyze/DifferentialExpression.js";
import DifferentialExpressionResults from "./pages/Analyze/DifferentialExpressionResults.js";
import AdvancedSearch from "./pages/Search/AdvancedSearch.js";
import ProteinSequence from "./pages/saliva_protein/protein_detail_sequence";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/download" element={<Download />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/analysis_home" element={<Analysis_Home />} />
        <Route path="/gene" element={<Gene />} />
        <Route path="/protein_signature" element={<Signature />} />
        <Route
          path="/protein_signature/:interproid"
          element={<Signature_Detail />}
        />
        <Route path="/protein_cluster" element={<Cluster />} />
        <Route path="/gene/:geneid" element={<Gene_Detail />} />
        <Route
          path="/protein_cluster/:clusterid"
          element={<Cluster_detail />}
        />
        <Route path="/salivary_protein" element={<Salivary_Protein />} />
        <Route path="/protein/:proteinid" element={<Protein_Detail />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route
          path="/clustalo/results/:jobId"
          element={<ClustalOmegaResults />}
        />
        <Route path="/clustalo" element={<ClustalOmega />} />
        <Route
          path="/iprscan5/results/:jobId"
          element={<InterProScanResults />}
        />
        <Route path="/iprscan5" element={<InterProScan />} />
        <Route path="/psiblast/results/:jobId" element={<PSIBlastResults />} />
        <Route path="/psiblast" element={<PSIBlast />} />
        <Route
          path="/differential-expression/results/:jobId"
          element={<DifferentialExpressionResults />}
        />
        <Route
          path="/differential-expression"
          element={<DifferentialExpression />}
        />
        <Route path="/citation" element={<Citation />} />
        <Route path="/citation/:citationid" element={<Citation_Detail />} />
        <Route path="/Basic_Search" element={<Basic_Search />} />
        <Route path="/advanced-search" element={<AdvancedSearch />}></Route>
        <Route path="/Experiment_Search" element={<Experiment_Search />} />
        <Route path="/Protein_Set_Search" element={<Protein_Set_Search />} />
        <Route path="/About" element={<About />} />
        <Route path="/Team" element={<Team />} />
        <Route
          path="protein_sequence/:proteinid"
          element={<ProteinSequence />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
