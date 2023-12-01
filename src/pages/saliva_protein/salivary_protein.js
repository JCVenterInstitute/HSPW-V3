import React from "react";
import Gene from "../../components/gene_table";
import "../style.css";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { rgb } from "d3";
import Protein from "../../components/salivary_protein/salivary_protein_table.js";
import main_feature from "../../components/hero.jpeg";

const styles = {
  transform: "translate(0, 0)",
};

const styles1 = {
  transform: "translate(2, 0)",
};

const accordionData = {
  title: "Section 1",
  content: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente
      laborum cupiditate possimus labore, hic temporibus velit dicta earum
      suscipit commodi eum enim atque at? Et perspiciatis dolore iure
      voluptatem.`,
};
const { title, content } = accordionData;

const Salivary_Protein = ({ title, content }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {}, []);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${main_feature})`,
        }}
        className="head_background"
      >
        <h1 className="head_title" align="left">
          Salivary Protein
        </h1>
        <p className="head_text">
          Proteins listed below have been manually reviewed and annotated by{" "}
          <a href="https://www.uniprot.org/" className="linksa">
            UniProt
          </a>
          , and have evidence of existence in human saliva through{" "}
          <a
            href="https://en.wikipedia.org/wiki/Tandem_mass_spectrometry"
            className="linksa"
          >
            tandem mass spectrometry (MS/MS)
          </a>{" "}
          experiments using whole saliva or glandular secretion samples
          collected from healthy subjects. The list is updated automatically
          based on current supporting evidence derived from data uploaded to the
          wiki or retrieved from external sources, such as the{" "}
          <a href="https://www.proteinatlas.org/" className="linksa">
            Human Protein Atlas
          </a>
          .
        </p>
      </div>

      <div className="accordion">
        <div className="accordion-item">
          <div
            className="accordion-title"
            onClick={() => setIsActive(!isActive)}
            style={{
              border: "solid",
              borderColor: "#C2C2C2",
              backgroundColor: "#F8F8F8",
            }}
          >
            <div style={{ color: "#7D7D7D", fontSize: "20px" }}>
              View Table Legend
            </div>
            <div>{isActive ? "x" : "+"}</div>
          </div>
          {isActive && (
            <div className="accordion-content rowC">
              <div style={{ margin: "20px" }}>
                <div
                  style={{
                    borderRadius: "10px 10px 0 0",
                    backgroundColor: "#E7E7E7",
                    border: "hidden",
                    borderColor: "#C2C2C2",
                    padding: "10px",
                  }}
                >
                  <div style={{ color: "#616161", textAlign: "center" }}>
                    Abundance Indicator Legend:
                  </div>
                </div>
                <TableContainer component={Paper} style={{ padding: "10px" }}>
                  <Table aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          style={{
                            fontWeight: "bold",
                            wordBreak: "break-word",
                          }}
                        >
                          Saliva-based
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Blood-based
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Estimated Abundance
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingRight: "5px", marginLeft: "35px" }}
                        >
                          <svg width={18} height={18} class="table-cell">
                            <rect width={18} height={18} fill="rgb(0,100,0)">
                              <title>High</title>
                            </rect>
                          </svg>
                          <span
                            class="svg-text"
                            style={{
                              color: "rgb(0,100,0)",
                            }}
                          >
                            &gt; 100
                          </span>
                        </TableCell>
                        <TableCell
                          style={{ paddingRight: "5px", marginLeft: "35px" }}
                        >
                          <svg width={18} height={18} class="table-cell">
                            <rect width={18} height={18} fill="rgb(100,0,0)">
                              <title>High</title>
                            </rect>
                          </svg>
                          <span
                            class="svg-text"
                            style={{
                              color: "rgb(100,0,0)",
                            }}
                          >
                            &gt; 2.1
                          </span>
                        </TableCell>
                        <TableCell>High</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingRight: "5px", marginLeft: "35px" }}
                        >
                          <svg width={18} height={18} class="table-cell">
                            <rect width={18} height={18} fill="rgb(70,170,70)">
                              <title>Medium</title>
                            </rect>
                          </svg>
                          <span
                            class="svg-text"
                            style={{
                              color: "rgb(70,170,70)",
                            }}
                          >
                            11 - 100
                          </span>
                        </TableCell>
                        <TableCell
                          style={{ paddingRight: "5px", marginLeft: "35px" }}
                        >
                          <svg width={18} height={18} class="table-cell">
                            <rect width={18} height={18} fill="rgb(190,70,70)">
                              <title>Medium</title>
                            </rect>
                          </svg>
                          <span
                            class="svg-text"
                            style={{
                              color: "rgb(190,70,70)",
                            }}
                          >
                            0.8 - 2
                          </span>
                        </TableCell>
                        <TableCell>Medium</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingRight: "5px", marginLeft: "35px" }}
                        >
                          <svg width={18} height={18} class="table-cell">
                            <rect
                              width={18}
                              height={18}
                              fill="rgb(180,250,180)"
                            >
                              <title>Low</title>
                            </rect>
                          </svg>
                          <span
                            class="svg-text"
                            style={{
                              color: "rgb(180,250,180)",
                            }}
                          >
                            &lt; 10
                          </span>
                        </TableCell>
                        <TableCell
                          style={{ paddingRight: "5px", marginLeft: "35px" }}
                        >
                          <svg width={18} height={18} class="table-cell">
                            <rect
                              width={18}
                              height={18}
                              fill="rgb(250,180,180)"
                            >
                              <title>Low</title>
                            </rect>
                          </svg>
                          <span
                            class="svg-text"
                            style={{
                              color: "rgb(250,180,180)",
                            }}
                          >
                            &lt; 0.79
                          </span>
                        </TableCell>
                        <TableCell>Low</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <svg
                            width={18}
                            height={18}
                            style={{ stroke: "black", alignItems: "center" }}
                          >
                            <rect
                              width={18}
                              height={18}
                              fill="rgb(255,255,255)"
                            >
                              <title>Not uniquely observed</title>
                            </rect>
                          </svg>
                        </TableCell>
                        <TableCell sx={{ marginLeft: "20px" }}>
                          <svg
                            width={18}
                            height={18}
                            style={{ stroke: "black", alignItems: "center" }}
                          >
                            <rect
                              width={18}
                              height={18}
                              fill="rgb(255,255,255)"
                            >
                              <title>Not uniquely observed</title>
                            </rect>
                          </svg>
                        </TableCell>
                        <TableCell>Not observed</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <svg
                            width={18}
                            height={18}
                            style={{ stroke: "black", alignItems: "center" }}
                          >
                            <defs>
                              <pattern
                                id="stripe2"
                                patternUnits="userSpaceOnUse"
                                patternTransform="rotate(45)"
                                x="0"
                                y="0"
                                width="4"
                                height="4"
                                viewBox="0 0 10 10"
                              >
                                <rect
                                  width={2}
                                  height={4}
                                  fill={rgb(220, 220, 220)}
                                  style={styles}
                                ></rect>
                                <rect
                                  width={2}
                                  height={4}
                                  fill={rgb(255, 255, 255)}
                                  style={styles1}
                                ></rect>
                              </pattern>
                            </defs>
                            <rect
                              width={18}
                              height={18}
                              style={{ fill: "url(#stripe2)" }}
                            >
                              <title>Data not available</title>
                            </rect>
                          </svg>
                        </TableCell>
                        <TableCell sx={{ marginLeft: "20px" }}>
                          <svg
                            width={18}
                            height={18}
                            style={{ stroke: "black", alignItems: "center" }}
                          >
                            <rect
                              width={18}
                              height={18}
                              style={{ fill: "url(#stripe2)" }}
                            >
                              <title>Data not available</title>
                            </rect>
                          </svg>
                        </TableCell>
                        <TableCell>Data not available</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div style={{ margin: "20px" }}>
                <div
                  style={{
                    borderRadius: "10px 10px 0 0",
                    backgroundColor: "#E7E7E7",
                    border: "hidden",
                    borderColor: "#C2C2C2",
                    padding: "10px",
                  }}
                >
                  <div style={{ color: "#616161", textAlign: "center" }}>
                    Differential Expression Legend:
                  </div>
                </div>
                <TableContainer component={Paper} style={{ padding: "10px" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ fontWeight: "bold" }}>
                        Label
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        Specificity
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell>Salivary gland specific</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2</TableCell>
                      <TableCell>
                        Specific to salivary glands and a few other tissues
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3</TableCell>
                      <TableCell>
                        On average higher in salivary glands than in other
                        tissues
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TableContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      <Protein />
    </>
  );
};

export default Salivary_Protein;
