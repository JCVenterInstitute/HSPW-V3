import LinearProgress from "@mui/material/LinearProgress";
import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import Box from "@mui/material/Box";

import main_feature from "../../../assets/hero.jpeg";
import Cluster from "../../../components/ProteinClusterTable";
import "../../style.css";
import { Container } from "@mui/material";
import BreadCrumb from "../../../components/Breadcrumbs";
import { Helmet } from "react-helmet";

export const options = {
  legend: { position: "none" },
  titlePosition: "none",
  hAxis: {
    title: "Number of Members",
    viewWindow: {
      min: 1,
      max: 11, // Adjust this to be greater than the largest number of members
    },
  },
  vAxis: {
    title: "Frequency",
    viewWindow: {
      min: 5,
      max: 13, // 'auto' or a suitable maximum for your data
    },
  },
  bubble: { textStyle: { fontSize: 11 } },
  // chartArea: {
  //   left: "10%",
  //   top: "5%",
  //   width: "75%", // Decrease if necessary to allow space for bubbles
  //   height: "50%",
  // },
};

const ProteinCluster = () => {
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState({});
  const [isLoading, setLoading] = useState(true);

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Browse" },
    { path: "Protein Cluster" },
  ];

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/protein-cluster`)
      .then((res) => res.json())
      .then((data) => setMessage(data["Cluster ID"]))
      .catch((error) =>
        console.error("Error fetching protein cluster data:", error)
      );

    fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/protein-cluster-member-count`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setNumber(data);
        } else {
          console.error("Data is missing or has an unexpected structure.");
        }
        setLoading(false); // Set loading to false when data is received
      })
      .catch((error) =>
        console.error("Error fetching member count data:", error)
      );
  }, []);

  const getCount = (key) => {
    const count = number[key]?.doc_count || 0;
    return { count, logCount: Math.log(count) + 5 };
  };

  const data = [
    ["Number of Members", "# of Members", "Width", "Counts", "size"],
    ...[2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
      const { count, logCount } = getCount(`number_of_members_${num}`);
      return [num.toString(), num, logCount, count, logCount];
    }),
    [
      "≥10",
      10,
      getCount("number_of_members_10_or_more").logCount,
      getCount("number_of_members_10_or_more").count,
      getCount("number_of_members_10_or_more").logCount,
    ],
  ];

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
        <title>HSP | Protein Clusters</title>
      </Helmet>
      <BreadCrumb path={breadcrumbPath} />
      <div
        style={{
          backgroundImage: `url(${main_feature})`,
        }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1
            className="head_title"
            align="left"
          >
            Protein Cluster
          </h1>
          <p className="head_text">
            A protein cluster in the Human Salivary Proteome Project consists of
            protein identifications. To cluster all proteins at a 95% identity
            level, we used mmseq2 with the easy-cluster option. We ensured that
            only those members' proteins with coverage above 50% sequence
            identity. Only the representative protein was included in the table.
            To access a comprehensive view of all the proteins in the cluster,
            along with their respective abundance values, we must access the "#
            of members" option
          </p>
        </Container>
      </div>
      <Container maxWidth="xl">
        <h2 style={{ textAlign: "center", marginTop: "20px" }}>Cluster Size</h2>
        <Chart
          chartType="BubbleChart"
          width="1200px"
          height="600px"
          data={data}
          options={options}
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            paddingBottom: "5px",
          }}
        />
      </Container>
      <Cluster />
    </>
  );
};

export default ProteinCluster;
