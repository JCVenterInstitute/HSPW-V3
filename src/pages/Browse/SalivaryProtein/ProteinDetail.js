import React from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { TableBody, TableHead } from "@mui/material";
import { HashLink as Link } from "react-router-hash-link";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import FontAwesome from "react-fontawesome";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import axios from "axios";
import { useParams } from "react-router";
import ProtvistaUniprot from "protvista-uniprot";
import "font-awesome/css/font-awesome.min.css";
import "resize-observer-polyfill";

import BChart from "../../../components/SalivaryProtein/TwoSidedBarChart";
import CommentTable from "../../../components/SalivaryProtein/CommentTable";
import GlycanTable from "../../../components/SalivaryProtein/GlycanTable";
import main_feature from "../../../assets/hero.jpeg";
import "../../style.css";

window.customElements.define("protvista-uniprot", ProtvistaUniprot);

const th = {
  background: "#f2f2f2",
  textAlign: "center",
  border: "1px solid #aaa",
  fontWeight: "bold",
  fontSize: "20px",
  padding: "0.2em",
  maxWidth: "1000px",
};

const td = {
  border: "1px solid #aaa",
  fontSize: "18px",
  padding: "0.2em",
  fontSize: "18px",
};

const ProteinDetail = (props) => {
  const params = useParams();
  let url = "http://localhost:8000/api/protein/" + params["proteinid"];

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const [authorName, setauthorName] = useState("");
  const [year, setYear] = useState("");
  const [journal, setJournal] = useState("");
  const [checkData, setCheckData] = useState(false);

  const fetchProtein = async () => {
    const response = await axios.get(url);
    const json = response.data;
    return json;
  };

  const processData = async () => {
    const proteinResult = await fetchProtein().catch(console.error);

    if (proteinResult) {
      setData(proteinResult);

      if (proteinResult[0]._source.salivary_proteins) {
        const cites = proteinResult[0]._source.salivary_proteins.cites;
        const promises = [];

        for (let i = 0; i < cites.length; i++) {
          const id = cites[i].split(":")[1];
          promises.push(fetchPubMed(id));
        }

        await Promise.all(promises);
      }

      setLoading(false);
      setCheckData(true);
    }
  };

  const fetchPubMed = async (id) => {
    let line = "";
    let yearTitle = "";
    let authorArr = [];
    const pubmedLink = "http://localhost:8000/api/citation/" + id;
    const response = await fetch(pubmedLink);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();

    authorArr = data[0]["_source"]["author_names"];
    if (authorArr.length === 2) {
      line = `${authorArr[0]} and ${authorArr[1]}`;
    } else if (authorArr.length >= 3) {
      line = `${authorArr[0]}, et al.`;
    }
    yearTitle = ` (${data[0]["_source"]["PubYear"]}) ${data[0]["_source"]["Title"]} `;
    setauthorName((prevLines) => [...prevLines, line]);
    setYear((prevLines) => [...prevLines, yearTitle]);
    setJournal((prevLines) => [
      ...prevLines,
      data[0]["_source"]["journal_title"],
    ]);
  };

  useEffect(() => {
    processData();
  }, []);

  if (isLoading === true) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress sx={{ mb: "500px", margin: "20px" }} />
      </Box>
    );
  }

  return (
    <>
      <script
        src="https://d3js.org/d3.v4.min.js"
        charSet="utf-8"
        defer
      ></script>
      <script src="https://cdn.jsdelivr.net/npm/protvista-uniprot@latest/dist/protvista-uniprot.js"></script>
      <Tabs>
        <TabList>
          <Tab>Protein</Tab>
          <Tab>Curation</Tab>
        </TabList>
        <TabPanel>
          <div
            style={{
              backgroundImage: `url(${main_feature})`,
            }}
            className="head_background"
          >
            <h1
              className="head_title"
              align="left"
            >
              Protein: {data[0]["_source"]["salivary_proteins"]["protein_name"]}
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
              Altername Names:{" "}
              {
                data[0]["_source"]["salivary_proteins"][
                  "protein_alternate_names"
                ][0]
              }
            </p>
          </div>
          <div id="hero-section">
            <span id="hero-text">Jump To Section</span>
            <div
              style={{
                marginLeft: "10px",
              }}
            >
              <Link
                to="#names-and-origin"
                className="hero-link"
                style={{ marginLeft: "0px" }}
              >
                Names and Origin
              </Link>
              |
              <Link
                to="#sequence-attributes"
                className="hero-link"
              >
                Sequence Attributes
              </Link>
              |
              <Link
                to="#feature-map"
                className="hero-link"
              >
                Feature Map
              </Link>
              |
              <Link
                to="#expression"
                className="hero-link"
              >
                Expression
              </Link>
              |
              <Link
                to="#glycan"
                className="hero-link"
              >
                Glycan
              </Link>
              |
              <Link
                to="#proteomics"
                className="hero-link"
              >
                Proteomics
              </Link>
              |
              <Link
                to="#cross-reference"
                className="hero-link"
              >
                Cross References
              </Link>
              |
              <Link
                to="#keyword"
                className="hero-link"
              >
                Keywords
              </Link>
              |
              <Link
                to="#reference"
                className="hero-link"
              >
                References
              </Link>
              |
              <Link
                to="#entry-info"
                className="hero-link"
              >
                Entry Info
              </Link>
            </div>
          </div>
          <div style={{ margin: "20px" }}>
            <h2
              style={{
                color: "black",
                marginBottom: "24px",
                fontWeight: "bold",
                fontFamily: "Lato",
              }}
              id="names-and-origin"
            >
              Names and Origin
            </h2>
            <TableContainer>
              <Table>
                <TableBody
                  style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    maxWidth: "70%",
                    borderRadius: "10px 0 0 10px",
                  }}
                >
                  <TableRow>
                    <TableCell
                      variant="header"
                      sx={th}
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        border: "1px solid #3592E4",
                        borderTopLeftRadius: "10px",
                        width: "10%",
                        fontSize: "14px",
                      }}
                    >
                      Primary Accession
                    </TableCell>
                    <TableCell
                      variant="header"
                      sx={{
                        border: "1px solid, #3592E4",
                        borderTopRightRadius: "10px",
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      {
                        data[0]["_source"]["salivary_proteins"][
                          "uniprot_accession"
                        ]
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={th}
                      variant="header"
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "14px",
                        border: "1px solid #3592E4",
                        borderLeft: "none",
                        borderRight: "none",
                      }}
                    >
                      Genes
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid, #3592E4",
                        borderTopRightRadius: "10px",
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      {data[0]["_source"]["salivary_proteins"][
                        "primary_gene_names"
                      ].map((child, i) => (
                        <React.Fragment key={i}>
                          <span style={{ color: "black" }}>
                            {i + 1}. {child}
                          </span>
                          <br></br>
                        </React.Fragment>
                      ))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      variant="header"
                      sx={th}
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "14px",
                      }}
                    >
                      Organism
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid, #3592E4",
                        borderTopRightRadius: "10px",
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      <a
                        style={{ color: "/*#116988*/#0b5989" }}
                        href="https://www.uniprot.org/taxonomy/9606 "
                      >
                        Homo sapiens
                      </a>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Divider
              sx={{
                marginBottom: "10px",
                borderColor: "#1463B9",
                paddingTop: "35px",
              }}
            />
            <h2
              style={{
                color: "black",
                marginBottom: "24px",
                fontWeight: "bold",
                fontFamily: "Lato",
                marginTop: "10px",
              }}
            >
              Taxonomy
            </h2>

            <span style={{ fontFamily: "Lato", fontSize: "14px" }}>
              Eukaryota {">"} Opisthokonta {">"} Metazoa {">"} Eumetazoa {">"}{" "}
              Bilateria {">"} Deuterostomia {">"} Chordata {">"} Craniata {">"}{" "}
              Vertebrata {">"} Gnathostomata {">"} Teleostomi {">"} Euteleostomi{" "}
              {">"} Sarcopterygii {">"} Dipnotetrapodomorpha {">"} Tetrapoda{" "}
              {">"} Amniota {">"} Mammalia {">"} Theria {">"} Eutheria {">"}{" "}
              Boreoeutheria {">"} Euarchontoglires {">"} Primates {">"}{" "}
              Haplorrhini {">"} Simiiformes {">"} Catarrhini {">"} Hominoidea{" "}
              {">"} Hominidae {">"} Homininae {">"} Homo
            </span>
            <Divider
              sx={{
                marginBottom: "10px",
                borderColor: "#1463B9",
                paddingTop: "35px",
              }}
            />
            <h2
              style={{
                color: "black",
                marginBottom: "24px",
                fontWeight: "bold",
                fontFamily: "Lato",
                marginTop: "10px",
              }}
              id="sequence-attributes"
            >
              Sequence Attributes
            </h2>

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow
                    style={{
                      border: "1px solid #3592E4",
                    }}
                  >
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      Identifier
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Name
                    </TableCell>

                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Sequence Length
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Molecular Mass
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      Sequence
                    </TableCell>
                  </TableRow>
                  <TableRow
                    style={{
                      border: "1px solid #CACACA",
                      borderRadius: "1em 0 0 1em",
                    }}
                  >
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      {data[0]["_id"]}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      Canonical sequence
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      {
                        data[0]["_source"]["salivary_proteins"][
                          "protein_sequence_length"
                        ]
                      }
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      {data[0]["_source"]["salivary_proteins"]["mass"]}
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      <a
                        style={{ color: "#116988" }}
                        href={
                          window.location.origin +
                          "/protein-sequence/" +
                          params["proteinid"]
                        }
                      >
                        Sequence
                      </a>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Divider
              sx={{
                marginBottom: "10px",
                borderColor: "#1463B9",
                paddingTop: "35px",
              }}
            />
            <h2
              style={{
                color: "black",
                marginBottom: "24px",
                fontWeight: "bold",
                fontFamily: "Lato",
                marginTop: "10px",
              }}
              id="feature-map"
            >
              Comments
            </h2>
            <CommentTable
              data={data[0]["_source"]["salivary_proteins"]["annotations"]}
            />
            <Divider
              sx={{
                marginBottom: "10px",
                borderColor: "#1463B9",
                paddingTop: "35px",
              }}
            />
            <h2
              style={{
                color: "black",
                marginBottom: "24px",
                fontWeight: "bold",
                fontFamily: "Lato",
                marginTop: "10px",
              }}
              id="feature-map"
            >
              Feature Map
            </h2>
            <div style={{ width: "95%" }}>
              <protvista-uniprot
                accession={
                  data[0]["_source"]["salivary_proteins"]["uniprot_accession"]
                }
              ></protvista-uniprot>
            </div>
            <Divider
              sx={{
                marginBottom: "10px",
                borderColor: "#1463B9",
                marginTop: "10px",
              }}
            />
            <GlycanTable data={data} />
            <Divider sx={{ marginBottom: "10px", borderColor: "#1463B9" }} />
            <h2
              style={{
                color: "black",
                marginBottom: "24px",
                fontWeight: "bold",
                fontFamily: "Lato",
                marginTop: "10px",
              }}
              id="expression"
            >
              Expression
            </h2>

            <p
              style={{
                color: "black",
                marginBottom: "20px",
                marginTop: "20px",
                fontSize: "0.875rem",
                textAlign: "left",
              }}
            >
              Abundance and localization of gene products based on both RNA and
              immunohistochemistry data from the{" "}
              <a
                href={
                  "http://www.proteinatlas.org/" +
                  data[0]["_source"]["salivary_proteins"]["ensembl_g"]
                }
              >
                Human Protein Atlas{" "}
                <FontAwesome
                  className="super-crazy-colors"
                  name="external-link"
                  style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
                />
              </a>
              . Click on the tissue names to view primary data.
            </p>
            <div style={{ marginLeft: "15%" }}>
              <BChart
                data={data[0]["_source"]["salivary_proteins"]["atlas"]}
                gene_id={data[0]["_source"]["salivary_proteins"]["ensembl_g"]}
              />
            </div>
            <Divider
              sx={{
                marginBottom: "10px",
                borderColor: "#1463B9",
                marginTop: "10px",
              }}
            />
            <h2
              style={{
                color: "black",
                marginBottom: "24px",
                fontWeight: "bold",
                fontFamily: "Lato",
                marginTop: "10px",
              }}
              id="proteomics"
            >
              Proteomics
            </h2>

            <TableContainer>
              <Table>
                <TableBody
                  style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <TableRow
                    style={{
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  >
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      Tissue ID
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Tissue Term
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Disease State
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Isoform
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Experiment Count
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Peptide Count
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      Abundance Score
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      <a href="https://salivaryproteome.org/community/index.php/Special:Ontology_Term/BTO:0001202">
                        BTO:0001202
                      </a>
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      Saliva
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      Disease free<br></br>Sjogren's Syndrome<br></br>COVID-19
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      50<br></br>2<br></br>8
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      133<br></br>2870<br></br>24
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      430.74<br></br>1008.23<br></br>0
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    ></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      <a href="https://salivaryproteome.org/community/index.php/Special:Ontology_Term/BTO:0001316">
                        BTO:0001316
                      </a>
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      Submandibular gland
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      Disease free
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      49
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      2442
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      13513.97
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    ></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      <a href="https://salivaryproteome.org/community/index.php/Special:Ontology_Term/BTO:0001315">
                        BTO:0001315
                      </a>
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      Sublingual gland
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      Disease free
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      49
                    </TableCell>
                    <TableCell v>2442</TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      14,385.84
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    ></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      <a href="https://salivaryproteome.org/community/index.php/Special:Ontology_Term/BTO:0001004">
                        BTO:0001004
                      </a>
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      Parotid gland
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      Disease free
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      56
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      1208
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    >
                      3,127.74
                    </TableCell>
                    <TableCell
                      style={{
                        border: "1px solid #CACACA",
                        fontFamily: "Lato",
                      }}
                    ></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Divider
              sx={{
                marginBottom: "10px",
                borderColor: "#1463B9",
                marginTop: "10px",
              }}
            />
            <h2
              style={{
                color: "black",
                marginBottom: "24px",
                fontWeight: "bold",
                fontFamily: "Lato",
                marginTop: "10px",
              }}
              id="cross-reference"
            >
              Cross References
            </h2>

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow sx={{ border: "1px solid black" }}>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                        maxWidth: "50%",
                        borderTopLeftRadius: "10px",
                      }}
                      sx={th}
                    >
                      RefSeq
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.875rem" }}
                      style={{
                        maxWidth: "100%",
                        border: "1px solid #CACACA",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      {data[0]["_source"]["salivary_proteins"][
                        "reference_sequence"
                      ].map((value, i, arr) => {
                        return (
                          <React.Fragment key={i}>
                            <a
                              href={
                                "https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=protein&id=" +
                                value
                              }
                              style={{
                                color: "#464646",
                                fontSize: "14px",
                                fontFamily: "Lato",
                              }}
                            >
                              {`${value} `}
                              <FontAwesome
                                className="super-crazy-colors"
                                name="external-link"
                                style={{
                                  textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            </a>
                            <span>{i !== arr.length - 1 ? ", " : ""}</span>
                          </React.Fragment>
                        );
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                      sx={th}
                    >
                      PeptideAtlas
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.875rem", border: "1px solid #CACACA" }}
                    >
                      {data[0]["_source"]["salivary_proteins"][
                        "peptide_atlas"
                      ].map((value, i, arr) => {
                        return (
                          <React.Fragment key={i}>
                            <a
                              href={
                                "https://db.systemsbiology.net/sbeams/cgi/PeptideAtlas/Search?action=GO&search_key=" +
                                value
                              }
                              style={{
                                color: "#464646",
                                fontSize: "14px",
                                fontFamily: "Lato",
                              }}
                            >
                              {`${value} `}
                              <FontAwesome
                                className="super-crazy-colors"
                                name="external-link"
                                style={{
                                  textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            </a>
                            <span>{i == arr.length - 1 ? ", " : ""}</span>
                          </React.Fragment>
                        );
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                      sx={th}
                    >
                      Ensembl
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.875rem" }}
                      style={{ maxWidth: "100%", border: "1px solid #CACACA" }}
                    >
                      {data[0]["_source"]["salivary_proteins"]["ensembl"].map(
                        (value, i, arr) => {
                          return (
                            <React.Fragment key={i}>
                              <a
                                href={"http://www.ensembl.org/id/" + value}
                                style={{
                                  color: "#464646",
                                  fontSize: "14px",
                                  fontFamily: "Lato",
                                }}
                              >
                                {`${value} `}
                                <FontAwesome
                                  className="super-crazy-colors"
                                  name="external-link"
                                  style={{
                                    textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                                  }}
                                />
                              </a>
                              <span>{i !== arr.length - 1 ? ", " : ""}</span>
                            </React.Fragment>
                          );
                        }
                      )}
                      <a
                        href={
                          "http://www.ensembl.org/id/" +
                          data[0]["_source"]["salivary_proteins"]["ensembl_g"]
                        }
                        style={{
                          color: "#464646",
                          fontSize: "14px",
                          fontFamily: "Lato",
                        }}
                      >
                        {`, ${data[0]["_source"]["salivary_proteins"]["ensembl_g"]} `}
                        <FontAwesome
                          className="super-crazy-colors"
                          name="external-link"
                          style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
                        />
                      </a>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                      sx={th}
                    >
                      GeneCards
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.875rem", border: "1px solid #CACACA" }}
                    >
                      {data[0]["_source"]["salivary_proteins"][
                        "gene_cards"
                      ].map((value, i, arr) => {
                        return (
                          <React.Fragment key={i}>
                            <a
                              href={
                                "https://www.genecards.org/cgi-bin/carddisp.pl?gene=" +
                                value
                              }
                              style={{
                                color: "#464646",
                                fontSize: "14px",
                                fontFamily: "Lato",
                              }}
                            >
                              {value}
                              <FontAwesome
                                className="super-crazy-colors"
                                name="external-link"
                                style={{
                                  textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            </a>
                            <span>{i !== arr.length - 1 ? ", " : ""}</span>
                          </React.Fragment>
                        );
                      })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Divider
              sx={{
                marginBottom: "10px",
                borderColor: "#1463B9",
                marginTop: "10px",
              }}
            />
            <h2
              style={{
                color: "black",
                marginBottom: "24px",
                fontWeight: "bold",
                fontFamily: "Lato",
                marginTop: "10px",
              }}
              id="keyword"
            >
              Keywords
            </h2>
            {data[0]["_source"]["salivary_proteins"]["keywords"].map(
              (value, i, arr) => {
                return (
                  <React.Fragment key={i}>
                    <a
                      href={`https://www.uniprot.org/keywords/${
                        value.id.split(":")[1]
                      }`}
                      style={{
                        fontFamily: "Lato",
                        fontSize: "14px",
                        color: "#000",
                      }}
                    >
                      {`${value.keyword} `}
                      <FontAwesome
                        className="super-crazy-colors"
                        name="external-link"
                        style={{
                          textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </a>
                    <span>{i !== arr.length - 1 ? ", " : ""}</span>
                  </React.Fragment>
                );
              }
            )}
            <Divider
              sx={{
                marginBottom: "10px",
                borderColor: "#1463B9",
                marginTop: "10px",
              }}
            />
            <h2
              style={{
                color: "black",
                marginBottom: "24px",
                fontWeight: "bold",
                fontFamily: "Lato",
                marginTop: "10px",
              }}
              id="reference"
            >
              References
            </h2>
            {data[0]["_source"]["salivary_proteins"]["cites"].map(
              (value, i) => {
                return (
                  <React.Fragment key={i}>
                    <div style={{ fontFamily: "Lato" }}>
                      <h4 style={{ display: "inline" }}>{i + 1}. </h4>
                      <b style={{ color: "#1463B9" }}>{authorName[i]}</b>
                      <span>{year[i]}</span>
                      <i>{journal[i]}</i>
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${value.replace(
                          "PubMed:",
                          ""
                        )}`}
                        style={{ color: "#777777" }}
                      >
                        {` ${value} `}
                        <FontAwesome
                          className="super-crazy-colors"
                          name="external-link"
                          style={{
                            textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                          }}
                        />
                      </a>
                    </div>
                  </React.Fragment>
                );
              }
            )}
            <Divider
              sx={{
                marginBottom: "10px",
                borderColor: "#1463B9",
                marginTop: "10px",
              }}
            />
            <h2
              style={{
                color: "black",
                marginBottom: "24px",
                fontWeight: "bold",
                fontFamily: "Lato",
                marginTop: "10px",
              }}
              id="entry-info"
            >
              Entry Information
            </h2>
            <Table>
              <TableHead>
                <TableRow sx={{ border: "1px solid black" }}>
                  <TableCell
                    sx={th}
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "16px",
                      border: "1px solid #3592E4",
                      borderTopLeftRadius: "10px",
                    }}
                  >
                    Created On
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.875rem" }}
                    style={{
                      maxWidth: "100%",
                      border: "1px solid #CACACA",
                      borderTopRightRadius: "10px",
                      fontFamily: "Lato",
                    }}
                  >
                    {
                      data[0]["_source"]["salivary_proteins"][
                        "created_on"
                      ].split("-")[0]
                    }
                    {"/"}
                    {
                      data[0]["_source"]["salivary_proteins"][
                        "created_on"
                      ].split("-")[1]
                    }
                    {"/"}
                    {
                      data[0]["_source"]["salivary_proteins"][
                        "created_on"
                      ].split("-")[2]
                    }
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    border: "1px solid #3592E4",
                  }}
                >
                  <TableCell
                    sx={th}
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "16px",
                      border: "1px solid #3592E4",
                    }}
                  >
                    Last Modified On
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.875rem" }}
                    style={{
                      maxWidth: "100%",
                      border: "1px solid #CACACA",
                      fontFamily: "Lato",
                    }}
                  >
                    {
                      data[0]["_source"]["salivary_proteins"][
                        "last_modified"
                      ].split("-")[0]
                    }
                    {"/"}
                    {
                      data[0]["_source"]["salivary_proteins"][
                        "last_modified"
                      ].split("-")[1]
                    }
                    {"/"}
                    {
                      data[0]["_source"]["salivary_proteins"][
                        "last_modified"
                      ].split("-")[2]
                    }
                  </TableCell>
                </TableRow>
                <TableRow sx={{ border: "1px solid black" }}>
                  <TableCell
                    sx={th}
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "16px",
                      border: "1px solid #3592E4",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.875rem" }}
                    style={{
                      maxWidth: "100%",
                      border: "1px solid #CACACA",
                      fontFamily: "Lato",
                    }}
                  >
                    {data[0]["_source"]["salivary_proteins"]["status"]}
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </div>
        </TabPanel>
        <TabPanel>
          <div style={{ marginLeft: "10px", marginBottom: "15px" }}>
            <h2 style={{ color: "#2b6384", marginBottom: "10px" }}>
              {data[0]["_source"]["salivary_proteins"]["protein_name"]}
            </h2>
            <Divider />

            <h2
              style={{
                color: "black",
                marginBottom: "20px",
                fontWeight: "bold",
                marginTop: "20px",
              }}
            >
              Protein Status
            </h2>
            <Divider sx={{ marginBottom: "10px" }} />

            <TableContainer>
              <Table
                sx={{ maxWidth: "20%", border: 1, tableLayout: "fixed" }}
                aria-label="simple table"
                style={{ border: "1px solid black" }}
              >
                <TableBody>
                  <TableRow sx={{ border: "1px solid black" }}>
                    <TableCell
                      sx={th}
                      style={{ maxWidth: "20%", textAlign: "center" }}
                    >
                      Salivary gland origin
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.875rem" }}
                      style={{ maxWidth: "100%", border: "1px" }}
                    >
                      Unsubstantiated
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ border: "1px solid black" }}>
                    <TableCell
                      sx={th}
                      style={{ maxWidth: "20%" }}
                    >
                      Abundance level
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.875rem" }}
                      style={{ maxWidth: "100%", border: "1px" }}
                    ></TableCell>
                  </TableRow>
                  <TableRow sx={{ border: "1px solid black" }}>
                    <TableCell
                      sx={th}
                      style={{ maxWidth: "20%" }}
                    >
                      Curator
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "0.875rem" }}
                      style={{ maxWidth: "100%", border: "1px" }}
                    >
                      127.0.0.1
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </TabPanel>
      </Tabs>
    </>
  );
};

export default ProteinDetail;
