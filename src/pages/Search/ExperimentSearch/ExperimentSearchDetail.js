import React from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import MainFeature from "../../../assets/hero.jpeg";
import "../../style.css";
import LaunchIcon from "@mui/icons-material/Launch";
import ExperimentProteinTable from "../../../components/Search/ExperimentSearch/ExperimentProteinTable";

const th = {
  background: "#f2f2f2",
  textAlign: "center",
  border: "1px solid #aaa",
  fontWeight: "bold",
  fontSize: "20px",
  padding: "0.2em",
  width: "200px",
};

const td = {
  border: "1px solid #aaa",
  fontSize: "18px",
  padding: "0.2em",
  borderTopRightRadius: "10px",
  fontSize: "18px",
};

const ExperimentSearchDetail = (props) => {
  const { id } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchExperiment = async () => {
      try {
        const response = await axios
          .get(`${process.env.REACT_APP_API_ENDPOINT}/api/study/${id}`)
          .then((res) => res.data);
        setData(response[0]._source);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchExperiment();
  }, []);

  if (isLoading) {
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
        <h1
          className="head_title"
          align="left"
        >
          {data.experiment_title}
        </h1>
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
            sx={{ minWidth: 250 }}
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
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Experiment ID
                </TableCell>
                <TableCell
                  sx={td}
                  style={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    paddingLeft: "10px",
                  }}
                >
                  {data.experiment_id_key}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={th}
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Short Label
                </TableCell>
                <TableCell
                  sx={td}
                  style={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    paddingLeft: "10px",
                  }}
                >
                  {data.experiment_short_title}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={th}
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  References
                </TableCell>
                <TableCell
                  sx={td}
                  style={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    paddingLeft: "10px",
                  }}
                >
                  {data.Study_name} [
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${data.PubMed_ID}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`PubMed: ${data.PubMed_ID}`}
                    <LaunchIcon sx={{ fontSize: "small" }} />
                  </a>
                  ]
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={th}
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Contact
                </TableCell>
                <TableCell
                  sx={td}
                  style={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                  }}
                >
                  <div style={{ margin: "5px" }}>
                    <TableContainer
                      component={Paper}
                      style={{
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        border: "1px solid #CACACA",
                      }}
                    >
                      <Table
                        sx={{ minWidth: 250 }}
                        aria-label="simple table"
                        style={{
                          border: "1px solid black",
                          borderTopLeftRadius: "10px",
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
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              sx={td}
                              style={{ fontFamily: "Lato", fontSize: "14px" }}
                            >
                              {data.contact_name}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              sx={th}
                              style={{
                                backgroundColor: "#1463B9",
                                color: "white",
                                fontFamily: "Montserrat",
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Institution
                            </TableCell>
                            <TableCell
                              sx={td}
                              style={{
                                fontFamily: "Lato",
                                fontSize: "14px",
                              }}
                            >
                              {data.institution}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              sx={th}
                              style={{
                                backgroundColor: "#1463B9",
                                color: "white",
                                fontFamily: "Montserrat",
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Contact Details
                            </TableCell>
                            <TableCell
                              sx={td}
                              style={{ fontFamily: "Lato", fontSize: "14px" }}
                            >
                              {data.contact_information === "NULL"
                                ? "NA"
                                : data.contact_information}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                      </Table>
                    </TableContainer>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={th}
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Sample
                </TableCell>
                <TableCell
                  sx={td}
                  style={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                  }}
                >
                  <div style={{ margin: "5px" }}>
                    <TableContainer
                      component={Paper}
                      style={{
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        border: "1px solid #CACACA",
                      }}
                    >
                      <Table
                        sx={{ minWidth: 250 }}
                        aria-label="simple table"
                        style={{
                          border: "1px solid black",
                          borderTopLeftRadius: "10px",
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
                                fontSize: "16px",
                                fontWeight: "bold",
                                width: "200px",
                              }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              sx={td}
                              style={{ fontFamily: "Lato", fontSize: "14px" }}
                            >
                              {data.sample_name}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              sx={th}
                              style={{
                                backgroundColor: "#1463B9",
                                color: "white",
                                fontFamily: "Montserrat",
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              NEWT
                            </TableCell>
                            <TableCell
                              sx={td}
                              style={{
                                fontFamily: "Lato",
                                fontSize: "14px",
                              }}
                            >
                              <a
                                href={`https://www.uniprot.org/taxonomy/${data.Taxononomy_ID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {data.Taxononomy_Species}
                                <LaunchIcon sx={{ fontSize: "small" }} />
                              </a>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              sx={th}
                              style={{
                                backgroundColor: "#1463B9",
                                color: "white",
                                fontFamily: "Montserrat",
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              BTO
                            </TableCell>
                            <TableCell
                              sx={td}
                              style={{ fontFamily: "Lato", fontSize: "14px" }}
                            >
                              {data.bto_term_list.map((term, index) => (
                                <React.Fragment key={index}>
                                  <a
                                    href={`https://www.ebi.ac.uk/ols4/ontologies/bto/classes/http%253A%252F%252Fpurl.obolibrary.org%252Fobo%252F${data.bto_ac[
                                      index
                                    ].replace(":", "_")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {term}
                                    <LaunchIcon sx={{ fontSize: "small" }} />
                                  </a>
                                  <p>
                                    Source:{" "}
                                    <a
                                      href={`http://purl.obolibrary.org/obo/${data.bto_ac[
                                        index
                                      ].replace(":", "_")}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {data.bto_ac[index]}
                                      <LaunchIcon sx={{ fontSize: "small" }} />
                                    </a>
                                  </p>
                                </React.Fragment>
                              ))}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                      </Table>
                    </TableContainer>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={th}
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Identifications
                </TableCell>
                <TableCell
                  sx={td}
                  style={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                  }}
                >
                  <ExperimentProteinTable experiment_id_key={id} />
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default ExperimentSearchDetail;