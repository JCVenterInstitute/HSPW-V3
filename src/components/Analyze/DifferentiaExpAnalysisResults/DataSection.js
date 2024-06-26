import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";

import ResultDownload from "./ResultSections/ResultDownload";
import { fetchData, getImageStyle, handleDownload } from "./utils";
import CsvTable from "./CsvTable";
import VolcanoPlot from "../VolcanoPlot/VolcanoPlot";
import PrincipleComponentAnalysis from "../PrincipleComponentAnalysis/PrincipleComponentAnalysis";

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
  const [plotData, setPlotData] = useState(null);

  const getDataFile = async (
    dataFile = files["Data Matrix"],
    forPlot = false
  ) => {
    const { data, dataUrl } = await fetchData(dataFile);
    forPlot ? setPlotData(dataUrl) : setData(data);
  };

  useEffect(() => {
    if (tab === null) return;

    if (tab && tab === "Data Matrix") {
      getDataFile();
    } else if (
      (tab && tab === "Visualization") ||
      tab.includes("Top") ||
      tab.includes("All")
    ) {
      let imageLink = files["Visualization"];

      // Handle Heatmap tabs
      if (tab.startsWith("Top")) imageLink = files["Top Samples"];
      if (tab.startsWith("All")) imageLink = files["All Samples"];

      // Handle PCA file
      if (files["PCA Score"]) {
        getDataFile(files["PCA Score"], true);
      } else {
        setPlotData(null);
      }

      setImage(imageLink);
    }
  }, [tab]);

  const getSection = () => {
    let displayResult = null;
    let isPngTab = true;

    switch (selectedSection) {
      case "Volcano Plot":
        if (allData && tab !== "Data Matrix") {
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
        } else {
          displayResult = null;
          isPngTab = false;
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
        if (plotData && tab !== "Data Matrix") {
          displayResult = (
            <PrincipleComponentAnalysis
              data={plotData}
              xCol={1}
              yCol={2}
              details={["p.value", "Fold.Change"]}
              xlabel="PC 1 (25.5%)"
              ylabel="PC 2 (12.5%)"
            />
          );
        } else {
          displayResult = null;
          isPngTab = false;
        }
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
      case "Result Data":
        displayResult = (
          <Container sx={{ margin: "0px" }}>
            <Box
              sx={{
                overflowX: "auto", // Enable horizontal scrolling
                width: "100%",
              }}
            >
              <CsvTable data={allData.data} selectedSection={selectedSection} />
            </Box>
          </Container>
        );
        break;
      case "Download":
        displayResult = (
          <ResultDownload jobId={jobId} handleDownload={handleDownload} />
        );
        break;
      default:
        displayResult = null;
    }

    if (displayResult === null) {
      if (data === null && isPngTab === true) {
        displayResult = (
          <img
            src={image}
            alt={selectedSection}
            style={getImageStyle(selectedSection)}
          />
        );
      } else if (data) {
        displayResult = (
          <Container sx={{ margin: "0px" }}>
            <Box
              sx={{
                overflowX: "auto", // Enable horizontal scrolling
                width: "100%",
              }}
            >
              <CsvTable data={data} selectedSection={selectedSection} />
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
