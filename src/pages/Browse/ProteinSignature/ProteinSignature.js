import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

import MainFeature from "../../../assets/hero.jpeg";
import ProteinSignatureTable from "../../../components/ProteinSignatureTable";
import "../../style.css";

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
  colors: ["#3182BD", "#6BAED6", "#9ECAE1", "#C6DBEF"],
  legend: {
    textStyle: {
      color: "black",
    },
  },
};

const ProteinSignature = () => {
  const [message, setMessage] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/signature-type-counts`)
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
        setLoading(false);
      });
  }, []);

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
          Protein Signature
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
      {message.length !== 0 ? (
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
      ) : null}
      <ProteinSignatureTable />
    </>
  );
};

export default ProteinSignature;
