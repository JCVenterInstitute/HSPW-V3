import React from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Container, TableBody, TableHead } from "@mui/material";
import { HashLink as Link } from "react-router-hash-link";
import { useEffect, useState } from "react";
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
import main_feature from "../../../assets/hero.png";
import "../../style.css";
import { Link as ReactLink } from "react-router-dom";
import BreadCrumb from "../../../components/Breadcrumbs";
import { Helmet } from "react-helmet";

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

const ProteinDetail = (props) => {
  const params = useParams();
  const url = `${process.env.REACT_APP_API_ENDPOINT}/api/salivary-protein/${params["proteinid"]}`;

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const [authorName, setauthorName] = useState("");
  const [year, setYear] = useState("");
  const [journal, setJournal] = useState("");
  const [abundanceData, setAbundanceData] = useState([]);

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Browse" },
    { path: "Salivary Proteins", link: "/salivary-protein" },
    { path: params["proteinid"] },
  ];

  const fetchProtein = async () => {
    const response = await axios.get(url);
    const json = response.data;
    return json;
  };

  const fetchAbundance = async () => {
    const resp = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/abundance-score/${params["proteinid"]}`
    );
    const abundanceData = resp.data;
    return abundanceData;
  };

  const processData = async () => {
    const proteinResult = await fetchProtein().catch(console.error);
    const abundanceData = await fetchAbundance();

    if (proteinResult) {
      setData(proteinResult);
      setAbundanceData(abundanceData);

      if (proteinResult[0]._source.salivary_proteins) {
        const cites = proteinResult[0]._source.salivary_proteins.cites;
        const promises = [];

        for (let i = 0; i < cites.length; i++) {
          const id = cites[i].split(":")[1];
          promises.push(fetchPubMed(id));
        }

        const pubmedDetails = await Promise.all(promises);

        setauthorName(pubmedDetails.map((detail) => detail.authorName));
        setYear(pubmedDetails.map((detail) => detail.yearTitle));
        setJournal(pubmedDetails.map((detail) => detail.journalTitle));
      }

      setLoading(false);
    }
  };

  const fetchPubMed = async (id) => {
    const pubmedLink = `${process.env.REACT_APP_API_ENDPOINT}/api/citation/${id}`;
    const response = await fetch(pubmedLink);
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();

    const authorArr = data[0]["_source"]["author_names"];
    let authorLine = "";
    if (authorArr.length === 2) {
      authorLine = `${authorArr[0]} and ${authorArr[1]}`;
    } else if (authorArr.length >= 3) {
      authorLine = `${authorArr[0]}, et al.`;
    } else {
      authorLine = `${authorArr[0]}`;
    }

    const yearTitle = ` (${data[0]["_source"]["PubYear"]}) ${data[0]["_source"]["Title"]} `;
    const journalTitle = data[0]["_source"]["journal_title"];

    return {
      pubmedId: id,
      authorName: authorLine,
      yearTitle: yearTitle,
      journalTitle: journalTitle,
    };
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
      <Helmet>
        <title>HSP | Salivary Protein Detail</title>
      </Helmet>
      <BreadCrumb path={breadcrumbPath} />
      <script
        src="https://d3js.org/d3.v4.min.js"
        charSet="utf-8"
        defer
      ></script>
      <script src="https://cdn.jsdelivr.net/npm/protvista-uniprot@latest/dist/protvista-uniprot.js"></script>
      <div
        style={{
          backgroundImage: `url(${main_feature})`,
        }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1 className="head_title">
            Protein: {data[0]["_source"]["salivary_proteins"]["protein_name"]}
          </h1>
          <p className="head_text">
            Altername Names:{" "}
            {
              data[0]["_source"]["salivary_proteins"][
                "protein_alternate_names"
              ][0]
            }
          </p>
        </Container>
      </div>
      <div
        id="hero-section"
        style={{ paddingTop: "10px" }}
      >
        <Container maxWidth="xl">
          <span id="hero-text">Jump To Section</span>
          <div
            style={{
              marginLeft: "30px",
              display: "inline-block", // Ensuring the links are also in line
              alignItems: "center", // Centering items vertically
              flexWrap: "wrap", // Optional: Allows items to wrap to the next line on smaller screens
            }}
          >
            <Link
              to="#names-and-origin"
              className="hero-link"
              style={{ marginLeft: "0px" }}
            >
              Names & Origin
            </Link>
            |
            <Link
              to="#taxonomy"
              className="hero-link"
            >
              Taxonomy
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
              to="#comments"
              className="hero-link"
            >
              Comments
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
            {data[0]["_source"]["salivary_proteins"]["glycans"].length !==
              0 && (
              <>
                <Link
                  to="#glycan"
                  className="hero-link"
                >
                  Glycan
                </Link>{" "}
                |
              </>
            )}
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
        </Container>
      </div>
      <Container maxWidth="xl">
        <div style={{ marginTop: "20px" }}>
          <h2
            style={{
              color: "black",
              marginBottom: "24px",
              fontWeight: "bold",
              fontFamily: "Lato",
            }}
            id="names-and-origin"
          >
            Names & Origin
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
                      border: "none",
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
                      borderTopRightRadius: "10px",
                      border: "1px solid #CACACA",
                      fontFamily: "Lato",
                    }}
                  >
                    <a
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "/*#116988*/#0b5989" }}
                      href="https://www.uniprot.org/taxonomy/9606 "
                    >
                      {"Homo sapiens "}
                      <FontAwesome
                        className="super-crazy-colors"
                        name="external-link"
                        style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
                      />
                    </a>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div
            style={{
              height: "3px",
              background: "linear-gradient(to right, #1463B9, #ffffff)",
              margin: "40px 0",
            }}
          ></div>
          <h2
            style={{
              color: "black",
              marginBottom: "24px",
              fontWeight: "bold",
              fontFamily: "Lato",
              marginTop: "10px",
            }}
            id="taxonomy"
          >
            Taxonomy
          </h2>

          <span style={{ fontFamily: "Lato", fontSize: "14px" }}>
            Eukaryota {">"} Opisthokonta {">"} Metazoa {">"} Eumetazoa {">"}{" "}
            Bilateria {">"} Deuterostomia {">"} Chordata {">"} Craniata {">"}{" "}
            Vertebrata {">"} Gnathostomata {">"} Teleostomi {">"} Euteleostomi{" "}
            {">"} Sarcopterygii {">"} Dipnotetrapodomorpha {">"} Tetrapoda {">"}{" "}
            Amniota {">"} Mammalia {">"} Theria {">"} Eutheria {">"}{" "}
            Boreoeutheria {">"} Euarchontoglires {">"} Primates {">"}{" "}
            Haplorrhini {">"} Simiiformes {">"} Catarrhini {">"} Hominoidea{" "}
            {">"} Hominidae {">"} Homininae {">"} Homo
          </span>
          <div
            style={{
              height: "3px",
              background: "linear-gradient(to right, #1463B9, #ffffff)",
              margin: "40px 0",
            }}
          ></div>
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
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "17px",
                      fontWeight: "bold",
                      border: "none",
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
                      border: "none",
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
                    <ReactLink
                      style={{ color: "#116988" }}
                      to={
                        window.location.origin +
                        "/protein-sequence/" +
                        params["proteinid"]
                      }
                    >
                      Sequence
                    </ReactLink>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div
            style={{
              height: "3px",
              background: "linear-gradient(to right, #1463B9, #ffffff)",
              margin: "40px 0",
            }}
          ></div>
          <h2
            style={{
              color: "black",
              marginBottom: "24px",
              fontWeight: "bold",
              fontFamily: "Lato",
              marginTop: "10px",
            }}
            id="comments"
          >
            Comments
          </h2>
          <CommentTable
            data={data[0]["_source"]["salivary_proteins"]["annotations"]}
          />
          <div
            style={{
              height: "3px",
              background: "linear-gradient(to right, #1463B9, #ffffff)",
              margin: "40px 0",
            }}
          ></div>
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
          <div style={{ overflowX: "auto" }}>
            <protvista-uniprot
              accession={
                data[0]["_source"]["salivary_proteins"]["uniprot_accession"]
              }
            ></protvista-uniprot>
          </div>
          <div
            style={{
              height: "3px",
              background: "linear-gradient(to right, #1463B9, #ffffff)",
              margin: "40px 0",
            }}
          ></div>
          {data[0]["_source"]["salivary_proteins"]["glycans"].length !== 0 && (
            <>
              <GlycanTable data={data} />
              <div
                style={{
                  height: "3px",
                  background: "linear-gradient(to right, #1463B9, #ffffff)",
                  margin: "40px 0",
                }}
              ></div>
            </>
          )}

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
              fontFamily: "Lato",
            }}
          >
            Abundance and localization of gene products based on both RNA and
            immunohistochemistry data from the{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={
                "http://www.proteinatlas.org/" +
                data[0]["_source"]["salivary_proteins"]["ensembl_g"]
              }
            >
              {"Human Protein Atlas "}
              <FontAwesome
                className="super-crazy-colors"
                name="external-link"
                style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
              />
            </a>
            . Click on the tissue names to view primary data.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              marginLeft: "6%",
            }}
          >
            <BChart
              data={data[0]["_source"]["salivary_proteins"]["atlas"]}
              gene_id={data[0]["_source"]["salivary_proteins"]["ensembl_g"]}
            />
          </div>
          <div
            style={{
              height: "3px",
              background: "linear-gradient(to right, #1463B9, #ffffff)",
              margin: "40px 0",
            }}
          ></div>
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
          {abundanceData.length === 1 &&
          abundanceData[0].tissue_id === "N/A" ? (
            "There is no human salivary proteomics data for this protein."
          ) : (
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
                        border: "none",
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
                    {/* <TableCell
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
                  </TableCell> */}
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
                        border: "none",
                        borderTopRightRadius: "10px",
                      }}
                    >
                      Abundance Score
                    </TableCell>
                  </TableRow>
                  {abundanceData.map((row, i) => {
                    const {
                      abundance_score,
                      disease_state,
                      experiment_count,
                      isoform,
                      peptide_count,
                      tissue_id,
                      tissue_term,
                    } = row;

                    return (
                      <TableRow key={`proteomics-row-${i}`}>
                        <TableCell
                          style={{
                            border: "1px solid #CACACA",
                            fontFamily: "Lato",
                          }}
                        >
                          {tissue_id === "N/A" ? (
                            tissue_id
                          ) : (
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={`https://www.ebi.ac.uk/ols4/ontologies/bto/classes?obo_id=${tissue_id}`}
                            >
                              {tissue_id}{" "}
                              <FontAwesome
                                className="super-crazy-colors"
                                name="external-link"
                                style={{
                                  textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            </a>
                          )}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #CACACA",
                            fontFamily: "Lato",
                            textTransform: "Capitalize",
                          }}
                        >
                          {tissue_term}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #CACACA",
                            fontFamily: "Lato",
                            textTransform: "Capitalize",
                          }}
                        >
                          {disease_state}
                        </TableCell>
                        {/* <TableCell
                        style={{
                          border: "1px solid #CACACA",
                          fontFamily: "Lato",
                        }}
                      >
                        // For IsoForm 
                      </TableCell> */}
                        <TableCell
                          style={{
                            border: "1px solid #CACACA",
                            fontFamily: "Lato",
                          }}
                        >
                          {experiment_count}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #CACACA",
                            fontFamily: "Lato",
                          }}
                        >
                          {peptide_count}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #CACACA",
                            fontFamily: "Lato",
                          }}
                        >
                          {abundance_score}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <div
            style={{
              height: "3px",
              background: "linear-gradient(to right, #1463B9, #ffffff)",
              margin: "40px 0",
            }}
          ></div>
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
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "17px",
                      fontWeight: "bold",
                      border: "none",
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
                            target="_blank"
                            rel="noreferrer"
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
                    sx={{
                      fontSize: "0.875rem",
                      border: "1px solid #CACACA",
                    }}
                  >
                    {data[0]["_source"]["salivary_proteins"][
                      "peptide_atlas"
                    ].map((value, i, arr) => {
                      return (
                        <React.Fragment key={i}>
                          <a
                            target="_blank"
                            rel="noreferrer"
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
                          <span>{i === arr.length - 1 ? ", " : ""}</span>
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
                    style={{
                      maxWidth: "100%",
                      border: "1px solid #CACACA",
                    }}
                  >
                    {data[0]["_source"]["salivary_proteins"]["ensembl"].map(
                      (value, i, arr) => {
                        return (
                          <React.Fragment key={i}>
                            <a
                              target="_blank"
                              rel="noreferrer"
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
                      target="_blank"
                      rel="noreferrer"
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
                    sx={{
                      fontSize: "0.875rem",
                      border: "1px solid #CACACA",
                    }}
                  >
                    {data[0]["_source"]["salivary_proteins"]["gene_cards"].map(
                      (value, i, arr) => {
                        return (
                          <React.Fragment key={i}>
                            <a
                              target="_blank"
                              rel="noreferrer"
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
                      }
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div
            style={{
              height: "3px",
              background: "linear-gradient(to right, #1463B9, #ffffff)",
              margin: "40px 0",
            }}
          ></div>
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
                    target="_blank"
                    rel="noreferrer"
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
          <div
            style={{
              height: "3px",
              background: "linear-gradient(to right, #1463B9, #ffffff)",
              margin: "40px 0",
            }}
          ></div>
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
          {data[0]["_source"]["salivary_proteins"]["cites"].map((value, i) => {
            return (
              <React.Fragment key={i}>
                <div style={{ fontFamily: "Lato" }}>
                  <h4 style={{ display: "inline" }}>{i + 1}. </h4>
                  <b style={{ color: "#1463B9" }}>{authorName[i]}</b>
                  <span>{year[i]}</span>
                  <i>{journal[i]}</i>
                  <a
                    target="_blank"
                    rel="noreferrer"
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
          })}
          <div
            style={{
              height: "3px",
              background: "linear-gradient(to right, #1463B9, #ffffff)",
              margin: "40px 0",
            }}
          ></div>
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
              <TableRow>
                <TableCell
                  sx={th}
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    border: "none",
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
                    data[0]["_source"]["salivary_proteins"]["created_on"].split(
                      "-"
                    )[0]
                  }
                  {"/"}
                  {
                    data[0]["_source"]["salivary_proteins"]["created_on"].split(
                      "-"
                    )[1]
                  }
                  {"/"}
                  {
                    data[0]["_source"]["salivary_proteins"]["created_on"].split(
                      "-"
                    )[2]
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
      </Container>
    </>
  );
};

export default ProteinDetail;
