import React from "react";
import "./App.css";
import Header from "./components/index";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages";
import Download from "./pages/download";
import Analysis_Home from "./pages/analysis_home";
import Gene from "./pages/gene";
import Contact from "./pages/contact";
import Footer from "./components/footer.js";
import Signature from "./pages/signature";
import Cluster from "./pages/cluster";
import Gene_Detail from "./pages/gene_detail";
import Salivary_Protein from "./pages/salivary_protein";
import Protein_Detail from "./pages/protein_detail";
import Analysis from "./pages/analysis";
import Blast from "./pages/blast";
import Citation from "./pages/citation";
import Citation_Detail from "./pages/citation_detail";
import InterProScan from "./pages/interproscan.js";
import Signature_Detail from "./pages/signature_detail";
import Basic_Search from "./pages/basic_search";
import Experiment_Search from "./pages/experiment_search";
import Protein_Set_Search from "./pages/protein_set_search";
import Cluster_detail from "./pages/cluster_detail";
import MultipleSequenceAlignment from "./pages/Analyze/MultipleSequenceAlignment";
import MultipleSequenceAlignmentResults from "./pages/Analyze/MultipleSequenceAlignementResults";

function App() {
  return (
    <Router>
      <Header />
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
          path="/clustal-w/results/:jobId"
          element={<MultipleSequenceAlignmentResults />}
        />
        <Route path="/clustal-w" element={<MultipleSequenceAlignment />} />
        <Route path="/Blast" element={<Blast />} />
        <Route path="/citation" element={<Citation />} />
        <Route path="/citation/:citationid" element={<Citation_Detail />} />
        <Route path="/InterProScan" element={<InterProScan />} />
        <Route path="/Basic_Search" element={<Basic_Search />} />
        <Route path="/Experiment_Search" element={<Experiment_Search />} />
        <Route path="/Protein_Set_Search" element={<Protein_Set_Search />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
