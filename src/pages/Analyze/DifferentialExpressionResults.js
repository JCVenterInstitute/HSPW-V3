import { useEffect, useState } from "react";
import main_feature from "../../assets/hero.jpeg";
import {
  Container,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import CSVDataTable from "./CSVDataTable";
import DownloadIcon from "@mui/icons-material/Download";

const DifferentialExpressionResults = () => {
  const { jobId } = useParams();
  const [selected, setSelected] = useState("Volcano Plot");
  const [alignment, setAlignment] = useState("left");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);

  const option = [
    "Volcano Plot",
    "Heatmap",
    "Statistical Parametric Test",
    "Fold Change Analysis",
    "Principal Component Analysis",
    "Venn-Diagram",
    "Normalization",
    "Input Data",
    "Result Data",
    "Download",
  ];

  const optionFile = {
    "Volcano Plot": "volcano_0_dpi72.png",
    "Volcano-Data": "volcano.csv",
    Heatmap: "heatmap_1_dpi72.png",
    HeatmapAll: "heatmap_0_dpi72.png",
    "Statistical Parametric Test": "tt_0_dpi72.png",
    "Statistical-Parametric-Test-Data": "statistical_parametric_test.csv",
    "Fold Change Analysis": "fc_0_dpi72.png",
    "FC-Data": "fold_change.csv",
    "Principal Component Analysis": "pca_score2d_0_dpi72.png",
    "PCA-Data": "pca_score.csv",
    "Venn-Diagram": "venn-dimensions.png",
    "Venn-Diagram-Data": "venn_out_data.txt",
    Normalization: "norm_0_dpi72.png",
    "Normalization-Data": "data_normalized.csv",
    "Input Data": "data_original.csv",
    "Result Data": "all_data.tsv",
  };

  const fileDownloadOption = {
    "Volcano Plot": "volcano_0_dpi72.png",
    "Volcano Data": "volcano.csv",
    "Top 25 Samples Heatmap": "heatmap_1_dpi72.png",
    "All Samples Heatmap": "heatmap_0_dpi72.png",
    "Statistical Parametric Test Plot": "tt_0_dpi72.png",
    "Statistical Parametric Test Data": "statistical_parametric_test.csv",
    "Fold Change Analysis Plot": "fc_0_dpi72.png",
    "Fold Change Analysis Data": "fold_change.csv",
    "Principal Component Analysis Plot": "pca_score2d_0_dpi72.png",
    "Principal Component Analysis Data": "pca_score.csv",
    "Venn-Diagram Plot": "venn-dimensions.png",
    "Venn-Diagram Data": "venn_out_data.txt",
    "Normalization Plot": "norm_0_dpi72.png",
    "Normalization Data": "data_normalized.csv",
    "Input Data": "data_original.csv",
    "Result Data": "all_data.tsv",
    "All Data Set": "data_set.zip",
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
      } else if (selected === "Volcano Plot") {
        fileName =
          newAlignment === "left"
            ? optionFile["Volcano Plot"]
            : optionFile["Volcano-Data"];
        fetchImage(jobId, fileName);
      } else if (selected === "Statistical Parametric Test") {
        fileName =
          newAlignment === "left"
            ? optionFile["Statistical Parametric Test"]
            : optionFile["Statistical-Parametric-Test-Data"];
        fetchImage(jobId, fileName);
      } else if (selected === "Fold Change Analysis") {
        fileName =
          newAlignment === "left"
            ? optionFile["Fold Change Analysis"]
            : optionFile["FC-Data"];
        fetchImage(jobId, fileName);
      } else if (selected === "Principal Component Analysis") {
        fileName =
          newAlignment === "left"
            ? optionFile["Principal Component Analysis"]
            : optionFile["PCA-Data"];
        fetchImage(jobId, fileName);
      } else if (selected === "Venn-Diagram") {
        fileName =
          newAlignment === "left"
            ? optionFile["Venn-Diagram"]
            : optionFile["Venn-Diagram-Data"];
        fetchImage(jobId, fileName);
      } else if (selected === "Normalization") {
        fileName =
          newAlignment === "left"
            ? optionFile["Normalization"]
            : optionFile["Normalization-Data"];
        fetchImage(jobId, fileName);
      } else {
        fileName = null;
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

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger a click event on the link
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
  };

  const handleDownload = async (jobId, fileName) => {
    try {
      await axios
        .get(`http://localhost:8000/api/s3Download/${jobId}/${fileName}`)
        .then((res) => {
          const link = document.createElement("a");
          link.href = res.data.url;

          // Set the download attribute to a default filename or based on the URL
          link.download = fileName; // This will take the last part of the URL as a filename

          // Append the link to the body
          document.body.appendChild(link);

          // Trigger a click event on the link
          link.click();

          // Remove the link from the body
          document.body.removeChild(link);
        });
    } catch (error) {
      console.error("Error downloading file:", error);
    }
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
      } else if (
        fileName &&
        (fileName.endsWith("csv") ||
          fileName.endsWith("tsv") ||
          fileName.endsWith("txt"))
      ) {
        const csvText = await axios
          .get(response.data.url)
          .then((res) => res.data);
        parseCSV(csvText);
        setImageUrl(response.data.url);
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

    // Detect delimiter (comma or tab)
    const delimiter = lines[0].indexOf("\t") >= 0 ? "\t" : ",";

    // Split the first line with the detected delimiter to get headers
    let headers = lines[0].split(delimiter);

    // Replace the first header if it's empty and remove quotes from all headers
    headers = headers.map((header, index) => {
      if (
        index === 0 &&
        (header.replace(/['"]+/g, "") === "" ||
          header.replace(/['"]+/g, "") === "rn")
      ) {
        return selected === "Principal Component Analysis"
          ? "Sample"
          : "Protein";
      } else {
        return header.replace(/['"]+/g, "");
      }
    });

    const parsedData = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(delimiter);

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
            width: "270px",
            height: "auto",
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
        <Container
          maxWidth="xl"
          sx={{ margin: "30px 0 30px 20px" }}
        >
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
                  selected !== "Input Data" &&
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
              {selected !== "Download" && (
                <Button
                  variant="contained"
                  onClick={handleDataDownload}
                >
                  Download
                </Button>
              )}
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
            ) : selected === "Download" ? (
              <Box sx={{ width: "80%" }}>
                <Typography
                  variant="h5"
                  sx={{ fontFamily: "Montserrat" }}
                  gutterBottom
                >
                  Download
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#f9f8f7",
                    mt: "20px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    padding: "25px",
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid
                      item
                      xs={12}
                      key="downloadAll"
                    >
                      <Box sx={{ ml: 3 }}>
                        <Button
                          onClick={() => handleDownload(jobId, "data_set.zip")}
                          startIcon={<DownloadIcon sx={{ color: "#1463B9" }} />}
                          sx={{
                            textTransform: "none", // Keeps the button text style similar to Typography
                            color: "#1463B9", // Sets the color of the text
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              textDecoration: "underline",
                              color: "#1463B9",
                            }}
                          >
                            Download all data set (zip)
                          </Typography>
                        </Button>
                      </Box>
                    </Grid>
                    {Object.entries(fileDownloadOption).map(
                      ([key, fileName]) => {
                        return fileName !== "data_set.zip" ? (
                          <Grid
                            item
                            xs={6}
                            key={key}
                          >
                            <Box sx={{ ml: 3 }}>
                              <Button
                                onClick={() => handleDownload(jobId, fileName)}
                                startIcon={
                                  <DownloadIcon sx={{ color: "#1463B9" }} />
                                }
                                sx={{
                                  textTransform: "none", // Keeps the button text style similar to Typography
                                  color: "#1463B9", // Sets the color of the text
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    textDecoration: "underline",
                                    color: "#1463B9",
                                  }}
                                >
                                  {key}
                                </Typography>
                              </Button>
                            </Box>
                          </Grid>
                        ) : null;
                      }
                    )}
                  </Grid>
                </Box>
              </Box>
            ) : selected === "Result Data" || selected === "Input Data" ? (
              <Container sx={{ margin: "0px" }}>
                <Box
                  sx={{
                    overflowX: "auto", // Enable horizontal scrolling
                    width: "100%",
                  }}
                >
                  <CSVDataTable data={csvData} />
                </Box>
              </Container>
            ) : selected === "Heatmap" || alignment === "left" ? (
              imageUrl && (
                <img
                  src={imageUrl}
                  alt={selected}
                  style={getImageStyle(selected)}
                />
              )
            ) : (
              (selected === "Volcano Plot" ||
                selected === "Statistical Parametric Test" ||
                selected === "Fold Change Analysis" ||
                selected === "Principal Component Analysis" ||
                selected === "Venn-Diagram" ||
                selected === "Normalization") &&
              alignment === "right" && (
                <Container sx={{ margin: "0px" }}>
                  <Box
                    sx={{
                      overflowX: "auto", // Enable horizontal scrolling
                      width: "100%",
                    }}
                  >
                    <CSVDataTable data={csvData} />
                  </Box>
                </Container>
              )
            )}
          </Box>
        </Container>
      </Container>
    </>
  );
};
export default DifferentialExpressionResults;
