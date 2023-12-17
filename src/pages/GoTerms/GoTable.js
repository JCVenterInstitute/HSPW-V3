import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import main_feature from "../../assets/hero.jpeg";
import { Paper } from "@mui/material";
import FontAwesome from "react-fontawesome";

const GoTable = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const params = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/go_nodes/${params.id}`
        );
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  });
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${main_feature})`,
        }}
        className="head_background"
      >
        <h1
          className="head_title"
          align="left"
        >
          Annotation Report for Salivary Proteins
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
          Many semantic properties are annotated using controlled vocabulary
          terms, such as those in the Gene Ontology. This page allows you to
          retrieve all the values that have been used to annotate such
          properties in the salivary proteome catalog. The number of occurrence
          for each value will also be computed. Click on the counts to view the
          list of proteins with the associated annotations.
        </p>
      </div>
    </>
  );
};
export default GoTable;
