import { display } from "@mui/system";
import React from "react";
import Gene from "../components/gene_table";
import "./style.css";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { translateDOMPositionXY } from "rsuite/esm/DOMHelper";
import { rgb } from "d3";
import Protein from "../components/salivary_protein_table.js";
import main_feature from "../components/hero.jpeg";
import Filter from "../components/salivary_protein/filter_protein";

const mystyle = {
  color: "white",
  marginTop: "20px",
  marginLeft: "20px",
  textAlign: "left",
  fontSize: "18px",
  marginBottom: "20px",
};

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

const Accordion = ({ title, content }) => {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [opinion, setOpinion] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/protein")
      .then((res) => res.json())
      .then((data) => setMessage(data["Uniprot Accession"]));

    fetch("http://localhost:8000/protein")
      .then((res) => res.json())
      .then((data) => setName(data["Protein Name"]));
  }, []);

  return (
    <>
      <div
        style={{
          height: "40%",
          padding: "35px",
          backgroundImage: `url(${main_feature})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <h1
          style={{
            color: "white",
            display: "left",
            marginLeft: "20px",
            marginBottom: "1rem",
          }}
          className="title"
          align="left"
        >
          Salivary Protein
        </h1>
        <p
          style={{
            textAlign: "left",
            color: "white",
            paddingBottom: "15px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
          className="head_text"
        >
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
          >
            <div style={{ color: "#0b5989", fontSize: "20px" }}>
              Table Legend
            </div>
            <div>{isActive ? "-" : "+"}</div>
          </div>
          {isActive && (
            <div className="accordion-content rowC">
              <div style={{ margin: "20px" }}>
                <h3>Abundance Indicator Legend:</h3>
                <TableContainer component={Paper} style={{ padding: "10px" }}>
                  <Table aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }}>
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
                        <TableCell>
                          <svg
                            width={18}
                            height={18}
                            style={{ stroke: "black", alignItems: "center" }}
                          >
                            <rect width={18} height={18} fill="rgb(0,100,0)">
                              <title>High</title>
                            </rect>
                          </svg>
                        </TableCell>
                        <TableCell>
                          <svg
                            width={18}
                            height={18}
                            style={{ stroke: "black", alignItems: "center" }}
                          >
                            <rect width={18} height={18} fill="rgb(100,0,0)">
                              <title>High</title>
                            </rect>
                          </svg>
                        </TableCell>
                        <TableCell>High</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <svg
                            width={18}
                            height={18}
                            style={{ stroke: "black", alignItems: "center" }}
                          >
                            <rect width={18} height={18} fill="rgb(70,170,70)">
                              <title>Medium</title>
                            </rect>
                          </svg>
                        </TableCell>
                        <TableCell>
                          <svg
                            width={18}
                            height={18}
                            style={{ stroke: "black", alignItems: "center" }}
                          >
                            <rect width={18} height={18} fill="rgb(190,70,70)">
                              <title>Medium</title>
                            </rect>
                          </svg>
                        </TableCell>
                        <TableCell>Medium</TableCell>
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
                              fill="rgb(180,250,180)"
                            >
                              <title>Low</title>
                            </rect>
                          </svg>
                        </TableCell>
                        <TableCell>
                          <svg
                            width={18}
                            height={18}
                            style={{ stroke: "black", alignItems: "center" }}
                          >
                            <rect
                              width={18}
                              height={18}
                              fill="rgb(250,180,180)"
                            >
                              <title>Low</title>
                            </rect>
                          </svg>
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
                <h3>Differential Expression Legend:</h3>
                <TableContainer>
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
                      <TableCell>**</TableCell>
                      <TableCell>Salivary gland specific</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>*</TableCell>
                      <TableCell>
                        Specific to salivary glands and a few other tissues
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>#</TableCell>
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
      <div className="rowC">
        <div className="sidebar1">
          <h2
            style={{
              margin: "26px",
              color: "#1463B9",
              fontFamily: "Montserrat",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "130%",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            FILTER
          </h2>
          <Filter />
        </div>
      </div>
      <Protein />
    </>
  );
};

export default Accordion;
