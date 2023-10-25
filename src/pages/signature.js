import React from "react";
import Signature from "../components/signature_table";

import { Chart } from "react-google-charts";
import { useState, useEffect, useCallback, useRef } from "react";
import main_feature from "../components/hero.jpeg";

import PChart from "../components/piechart_d3.js";

export const data = [
  [
    "Types of Protein Signatures Detected in Salivary Proteins",
    "Number of Proteins",
  ],
  ["Domains", 1351],
  ["Families", 1214],
  ["Repeats", 54],
  ["Regions", 0],
  ["Sites", 6],
];

export const options = {
  is3D: true,
  pieSliceText: "label",
  slices: {
    4: { offset: 0.2 },
    12: { offset: 0.3 },
    14: { offset: 0.4 },
    15: { offset: 0.5 },
  },
  backgroundColor: "transparent",
  colors: ["#567189", "#7B8FA1", "#CFB997", "#FAD6A5"],
  legend: {
    textStyle: {
      color: "black",
    },
  },
};

const data1 = [{ label: "1" }, { label: "2" }];
const mystyle = {
  color: "black",
  marginTop: "20px",
  marginLeft: "20px",
  textAlign: "left",
  fontSize: "18px",
  marginBottom: "20px",
};

const Protein_Signature = () => {
  const [message, setMessage] = useState([
    "Types of Protein Signatures Detected in Salivary Proteins",
    "Number of Proteins",
  ]);
  useEffect(() => {
    fetch("http://localhost:8000/signature_type_counts")
      .then((res) => res.json())
      .then((data) => {
        let data1 = [
          [
            "Types of Protein Signatures Detected in Salivary Proteins",
            "Number of Proteins",
          ],
        ];
        for (let i = 0; i < 4; i++) {
          data1.push([data[i].key, data[i].doc_count]);
        }
        setMessage(data1);
      });
  }, [message]);
  console.log(message);
  return (
    <>
      <div style={{ height: "30%", backgroundImage: `url(${main_feature})` }}>
        <h1
          style={{
            color: "white",
            textAlign: "center",
            display: "left",
            marginLeft: "20px",
            marginBottom: "1rem",
          }}
          align="left"
        >
          Protein Signature
        </h1>
        <p
          style={{
            textAlign: "left",
            color: "white",
            fontSize: "25px",
            paddingBottom: "15px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          InterPro is a searchable database providing information on sequence
          function and annotation. Sequences InterPro is a searchable database
          providing information on sequence function and annotation. Sequences
          are grouped based on protein signatures or 'methods'. These groups
          represent superfamilies, families or sub-families of sequences. The
          groups may be defined as families, domains, regions, repeats or sites.
          The function of sequences within any group may be confined to a single
          biological process or it may be diverse range of functions (as in a
          superfamily) or the group may be functionally uncharacterized but
          without exception every entry has an abstract and references are
          provided where possible.
        </p>
      </div>
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>
        Types of Protein Signatures Detected in Salivary Proteins
      </h2>
      <Chart
        chartType="PieChart"
        width="600px"
        height="300px"
        data={message}
        options={options}
        style={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          paddingBottom: "5px",
        }}
      />
      <Signature />
    </>
  );
};

export default Protein_Signature;
