import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { HashLink as Link } from "react-router-hash-link";
import { useEffect, useState } from "react";
import "./style.css";
import Divider from "@mui/material/Divider";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import FontAwesome from "react-fontawesome";
import "font-awesome/css/font-awesome.min.css";

import { useParams } from "react-router";
import ProtvistaUniprot from "protvista-uniprot";
import axios from "axios";
import BChart from "../components/TwoSidedBarChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import main_feature from "../components/hero.jpeg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
let i = 0;

window.customElements.define("protvista-uniprot", ProtvistaUniprot);
export const options = {
  indexAxis: "y",
  responsive: true,
  title: {
    display: true,
    text: "Data Pasien Keluar Masuk",
    fontSize: 20,
  },
  legend: {
    position: "bottom",
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = 0;
          if (context.parsed.x) {
            label = Math.abs(context.parsed.x);
          }
          return label;
        },
      },
    },
  },
  scales: {
    xAxes: [
      {
        stacked: true,
        ticks: {
          callback: (value) => Math.abs(value),
        },
      },
    ],
    yAxes: [
      {
        stacked: true,
        ticks: {
          reverse: true,
        },
      },
      {
        type: "category",
        position: "right",
        offset: true,
        ticks: {
          reverse: true,
        },
        gridLines: {
          display: false,
        },
      },
    ],
  },
};

export const data = {
  labels: ["0-4", "5-9", "10-14", "15-19", "20+"],
  datasets: [
    {
      label: "Pasien Masuk",
      data: [100, 90, 80, 70, 60000],
      backgroundColor: "red",
    },
    {
      label: "Pasien Keluar",
      data: [-100, -75, -60, -75, -70],
      backgroundColor: "blue",
    },
  ],
};

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

