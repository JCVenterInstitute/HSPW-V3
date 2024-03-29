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
import parse from "html-react-parser";
import FontAwesome from "react-fontawesome";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import MainFeature from "../../../assets/hero.jpeg";
import "../../style.css";
import { Container } from "@mui/material";
import BreadCrumb from "../../../components/Breadcrumbs";
import { Helmet } from "react-helmet";

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
  paddingLeft: "15px",
};

const SignatureDetail = (props) => {
  const params = useParams();
  const url = `${process.env.REACT_APP_API_ENDPOINT}/api/protein-signature/${params["interproid"]}`;

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const [pfam, setpFam] = useState("");
  const [PRINTS, setPRINTS] = useState("");
  const [abstract, setAbstract] = useState("");
  const [PROFILE, setPROFILE] = useState("");
  const [SMART, setSMART] = useState("");
  const [reference, setReference] = useState([]);
  const [authorName, setauthorName] = useState("");
  const [year, setYear] = useState("");
  const [journal, setJournal] = useState("");

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Browse" },
    { path: "Salivary Signature", link: "/protein-signature" },
    { path: params["interproid"] },
  ];

  let interpro_link = "https://www.ebi.ac.uk/interpro/entry/InterPro/";

  useEffect(() => {
    const fetchSignature = async () => {
      const response = await axios.get(url);
      const json = response.data;
      return json;
    };
    const signatureResult = fetchSignature().catch(console.errror);
    signatureResult.then((signature) => {
      if (signature) {
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
        if (signature[0]["_source"]["ReferencesID"] !== "") {
          setReference(signature[0]["_source"]["ReferencesID"].split(","));
          constructReferences(
            signature[0]["_source"]["ReferencesID"].split(",")
          );
        }
        setAbstract(signature[0]["_source"]["Abstract"]);

        setLoading(false);
      }
    });
  }, []);

  const constructReferences = async (references) => {
    const promises = references.map((ref) => {
      const id = ref.split(":")[1];
      return fetchPubMed(id);
    });

    const pubmedDetails = await Promise.all(promises);

    // Now set the state with the fetched details
    setauthorName(pubmedDetails.map((detail) => detail.authorName));
    setYear(pubmedDetails.map((detail) => detail.yearTitle));
    setJournal(pubmedDetails.map((detail) => detail.journalTitle));
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

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress sx={{ mb: "500px", margin: "20px" }} />
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>HSP | Protein Signature Detail</title>
      </Helmet>
      <BreadCrumb path={breadcrumbPath} />
      <div
        style={{
          backgroundImage: `url(${MainFeature})`,
        }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1 className="head_title">
            {data[0]["_source"]["Type"] + ": " + data[0]["_source"]["Name"]}
          </h1>
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
                    sx={{ ...td, paddingY: "10px" }}
                    style={{ fontFamily: "Lato", fontSize: "14px" }}
                  >
                    <div>
                      <span style={{ color: "black" }}>
                        {parse(parse(abstract.split("=")[1]))}
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
                        maxWidth: "60%",
                        margin: "10px",
                      }}
                    >
                      <Table>
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
                                  width: "15%",
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
                                    width: "15%",
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
                                    width: "15%",
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
                                    width: "15%",
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
                                    fontSize: "14px",
                                    fontFamily: "Lato",
                                  }}
                                >
                                  <a
                                    rel="noreferrer"
                                    target="_blank"
                                    href={
                                      "https://www.ebi.ac.uk/interpro/entry/pfam/" +
                                      pfam.split(":")[1]
                                    }
                                  >
                                    {pfam}{" "}
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
                              </>
                            ) : (
                              <></>
                            )}

                            {PRINTS ? (
                              <>
                                <TableCell
                                  style={{
                                    border: "1px solid grey",
                                    // width: "20%",
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
                                    {PRINTS}{" "}
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
                                    // width: "15%",
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
                                    {PROFILE}{" "}
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
                              </>
                            ) : (
                              <></>
                            )}
                            {SMART ? (
                              <>
                                <TableCell
                                  style={{
                                    border: "1px solid grey",
                                    // width: "20%",
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
                                    {SMART}{" "}
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
                              </>
                            ) : (
                              <></>
                            )}
                          </TableRow>
                        </TableHead>
                      </Table>
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
                      // component={Paper}
                      style={{
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        border: "1px solid #CACACA",
                        width: "fit-content", // or "100%"
                        margin: "10px",
                      }}
                    >
                      {data[0]["_source"]["GO Annotations"] !== "" ? (
                        <Table sx={{ border: "none" }}>
                          <TableHead>
                            <TableRow style={{ borderTopRightRadius: "10px" }}>
                              <TableCell
                                style={{
                                  backgroundColor: "#1463B9",
                                  color: "white",
                                  fontFamily: "Montserrat",
                                  fontSize: "17px",
                                  fontWeight: "bold",
                                  padding: "10px",
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
                                  padding: "10px",
                                }}
                              >
                                {
                                  data[0]["_source"]["GO Annotations"].split(
                                    ","
                                  )[0]
                                }
                              </TableCell>
                            </TableRow>
                            {data[0]["_source"]["GO Annotations"].split(
                              ","
                            )[1] ? (
                              <TableRow>
                                <TableCell
                                  sx={th}
                                  style={{
                                    backgroundColor: "#1463B9",
                                    color: "white",
                                    fontFamily: "Montserrat",
                                    fontSize: "17px",
                                    fontWeight: "bold",
                                    padding: "10px",
                                  }}
                                >
                                  Processes
                                </TableCell>
                                <TableCell
                                  sx={td}
                                  style={{
                                    maxWidth: "100%",
                                    fontFamily: "Lato",
                                    fontSize: "14px",
                                    border: "1px solid #CACACA",
                                    padding: "10px",
                                  }}
                                >
                                  {
                                    data[0]["_source"]["GO Annotations"].split(
                                      ","
                                    )[1]
                                  }
                                </TableCell>
                              </TableRow>
                            ) : null}
                          </TableHead>
                        </Table>
                      ) : null}
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
                    }}
                  >
                    {reference.length !== 0
                      ? reference.map((value, i) => {
                          return (
                            <React.Fragment key={i}>
                              <div style={{ fontFamily: "Lato" }}>
                                <h4 style={{ display: "inline" }}>{i + 1}. </h4>
                                <b style={{ color: "#1463B9" }}>
                                  {authorName[i]}
                                </b>
                                <span>{year[i]}</span>
                                <i>{journal[i]} </i>{" "}
                                <a
                                  target="_blank"
                                  rel="noreferrer"
                                  href={`https://pubmed.ncbi.nlm.nih.gov/${value.replace(
                                    "PubMed:",
                                    ""
                                  )}`}
                                  style={{ color: "#777777" }}
                                >
                                  {" "}
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
                        })
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
                    }}
                  >
                    <Link
                      rel="noreferrer"
                      target="_blank"
                      to={interpro_link + data[0]["_source"]["InterPro ID"]}
                    >
                      InterPro{" "}
                      <FontAwesome
                        className="super-crazy-colors"
                        name="external-link"
                        style={{
                          textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </Link>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </div>
      </Container>
      <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script src="https://unpkg.com/html-react-parser@latest/dist/html-react-parser.min.js"></script>
      <script>window.HTMLReactParser(/* string */);</script>
    </>
  );
};

export default SignatureDetail;
