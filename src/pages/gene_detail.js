import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import main_feature from "../components/hero.jpeg";
import { useParams } from "react-router";
import FontAwesome from "react-fontawesome";

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
  fontSize: "14px",
};

const Gene_detail = (props) => {
  const [message, setMessage] = useState(true);
  const params = useParams();

  let url = "http://localhost:8000/genes/" + params["geneid"];

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");
  let gene_id = 0;
  let gene_link = "https://www.ncbi.nlm.nih.gov/gene/";
  const fetchGenes = async () => {
    console.log("hi");
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const genes = await response.json();
    setData(genes);
    setMessage(false);
  };

  const [proteinName, setProteinName] = useState("");
  const fetchProtein = async () => {
    let p = [];
    data[0]["_source"]["Gene Products"].map(async (item, i) => {
      try {
        const response = await fetch(
          `https://rest.uniprot.org/uniprotkb/${item}.json`
        );
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.status}`);
        }

        const proteinName = await response.json();

        if (
          proteinName &&
          proteinName.proteinDescription &&
          proteinName.proteinDescription.recommendedName
        ) {
          p.push(proteinName.proteinDescription.recommendedName.fullName.value);
        } else if (
          proteinName &&
          proteinName["proteinDescription"] &&
          proteinName["proteinDescription"].submissionNames &&
          proteinName["proteinDescription"].submissionNames[0]
        ) {
          p.push(
            proteinName["proteinDescription"].submissionNames[0].fullName.value
          );
        }

        if (i === data[0]["_source"]["Gene Products"].length - 1) {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    fetchGenes();
    if (message === false) {
      fetchProtein();
    }
  }, [message]);

  if (isLoading === true) {
    return <h2>Loading</h2>;
  }

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${main_feature})`,
        }}
        className="head_background"
      >
        <h1 className="head_title" align="left">
          Gene: EntrezGene:{data[0]["_source"]["GeneID"]}
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
          Name: {data[0]["_source"]["Gene Name"]}
        </p>
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
          Gene Symbol: {data[0]["_source"]["Gene Symbol"]}
        </p>
      </div>
      <div style={{ margin: "20px" }}>
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
                  Craniata {">"} Vertebrata {">"} Gnathostomata {">"} Teleostomi{" "}
                  {">"} Euteleostomi {">"} Sarcopterygii {">"}{" "}
                  Dipnotetrapodomorpha {">"} Tetrapoda {">"} Amniota {">"}{" "}
                  Mammalia {">"} Theria {">"} Eutheria {">"} Boreoeutheria {">"}{" "}
                  Euarchontoglires {">"} Primates {">"} Haplorrhini {">"}{" "}
                  Simiiformes {">"} Catarrhini {">"} Hominoidea {">"} Hominidae{" "}
                  {">"} Homininae {">"} Homo
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
                sx={{ border: "1px solid white", height: "10%" }}
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
                  style={{ fontFamily: "Lato", fontSize: "14px" }}
                >
                  <Table>
                    <TableHead>
                      <TableRow style={{ border: "1px solid white" }}>
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
                          <a
                            style={{ color: "white" }}
                            href="https://salivaryproteome.org/public/index.php/Property:Has_accession_number"
                          >
                            Accession Number
                          </a>
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
                          <a
                            style={{ color: "white" }}
                            href="https://salivaryproteome.org/public/index.php/Property:Known_officially_as"
                          >
                            Protein Name
                          </a>
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
                              style={{ border: "1px solid white" }}
                              key={i}
                            >
                              <TableCell
                                style={{
                                  borderRight: "1px solid grey",
                                  borderBottom: "1px solid grey",
                                  width: "15%",
                                }}
                              >
                                {value}
                              </TableCell>
                              <TableCell
                                style={{
                                  border: "1px solid grey",
                                  width: "20%",
                                }}
                              >
                                {proteinName[i]}
                              </TableCell>
                              <TableCell
                                style={{
                                  borderLeft: "1px solid grey",
                                  borderBottom: "1px solid grey",
                                  width: "15%",
                                }}
                              >
                                <a
                                  href={`https://www.uniprot.org/uniprotkb/${value}/entry`}
                                >
                                  UniProt{" "}
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
                <TableCell style={{ fontFamily: "Lato", fontSize: "14px" }}>
                  <a href={gene_link + data[0]["_source"]["GeneID"]}>
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
    </>
  );
};

export default Gene_detail;
