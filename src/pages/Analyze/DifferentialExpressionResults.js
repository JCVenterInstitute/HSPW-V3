import { useEffect, useState } from "react";
import main_feature from "../../components/hero.jpeg";
import {
  Container,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import CSVDataTable from "./CSVDataTable";

const DifferentialExpressionResults = () => {
  const { jobId } = useParams();
  const [selected, setSelected] = useState("Valcano Plot");
  const [alignment, setAlignment] = useState("left");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);

  const option = [
    "Valcano Plot",
    "Heatmap",
    "T-Tests",
    "Venn-Diagram",
    "Normalization",
    "Result Data",
    "Download",
  ];

  const optionFile = {
    "Valcano Plot": "volcano_0_dpi72.png",
    "Valcano-Data": "volcano.csv",
    Heatmap: "heatmap_1_dpi72.png",
    HeatmapAll: "heatmap_0_dpi72.png",
    "T-Tests": "tt_0_dpi72.png",
    "T-Tests-Data": "t_test.csv",
    "Venn-Diagram": "venn-dimensions.png",
    Normalization: "norm_0_dpi72.png",
    "Result Data": "all_data.tsv",
  };

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      let fileName;
      if (selected === "Heatmap") {
        fileName =
          newAlignment === "left"
            ? optionFile["Heatmap"]
            : optionFile["HeatmapAll"];
        fetchImage(jobId, fileName);
      } else if (selected === "Valcano Plot") {
        fileName =
          newAlignment === "left"
            ? optionFile["Valcano Plot"]
            : optionFile["Valcano-Data"];
        fetchImage(jobId, fileName);
      } else if (selected === "T-Tests") {
        fileName =
          newAlignment === "left"
            ? optionFile["T-Tests"]
            : optionFile["T-Tests-Data"];
        fetchImage(jobId, fileName);
      } else if (selected === "Venn-Diagram") {
        fileName = newAlignment === "left" ? optionFile["Venn-Diagram"] : null;
        fetchImage(jobId, fileName);
      } else if (selected === "Normalization") {
        fileName = newAlignment === "left" ? optionFile["Normalization"] : null;
        fetchImage(jobId, fileName);
      }
    }
  };

  const handleSelect = (item) => {
    setAlignment("left"); // Reset the alignment
    setSelected(item);
    fetchImage(jobId, optionFile[item]); // Fetch the image for the selected item
  };

  const handleDataDownload = () => {
    // Create a new anchor element
    const link = document.createElement("a");
    link.href = imageUrl;

    // Set the download attribute to a default filename or based on the URL
    link.download = imageUrl.split("/").pop(); // This will take the last part of the URL as a filename

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger a click event on the link
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
  };

  const getImageStyle = (selectedItem) => {
    if (selectedItem === "Venn-Diagram") {
      return {
        maxWidth: "600px",
        maxHeight: "600px",
        width: "100%",
        height: "auto",
      };
    }
    return { maxWidth: "100%", maxHeight: "100%", height: "auto" };
  };

  const fetchImage = async (jobId, fileName) => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(
        `http://localhost:8000/api/s3Download/${jobId}/${fileName}`
      );
      if (fileName === null) {
        setCsvData([]);
      } else if (fileName.endsWith("csv")) {
        const csvText = await axios
          .get(response.data.url)
          .then((res) => res.data);
        parseCSV(csvText);
      } else {
        setImageUrl(response.data.url); // Set the image URL
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      setImageUrl(""); // Reset the image URL on error
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split("\n");

    // Split the first line to get headers
    let headers = lines[0].split(",");

    // Replace the first header if it's empty and remove quotes from all headers
    headers = headers.map((header, index) => {
      if (index === 0 && header === '""') {
        return "Protein"; // Replace the first header if it's empty
      } else {
        return header.replace(/['"]+/g, ""); // Remove quotes from headers
      }
    });

    const parsedData = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(",");

      if (currentLine.length === headers.length) {
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j].trim()] = currentLine[j].trim();
        }
        parsedData.push(row);
      }
    }

    setCsvData(parsedData);
  };

  useEffect(() => {
    fetchImage(jobId, optionFile[selected]); // Fetch the image on component mount
  }, [jobId, selected]); // Add 'selected' as a dependency

  return (
    <>
      <div style={{ backgroundImage: `url(${main_feature})` }}>
        <h1
          style={{
            color: "white",
            display: "left",
            marginLeft: "20px",
            marginBottom: "1rem",
            paddingTop: "25px",
            paddingLeft: "40px",
          }}
        >
          Differential Expression Analysis Results
        </h1>
        <p
          style={{
            textAlign: "left",
            color: "white",
            fontSize: "18px",
            paddingBottom: "25px",
            marginLeft: "20px",
            marginRight: "20px",
            paddingLeft: "40px",
            paddingRight: "40px",
          }}
        >
          Visual analytics will identify proteins with differential abundance
          between experiments in Groups A and B based on their normalized
          spectral counts.
        </p>
      </div>
      <Container
        maxWidth="false"
        sx={{
          width: "100%",
          display: "flex",
          paddingLeft: "0px !important",
          // paddingRight: "0px !important",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#f9f8f7",
            width: "250px",
            height: "100%",
          }}
        >
          <Box sx={{ p: 4, borderRadius: "16px", width: "100%" }}>
            {option.map((item, index) => (
              <Typography
                key={index}
                sx={{
                  color: "#454545",
                  fontFamily: "Montserrat",
                  textAlign: "left",
                  marginTop: "30px",
                  fontSize: "16px",
                  padding: "12px 15px 12px 15px",
                  borderRadius: "16px",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "#D9D9D9",
                    cursor: "pointer",
                  },
                  ...(selected === item && {
                    backgroundColor: "#C9C9C9",
                  }),
                }}
                onClick={() => handleSelect(item)}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
        <Container maxWidth="xl" sx={{ marginTop: "30px" }}>
          <Box sx={{ display: "flex" }}>
            <Box style={{ display: "flex", width: "100%", maxWidth: "550px" }}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {selected === "Heatmap" ? (
                  <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    sx={{
                      backgroundColor: "#EBEBEB",
                      borderRadius: "16px",
                      "& .MuiToggleButtonGroup-grouped": {
                        margin: "7px 5px",
                        border: "none",
                        padding: "8px 12px",
                        fontFamily: "Montserrat",
                        borderRadius: "16px !important",
                        "&.Mui-selected": {
                          backgroundColor: "#1463B9",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#6B9AC4",
                          },
                        },
                        "&:not(.Mui-selected)": {
                          color: "#1463B9",
                          "&:hover": {
                            backgroundColor: "#BBD1E9",
                          },
                        },
                      },
                    }}
                  >
                    <ToggleButton value="left">TOP 25 SAMPLES</ToggleButton>
                    <ToggleButton value="right">ALL SAMPLES</ToggleButton>
                  </ToggleButtonGroup>
                ) : (
                  selected !== "Result Data" &&
                  selected !== "Download" && (
                    <ToggleButtonGroup
                      value={alignment}
                      exclusive
                      onChange={handleAlignment}
                      sx={{
                        backgroundColor: "#EBEBEB",
                        borderRadius: "16px",
                        "& .MuiToggleButtonGroup-grouped": {
                          margin: "7px 5px",
                          border: "none",
                          padding: "8px 12px",
                          fontFamily: "Montserrat",
                          borderRadius: "16px !important",
                          "&.Mui-selected": {
                            backgroundColor: "#1463B9",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#6B9AC4",
                            },
                          },
                          "&:not(.Mui-selected)": {
                            color: "#1463B9",
                            "&:hover": {
                              backgroundColor: "#BBD1E9",
                            },
                          },
                        },
                      }}
                    >
                      <ToggleButton value="left">VISUALIZATION</ToggleButton>
                      <ToggleButton value="right">DATA MATRIX</ToggleButton>
                    </ToggleButtonGroup>
                  )
                )}
              </Box>
            </Box>
            <Box
              sx={{
                textAlign: "right",
                justifyContent: "flex-end", // To push content to the right
                flexGrow: 1, // To make the right Box occupy remaining space
              }}
            >
              <Button variant="contained" onClick={handleDataDownload}>
                Download
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "auto",
            }}
          >
            {isLoading ? (
              <CircularProgress />
            ) : selected === "Heatmap" || alignment === "left" ? (
              imageUrl && (
                <img
                  src={imageUrl}
                  alt={selected}
                  style={getImageStyle(selected)}
                />
              )
            ) : (selected === "Valcano Plot" ||
                selected === "T-Tests" ||
                selected === "Venn-Diagram" ||
                selected === "Normalization") &&
              alignment === "right" ? (
              <CSVDataTable data={csvData} />
            ) : (
              <div>Hello</div>
            )}
          </Box>
        </Container>
      </Container>
    </>
  );
};
export default DifferentialExpressionResults;
