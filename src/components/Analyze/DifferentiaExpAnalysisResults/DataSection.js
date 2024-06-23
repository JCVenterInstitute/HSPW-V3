import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";

import ResultDownload from "./ResultSections/ResultDownload";
import { fetchData, getImageStyle, handleDownload } from "./utils";
import CsvTable from "./CsvTable";
import VolcanoPlot from "../VolcanoPlot/VolcanoPlot";

const style = {
  dataBox: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
  },
};

const DataSection = ({
  selectedSection,
  tab,
  files,
  allData,
  jobId,
  searchParams,
}) => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState(null);

  const getDataFile = async () => {
    const { data } = await fetchData(files["Data Matrix"]);
    setData(data);
  };

  useEffect(() => {
    if (tab === null) return;

    if (tab && tab === "Data Matrix") {
      getDataFile(null);
    } else if (
      (tab && tab === "Visualization") ||
      tab.includes("Top") ||
      tab.includes("All")
    ) {
      let imageLink = files["Visualization"];

      // Handle Heatmap tabs
      if (tab.startsWith("Top")) imageLink = files["Top Samples"];
      if (tab.startsWith("All")) imageLink = files["All Samples"];

      setData(null);
      setImage(imageLink);
    }
  }, [tab]);

  const getSection = () => {
    let displayResult = null;
    console.log(searchParams);
    switch (selectedSection) {
      case "Volcano Plot":
        if (allData) {
          displayResult = (
            <VolcanoPlot
              data={allData["textUrl"]}
              extension="tsv"
              pval={searchParams.get("pValue")}
              foldChange={searchParams.get("foldChange")}
              xCol={8}
              yCol={5}
              details={["p.value", "Fold.Change"]}
              xlabel="Log2(FC)"
              ylabel="Log10(p)"
            />
          );
        }

        break;
      case "Heatmap":
        displayResult = null;
        break;
      case "Statistical Parametric Test":
        displayResult = null;
        break;
      case "Fold Change Analysis":
        displayResult = null;
        break;
      case "Principal Component Analysis":
        displayResult = null;
        break;
      case "Venn-Diagram":
        displayResult = null;
        break;
      case "Normalization":
        displayResult = null;
        break;
      case "Random Forest":
        displayResult = null;
        break;
      case "GO Biological Process":
        displayResult = null;
        break;
      case "GO Molecular Function":
        displayResult = null;
        break;
      case "GO Cellular Component":
        displayResult = null;
        break;
      case "KEGG Pathway/Module":
        displayResult = null;
        break;
      case "Input Data":
        displayResult = (
          <Container sx={{ margin: "0px" }}>
            <Box
              sx={{
                overflowX: "auto", // Enable horizontal scrolling
                width: "100%",
              }}
            >
              <CsvTable
                data={data}
                selectedSection={selectedSection}
              />
            </Box>
          </Container>
        );
        break;
      case "Download":
        displayResult = (
          <ResultDownload
            jobId={jobId}
            handleDownload={handleDownload}
          />
        );
        break;
      default:
        displayResult = null;
    }

    if (displayResult === null) {
      if (data === null) {
        displayResult = (
          <img
            src={image}
            alt={selectedSection}
            style={getImageStyle(selectedSection)}
          />
        );
      } else {
        displayResult = (
          <Container sx={{ margin: "0px" }}>
            <Box
              sx={{
                overflowX: "auto", // Enable horizontal scrolling
                width: "100%",
              }}
            >
              <CsvTable
                data={data}
                selectedSection={selectedSection}
              />
            </Box>
          </Container>
        );
      }
    }

    return displayResult;
  };

  return <Box sx={style.dataBox}>{getSection()}</Box>;
};

export default DataSection;
