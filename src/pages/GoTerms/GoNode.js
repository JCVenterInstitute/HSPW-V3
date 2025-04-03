import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import FontAwesome from "react-fontawesome";

import MainFeature from "@Assets/backgrounds/hero.jpeg";

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
  const [data, setData] = useState(null);
  const params = useParams();
  const [usageData, setUsageData] = useState([]);
  const [parentData, setParentData] = useState([]);
  const [siblingData, setSibilingData] = useState([]);
  const [childrenData, setChildrenData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/go-nodes/${params.id}`
        );
        console.log("75", response.data);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUsageData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/go-nodes-usage/${
            params.id.split("_")[1]
          }`
        );
        setUsageData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchEdgeData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/go-edges/${
            params.id.split("_")[1]
          }`
        );
        const edgeResult = response.data;
        const parentEdges = edgeResult.filter(
          (edge) =>
            edge["_source"].pred.includes("is_a") &&
            edge["_source"].sub.includes(params.id)
        );
        setParentData(parentEdges.map((edge) => edge["_source"]));
        const sibilingEdges = edgeResult.filter(
          (edge) =>
            edge["_source"].pred.includes("BFO_0000050") ||
            edge["_source"].pred.includes("BFO_0000051") ||
            edge["_source"].pred.includes("BFO_0000066")
        );
        setSibilingData(sibilingEdges.map((edge) => edge["_source"]));
        const childrenEdges = edgeResult.filter(
          (edge) =>
            edge["_source"].pred.includes("is_a") &&
            edge["_source"].obj.includes(params.id)
        );
        setChildrenData(childrenEdges.map((edge) => edge["_source"]));
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchUsageData();
    fetchEdgeData();
  }, [params.id]);

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
      >
        <TableBody>
          <TableRow>
            <TableCell
              variant="head"
              sx={th_first_row}
            >
              Term Name
            </TableCell>
            <TableCell
              variant="head"
              sx={td_first_row}
            >
              {data[0]["_source"]["lbl"]}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              variant="head"
              sx={th}
            >
              Description
            </TableCell>
            <TableCell sx={td}>
              {data[0]["_source"]["meta"]["definition"]["val"]}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              variant="head"
              sx={th}
            >
              Has Obo Namespace
            </TableCell>
            <TableCell sx={td}>
              {data[0]["_source"]["meta"]["basicPropertyValues"][0]["val"]}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              variant="head"
              sx={th}
            >
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
            <TableCell
              variant="head"
              sx={th}
            >
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
            <TableCell
              variant="head"
              sx={th}
            >
              Usage
            </TableCell>
            <TableCell sx={td}>
              {data[0]["_source"]["meta"]["synonyms"] !== undefined ? (
                <ul style={{ marginLeft: "2%" }}>
                  {usageData.map((obj, index) => (
                    <li key={index}>
                      <a href={`/protein/${obj["_id"]}`}>{obj["_id"]}</a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table
        style={{
          marginLeft: "10%",
          marginTop: "3%",
          marginBottom: "5%",
          width: "80%",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <TableBody>
          <TableRow>
            {parentData.length !== 0 ? (
              <TableCell
                variant="head"
                sx={th_first_row}
                align="center"
              >
                Parents ({parentData.length})
              </TableCell>
            ) : null}
            {siblingData.length !== 0 ? (
              <TableCell
                variant="head"
                sx={th}
                align="center"
              >
                Siblings ({siblingData.length})
              </TableCell>
            ) : null}
            {childrenData.length !== 0 ? (
              <TableCell
                variant="head"
                sx={th}
                align="center"
              >
                Children ({childrenData.length})
              </TableCell>
            ) : null}
          </TableRow>
          <TableRow sx={td}>
            {parentData.length !== 0 ? (
              <TableCell sx={td}>
                <ul style={{ marginLeft: "40px" }}>
                  {parentData.map((val, index) => (
                    <li
                      key={index}
                      style={{ margin: "5px" }}
                    >
                      <a href={`/GoNodes/${val.obj}`}>{val.obj}</a>
                    </li>
                  ))}
                </ul>
              </TableCell>
            ) : null}
            {siblingData.length !== 0 ? (
              <TableCell sx={td}>
                <ul style={{ marginLeft: "40px" }}>
                  {siblingData.map((val, index) => (
                    <li
                      key={index}
                      style={{ margin: "5px" }}
                    >
                      <a href={`/GoNodes/${val.obj}`}>{val.obj}</a>
                    </li>
                  ))}
                </ul>
              </TableCell>
            ) : null}
            {childrenData.length !== 0 ? (
              <TableCell sx={td}>
                <ul style={{ marginLeft: "40px" }}>
                  {childrenData.map((val, index) => (
                    <li
                      key={index}
                      style={{ margin: "5px" }}
                    >
                      <a href={`/GoNodes/${val.sub}`}>{val.sub}</a>
                    </li>
                  ))}
                </ul>
              </TableCell>
            ) : null}
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default GoNode;
