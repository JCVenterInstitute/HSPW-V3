import React from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import FontAwesome from "react-fontawesome";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

import MainFeature from "../../../assets/hero.jpeg";
import { Container } from "@mui/material";

const th = {
  background: "#f2f2f2",
  textAlign: "center",
  border: "1px solid #aaa",
  fontWeight: "bold",
  fontSize: "20px",
  padding: "0.2em",
};

const td = {
  border: "1px solid #aaa",
  fontSize: "14px",
  padding: "0.2em",
};

const GeneDetail = (props) => {
  const params = useParams();

  const [message, setMessage] = useState(true);
  const [proteinNameMap, setProteinNameMap] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");

  const gene_link = "https://www.ncbi.nlm.nih.gov/gene/";

  const fetchGenes = async () => {
    const url = `${process.env.REACT_APP_API_ENDPOINT}/genes/${params["geneid"]}`;

    const response = await fetch(url);

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const genes = await response.json();

    setData(genes);
    setMessage(false);
  };

  const fetchProtein = async () => {
    const proteinNameMapping = {};

    for (const gene of data[0]["_source"]["Gene Products"]) {
      try {
        const response = await fetch(
          `https://rest.uniprot.org/uniprotkb/${gene}.json`
        );

        const proteinName = await response.json();

        if (proteinName && proteinName.proteinDescription) {
          const { recommendedName, submissionNames } =
            proteinName.proteinDescription;

          if (recommendedName) {
            proteinNameMapping[gene] = recommendedName.fullName.value;
          } else if (submissionNames) {
            proteinNameMapping[gene] = submissionNames[0].fullName.value;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    setProteinNameMap(proteinNameMapping);
    setLoading(false);
  };

  useEffect(() => {
    fetchGenes();
    if (message === false) {
      fetchProtein();
    }
  }, [message]);

  if (isLoading === true) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress sx={{ mb: "500px", margin: "20px" }} />
      </Box>
    );
  }

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${MainFeature})`,
        }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1 className="head_title">
            Gene: EntrezGene:{data[0]["_source"]["GeneID"]}
          </h1>
          <p className="head_text">Name: {data[0]["_source"]["Gene Name"]}</p>
          <p className="head_text">
            Gene Symbol: {data[0]["_source"]["Gene Symbol"]}
          </p>
        </Container>
      </div>
      <Container maxWidth="xl">
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <TableContainer
            component={Paper}
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              border: "1px solid #CACACA",
            }}
          >
            <Table
              aria-label="simple table"
              style={{ border: "1px solid white" }}
            >
              <TableHead>
                <TableRow sx={{ border: "1px solid white" }}>
                  <TableCell
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "16px",
                      fontWeight: "bold",
                      border: "1px solid white",
                      borderTopLeftRadius: "10px",
                    }}
                    sx={th}
                  >
                    Aliases
                  </TableCell>
                  <TableCell
                    sx={td}
                    style={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                      borderTopRightRadius: "10px",
                      border: "1px solid #CACACA",
                      paddingLeft: "15px",
                    }}
                  >
                    {data[0]["_source"]["Aliases"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "16px",
                      fontWeight: "bold",
                      border: "1px solid white",
                    }}
                    sx={th}
                  >
                    Organism
                  </TableCell>
                  <TableCell
                    sx={td}
                    style={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                      paddingLeft: "15px",
                    }}
                  >
                    <a
                      style={{ color: "/*#116988*/#0b5989" }}
                      target="_blank"
                      rel="noreferrer"
                      href="https://www.uniprot.org/taxonomy/9606 "
                    >
                      Homo sapiens{" "}
                      <FontAwesome
                        className="super-crazy-colors"
                        name="external-link"
                        style={{
                          textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                        }}
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
                      fontSize: "16px",
                      fontWeight: "bold",
                      border: "1px solid white",
                    }}
                    sx={th}
                  >
                    Taxonomic lineage
                  </TableCell>
                  <TableCell
                    sx={td}
                    style={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                      paddingLeft: "15px",
                    }}
                  >
                    Eukaryota {">"} Opisthokonta {">"} Metazoa {">"} Eumetazoa{" "}
                    {">"} Bilateria {">"} Deuterostomia {">"} Chordata {">"}{" "}
                    Craniata {">"} Vertebrata {">"} Gnathostomata {">"}{" "}
                    Teleostomi {">"} Euteleostomi {">"} Sarcopterygii {">"}{" "}
                    Dipnotetrapodomorpha {">"} Tetrapoda {">"} Amniota {">"}{" "}
                    Mammalia {">"} Theria {">"} Eutheria {">"} Boreoeutheria{" "}
                    {">"} Euarchontoglires {">"} Primates {">"} Haplorrhini{" "}
                    {">"} Simiiformes {">"} Catarrhini {">"} Hominoidea {">"}{" "}
                    Hominidae {">"} Homininae {">"} Homo
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "16px",
                      fontWeight: "bold",
                      border: "1px solid white",
                    }}
                    sx={th}
                  >
                    Chromosome location
                  </TableCell>
                  <TableCell
                    sx={td}
                    style={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "#464646",
                      paddingLeft: "15px",
                    }}
                  >
                    {data[0]["_source"]["Location"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "16px",
                      fontWeight: "bold",
                      border: "1px solid white",
                    }}
                    sx={th}
                  >
                    Summary
                  </TableCell>
                  <TableCell
                    sx={td}
                    style={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                      paddingLeft: "15px",
                    }}
                  >
                    {data[0]["_source"]["Summary"]}
                  </TableCell>
                </TableRow>
                <TableRow
                  size="small"
                  sx={{
                    border: "1px solid white",
                    height: "10%",
                  }}
                >
                  <TableCell
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "16px",
                      fontWeight: "bold",
                      border: "1px solid white",
                    }}
                    sx={th}
                  >
                    Gene products
                  </TableCell>
                  <TableCell
                    sx={td}
                    style={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow
                          style={{
                            border: "1px solid white",
                          }}
                        >
                          <TableCell
                            style={{
                              backgroundColor: "#1463B9",
                              color: "white",
                              fontFamily: "Montserrat",
                              fontSize: "16px",
                              fontWeight: "bold",
                              border: "1px solid white",
                              borderTopLeftRadius: "10px",
                            }}
                          >
                            Accession Number
                          </TableCell>
                          <TableCell
                            style={{
                              backgroundColor: "#1463B9",
                              color: "white",
                              fontFamily: "Montserrat",
                              fontSize: "16px",
                              fontWeight: "bold",
                              border: "1px solid white",
                            }}
                          >
                            Protein Name
                          </TableCell>
                          <TableCell
                            style={{
                              backgroundColor: "#1463B9",
                              color: "white",
                              fontFamily: "Montserrat",
                              fontSize: "16px",
                              fontWeight: "bold",
                              border: "1px solid white",
                              borderTopRightRadius: "10px",
                            }}
                          >
                            Link
                          </TableCell>
                        </TableRow>
                        {data[0]["_source"]["Gene Products"].map(
                          (value, i, arr) => {
                            return (
                              <TableRow
                                style={{
                                  border: "1px solid white",
                                }}
                                key={`gene-product-${i}`}
                              >
                                <TableCell
                                  style={{
                                    fontFamily: "Lato",
                                    borderRight: "1px solid grey",
                                    borderBottom: "1px solid grey",
                                    width: "15%",
                                    fontSize: "14px",
                                  }}
                                >
                                  {value}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontFamily: "Lato",
                                    border: "1px solid grey",
                                    width: "20%",
                                    fontSize: "14px",
                                  }}
                                >
                                  {proteinNameMap[value]}
                                </TableCell>
                                <TableCell
                                  style={{
                                    borderLeft: "1px solid grey",
                                    borderBottom: "1px solid grey",
                                    width: "15%",
                                    fontSize: "14px",
                                  }}
                                >
                                  <a
                                    style={{
                                      fontFamily: "Lato",
                                      fontSize: "14px",
                                    }}
                                    target="_blank"
                                    rel="noreferrer"
                                    href={`https://www.uniprot.org/uniprotkb/${value}/entry`}
                                  >
                                    UniProt{" "}
                                    <FontAwesome
                                      className="super-crazy-colors"
                                      name="external-link"
                                      style={{
                                        textShadow:
                                          "0 1px 0 rgba(0, 0, 0, 0.1)",
                                      }}
                                    />
                                  </a>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </TableHead>
                    </Table>
                  </TableCell>
                </TableRow>
                <TableRow style={{ border: "1px solid white" }}>
                  <TableCell
                    style={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "16px",
                      fontWeight: "bold",
                      border: "1px solid white",
                    }}
                    sx={th}
                  >
                    Link
                  </TableCell>
                  <TableCell
                    style={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                    }}
                  >
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={gene_link + data[0]["_source"]["GeneID"]}
                    >
                      Entrez Gene{" "}
                      <FontAwesome
                        className="super-crazy-colors"
                        name="external-link"
                        style={{
                          textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </a>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </div>
      </Container>
    </>
  );
};

export default GeneDetail;
