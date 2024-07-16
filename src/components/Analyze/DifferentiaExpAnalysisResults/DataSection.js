import { Box, Container, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

import { fileMapping } from "./Constants";
import ResultDownload from "./ResultSections/ResultDownload";
import CsvTable from "./CsvTable";
import VolcanoPlot from "./D3Graphics/VolcanoPlot/VolcanoPlot";
import StatisticalParametricPlot from "./D3Graphics/StatisticalParametricTest/StatisticalParametricTest";
import FoldChangePlot from "./D3Graphics/FoldChangeAnalysis/FoldChangeAnalysis";
import VennDiagramComponent from "./D3Graphics/VennDiagram/VennDiagramComponent";
import BoxPlot from "./D3Graphics/Normalization Plot/BoxPlot";
import DensityPlot from "./D3Graphics/Normalization Plot/DensityPlot";
import PrincipleComponentAnalysis from "./D3Graphics/PrincipleComponentAnalysis/PrincipleComponentAnalysis";
import BarChartComponent from "./D3Graphics/GoKegg/EncrichmentPlot/BarPlot";
import RidgePlotComponent from "./D3Graphics/GoKegg/GSEARidgePlot/RidgePlot";
import RandomForest from "./D3Graphics/RandomForest/RandomForest";
import InputData from "./InputData";
import {
  fetchCSV,
  fetchData,
  fetchImage,
  getImageStyle,
  handleDownload,
  getFileUrl,
} from "./utils";

const style = {
  dataBox: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
  },
};

const DataSection = ({ selectedSection, searchParams, tab, jobId }) => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState(null);
  const [plotData, setPlotData] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [pcaVariance, setPcaVariance] = useState(null);
  const [allData, setAllData] = useState(null);
  const [files, setFiles] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getDataFile = async (
    dataFile = files["Data Matrix"],
    setter = setData
  ) => {
    if (!dataFile) return;

    const data = await fetchData(dataFile);

    setter(data);
  };

  /**
   * Fetch all files associated with the selected results section
   * @param {string} selectedSection Results section currently selected
   * @param {string} jobId Id of analysis submission job
   */
  const fetchFiles = async (selectedSection, jobId) => {
    const mappedSectionFiles = fileMapping[selectedSection];

    // No files to fetch
    if (mappedSectionFiles === undefined || mappedSectionFiles === null) return;

    try {
      setIsLoading(true);
      let files = {};

      if (typeof mappedSectionFiles === "string") {
        files = await getFileUrl(jobId, mappedSectionFiles);
      } else {
        for (const [tabName, fileName] of Object.entries(mappedSectionFiles)) {
          const fileUrl = await getFileUrl(jobId, fileName);

          files[tabName] = fileUrl;
        }
      }

      setFiles(files);
    } catch (err) {
      console.error("> Failed trying to fetch all files", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get & return all_data.tsv download link & file contents
   */
  const getAllDataFile = async () => {
    try {
      const { data, downloadUrl, textUrl } = await fetchCSV(
        jobId,
        "all_data.tsv"
      );

      setAllData({
        data,
        downloadUrl,
        textUrl,
      });
    } catch (err) {
      console.error("> Error fetching all data file", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all needed files for the current selected section
  useEffect(() => {
    fetchFiles(selectedSection, jobId);
  }, [selectedSection]);

  // Get all_data.tsv, shared across all tab sections
  useEffect(() => {
    getAllDataFile();
  }, []);

  useEffect(() => {
    if (tab === null) return;

    if (tab === "Data Matrix") {
      getDataFile();
    } else if (
      tab === "Visualization" ||
      tab.includes("Top") ||
      tab.includes("All")
    ) {
      let imageLink = files["Visualization"];

      // Handle Heatmap tabs
      if (tab.startsWith("Top")) imageLink = files["Top Samples"];
      if (tab.startsWith("All")) imageLink = files["All Samples"];
      if (tab.startsWith("Top") || tab.startsWith("All")) setData(null);

      if (selectedSection === "Principal Component Analysis") {
        // Handle PCA file
        getDataFile(files["PCA Score"], setPlotData);
        getDataFile(files["Group Labels"], setGroupData);
        getDataFile(files["PCA Variance"], setPcaVariance);
      } else {
        setPlotData(null);
        setGroupData(null);
        setPcaVariance(null);
      }

      setImage(imageLink);
    } else {
      const getImage = async () => {
        const imageUrl = await fetchImage(jobId, newRelevantFile);
        setImage(imageUrl);
      };

      const newRelevantFile = fileMapping[selectedSection][tab];

      if (newRelevantFile === undefined || tab === "Data Matrix") return;

      getImage();
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
              data={allData.data}
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
      case "Statistical Parametric Test":
        if (allData && tab !== "Data Matrix") {
          displayResult = (
            <StatisticalParametricPlot
              data={allData.data}
              pval={searchParams.get("pValue")}
              // TODO: make pval a user input
            />
          );
        } else {
          displayResult = null;
          isPngTab = false;
        }
        break;
      case "Fold Change Analysis":
        if (allData && tab !== "Data Matrix") {
          displayResult = (
            <FoldChangePlot
              data={allData.data}
              fc={searchParams.get("foldChange")}
            />
          );
        } else {
          displayResult = null;
          isPngTab = false;
        }
        break;
      case "Principal Component Analysis":
        if (plotData && groupData && pcaVariance && tab !== "Data Matrix") {
          var cleanedGroupData = {};
          var groupLabels = new Set();
          for (const [key, value] of Object.entries(groupData[0])) {
            if (key !== "Protein") {
              cleanedGroupData[key] = value.replaceAll('"', "");
              groupLabels.add(cleanedGroupData[key]);
            }
          }
          displayResult = (
            <PrincipleComponentAnalysis
              data={plotData}
              groupMapping={cleanedGroupData}
              groupLabels={[...groupLabels]}
              pcaVariance={pcaVariance}
              extension={"csv"}
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
          isPngTab = false;
        }
        break;
      case "Normalization":
        if (tab !== "Data Matrix") {
          const originalFile = fileMapping["Normalization"]["Data Original"];
          const normalizedFile =
            fileMapping["Normalization"]["Data Normalized"];

          displayResult = (
            <div id="normChart">
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
            </div>
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
      case "GO Molecular Function":
      case "GO Molecular Function":
      case "GO Cellular Component":
      case "KEGG Pathway/Module":
        const sectionFile = fileMapping[selectedSection][`${tab} Data`];

        if (tab === "Enrichment Plot") {
          displayResult = (
            <BarChartComponent
              jobId={jobId}
              datafile={sectionFile}
              selectedSection={selectedSection}
            />
          );
        } else if (tab.endsWith("Ridge plot")) {
          displayResult = (
            <RidgePlotComponent
              jobId={jobId}
              fileName1={sectionFile}
              fileName2={fileMapping["Result Data"]}
              selectedSection={selectedSection}
            />
          );
        } else {
          displayResult = null;
        }
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
      case "Input Data":
        displayResult = <InputData searchParams={searchParams} jobId={jobId} />;
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

  return isLoading ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <Box sx={style.dataBox} className="d3Graph">
      {getSection()}
    </Box>
  );
};

export default DataSection;
