import { useState, useEffect } from "react";
import Chart from "react-google-charts";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

import GeneTable from "../../../components/Tables/GeneTable";
import MainFeature from "../../../assets/hero.jpeg";
import { Container } from "@mui/material";
import BreadCrumb from "../../../components/Layout/Breadcrumbs";
import { Helmet } from "react-helmet";

export const options = {
  vAxis: { title: "Count" },
  hAxis: { title: "Chromosome" },
};

const Gene = () => {
  const [message, setMessage] = useState(["Chromosome", "count"]);
  const [isLoading, setLoading] = useState(true);

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Browse" },
    { path: "Gene" },
  ];

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/gene-location-counts`)
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
      <Helmet>
        <title>HSP | Genes</title>
      </Helmet>
      <BreadCrumb path={breadcrumbPath} />
      <div
        className="head_background"
        style={{ backgroundImage: `url(${MainFeature})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Gene</h1>
          <p className="head_text">
            A gene is a locatable region of genomic sequence, corresponding to a
            unit of inheritance, which is associated with regulatory regions,
            transcribed regions, and or other functional sequence regions.
          </p>
        </Container>
      </div>
      <Container maxWidth="xl">
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
      </Container>
      <GeneTable />
    </>
  );
};

export default Gene;
