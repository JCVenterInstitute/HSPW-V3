import React from "react";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { HashLink as Link } from "react-router-hash-link";
import { useEffect, useState } from "react";
import "../style.css";
import Divider from "@mui/material/Divider";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import FontAwesome from "react-fontawesome";
import "font-awesome/css/font-awesome.min.css";
import Comment_Table from "../../components/salivary_protein/comment_table";
import { useParams } from "react-router";
import ProtvistaUniprot from "protvista-uniprot";
import axios from "axios";
import BChart from "../../components/salivary_protein/TwoSidedBarChart";
import "resize-observer-polyfill";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import main_feature from "../../components/hero.jpeg";

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
  const [year, setYear] = useState("");
  const [journal, setJournal] = useState("");
  const [v, setV] = useState("");
  const [j, setJ] = useState("");
  const [sS, setSS] = useState("");
  const [checkData, setCheckData] = useState(false);
  const [annotation, setAnnotation] = useState("");

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
    let yearTitle = "";
    let authorArr = [];
    const pubmedLink = "http://localhost:8000/citation/" + id;
    console.log(pubmedLink);
    const response = await fetch(pubmedLink);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();
    console.log(data[0]["_source"]);
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

            <TableHead
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <TableRow sx={{ border: "1px solid black" }}>
                <TableCell
                  sx={th}
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "14px",
                    border: "1px solid #3592E4",
                    borderTopLeftRadius: "10px",
                  }}
                >
                  Primary Accession
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.875rem",
                    border: "1px solid #CACACA",
                    borderTopRightRadius: "10px",
                    fontFamily: "Lato",
                  }}
                >
                  {data[0]["_source"]["salivary_proteins"]["uniprot_accession"]}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  sx={th}
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "14px",

                    border: "1px solid #3592E4",
                  }}
                >
                  Genes
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.875rem",
                    border: "1px solid #CACACA",
                    fontFamily: "Lato",
                    fontSize: "14px",
                  }}
                >
                  {data[0]["_source"]["salivary_proteins"][
                    "primary_gene_names"
                  ].map((child, i) => (
                    <React.Fragment
                      key={
                        data[0]["_source"]["salivary_proteins"][
                          "primary_gene_names"
                        ].i
                      }
                    >
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
                  sx={th}
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "14px",
                    border: "1px solid #3592E4",
                  }}
                >
                  Organism
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.875rem",
                    border: "1px solid #CACACA",
                    fontFamily: "Lato",
                    fontSize: "14px",
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
            </TableHead>

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
                    borderTopLeftRadius: "10px",
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
                    borderTopRightRadius: "10px",
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
                  }}
                >
                  {data[0]["_id"]}
                </TableCell>
                <TableCell style={{ border: "1px solid #CACACA" }}>
                  Canonical sequence
                </TableCell>
                <TableCell style={{ border: "1px solid #CACACA" }}></TableCell>
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
            <Comment_Table
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
            <div style={{width:95%;}}>
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

            <div
              style={{
                color: "black",
                marginBottom: "20px",
                marginTop: "20px",
                fontSize: "0.875rem",
                textAlign: "left",
                width:"100%",
                overflow:"hidden"
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
                      borderTopLeftRadius: "10px",
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
                      borderTopRightRadius: "10px",
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
                        }}
                        key={
                          data[0]["_source"]["salivary_proteins"]["glycans"].i
                        }
                      >
                        <TableCell
                          style={{
                            border: "1px solid #CACACA",
                          }}
                        >
                          {value.glytoucan_accession}
                        </TableCell>
                        <TableCell style={{ border: "1px solid #CACACA" }}>
                          <img src={value.image} alt="Glygen" />
                        </TableCell>

                        <TableCell style={{ border: "1px solid #CACACA" }}>
                          {value.type}
                        </TableCell>
                        <TableCell style={{ border: "1px solid #CACACA" }}>
                          {value.mass}
                        </TableCell>
                        <TableCell style={{ border: "1px solid #CACACA" }}>
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
                                  borderTopLeftRadius: "10px",
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
                                  borderTopRightRadius: "10px",
                                }}
                              >
                                url
                              </TableCell>
                            </TableRow>
                            {value.source.map((val, j, arr) => {
                              return (
                                <React.Fragment key={value.j}>
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
                                </React.Fragment>
                              );
                            })}
                          </TableHead>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableHead>
            </div>
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

            <TableHead
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
                <TableCell style={{ border: "1px solid #CACACA" }}></TableCell>
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
                <TableCell style={{ border: "1px solid #CACACA" }}></TableCell>
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
                <TableCell style={{ border: "1px solid #CACACA" }}></TableCell>
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
                <TableCell style={{ border: "1px solid #CACACA" }}></TableCell>
              </TableRow>
            </TableHead>

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
                      <React.Fragment
                        key={
                          data[0]["_source"]["salivary_proteins"][
                            "reference_sequence"
                          ].i
                        }
                      >
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
                  {data[0]["_source"]["salivary_proteins"]["peptide_atlas"].map(
                    (value, i, arr) => {
                      return (
                        <React.Fragment
                          key={
                            data[0]["_source"]["salivary_proteins"][
                              "peptide_atlas"
                            ].i
                          }
                        >
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
                        </React.Fragment>
                      );
                    }
                  )}
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
                        <React.Fragment
                          key={
                            data[0]["_source"]["salivary_proteins"]["ensembl"].i
                          }
                        >
                          <a
                            href={"http://www.ensembl.org/id/" + value}
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
                          <span>{i != arr.length - 1 ? ", " : ""}</span>
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
                        <React.Fragment
                          key={
                            data[0]["_source"]["salivary_proteins"][
                              "gene_cards"
                            ].i
                          }
                        >
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
                          <span>{i != arr.length - 1 ? ", " : ""}</span>
                        </React.Fragment>
                      );
                    }
                  )}
                </TableCell>
              </TableRow>
            </TableHead>

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
                  <React.Fragment
                    key={data[0]["_source"]["salivary_proteins"]["keywords"].i}
                  >
                    <a
                      href={"https://www.uniprot.org/keywords/" + value.id}
                      style={{
                        fontFamily: "Lato",
                        fontSize: "14px",
                        color: "#000",
                      }}
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
                  <React.Fragment
                    key={data[0]["_source"]["salivary_proteins"]["cites"].i}
                  >
                    <div key={value}>
                      <h4 style={{ display: "inline" }}>{i + 1}. </h4>

                      <b style={{ color: "#1463B9" }}>{authorName[i]}</b>
                      <span>{year[i]}</span>
                      <i>{journal[i]}</i>

                      <a
                        href={"https://pubmed.ncbi.nlm.nih.gov/" + value}
                        style={{ color: "#777777" }}
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
                  }}
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
                    fontSize: "16px",
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
                    fontSize: "16px",
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
