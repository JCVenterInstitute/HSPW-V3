import React, { useEffect, useState } from "react";
import main_feature from "../components/hero.jpeg";
import { Typography, Container, TextField, MenuItem } from "@mui/material";

import SequenceParameters from "../components/MultipleSequenceAlignment/SequenceParameters";

const MultipleSequenceAlignment = () => {
  return (
    <>
      <div style={{ backgroundImage: `url(${main_feature})` }}>
        <Typography
          variant="h3"
          sx={{ pt: 3, pb: 2, color: "white", textAlign: "center" }}
        >
          Multiple Sequence Alignment
        </Typography>
        <Container>
          <Typography variant="body1" sx={{ pb: 3, color: "white" }}>
            ClustalW is a general purpose multiple sequence alignment program
            for DNA or proteins. It produces biologically meaningful multiple
            sequence alignments of divergent sequences. It calculates the best
            match for the selected sequences, and lines them up so that the
            identities, similarities and differences can be seen. This service
            is provided by the European Bioinformatics Institute (EBI).
          </Typography>
        </Container>
      </div>
      <Container>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mt: 3, color: "black" }}
        >
          Sequence Alignment Options:
        </Typography>
      </Container>
      <Container sx={{ mt: 3 }}>
        <SequenceParameters />
      </Container>

      {/* <form style={{ marginTop: "30px", marginLeft: "20px" }}>
        <table>
          <tr style={{ marginBottom: "20px" }}>
            <td>
              <label style={{ marginLeft: "20px", marginBottom: "20px" }}>
                Protein Weight Matrix:{" "}
              </label>
              <select id="matrix" name="matrix">
                <option value="gonnet">Gonnet</option>
                <option value="blosum">BLOSUM</option>
                <option value="pam">PAM</option>
                <option value="id">ID</option>
              </select>
            </td>
            <td>
              <label style={{ marginLeft: "20px", marginBottom: "20px" }}>
                Gap Open:{" "}
              </label>
              <select id="gapopen" name="gapopen">
                <option value="10">10</option>
                <option value="100">100</option>
                <option value="50">50</option>
                <option value="25">25</option>
                <option value="5">5</option>
                <option value="2">2</option>
              </select>
            </td>
            <td>
              <label style={{ marginLeft: "20px", marginBottom: "20px" }}>
                Gap Extension:{" "}
              </label>
              <select id="gapext" name="gapext">
                <option value="10">10</option>
                <option value="100">100</option>
                <option value="50">50</option>
                <option value="25">25</option>
                <option value="5">5</option>
                <option value="2">2</option>
              </select>
            </td>
            <td>
              <label style={{ marginLeft: "20px", marginBottom: "20px" }}>
                Gap Distance:{" "}
              </label>
              <select id="gapdist" name="gapdist">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="9">9</option>
                <option value="8">8</option>
                <option value="7">7</option>
                <option value="6">6</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </td>
          </tr>
          <tr style={{ marginLeft: "20px", marginTop: "20px" }}>
            <td>
              <label style={{ marginLeft: "20px", marginTop: "20px" }}>
                No End Gaps:{" "}
              </label>
              <select id="noendgaps" name="noendgaps">
                <option value="false">no</option>
                <option value="true">yes</option>
              </select>
            </td>
            <td>
              <label style={{ marginLeft: "20px", marginTop: "20px" }}>
                Iteration:{" "}
              </label>
              <select id="iteration" name="iteration">
                <option value="none">none</option>
                <option value="tree">tree</option>
                <option value="alignment">alignment</option>
              </select>
            </td>
            <td>
              <label style={{ marginLeft: "20px", marginTop: "20px" }}>
                Num Iter:{" "}
              </label>
              <select id="numiter" name="numiter">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </td>
            <td>
              <label style={{ marginLeft: "20px", marginTop: "20px" }}>
                Clustering:{" "}
              </label>
              <select id="clustering" name="clustering">
                <option value="NJ">NJ</option>
                <option value="UPGMA">UPGMA</option>
              </select>
            </td>
            <br></br>
          </tr>
        </table>
        <p style={{ color: "black" }}>
          Enter one sequence page name (e.g. HSPW:PDDBCB3/1) or amino acid
          sequence per line for each sequence to be aligned:
        </p>
        <textarea name="proteins" rows="10" style={{ width: "97%" }} />
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            width: "8em",
            marginTop: "2rem",
            marginBottom: "2rem",
          }}
        >
          <input type="submit" value="Submit" style={{ width: "8em" }}></input>
          <input type="reset" value="Reset" style={{ width: "8em" }}></input>
        </div>
      </form> */}
    </>
  );
};

export default MultipleSequenceAlignment;
