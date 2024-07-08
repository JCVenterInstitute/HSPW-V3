import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { fileMapping } from "./Constants";
import ResultDownload from "./ResultSections/ResultDownload";
import { fetchData, getImageStyle, handleDownload } from "./utils";
import CsvTable from "./CsvTable";
import VolcanoPlot from "./D3Graphics/VolcanoPlot/VolcanoPlot";
import StatisticalParametricPlot from "./D3Graphics/StatisticalParametricTest/StatisticalParametricTest";
import FoldChangePlot from "./D3Graphics/FoldChangeAnalysis/FoldChangeAnalysis";
import VennDiagramComponent from "./D3Graphics/VennDiagram/VennDiagramComponent";
import BoxPlot from "./D3Graphics/Normalization Plot/BoxPlot";
import DensityPlot from "./D3Graphics/Normalization Plot/DensityPlot";
import PrincipleComponentAnalysis from "./D3Graphics/PrincipleComponentAnalysis/PrincipleComponentAnalysis";
import RandomForest from "./D3Graphics/RandomForest/RandomForest";

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
  }, [tab, files]);

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
        if (allData && tab !== "Data Matrix") {
          displayResult = (
            <StatisticalParametricPlot data={allData.data} extension={"tsv"} />
          );
        } else {
          displayResult = null;
          isPngTab = false;
        }
        break;
      case "Fold Change Analysis":
        if (allData && tab !== "Data Matrix") {
          displayResult = (
            <FoldChangePlot data={allData.data} extension={"tsv"} />
          );
        } else {
          displayResult = null;
          isPngTab = false;
        }
        break;
      case "Principal Component Analysis":
        if (plotData && tab !== "Data Matrix") {
          displayResult = (
            <PrincipleComponentAnalysis
              data={data}
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
        if (tab !== "Data Matrix") {
          displayResult = <VennDiagramComponent jobId={jobId} />;
        } else {
          displayResult = null;
        }
        break;
      case "Normalization":
        if (tab !== "Data Matrix") {
          //console.log("Rendering Normalization section with data:", data);

          const originalFile = fileMapping["Normalization"]["Data Original"];
          const normalizedFile =
            fileMapping["Normalization"]["Data Normalized"];

          displayResult = (
            <Container sx={{ margin: "0px" }}>
              <Box className="plot-section">
                <Box className="chart-section">
                  <h2>Before Normalization</h2>
                  <DensityPlot
                    containerId="density-before"
                    jobId={jobId}
                    datafile={originalFile}
                  />
                  <BoxPlot
                    containerId="box-before"
                    jobId={jobId}
                    datafile={originalFile}
                  />
                </Box>
                <Box className="chart-section">
                  <h2>After Normalization</h2>
                  <DensityPlot
                    containerId="density-after"
                    jobId={jobId}
                    datafile={normalizedFile}
                  />
                  <BoxPlot
                    containerId="box-after"
                    jobId={jobId}
                    datafile={normalizedFile}
                  />
                </Box>
              </Box>
            </Container>
          );
        } else {
          displayResult = null;
        }
        break;
      case "Random Forest":
        displayResult = (
          <RandomForest
            selectedSection={selectedSection}
            jobId={jobId}
            tab={tab}
          />
        );
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
