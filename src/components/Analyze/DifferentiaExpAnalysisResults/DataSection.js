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
import PrincipleComponentAnalysis from "./D3Graphics/PrincipleComponentAnalysis/PrincipleComponentAnalysis.jsx";
import BarChartComponent from "./D3Graphics/GoKegg/EncrichmentPlot/BarPlot";
import RidgePlotComponent from "./D3Graphics/GoKegg/GSEARidgePlot/RidgePlot";
import TreeClusterPlotComponent from "./D3Graphics/GoKegg/GSEATree Cluster Plot/TreeClusterPlot.js";
import HeatmapComponent from "./D3Graphics/GoKegg/GSEAHeatmapPlot/GOHeatmap.js";
import RandomForest from "./D3Graphics/RandomForest/RandomForest";
import InputData from "./InputData";
import {
  fetchDataFile,
  fetchData,
  fetchImage,
  getImageStyle,
  handleDownload,
  getFileUrl,
} from "./utils";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

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
  const [files, setFiles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [allFiles, setAllFiles] = useState(null);
  const fileNames = [
    "all_data.tsv",
    "data_normalized.csv",
    "data_original.csv",
    "data_processed.csv",
    "fold_change.csv",
    "gsekk.tsv",
    "heatmap_0_dpi150.png",
    "heatmap_1_dpi150.png",
    "kegg.tsv",
    "pca_loadings.csv",
    "pca_score.csv",
    "pca_variance.csv",
    "randomforest_confusion.csv",
    "randomforests_sigfeatures.csv",
    "statistical_parametric_test.csv",
    "venn_out_data.txt",
    "volcano.csv",
  ];

  const displayTable = (data) => {
    var columnDefs = [];
    Object.keys(data[0]).forEach((header) =>
      columnDefs.push({
        field: header,
        cellStyle: { textAlign: "left", lineHeight: "10%" },
      })
    );
    console.log(columnDefs);
    console.log(data);
    return (
      <Container sx={{ margin: "0px" }}>
        <div
          className="ag-theme-material ag-cell-wrap-text ag-theme-alpine"
          style={{
            overflowX: "auto", // Enable horizontal scrolling
            width: "100%",
          }}
        >
          {/* <CsvTable data={data} selectedSection={selectedSection} /> */}
          <AgGridReact
            className="ag-cell-wrap-text"
            rowData={data}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            suppressFieldDotNotation={true}
            domLayout="autoHeight"
            autoSizeStrategy={{
              type: "fitGridWidth",
              defaultMinWidth: 100,
              columnLimits: [
                {
                  colId: "country",
                  minWidth: 900,
                },
              ],
            }}
          />
        </div>
      </Container>
    );
  };

  const displayImg = (image) => (
    <img
      src={image}
      alt={selectedSection}
      style={getImageStyle(selectedSection)}
    />
  );

  const getDataFile = async (
    dataFile = files["Data Matrix"],
    setter = setData
  ) => {
    if (!dataFile) return;

    const data = await fetchData(dataFile);

    setter(data);
  };

  /**
   * Get & return all files contents
   */

  const getAllFiles = async () => {
    try {
      const fileDict = {};
      for (const file of fileNames) {
        fileDict[file] = await fetchDataFile(jobId, file);
      }
      setAllFiles(fileDict);
    } catch (err) {
      console.error("> Error fetching all data file", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all needed files for the current selected section
  // useEffect(() => {
  //   fetchFiles(selectedSection, jobId);
  // }, [selectedSection]);

  // Get all_data.tsv, shared across all tab sections
  useEffect(() => {
    // getAllDataFile();
    getAllFiles();
  }, []);

  useEffect(() => {
    if (tab === null || allFiles === null) return;

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
  }, [tab, allFiles]);

  const getSection = () => {
    let displayResult = null;
    let isPngTab = true;
    console.log(allFiles);
    if (allFiles) {
      switch (selectedSection) {
        case "Volcano Plot":
          if (tab === "Visualization") {
            displayResult = (
              <VolcanoPlot
                data={allFiles["all_data.tsv"].data}
                pval={searchParams.get("pValue")}
                foldChange={searchParams.get("foldChange")}
                xCol={8}
                yCol={5}
                details={["p.value", "Fold.Change"]}
                xlabel="Log2(FC)"
                ylabel="-Log10(p)"
              />
            );
          } else if (tab === "Data Matrix") {
            displayResult = displayTable(allFiles["volcano.csv"].data);
          }

          break;
        case "Heatmap":
          if (tab === "Top 25 Samples") {
            displayResult = displayImg(
              allFiles["heatmap_1_dpi150.png"].downloadUrl
            );
          } else {
            displayResult = displayImg(
              allFiles["heatmap_0_dpi150.png"].downloadUrl
            );
          }

          break;
        case "Statistical Parametric Test":
          if (tab === "Visualization") {
            displayResult = (
              <StatisticalParametricPlot
                data={allFiles["all_data.tsv"].data}
                pval={searchParams.get("pValue")}
                // TODO: make pval a user input
              />
            );
          } else if (tab === "Data Matrix") {
            displayResult = displayTable(
              allFiles["statistical_parametric_test.csv"].data
            );
          }

          break;
        case "Fold Change Analysis":
          if (tab !== "Data Matrix") {
            displayResult = (
              <FoldChangePlot
                data={allFiles["all_data.tsv"].data}
                fc={searchParams.get("foldChange")}
              />
            );
          } else if (tab === "Data Matrix") {
            displayResult = displayTable(allFiles["fold_change.csv"].data);
          }

          break;
        case "Principal Component Analysis":
          if (tab !== "Data Matrix") {
            var cleanedGroupData = {};
            var groupLabels = new Set();
            for (const [key, value] of Object.entries(
              allFiles["data_normalized.csv"].data[0]
            )) {
              if (key !== "Protein") {
                cleanedGroupData[key] = value.replaceAll('"', "");
                groupLabels.add(cleanedGroupData[key]);
              }
            }
            displayResult = (
              <PrincipleComponentAnalysis
                data={allFiles["pca_score.csv"].data}
                groupMapping={cleanedGroupData}
                groupLabels={[...groupLabels]}
                pcaVariance={allFiles["pca_variance.csv"].data}
                extension={"csv"}
              />
            );
          } else if (tab === "Data Matrix") {
            displayResult = displayTable(allFiles["pca_score.csv"].data);
          }

          break;
        case "Venn-Diagram":
          if (tab !== "Data Matrix") {
            displayResult = (
              <VennDiagramComponent data={allFiles["data_original.csv"].data} />
            );
          } else if (tab === "Data Matrix") {
            displayResult = displayTable(allFiles["venn_out_data.txt"].data);
          }
          break;
        case "Normalization":
          if (tab === "Visualization") {
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
                        data={allFiles["data_original.csv"].data}
                      />
                      <BoxPlot
                        containerId="box-before"
                        data={allFiles["data_original.csv"].data}
                      />
                    </Box>
                    <Box className="chart-section">
                      <h2>After Normalization</h2>
                      <DensityPlot
                        containerId="density-after"
                        data={allFiles["data_normalized.csv"].data}
                      />
                      <BoxPlot
                        containerId="box-after"
                        data={allFiles["data_normalized.csv"].data}
                      />
                    </Box>
                  </Box>
                </Container>
              </div>
            );
          } else if (tab === "Data Matrix") {
            displayResult = displayTable(allFiles["data_normalized.csv"].data);
          }
          break;
        case "Random Forest":
          // displayResult = (
          //   <RandomForest
          //     selectedSection={selectedSection}
          //     jobId={jobId}
          //     tab={tab}
          //   />
          // );
          if (tab === "Classification") {
          }
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
          } else if (tab.endsWith("Heatmap plot")) {
            displayResult = (
              <HeatmapComponent
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
                <CsvTable
                  data={allFiles["all_data.tsv"].data}
                  selectedSection={selectedSection}
                />
              </Box>
            </Container>
          );
          break;
        case "Input Data":
          displayResult = (
            <InputData searchParams={searchParams} jobId={jobId} />
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
    }

    if (displayResult === null) {
      console.log(`tab: ${tab}`);
      if (
        (data === null && isPngTab === true) ||
        tab.startsWith("Enriched terms ") ||
        tab.startsWith("GSEA Tree ")
      ) {
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