const Protein_Detail = (props) => {
  const [message, setMessage] = useState("");
  const params = useParams();
  let url = "http://localhost:8000/protein/" + params["proteinid"];

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const [data1, setData1] = useState("");
  const [p, setP] = useState("");
  const [o, setO] = useState("");
  const [fS, setFS] = useState("");
  const [authorName, setauthorName] = useState("");
  const [v, setV] = useState("");
  const [j, setJ] = useState("");
  const [sS, setSS] = useState("");
  const [checkData, setCheckData] = useState(false);

  const fetchProtein = async () => {
    console.log(url);
    const response = await axios.get(url);
    console.log(response);

    const json = response.data;
    return json;
  };

  const processData = async () => {
    const proteinResult = await fetchProtein().catch(console.error);

    if (proteinResult) {
      setData(proteinResult);
      console.log(proteinResult);
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
    console.log("178" + id);

    const pubmedLink = "http://localhost:8000/citation/" + id;
    console.log(pubmedLink);
    const response = await fetch(pubmedLink);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();
    console.log("188:" + id + " i: " + JSON.stringify(data[0]["_source"]));
    line =
      data[0]["_source"].Authors +
      " (" +
      data[0]["_source"]["Date of Publication"] +
      ") " +
      data[0]["_source"]["Title"];
    setauthorName((prevLines) => [...prevLines, line]);
    console.log("line: " + line);

    setLoading(false);
  };

  useEffect(() => {
    processData();
  }, []);

  if (isLoading === true) {
    return <h2>Loading</h2>;
  }

  return (
    <>
      <script
        src="https://d3js.org/d3.v4.min.js"
        charset="utf-8"
        defer
      ></script>
      <script src="https://cdn.jsdelivr.net/npm/protvista-uniprot@latest/dist/protvista-uniprot.js"></script>
      <Tabs>
        <TabList>
          <Tab>Protein</Tab>
          <Tab>Curation</Tab>
          <Tab></Tab>
        </TabList>

        <TabPanel>
          <div
            style={{
              backgroundImage: `url(${main_feature})`,
            }}
            className="head_background"
          >
            <h1 className="head_title" align="left">
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
              <Link to="#sequence-attributes" className="hero-link">
                Sequence Attributes
              </Link>
              |
              <Link to="#feature-map" className="hero-link">
                Feature Map
              </Link>
              |
              <Link to="#expression" className="hero-link">
                Expression
              </Link>
              |
              <Link to="#glycan" className="hero-link">
                Glycan
              </Link>
              |
              <Link to="#proteomics" className="hero-link">
                Proteomics
              </Link>
              |
              <Link to="#cross-reference" className="hero-link">
                Cross References
              </Link>
              |
              <Link to="#keywords" className="hero-link">
                Keywords
              </Link>
              |
              <Link to="#references" className="hero-link">
                References
              </Link>
              |
              <Link to="#entry-info" className="hero-link">
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
            <Table
              sx={{ maxWidth: "40%" }}
              aria-label="simple table"
              style={{ border: "1px solid black", borderTopLeftRadius: "10px" }}
            >
              <TableHead>
                <TableRow sx={{ border: "1px solid black" }}>
                  <TableCell
                    sx={th}
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "17px",
                      fontWeight: "bold",
                      border: "1px solid #3592E4",
                    }}
                  >
                    Primary Accession
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.875rem", border: "1px solid #CACACA" }}
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
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "17px",
                      fontWeight: "bold",
                      border: "1px solid #3592E4",
                    }}
                  >
                    Genes
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.875rem", border: "1px solid #CACACA" }}
                  >
                    {data[0]["_source"]["salivary_proteins"][
                      "primary_gene_names"
                    ].map((child, i) => (
                      <>
                        <span style={{ color: "black" }}>
                          {i + 1}. {child}
                        </span>
                        <br></br>
                      </>
                    ))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={th}
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "17px",
                      fontWeight: "bold",
                      border: "1px solid #3592E4",
                    }}
                  >
                    Organism
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.875rem", border: "1px solid #CACACA" }}
                  >
                    <a
                      style={{ color: "/*#116988*/#0b5989" }}
                      href="http://salivaryproteome.org/public/index.php/Special:Ontology_Term/NEWT:9606"
                    >
                      Homo sapiens
                    </a>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
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

            <span>
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
            <Table
              style={{
                width: "80%",
                border: "1px solid black",
                marginBottom: "20px",
              }}
            >
              <TableHead>
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
                    }}
                  >
                    <a
                      style={{ color: "white" }}
                      href="https://salivaryproteome.org/public/index.php/Property:Has_accession_number"
                    >
                      Identifier
                    </a>
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
                    <a
                      style={{ color: "white" }}
                      href="https://salivaryproteome.org/public/index.php/Property:Known_officially_as"
                    >
                      Name
                    </a>
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
                    <a
                      style={{ color: "white" }}
                      href="https://salivaryproteome.org/public/index.php/Property:Known_officially_as"
                    >
                      Aliases
                    </a>
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
                    <a
                      style={{ color: "white" }}
                      href="https://salivaryproteome.org/public/index.php/Property:Known_officially_as"
                    >
                      Sequence length
                    </a>
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
                    <a
                      style={{ color: "white" }}
                      href="https://salivaryproteome.org/public/index.php/Property:Known_officially_as"
                    >
                      Molecular mass
                    </a>
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
                    <a
                      style={{ color: "white" }}
                      href="https://salivaryproteome.org/public/index.php/Property:Known_officially_as"
                    >
                      Sequence
                    </a>
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
                      borderRadius: "1em 0 0 1em",
                    }}
                  >
                    {data[0]["_id"]}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    Canonical sequence
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #CACACA" }}
                  ></TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    {
                      data[0]["_source"]["salivary_proteins"][
                        "protein_sequence_length"
                      ]
                    }
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    {data[0]["_source"]["salivary_proteins"]["mass"]}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    <a
                      style={{ color: "#116988" }}
                      href="https://salivaryproteome.org/public/index.php/HSPW:PE90567/1"
                    >
                      HSPW:PE90567/1
                    </a>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>

            {/*
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Go Annotations</h2>
        <Divider style={{'margin-bottom':'10px'}}/>
        <p style={{ 'display': 'inline','color':'black','font-size':'0.9rem' }}>
            The Gene Ontology (GO) describes knowledge of the biological domain with respect to three aspects: 1. Molecular function 2. Biological process 3. Cellular component
        </p>
        <br style={{'margin-bottom':'5px'}}></br>
        <p style={{ 'display': 'inline','color':'black','font-size':'0.9rem' }}>
            A variety of groups, including UniProtKB curators, use GO terms to annotate gene products in a computationally tractable manner. UniProt lists the annotated GO terms in the 'Function' section; the GO terms from the 'Cellular component' category can also be seen in 'Subcellular location' section. The project that made the annotation is shown as the 'Source', and a click on this label will display the supporting type of evidence. When available, a link to the relevant publications is provided.
        </p>
        <Comment_Table data={p}/>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>PTM/Processing</h2>
        <Divider style={{'margin-bottom':'10px'}}/>
        <p style={{ 'display': 'inline','color':'black','font-size':'0.9rem' }}>This section describes post-translational modifications (PTMs) and/or processing events.</p>
        <Comment_Table data={o}/>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Features</h2>
        <Divider sx={{'marginBottom': "10px"}}/>
  */}
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
            <protvista-uniprot
              accession={
                data[0]["_source"]["salivary_proteins"]["uniprot_accession"]
              }
            ></protvista-uniprot>
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
              id="glycan"
            >
              Glycans
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
              <Table>
                <TableHead>
                  <TableRow sx={{ border: "1px solid black" }}>
                    <TableCell
                      sx={th}
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Accession
                    </TableCell>
                    <TableCell
                      sx={th}
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Image
                    </TableCell>
                    <TableCell
                      sx={th}
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      sx={th}
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Mass
                    </TableCell>
                    <TableCell
                      sx={th}
                      style={{
                        backgroundColor: "#1463B9",
                        color: "white",
                        fontFamily: "Montserrat",
                        fontSize: "17px",
                        fontWeight: "bold",
                        border: "1px solid #3592E4",
                      }}
                    >
                      Source
                    </TableCell>
                  </TableRow>
                  {data[0]["_source"]["salivary_proteins"]["glycans"].map(
                    (value, i, arr) => {
                      return (
                        <TableRow
                          style={{
                            border: "1px solid #CACACA",
                            borderRadius: "1em 0 0 1em",
                          }}
                        >
                          <TableCell
                            style={{
                              border: "1px solid #CACACA",
                              borderRadius: "1em 0 0 1em",
                            }}
                          >
                            {value.glytoucan_accession}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #CACACA" }}>
                            <img
                              src={value.image}
                              alt="Glygen"
                              width="150"
                              height="100"
                            />
                          </TableCell>

                          <TableCell style={{ border: "1px solid #CACACA" }}>
                            {value.type}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #CACACA" }}>
                            {value.mass}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #CACACA" }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    sx={th}
                                    style={{
                                      backgroundColor: "#1463B9",
                                      color: "white",
                                      fontFamily: "Montserrat",
                                      fontSize: "17px",
                                      fontWeight: "bold",
                                      border: "1px solid #3592E4",
                                    }}
                                  >
                                    id
                                  </TableCell>
                                  <TableCell
                                    sx={th}
                                    style={{
                                      backgroundColor: "#1463B9",
                                      color: "white",
                                      fontFamily: "Montserrat",
                                      fontSize: "17px",
                                      fontWeight: "bold",
                                      border: "1px solid #3592E4",
                                    }}
                                  >
                                    Database
                                  </TableCell>
                                  <TableCell
                                    sx={th}
                                    style={{
                                      backgroundColor: "#1463B9",
                                      color: "white",
                                      fontFamily: "Montserrat",
                                      fontSize: "17px",
                                      fontWeight: "bold",
                                      border: "1px solid #3592E4",
                                    }}
                                  >
                                    url
                                  </TableCell>
                                </TableRow>
                                {value.source.map((val, j, arr) => {
                                  return (
                                    <>
                                      <TableRow>
                                        <TableCell
                                          style={{
                                            border: "1px solid #CACACA",
                                          }}
                                        >
                                          {val.id}
                                        </TableCell>
                                        <TableCell
                                          style={{
                                            border: "1px solid #CACACA",
                                          }}
                                        >
                                          {val.database}
                                        </TableCell>
                                        {val.url ? (
                                          <TableCell
                                            style={{
                                              border: "1px solid #CACACA",
                                            }}
                                          >
                                            <a href={val.url}>{val.url}</a>
                                          </TableCell>
                                        ) : (
                                          <TableCell
                                            style={{
                                              border: "1px solid #CACACA",
                                            }}
                                          ></TableCell>
                                        )}
                                      </TableRow>
                                    </>
                                  );
                                })}
                              </TableHead>
                            </Table>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableHead>
              </Table>
            </p>
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
                Human Protein Atlas
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
            <Table style={{ width: "80%" }}>
              <TableHead>
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
                    }}
                  >
                    Abundance Score
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    <a href="https://salivaryproteome.org/community/index.php/Special:Ontology_Term/BTO:0001202">
                      BTO:0001202
                    </a>
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    Saliva
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    Disease free<br></br>Sjogren's Syndrome<br></br>COVID-19
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    50<br></br>2<br></br>8
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    133<br></br>2870<br></br>24
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    430.74<br></br>1008.23<br></br>0
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #CACACA" }}
                  ></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    <a href="https://salivaryproteome.org/community/index.php/Special:Ontology_Term/BTO:0001316">
                      BTO:0001316
                    </a>
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    Submandibular gland
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    Disease free
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    49
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    2442
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    13513.97
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #CACACA" }}
                  ></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    <a href="https://salivaryproteome.org/community/index.php/Special:Ontology_Term/BTO:0001315">
                      BTO:0001315
                    </a>
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    Sublingual gland
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    Disease free
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    49
                  </TableCell>
                  <TableCell v>2442</TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    14,385.84
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #CACACA" }}
                  ></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    <a href="https://salivaryproteome.org/community/index.php/Special:Ontology_Term/BTO:0001004">
                      BTO:0001004
                    </a>
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    Parotid gland
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    Disease free
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    56
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    1208
                  </TableCell>
                  <TableCell style={{ border: "1px solid #CACACA" }}>
                    3,127.74
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #CACACA" }}
                  ></TableCell>
                </TableRow>
              </TableHead>
            </Table>
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

            <Table
              sx={{ maxWidth: "40%", border: 1, tableLayout: "fixed" }}
              aria-label="simple table"
              style={{ border: "1px solid black" }}
            >
              <TableHead>
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
                    }}
                    sx={th}
                  >
                    RefSeq
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.875rem" }}
                    style={{ maxWidth: "100%", border: "1px solid #CACACA" }}
                  >
                    {data[0]["_source"]["salivary_proteins"][
                      "reference_sequence"
                    ].map((value, i, arr) => {
                      return (
                        <>
                          <a
                            href={
                              "https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=protein&id=" +
                              value
                            }
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
                          <span>{i != arr.length - 1 ? ", " : ""}</span>
                        </>
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
                        <>
                          <a
                            href={
                              "https://db.systemsbiology.net/sbeams/cgi/PeptideAtlas/Search?action=GO&search_key=" +
                              value
                            }
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
                          <span>{i != arr.length - 1 ? ", " : ""}</span>
                        </>
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
                          <>
                            <a href={"http://www.ensembl.org/id/" + value}>
                              {value}
                              <FontAwesome
                                className="super-crazy-colors"
                                name="external-link"
                                style={{
                                  textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            </a>
                            <span>{i != arr.length - 1 ? ", " : ""}</span>
                          </>
                        );
                      }
                    )}
                    <a
                      href={
                        "http://www.ensembl.org/id/" +
                        data[0]["_source"]["salivary_proteins"]["ensembl_g"]
                      }
                    >
                      , {data[0]["_source"]["salivary_proteins"]["ensemgl_g"]}
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
                    {data[0]["_source"]["salivary_proteins"]["gene_cards"].map(
                      (value, i, arr) => {
                        return (
                          <>
                            <a
                              href={
                                "https://www.genecards.org/cgi-bin/carddisp.pl?gene=" +
                                value
                              }
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
                            <span>{i != arr.length - 1 ? ", " : ""}</span>
                          </>
                        );
                      }
                    )}
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
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
                  <>
                    <a
                      href={
                        "https://www.uniprot.org/keywords/" +
                        value.id.split(":")[1]
                      }
                      style={{ fontFamily: "Lato", fontSize: "18px" }}
                    >
                      {value.keyword}
                      <FontAwesome
                        className="super-crazy-colors"
                        name="external-link"
                        style={{
                          textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </a>
                    <span>{i != arr.length - 1 ? ", " : ""}</span>
                  </>
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

            <Table
              sx={{ minWidth: 650, border: 1, width: "90%" }}
              aria-label="simple table"
            >
              <TableRow sx={{ border: "1px solid black" }}>
                <TableCell
                  sx={{ fontSize: "0.875rem" }}
                  style={{ maxWidth: "100%" }}
                >
                  {data[0]["_source"]["salivary_proteins"]["cites"].map(
                    (value, i) => {
                      return (
                        <>
                          <div key={value}>
                            <h3 style={{ display: "inline" }}>{i + 1}. </h3>
                            <p
                              style={{
                                display: "inline",
                                color: "black",
                                "font-size": "0.875rem",
                              }}
                            >
                              <b>{authorName[i]}</b>
                            </p>
                            <a
                              href={
                                "https://pubmed.ncbi.nlm.nih.gov/" +
                                value.split(":")[1]
                              }
                            >
                              {" "}
                              [{value}
                              <FontAwesome
                                className="super-crazy-colors"
                                name="external-link"
                                style={{
                                  textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                                }}
                              />
                              ]
                            </a>
                          </div>
                        </>
                      );
                    }
                  )}
                </TableCell>
              </TableRow>
            </Table>
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

            <Table
              sx={{ maxWidth: "20%", border: 1, tableLayout: "fixed" }}
              aria-label="simple table"
              style={{
                border: "1px solid #3592E4",
              }}
            >
              <TableHead>
                <TableRow sx={{ border: "1px solid black" }}>
                  <TableCell
                    sx={th}
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "17px",
                      fontWeight: "bold",
                      border: "1px solid #3592E4",
                    }}
                  >
                    Created On
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.875rem" }}
                    style={{ maxWidth: "100%", border: "1px solid #CACACA" }}
                  >
                    {data[0]["_source"]["salivary_proteins"]["created_on"]}
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
                      fontSize: "17px",
                      fontWeight: "bold",
                      border: "1px solid #3592E4",
                    }}
                  >
                    Last Modified On
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.875rem" }}
                    style={{ maxWidth: "100%", border: "1px solid #CACACA" }}
                  >
                    {data[0]["_source"]["salivary_proteins"]["last_modified"]}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ border: "1px solid black" }}>
                  <TableCell
                    sx={th}
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "17px",
                      fontWeight: "bold",
                      border: "1px solid #3592E4",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.875rem" }}
                    style={{ maxWidth: "100%", border: "1px solid #CACACA" }}
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

            <Table
              sx={{ maxWidth: "20%", border: 1, tableLayout: "fixed" }}
              aria-label="simple table"
              style={{ border: "1px solid black" }}
            >
              <TableHead>
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
                  <TableCell sx={th} style={{ maxWidth: "20%" }}>
                    Abundance level
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.875rem" }}
                    style={{ maxWidth: "100%", border: "1px" }}
                  ></TableCell>
                </TableRow>
                <TableRow sx={{ border: "1px solid black" }}>
                  <TableCell sx={th} style={{ maxWidth: "20%" }}>
                    Curator
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.875rem" }}
                    style={{ maxWidth: "100%", border: "1px" }}
                  >
                    127.0.0.1
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </div>
        </TabPanel>
      </Tabs>
    </>
  );
};

export default Protein_Detail;
<>
  <script src="https://d3js.org/d3.v4.min.js" charset="utf-8" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/protvista-uniprot@latest/dist/protvista-uniprot.js"></script>
</>;
