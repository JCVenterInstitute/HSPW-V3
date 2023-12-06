import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import main_feature from "../components/hero.jpeg";
import parse from "html-react-parser";
import "./style.css";

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
  borderTopRightRadius: "10px",
  fontSize: "18px",
};

const Signature_detail = (props) => {
  const [message, setMessage] = useState("");
  const params = useParams();
  let url = "http://localhost:8000/protein_signature/" + params["interproid"];

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const [pfam, setpFam] = useState("");
  const [PRINTS, setPRINTS] = useState("");
  const [abstract, setAbstract] = useState("");
  const [PROFILE, setPROFILE] = useState("");
  const [SMART, setSMART] = useState("");
  const [reference1, setReference] = useState([]);
  let gene_id = 0;
  let interpro_link = "https://www.ebi.ac.uk/interpro/entry/InterPro/";
  console.log(url);

  useEffect(() => {
    const fetchSignature = async () => {
      const response = await axios.get(url);
      const json = response.data;
      return json;
    };
    const signatureResult = fetchSignature().catch(console.errror);
    signatureResult.then((signature) => {
      if (signature) {
        console.log(signature);
        setData(signature);
        var elements = signature[0]["_source"]["Signature"].split(",");

        for (let i = 0; i < elements.length; i++) {
          if (elements[i].includes("PFAM")) {
            setpFam(elements[i]);
          } else if (elements[i].includes("PRINTS")) {
            setPRINTS(elements[i]);
          } else if (elements[i].includes("PROFILE")) {
            setPROFILE(elements[i]);
          } else if (elements[i].includes("SMART")) {
            setSMART(elements[i]);
          }
        }
        if (signature[0]["_source"]["ReferencesID"] != "") {
          setReference(signature[0]["_source"]["ReferencesID"].split(","));
        }
        setAbstract(signature[0]["_source"]["Abstract"]);
        setLoading(false);
      }
    });
  }, []);

  if (isLoading) {
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
          {data[0]["_source"]["Type"] + ": " + data[0]["_source"]["Name"]}
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
                  Abstract
                </TableCell>
                <TableCell
                  sx={td}
                  style={{ fontFamily: "Lato", fontSize: "14px" }}
                >
                  <div style={{ paddingLeft: "1%" }}>
                    <span style={{ color: "black", fontSize: "14px" }}>
                      {parse(parse(abstract))}
                    </span>
                  </div>
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
                  }}
                  sx={th}
                >
                  Signatures
                </TableCell>
                <TableCell
                  sx={td}
                  style={{ fontFamily: "Lato", fontSize: "14px" }}
                >
                  <TableContainer
                    component={Paper}
                    style={{
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      border: "1px solid #CACACA",
                      maxWidth: "40%",
                      margin: "10px",
                    }}
                  >
                    <TableHead style={{ borderTopLeftRadius: "10px" }}>
                      <TableRow style={{ border: "1px solid white" }}>
                        {pfam ? (
                          <TableCell
                            style={{
                              backgroundColor: "#1463B9",
                              color: "white",
                              fontFamily: "Montserrat",
                              fontSize: "16px",
                              fontWeight: "bold",
                              border: "1px solid white",
                              width: "10%",
                            }}
                          >
                            Pfam
                          </TableCell>
                        ) : (
                          <></>
                        )}
                        {PRINTS ? (
                          <>
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
                              PRINTS
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}

                        {PROFILE ? (
                          <>
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
                              Profile
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}

                        {SMART ? (
                          <>
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
                              SMART
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                      </TableRow>

                      <TableRow style={{ border: "1px solid white" }}>
                        {pfam ? (
                          <>
                            <TableCell
                              style={{
                                borderRight: "1px solid grey",
                                borderBottom: "1px solid grey",
                                width: "15%",
                                fontSize: "14px",
                                fontFamily: "Lato",
                              }}
                            >
                              <a
                                href={
                                  "https://www.ebi.ac.uk/interpro/entry/pfam/" +
                                  pfam.split(":")[1]
                                }
                              >
                                {pfam}
                              </a>
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}

                        {PRINTS ? (
                          <>
                            <TableCell
                              style={{
                                border: "1px solid grey",
                                width: "20%",
                                fontSize: "14px",
                                fontFamily: "Lato",
                              }}
                            >
                              <a
                                href={
                                  "https://www.ebi.ac.uk/interpro/entry/prints/" +
                                  PRINTS.split(":")[1]
                                }
                              >
                                {PRINTS}
                              </a>
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}

                        {PROFILE ? (
                          <>
                            <TableCell
                              style={{
                                borderLeft: "1px solid grey",
                                borderBottom: "1px solid grey",
                                width: "15%",
                                fontSize: "14px",
                                fontFamily: "Lato",
                              }}
                            >
                              <a
                                href={
                                  "https://prosite.expasy.org/" +
                                  PROFILE.split(":")[1]
                                }
                              >
                                {PROFILE}
                              </a>
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}

                        {SMART ? (
                          <>
                            <TableCell
                              style={{
                                border: "1px solid grey",
                                width: "20%",
                                fontSize: "14px",
                                fontFamily: "Lato",
                              }}
                            >
                              <a
                                href={
                                  "http://smart.embl-heidelberg.de/smart/do_annotation.pl?ACC=" +
                                  SMART.split(":")[1] +
                                  "&BLAST=DUMMY"
                                }
                              >
                                {SMART}
                              </a>
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                      </TableRow>
                    </TableHead>
                  </TableContainer>
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
                  GO Annotations
                </TableCell>
                <TableCell
                  sx={td}
                  style={{ fontFamily: "Lato", fontSize: "17px" }}
                >
                  <TableContainer
                    component={Paper}
                    style={{
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      border: "1px solid #CACACA",
                      width: "fit-content", // or "100%"
                      margin: "10px",
                    }}
                  >
                    <TableHead>
                      <TableRow style={{ borderTopRightRadius: "10px" }}>
                        <TableCell
                          style={{
                            backgroundColor: "#1463B9",
                            color: "white",
                            fontFamily: "Montserrat",
                            fontSize: "17px",
                            fontWeight: "bold",

                            borderTopLeftRadius: "10px",
                          }}
                        >
                          Functions
                        </TableCell>
                        <TableCell
                          sx={td}
                          style={{
                            maxWidth: "100%",
                            border: "1px solid #CACACA",
                            borderTopRightRadius: "10px",
                            fontFamily: "Lato",
                            fontSize: "14px",
                          }}
                        >
                          {data[0]["_source"]["GO Annotations"].split(",")[0]}
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
                          Processes
                        </TableCell>
                        <TableCell
                          sx={td}
                          style={{
                            fontFamily: "Lato",
                            fontSize: "14px",
                            border: "1px solid #CACACA",
                          }}
                        >
                          {data[0]["_source"]["GO Annotations"].split(",")[1]}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </TableContainer>
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
                    paddingLeft: "1%",
                  }}
                >
                  {reference1.length !== 0
                    ? reference1.map((val, j) => (
                        <React.Fragment key={j}>
                          {j + 1}. {val}
                          <br />
                        </React.Fragment>
                      ))
                    : null}
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
                  Members
                </TableCell>
                <TableCell
                  sx={td}
                  style={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    paddingLeft: "1%",
                  }}
                >
                  View Protein Members
                </TableCell>
              </TableRow>

              <TableRow style={{ border: "1px solid black" }}>
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
                  Link
                </TableCell>
                <TableCell
                  sx={td}
                  style={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    paddingLeft: "1%",
                  }}
                >
                  <a href={interpro_link + data[0]["_source"]["InterPro ID"]}>
                    InterPro
                  </a>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </div>
      <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script src="https://unpkg.com/html-react-parser@latest/dist/html-react-parser.min.js"></script>
      <script>window.HTMLReactParser(/* string */);</script>
    </>
  );
};

export default Signature_detail;
