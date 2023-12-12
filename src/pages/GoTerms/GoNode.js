import React from "react";
import main_feature from "../../components/hero.jpeg";
import { Typography, Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState, params } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import TableRow from "@mui/material/TableRow";

import FontAwesome from "react-fontawesome";
const StyledTable = styled(Table)({
  borderRadius: "10px 0 0 10px",
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderTopLeftRadius: theme.shape.borderRadius,
}));

const StyledDiv = styled("div")(({ theme }) => ({
  borderTopRightRadius: theme.shape.borderRadius,
  padding: theme.spacing(1), // Adjust as needed
}));

const table = {
  table: {
    borderRadius: "10px 0 0 10px", // Set border radius here
  },
};

const th = {
  backgroundColor: "#1463B9",
  color: "white",
  fontFamily: "Montserrat",
  fontSize: "16px",
  fontWeight: "bold",
  border: "1px solid #3592E4",
};

const td = {
  fontFamily: "Lato",
  fontSize: "14px",
  border: "1px solid #CACACA",
};

const td_first_row = {
  borderTopRightRadius: "10px !important",
  fontFamily: "Lato",
  fontSize: "14px",
  border: "1px solid #CACACA",
};

const th_first_row = {
  backgroundColor: "#1463B9",
  color: "white",
  fontFamily: "Montserrat",
  fontSize: "16px",
  fontWeight: "bold",
  borderTopLeftRadius: "10px",
};
const GoNode = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const params = useParams();
  const [usageData, setUsageData] = useState("");
  const fetchData = async () => {
    const response = await axios.get(
      `http://localhost:8000/api/go_nodes/${params.id}`
    );

    const json = response.data;
    return json;
  };

  const processData = async () => {
    const goTermResult = await fetchData().catch(console.error);
    if (goTermResult) {
      setData(goTermResult);
    }
    const usageResult = await fetchUsageData().catch(console.error);
    if (usageResult) {
      setUsageData(usageResult);
      setLoading(false);
    }
  };

  const fetchUsageData = async () => {
    const response = await axios.get(
      `http://localhost:8000/api/go_nodes_usage/${params.id.split("_")[1]}`
    );
    const json = response.data;
    return json;
  };

  useEffect(() => {
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
      <div
        style={{
          backgroundImage: `url(${main_feature})`,
        }}
        className="head_background"
      >
        <h1 className="head_title" align="left">
          Go Terms: {data[0]["_source"]["id"]}
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
          Source Ontology: Gene Ontology
        </p>
      </div>

      <Table
        style={{
          width: "80%",
          marginLeft: "10%",
          borderTopLeftRadius: "10px",
          marginTop: "3%",
        }}
        sx={table}
      >
        <TableBody>
          <TableRow>
            <TableCell variant="head" sx={th_first_row}>
              Term Name
            </TableCell>
            <TableCell variant="head" sx={td_first_row}>
              {data[0]["_source"]["lbl"]}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head" sx={th}>
              Description
            </TableCell>
            <TableCell sx={td}>
              {data[0]["_source"]["meta"]["definition"]["val"]}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head" sx={th}>
              Has Obo Namespace
            </TableCell>
            <TableCell sx={td}>
              {data[0]["_source"]["meta"]["basicPropertyValues"][0]["val"]}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head" sx={th}>
              Synonyms
            </TableCell>
            <TableCell sx={td}>
              {data[0]["_source"]["meta"]["synonyms"] !== undefined ? (
                <ul style={{ marginLeft: "2%" }}>
                  {data[0]["_source"]["meta"]["synonyms"].map((obj, index) => (
                    <li key={index}>{obj.val}</li>
                  ))}
                </ul>
              ) : null}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head" sx={th}>
              Link
            </TableCell>
            <TableCell sx={td}>
              <a
                href={
                  "http://amigo.geneontology.org/cgi-bin/amigo/go.cgi?view=details&query=GO:" +
                  data[0]["_source"]["id"].split("_")[1]
                }
              >
                Go Term{" "}
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
            <TableCell variant="head" sx={th}>
              Usage
            </TableCell>
            <TableCell sx={td}>
              {data[0]["_source"]["meta"]["synonyms"] !== undefined ? (
                <ul style={{ marginLeft: "2%" }}>
                  {usageData.map((obj, index) => (
                    <li key={index}>
                      <a href={"http://localhost:3000/protein/" + obj["_id"]}>
                        {obj["_id"]}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default GoNode;
