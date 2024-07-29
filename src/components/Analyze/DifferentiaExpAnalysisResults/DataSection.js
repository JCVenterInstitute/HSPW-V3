import { Box, Container, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fileMapping } from "./Constants";
import ResultDownload from "./ResultSections/ResultDownload";
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
import { fetchDataFile, getImageStyle, handleDownload } from "./utils";
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
  const [isLoading, setIsLoading] = useState(true);
  const [allFiles, setAllFiles] = useState(null);
  const goKeggDict = {
    "GO Biological Process": ["egobp.tsv", "gsebp.tsv",],
    "GO Molecular Function": ["egomf.tsv", "gsemf.tsv",],
    "GO Cellular Component": ["egocc.tsv", "gsecc.tsv",],
    "KEGG Pathway/Module": ["kegg.tsv", "gsekk.tsv",],
  };
  const fileNames = [
    "all_data.tsv",
    "data_normalized.csv",
    "data_original.csv",
    "data_processed.csv",
    "egobp.tsv",
    "egomf.tsv",
    "egocc.tsv",
    "fold_change.csv",
    "gsebp.tsv",
    "gsemf.tsv",
    "gsecc.tsv",
    "gsekk.tsv",
    "heatmap_0_dpi150.png",
    "heatmap_1_dpi150.png",
    "kegg.tsv",
    "pca_loadings.csv",
    "pca_score.csv",
    "pca_variance.csv",
    "randomforest_confusion.csv",
    "randomforests_sigfeatures.csv",
    "rf_cls_0_dpi150.png",
    "rf_imp_0_dpi150.png",
    "rf_outlier_0_dpi150.png",
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

  /**
   * Get & return all files contents
   */

  const getAllFiles = async () => {
    try {
      const fileDict = {};
      for (const file of fileNames) {
        fileDict[file] = await fetchDataFile(jobId, file);
      }
      fileDict["inputData"] = {};
      searchParams.forEach((input, header) => {
        switch (header) {
          case "logNorm":
            fileDict["inputData"]["Log Transformation"] = input;
            break;
          case "heatmap":
            fileDict["inputData"][
              "Number of Differentially Abundant Proteins in Heatmap"
            ] = input;
            break;
          case "foldChange":
            fileDict["inputData"]["Fold Change Threshold"] = input;
            break;
          case "pValue":
            fileDict["inputData"]["P-Value Threshold"] = input;
            break;
          case "pType":
            fileDict["inputData"]["P-Value Type"] =
              input === "Raw" ? "RAW" : "FDR";
            break;
          case "parametricTest":
            fileDict["inputData"]["Statistical Parametric Test"] =
              input === "F" ? "T-Test" : "Wilcoxon Signed-rank Test";
          default:
            break;
        }
      });
      setAllFiles(fileDict);
    } catch (err) {
      console.error("> Error fetching all data file", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get all_data.tsv, shared across all tab sections
  useEffect(() => {
    getAllFiles();
  }, []);

  const getSection = () => {
    let displayResult = null;
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
          if (tab === "Visualization") {
            displayResult = (
              <VennDiagramComponent data={allFiles["data_original.csv"].data} />
            );
          } else if (tab === "Data Matrix") {
            displayResult = displayTable(allFiles["venn_out_data.txt"].data);
          }
          break;
        case "Normalization":
          if (tab === "Visualization") {
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
          if (tab === "Classification") {
            displayResult = (
              <div>
                {displayImg(allFiles["rf_cls_0_dpi150.png"].downloadUrl)}
                {displayTable(allFiles["randomforest_confusion.csv"].data)}
              </div>
            );
          }else if (tab === "Feature"){
            displayResult = (
              <div>
                {displayImg(allFiles["rf_imp_0_dpi150.png"].downloadUrl)}
                {displayTable(allFiles["randomforests_sigfeatures.csv"].data)}
              </div>
            );
          }else if (tab === "Outlier"){
            displayResult = displayImg(allFiles["rf_outlier_0_dpi150.png"].downloadUrl);
          }
          break;
        case "GO Biological Process":
        case "GO Molecular Function":         
        case "GO Cellular Component":          
        case "KEGG Pathway/Module":
          if (tab === "Enrichment Plot") {
            displayResult = (
              <BarChartComponent tableData={allFiles[goKeggDict[selectedSection][0]].data} />
            );
          }else if (tab && tab.endsWith("Ridge plot")) {
            displayResult = (
              <RidgePlotComponent 
                tableData={allFiles[goKeggDict[selectedSection][1]].data} 
                allData={allFiles["all_data.tsv"].data}
              />
            );
          }else if (tab && tab.endsWith("Heatmap plot")) {
            displayResult = (
              <HeatmapComponent
                tableData={allFiles[goKeggDict[selectedSection][1]].data}
                allData={allFiles["all_data.tsv"].data}
              />
            );
          } else {
            displayResult = null;
          }
          break;
        case "Result Data":
          displayResult = displayTable(allFiles["all_data.tsv"].data);
          break;
        case "Input Data":
          displayResult = (
            <Container sx={{ margin: "0px" }}>
              <Typography variant="h5" sx={{ fontFamily: "Lato" }}>
                Analysis Options:
              </Typography>
              {displayTable([allFiles["inputData"]])}
              <Typography variant="h5" sx={{ fontFamily: "Lato" }}>
                Input Data:
              </Typography>
              {displayTable(allFiles["data_original.csv"].data)}
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