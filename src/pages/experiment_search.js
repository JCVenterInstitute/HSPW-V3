import React, { useState } from "react";
import main_feature from "../assets/hero.jpeg";

const ExperimentSearch = () => {
  const [categories, setCategories] = useState("gene");
  const [operation, setOperation] = useState("::+");
  return (
    <>
      <div style={{ height: "40%", backgroundImage: `url(${main_feature})` }}>
        <h1
          style={{
            color: "white",
            textAlign: "center",
            display: "left",
            marginLeft: "20px",
            marginBottom: "1rem",
          }}
          align="left"
        >
          Experiment Search
        </h1>

        <p
          style={{
            textAlign: "left",
            color: "white",
            fontSize: "25px",
            paddingBottom: "15px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          You may search for proteomics experiments stored in our local PRIDE
          database by (1) experiment accesion number, (2) protein accession
          number, (3) peptide sequence, (4) affiliation, or (5) sample
          characteristics:
        </p>
      </div>
      <form style={{ margin: "25px", marginLeft: "15%" }}>
        <table style={{ width: "60%" }}>
          <tbody
            style={{ display: "table-row-group", verticalAlign: "middle" }}
          >
            <tr style={{ display: "table-row-group" }}>
              <td style={{ display: "table-cell", margin: "10px" }}>
                Experiment Type
              </td>
              <td style={{ display: "table-cell", margin: "10px" }}>
                <select name="data">
                  <option value="mz gel"></option>
                  <option value="mz">Mass Spectrometry</option>
                  <option value="gel">Gel Electrophoresis</option>
                </select>
              </td>
            </tr>
            <tr style={{ display: "table-row-group" }}>
              <td style={{ display: "table-cell", margin: "10px" }}>
                <input
                  type="radio"
                  name="type"
                  value="experiment"
                  checked="checked"
                />
                Experiment accession number
              </td>
              <td style={{ display: "table-cell", margin: "10px" }}>
                <input
                  type="text"
                  name="experimentVal"
                  onfocus="clearAll(0)"
                />
              </td>
            </tr>
            <tr style={{ display: "table-row-group" }}>
              <td style={{ display: "table-cell", margin: "10px" }}>
                <input
                  type="radio"
                  name="type"
                  value="peptide"
                />
                Peptide sequence
              </td>
              <td style={{ display: "table-cell", margin: "10px" }}>
                <input
                  type="text"
                  name="peptideVal"
                  onfocus="clearAll(0)"
                />
              </td>
            </tr>
            <tr style={{ display: "table-row-group" }}>
              <td style={{ display: "table-cell", margin: "10px" }}>
                <input
                  type="radio"
                  name="type"
                  value="protein"
                />
                Any mapped protein accession
              </td>
              <td style={{ display: "table-cell", margin: "10px" }}>
                <input
                  type="text"
                  name="proteintVal"
                  onfocus="clearAll(0)"
                />
              </td>
            </tr>
            <tr style={{ display: "table-row-group" }}>
              <td style={{ display: "table-cell", margin: "10px" }}>
                <input
                  type="radio"
                  name="type"
                  value="institute"
                />
                Institute
              </td>
              <td style={{ display: "table-cell", margin: "10px" }}>
                <input
                  type="text"
                  name="institueVal"
                  onfocus="clearAll(0)"
                />
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <input
                  type="radio"
                  name="type"
                  value="sampleattribute"
                />
                Sample Type Search (Species, Tissue, Disease etc.)
                <br />
                <font size="1.5">
                  You need to enter at least one pair of type and value below to
                  conduct this search.
                </font>
              </td>
            </tr>
            <tr>
              <td>Sample Parameter Type</td>
              <td>Sample Parameter Value</td>
            </tr>
            <tr>
              <td>
                <select
                  name="sampletype1"
                  id="sampletype1"
                  onchange="ajaxCall(this.value,'samplevalue1','txtResult')"
                >
                  <option
                    value=""
                    selected="selected"
                  ></option>
                  <option value="BRENDA ID (Tissue)">Tissue</option>
                  <option value="Taxonomy ID (NEWT / NCBI Taxon)">
                    Species
                  </option>
                  <option value="Human Disease Term (DOID)">Disease</option>
                </select>
              </td>
              <td>
                <span id="txtResult">
                  <select
                    name="samplevalue1"
                    id="samplevalue1"
                    onchange="clearAll(4)"
                  ></select>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <input
          type="submit"
          value="Search"
          style={{ margin: "10px" }}
        ></input>
        <input
          type="reset"
          value="Reset"
        ></input>
      </form>
    </>
  );
};
export default ExperimentSearch;
