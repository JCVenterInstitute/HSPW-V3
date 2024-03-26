import React from "react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import { useParams } from "react-router";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

import MainFeature from "../../../assets/hero.png";
import "../../style.css";
import { Container } from "@mui/material";
import BreadCrumb from "../../../components/Breadcrumbs";
import { Helmet } from "react-helmet";

const ProteinDetailSequence = (props) => {
  const params = useParams();
  let url = `${process.env.REACT_APP_API_ENDPOINT}/api/salivary-protein/${params["proteinid"]}`;

  const th = {
    background: "#f2f2f2",
    textAlign: "center",
    border: "1px solid #aaa",
    fontWeight: "bold",
    fontSize: "20px",
    padding: "0.2em",
    maxWidth: "1000px",
  };

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Browse" },
    { path: "Salivary Proteins", link: "/salivary-protein" },
    {
      path: "Salivary Protein Detail",
      link: `/protein/${params["proteinid"]}`,
    },
    { path: params["proteinid"] },
  ];

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");

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
        const promises = [];

        await Promise.all(promises);
      }

      setLoading(false);
    }
  };
  useEffect(() => {
    processData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <title>HSP | Protein Sequence Detail</title>
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
            {"Protein Sequence: "}
            {data[0]["_source"]["salivary_proteins"]["protein_name"]}
          </h1>
        </Container>
      </div>
      <Container maxWidth="xl">
        <div style={{ marginTop: "20px" }}>
          <TableHead
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              maxWidth: "70%",
              borderRadius: "10px 0 0 10px",
              margin: "10px",
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
                  fontSize: "17px",
                  border: "1px solid #3592E4",
                  borderTopLeftRadius: "10px",
                  width: "10%",
                }}
              >
                Variant of
              </TableCell>
              <TableCell
                style={{
                  fontWeight: "bold",
                  border: "1px solid, #3592E4",
                  borderTopRightRadius: "10px",
                }}
                sx={{
                  fontSize: "14px",
                  border: "1px solid #CACACA",
                  fontFamily: "Lato",
                }}
              >
                {data[0]["_source"]["salivary_proteins"]["protein_name"]}
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
                  fontSize: "17px",
                  border: "1px solid #3592E4",
                  borderLeft: "none",
                  borderRight: "none",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #CACACA",
                  fontFamily: "Lato",
                  fontSize: "14px",
                }}
              >
                Canonical sequence
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
                  fontSize: "17px",
                }}
              >
                Accession number
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #CACACA",
                  fontFamily: "Lato",
                  fontSize: "14px",
                }}
              >
                {data[0]["_source"]["salivary_proteins"]["uniprot_accession"]}
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
                  fontSize: "17px",
                }}
              >
                Sequence
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #CACACA",
                  fontFamily: "Lato",
                  fontSize: "14px",
                }}
              >
                <textarea
                  style={{ fontSize: "14px" }}
                  maxLength="100"
                  cols="50"
                  rows="5"
                >
                  {data[0]["_source"]["salivary_proteins"]["protein_sequence"]}
                </textarea>
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
                  fontSize: "17px",
                }}
              >
                Length (AA)
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #CACACA",
                  fontFamily: "Lato",
                  fontSize: "14px",
                }}
              >
                {
                  data[0]["_source"]["salivary_proteins"][
                    "protein_sequence_length"
                  ]
                }
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
                  fontSize: "17px",
                }}
              >
                Molecular Mass (Da)
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #CACACA",
                  fontFamily: "Lato",
                  fontSize: "14px",
                }}
              >
                {data[0]["_source"]["salivary_proteins"]["mass"]}
              </TableCell>
            </TableRow>
          </TableHead>
        </div>
      </Container>
    </>
  );
};
export default ProteinDetailSequence;
