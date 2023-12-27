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

import "../../style.css";

const Protein_Detail_Sequence = (props) => {
  const params = useParams();
  let url = "http://localhost:8000/protein/" + params["proteinid"];
  const th = {
    background: "#f2f2f2",
    textAlign: "center",
    border: "1px solid #aaa",
    fontWeight: "bold",
    fontSize: "20px",
    padding: "0.2em",
    maxWidth: "1000px",
  };
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

        await Promise.all(promises);
      }

      setLoading(false);
      setCheckData(true);
    }
  };
  useEffect(() => {
    console.log("Effect is running");
    console.log("Component rendering...");
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
      <div style={{ padding: "20px" }}>
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
                fontSize: "14px",
                border: "1px solid #3592E4",
                borderTopLeftRadius: "10px",
                border: "none",
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
                fontSize: "0.875rem",
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
                fontSize: "14px",
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
                fontSize: "14px",
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
                fontSize: "14px",
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
                fontSize: "14px",
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
                fontSize: "14px",
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
    </>
  );
};
export default Protein_Detail_Sequence;
