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
  fontSize: "18px",
  padding: "0.2em",
  fontSize: "18px",
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
    data[0]["_source"]["Gene Products"].map(
      async (item, i) =>
        await fetch("https://rest.uniprot.org/uniprotkb/" + item + ".json")
          .then((res) => res.json())
          .then((proteinName) => {
            console.log(proteinName["proteinDescription"]);
            if (
              typeof proteinName["proteinDescription"]["recommendedName"] !==
              "undefined"
            ) {
              p.push(
                proteinName["proteinDescription"]["recommendedName"][
                  "fullName"
                ]["value"]
              );
              console.log(p);
              setProteinName(p);
              if (i === data[0]["_source"]["Gene Products"].length - 1) {
                setLoading(false);
              }
            } else if (
              typeof proteinName["proteinDescription"].submissionNames[0] !==
              "undefined"
            ) {
              console.log(
                "123:" +
                  proteinName["proteinDescription"].submissionNames[0].fullName
                    .value
              );
              p.push(
                proteinName["proteinDescription"].submissionNames[0].fullName
                  .value
              );
              console.log(p);
              setProteinName(p);
              console.log(i);
              console.log(data[0]["_source"]["Gene Products"].length);
              if (i === data[0]["_source"]["Gene Products"].length - 1) {
                setLoading(false);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          })
    );
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
        <TableContainer component={Paper}>
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
                    fontSize: "17px",
                    fontWeight: "bold",
                    border: "1px solid white",
                  }}
                  sx={th}
                >
                  Aliases
                </TableCell>
                <TableCell
                  sx={td}
                  style={{ fontFamily: "Lato", fontSize: "18px" }}
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
                    fontSize: "17px",
                    fontWeight: "bold",
                    border: "1px solid white",
                  }}
                  sx={th}
                >
                  Organism
                </TableCell>
                <TableCell
                  sx={td}
                  style={{ fontFamily: "Lato", fontSize: "18px" }}
                >
                  <a
                    style={{ color: "/*#116988*/#0b5989" }}
                    href="http://salivaryproteome.org/public/index.php/Special:Ontology_Term/NEWT:9606"
                  >
                    Homo sapiens
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
                    border: "1px solid white",
                  }}
                  sx={th}
                >
                  Taxonomic lineage
                </TableCell>
                <TableCell
                  sx={td}
                  style={{ fontFamily: "Lato", fontSize: "18px" }}
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
                    fontSize: "17px",
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
                    fontSize: "18px",
                    color: "#464646",
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
                    fontSize: "17px",
                    fontWeight: "bold",
                    border: "1px solid white",
                  }}
                  sx={th}
                >
                  Summary
                </TableCell>
                <TableCell
                  sx={td}
                  style={{ fontFamily: "Lato", fontSize: "18px" }}
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
                    fontSize: "17px",
                    fontWeight: "bold",
                    border: "1px solid white",
                  }}
                  sx={th}
                >
                  Gene products
                </TableCell>
                <TableCell
                  sx={td}
                  style={{ fontFamily: "Lato", fontSize: "18px" }}
                >
                  <Table>
                    <TableHead>
                      <TableRow style={{ border: "1px solid white" }}>
                        <TableCell
                          style={{
                            backgroundColor: "#1463B9",
                            color: "white",
                            fontFamily: "Montserrat",
                            fontSize: "17px",
                            fontWeight: "bold",
                            border: "1px solid white",
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
                            fontSize: "17px",
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
                            fontSize: "17px",
                            fontWeight: "bold",
                            border: "1px solid white",
                          }}
                        >
                          Link
                        </TableCell>
                      </TableRow>

                      {data[0]["_source"]["Gene Products"].map(
                        (value, i, arr) => {
                          return (
                            <TableRow style={{ border: "1px solid white" }}>
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
                                  UniProt
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
                    fontSize: "17px",
                    fontWeight: "bold",
                    border: "1px solid white",
                  }}
                  sx={th}
                >
                  Link
                </TableCell>
                <TableCell
                  style={td}
                  style={{ fontFamily: "Lato", fontSize: "18px" }}
                >
                  <a href={gene_link + data[0]["_source"]["GeneID"]}>
                    Entrez Gene
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
