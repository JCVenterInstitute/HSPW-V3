import React, { useState, useEffect } from "react";
import Cluster from "../../components/cluster/cluster_table.js";

import Chart from "react-google-charts";
import main_feature from "../../components/hero.jpeg";
import "../style.css";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

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
  chartArea: {
    left: "10%",
    top: "5%",
    width: "75%", // Decrease if necessary to allow space for bubbles
    height: "50%",
  },
};

const Protein_Cluster = () => {
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/protein_cluster")
      .then((res) => res.json())
      .then((data) => setMessage(data["Cluster ID"]))
      .catch((error) =>
        console.error("Error fetching protein cluster data:", error)
      );

    fetch("http://localhost:8000/api/protein_cluster_member_count")
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
      <div
        style={{
          height: "40%",
          backgroundImage: `url(${main_feature})`,
          paddingBottom: "10px",
        }}
      >
        <h1 className="head_title" align="left">
          Protein Cluster
        </h1>
        <p className="head_text">
          A protein cluster in the Human Salivary Proteome Project consists of
          protein identifications matching identical peptide lists. Each cluster
          contains at least one unique peptide not found in the other clusters.
        </p>
        <p className="head_text">
          The representative protein within a cluster is chosen by applying the
          following steps sequentially:
        </p>
        <ol className="head_text">
          <li>
            The protein reported by the maximum number of research groups.
          </li>
          <li>The protein with the highest number of distinct peptide hits.</li>
          <li>
            The protein with a well-defined description in the IPI database or
            is cross-referenced to the Swiss-Prot database.
          </li>
          <li>The protein with the lowest IPI accession number.</li>
        </ol>
      </div>

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

      <Cluster />
    </>
  );
};

export default Protein_Cluster;
