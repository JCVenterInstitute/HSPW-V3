import { useState, useEffect } from "react";
import Chart from "react-google-charts";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

import GeneTable from "../../../components/GeneTable";
import MainFeature from "../../../assets/hero.jpeg";

export const options = {
  vAxis: { title: "Count" },
  hAxis: { title: "Chromosome" },
};

const Gene = () => {
  const [message, setMessage] = useState(["Chromosome", "count"]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/gene_location_counts`)
      .then((res) => res.json())
      .then((data) => {
        let data1 = [
          [
            "Types of Protein Signatures Detected in Salivary Proteins",
            "Number of Proteins",
          ],
        ];
        for (var key in data) {
          data1.push([key, data[key].doc_count.value]);
        }

        setMessage(data1);
        setLoading(false);
      });
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
        className="head_background"
        style={{ backgroundImage: `url(${MainFeature})` }}
      >
        <h1
          className="head_title"
          align="left"
        >
          Gene
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
          A gene is a locatable region of genomic sequence, corresponding to a
          unit of inheritance, which is associated with regulatory regions,
          transcribed regions, and or other functional sequence regions.
        </p>
      </div>
      <h2 style={{ textAlign: "center", marginTop: "10px" }}>
        Chromosome location of the genes
      </h2>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={message}
        options={options}
      />
      <GeneTable />
    </>
  );
};

export default Gene;
