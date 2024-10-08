import {
  Box,
  Container,
  CircularProgress,
  Typography,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fileNames, goKeggDict } from "./Constants.js";
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
import GOHeatmapComponent from "./D3Graphics/GoKegg/GSEAHeatmapPlot/GOHeatmap.js";
import DotGraph from "./D3Graphics/DotGraph/DotGraph";
import HeatmapComponent from "./D3Graphics/Heatmap/Heatmap.js";
import NetworkGraph from "./D3Graphics/GoKegg/NetworkGraph/NetworkGraph";
import { fetchDataFile, getImageStyle, handleDownload } from "./utils";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import DataTable from "./DataTable.js";

const style = {
  dataBox: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
  },
};

const CheckbackLater = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <Stack
        id="stack"
        sx={{ alignItems: "center" }}
      >
        <CircularProgress />
        <Typography sx={{ marginY: "10px" }}>
          Results not ready. Analysis still running. Please check back later
        </Typography>
      </Stack>
    </Box>
  );
};

const DataSection = ({
  selectedSection,
  searchParams,
  tab,
  jobId,
  numbOfTopVolcanoSamples,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [allFiles, setAllFiles] = useState(null);
  const [goResultsReady, setGoResultsReady] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const checkGoStatus = async () => {
    // console.log("> Calling Go Status Check");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/go-kegg-check/${jobId}/gsemf.tsv`
      );

      const { exists } = await res.json();

      setGoResultsReady(exists);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const intervalCall = setInterval(() => {
      checkGoStatus();
    }, 30000);

    setIntervalId(intervalCall);

    return () => {
      // clean up
      clearInterval(intervalCall);
    };
  }, []);

  useEffect(() => {
    if (goResultsReady) {
      clearInterval(intervalId);
    }
  }, [goResultsReady, intervalId]);

  /**
   * Creates a html image from download link
   * @param {*} image
   * @returns
   */
  const displayImg = (image) => (
    <img
      src={image}
      alt={selectedSection}
      style={getImageStyle(selectedSection)}
    />
  );

  /**
   * Gets all files listed in fileNames const
   */
  const getAllFiles = async () => {
    try {
      const fileDict = {};
      // for (const file of fileNames) {
      //   fileDict[file] = await fetchDataFile(jobId, file);
      // }
      const fetchPromises = fileNames.map(async (file) => {
        const data = await fetchDataFile(jobId, file);
        fileDict[file] = data;
      });

      await Promise.all(fetchPromises);

      fileDict["inputData"] = {};
      searchParams.forEach((input, header) => {
        switch (header) {
          case "pType":
            fileDict["inputData"][header] = input === "Raw" ? "RAW" : "FDR";
            break;
          case "parametricTest":
            fileDict["inputData"][header] =
              input === "F" ? "T-Test" : "Wilcoxon Signed-rank Test";
            break;
          default:
            fileDict["inputData"][header] = input;
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
            displayResult = <DataTable data={allFiles["volcano.csv"].data} />;
          }

          break;
        case "Heatmap":
          // if (tab.endsWith("Samples")) {
          //   displayResult = (
          //     <HeatmapComponent
          //       fileName={allFiles["data_normalized.csv"].data}
          //       numbVolcanoSamples={numbOfTopVolcanoSamples}
          //       tab={tab}
          //     />
          //   );
          // } else {
          //   displayResult = displayImg(
          //     allFiles["heatmap_0_dpi150.png"].downloadUrl
          //   );
          // }
          if (tab === null || tab.startsWith("Top")) {
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
            displayResult = (
              <DataTable
                data={allFiles["statistical_parametric_test.csv"].data}
              />
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
            displayResult = (
              <DataTable data={allFiles["fold_change.csv"].data} />
            );
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
            displayResult = <DataTable data={allFiles["pca_score.csv"].data} />;
          }

          break;
        case "Venn-Diagram":
          if (tab === "Visualization") {
            displayResult = (
              <VennDiagramComponent data={allFiles["data_original.csv"].data} />
            );
          } else if (tab === "Data Matrix") {
            displayResult = (
              <DataTable data={allFiles["venn_out_data.txt"].data} />
            );
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
            displayResult = (
              <DataTable data={allFiles["data_normalized.csv"].data} />
            );
          }
          break;
        case "Random Forest":
          if (tab === "Classification") {
            displayResult = (
              <div>
                {displayImg(allFiles["rf_cls_0_dpi150.png"].downloadUrl)}
                <DataTable data={allFiles["randomforest_confusion.csv"].data} />
              </div>
            );
          } else if (tab === "Feature") {
            displayResult = (
              <div>
                <DotGraph
                  plotData={allFiles["randomforests_sigfeatures.csv"].data}
                />
                <DataTable
                  data={allFiles["randomforests_sigfeatures.csv"].data}
                />
              </div>
            );
          } else if (tab === "Outlier") {
            displayResult = displayImg(
              allFiles["rf_outlier_0_dpi150.png"].downloadUrl
            );
          }
          break;
        case "GO Biological Process":
        case "GO Molecular Function":
        case "GO Cellular Component":
        case "KEGG Pathway/Module":
          if (tab === "Enrichment Plot") {
            displayResult = (
              <BarChartComponent
                plotData={allFiles[goKeggDict[selectedSection][0]].data}
              />
            );
          } else if (tab && tab.endsWith("connected genes")) {
            displayResult = (
              <NetworkGraph
                plotData={allFiles[goKeggDict[selectedSection][1]].data}
              />
            );
          } else if (tab && tab.endsWith("Ridge plot")) {
            displayResult = (
              <RidgePlotComponent
                tableData={allFiles[goKeggDict[selectedSection][2]].data}
                allData={allFiles["all_data.tsv"].data}
              />
            );
          } else if (tab && tab.endsWith("Heatmap plot")) {
            displayResult = (
              <GOHeatmapComponent
                tableData={allFiles[goKeggDict[selectedSection][2]].data}
                allData={allFiles["all_data.tsv"].data}
              />
            );
          } else if (tab && tab.endsWith("cluster plot")) {
            displayResult = (
              <TreeClusterPlotComponent
                plotData={allFiles[goKeggDict[selectedSection][3]]}
              />
            );
          } else {
            displayResult = null;
          }
          break;
        case "Result Data":
          displayResult = <DataTable data={allFiles["all_data.tsv"].data} />;
          break;
        case "Input Data":
          displayResult = (
            <Container sx={{ margin: "0px" }}>
              <Typography
                variant="h5"
                sx={{ fontFamily: "Lato" }}
              >
                Analysis Options:
              </Typography>
              <DataTable data={[allFiles["inputData"]]} />
              <Typography
                variant="h5"
                sx={{ fontFamily: "Lato" }}
              >
                Input Data:
              </Typography>
              <DataTable data={allFiles["data_original.csv"].data} />
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
    <Box
      sx={style.dataBox}
      className="d3Graph"
    >
      {getSection()}
    </Box>
  );
};
export default DataSection;
