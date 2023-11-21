import React, { useEffect, useState } from "react";
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

const DifferentialExpressionResults = () => {
  const { jobId } = useParams();
  const [selected, setSelected] = useState("Valcano Plot");
  const [alignment, setAlignment] = useState("VISUALISATION");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    Heatmap: "heatmap_1_dpi72.png",
    HeatmapAll: "heatmap_0_dpi72.png",
    "T-Tests": "tt_0_dpi72.png",
    "Venn-Diagram": "venn-dimensions.png",
    Normalization: "norm_0_dpi72.png",
    "Result Data": "all_data.tsv",
  };

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const handleSelect = (item) => {
    setSelected(item);
    const fileName = optionFile[item]; // Get the file name based on the selected item
    fetchImage(jobId, fileName); // Fetch the image for the selected item
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
      setImageUrl(response.data.url); // Set the image URL
    } catch (error) {
      console.error("Error downloading image:", error);
      setImageUrl(""); // Reset the image URL on error
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
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
            height: "1200px",
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
                    <ToggleButton
                      value="VISUALISATION"
                      onClick={() => handleSelect("Heatmap")}
                    >
                      TOP 25 SAMPLES
                    </ToggleButton>
                    <ToggleButton
                      value="DATA_MATRIX"
                      onClick={() =>
                        fetchImage(jobId, optionFile["HeatmapAll"])
                      }
                    >
                      ALL SAMPLES
                    </ToggleButton>
                  </ToggleButtonGroup>
                ) : (
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
                    <ToggleButton value="VISUALISATION">
                      VISUALIZATION
                    </ToggleButton>
                    <ToggleButton value="DATA_MATRIX">DATA MATRIX</ToggleButton>
                  </ToggleButtonGroup>
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
              <Button variant="contained">Download</Button>
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
            ) : (
              imageUrl && (
                <img
                  src={imageUrl}
                  alt={selected}
                  style={getImageStyle(selected)}
                />
              )
            )}
          </Box>
        </Container>
      </Container>
    </>
  );
};
export default DifferentialExpressionResults;
