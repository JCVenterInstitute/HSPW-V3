import { Box, CircularProgress, Container } from "@mui/material";
import { useEffect, useState } from "react";

import TabDescription from "./TabDescription";
import TabOptions from "./TabOptions";
import ResultDownload from "./ResultDownload";
import CSVDataTable from "../../../pages/Analyze/CSVDataTable";
import axios from "axios";
import { fetchCSV, getImageStyle } from "./utils";
import { fileMapping } from "./Constants";

const DataSection = ({
  selectedSection,
  handleDownload,
  tab,
  jobId,
  imageUrl,
  setImageUrl,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [csvData, setCsvData] = useState(null);
  const [image, setImage] = useState(null);

  const style = {
    dataBox: {
      marginTop: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "auto",
    },
  };

  // Load graph images
  useEffect(() => {
    let currentTab = tab;

    setIsLoading(true);
    setImageUrl(null);
    setImage(null);

    // No file to display
    if (fileMapping[selectedSection] === undefined) return;

    // Heat Map has tab name based on param passed in so need diff logic for handling tab names
    if (selectedSection === "Heatmap") {
      currentTab = currentTab.startsWith("Top") ? "Top Samples" : "All Samples";
    }

    const newRelevantFile = fileMapping[selectedSection][currentTab];

    if (newRelevantFile === undefined || currentTab === "Data Matrix") return;

    fetchImage(
      jobId,
      Array.isArray(newRelevantFile) ? newRelevantFile[0] : newRelevantFile
    );
  }, [selectedSection, tab]);

  // Get CSV data for Data Matrix Tabs
  useEffect(() => {
    const getCsvData = async () => {
      if (tab === "Data Matrix") {
        const { data, downloadUrl } = await fetchCSV(
          jobId,
          fileMapping[selectedSection][tab]
        );

        setCsvData(data);
        setImageUrl(downloadUrl);
      }
    };

    try {
      setIsLoading(true);
      setCsvData([]);
      getCsvData();
    } catch (err) {
      console.log("> CSV Data Load Error", err);
    } finally {
      setIsLoading(false);
    }
  }, [tab]);

  const fetchImage = async (jobId, fileName) => {
    console.log("> Fetch Image", fileName);

    try {
      let response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/s3Download/${jobId}/${fileName}`
      );
      setImageUrl(response.data.url); // Set the image URL
      setImage(response.data.url);
    } catch (error) {
      console.error("Error downloading image:", error);
      setImageUrl(""); // Reset the image URL on error
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  };

  if (isLoading) {
    return (
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
    );
  }

  let displayResult = null;

  switch (selectedSection) {
    case "Volcano Plot":
      displayResult = null;
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
    case "Download":
      displayResult = <ResultDownload handleDownload={handleDownload} />;
      break;

    default:
      displayResult = null;
  }

  if (tab === "Data Matrix" && csvData !== null) {
    displayResult = (
      <Container sx={{ margin: "0px" }}>
        <Box
          sx={{
            overflowX: "auto", // Enable horizontal scrolling
            width: "100%",
          }}
        >
          <CSVDataTable
            data={csvData}
            selectedSection={selectedSection}
          />
        </Box>
      </Container>
    );
  }

  if (displayResult === null) {
    displayResult = (
      <img
        src={image}
        alt={selectedSection}
        style={getImageStyle(selectedSection)}
      />
    );
  }

  return <Box sx={style.dataBox}>{displayResult}</Box>;
};

const ResultSection = ({
  selectedSection,
  tab,
  handleTabChange,
  handleDataDownload,
  numbOfTopVolcanoSamples,
  setTab,
  jobId,
  handleDownload,
  imageUrl,
  setImageUrl,
}) => {
  return (
    <>
      <TabOptions
        numbOfTopVolcanoSamples={numbOfTopVolcanoSamples}
        tab={tab}
        selectedSection={selectedSection}
        handleTabChange={handleTabChange}
        handleDataDownload={handleDataDownload}
        setTab={setTab}
      />
      <TabDescription
        tab={tab}
        selectedSection={selectedSection}
        numbOfTopVolcanoSamples={numbOfTopVolcanoSamples}
      />
      <DataSection
        selectedSection={selectedSection}
        handleDownload={handleDownload}
        jobId={jobId}
        tab={tab}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
      />
    </>
  );
};

export default ResultSection;
