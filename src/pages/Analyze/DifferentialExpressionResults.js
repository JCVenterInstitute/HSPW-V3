import { useEffect, useState, useCallback, useMemo } from "react";
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
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import CustomLoadingOverlay from "./CustomLoadingOverlay";
import CustomNoRowsOverlay from "./CustomNoRowsOverlay";

const DifferentialExpressionResults = () => {
  const { jobId } = useParams();
  const [selected, setSelected] = useState("Valcano Plot");
  const [alignment, setAlignment] = useState("left");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rowData, setRowData] = useState();
  const [gridApi, setGridApi] = useState();

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const noRowsOverlayComponent = useMemo(() => {
    return CustomNoRowsOverlay;
  }, []);

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
    "Venn-Diagram-Common": "venn_common.csv",
    Normalization: "norm_0_dpi72.png",
    "Result Data": "all_data.tsv",
  };

  const columns = [
    {
      headerName: "Sample ID",
      field: "experiment_id_key",
      wrapText: true,
      minWidth: 230,
      headerClass: ["header-border"],
      checkboxSelection: true,
      headerCheckboxSelection: true,
      sort: "asc",
    },
    {
      headerName: "Sample Title",
      field: "experiment_title",
      wrapText: true,
      minWidth: 500,
      headerClass: ["header-border"],
    },
    {
      headerName: "Tissue Type",
      field: "sample_type",
      wrapText: true,
      headerClass: ["header-border"],
    },
    {
      headerName: "Institution",
      field: "institution",
      wrapText: true,
      headerClass: ["header-border"],
    },
    {
      headerName: "Disease",
      field: "condition_type",
      wrapText: true,
      headerClass: ["header-border"],
    },
    {
      headerName: "Protein Count",
      field: "experiment_protein_count",
      wrapText: true,
      headerClass: ["header-border"],
    },
  ];

  const defaultColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    minWidth: 150,
    filter: "agTextColumnFilter",
  };

  const onGridReady = useCallback((params) => {
    axios
      .get("http://localhost:8000/api/study")
      .then((res) => res.data)
      .then((data) => {
        return data.hits.hits.map((item) => item._source);
      })
      .then((sourceData) => {
        setRowData(sourceData);
      })
      .then(() => {
        setGridApi(params.api);
      });
  }, []);

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
                    <ToggleButton value="left">TOP 25 SAMPLES</ToggleButton>
                    <ToggleButton value="right">ALL SAMPLES</ToggleButton>
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
                    <ToggleButton value="left">VISUALIZATION</ToggleButton>
                    <ToggleButton value="right">DATA MATRIX</ToggleButton>
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
            ) : selected === "Valcano Plot" && alignment === "right" ? (
              <div
                className="ag-theme-material ag-cell-wrap-text ag-theme-alpine differential-expression"
                style={{ width: "100%", height: "1000px" }}
              >
                <AgGridReact
                  className="ag-cell-wrap-text"
                  rowData={rowData}
                  columnDefs={columns}
                  defaultColDef={defaultColDef}
                  onGridReady={onGridReady}
                  enableCellTextSelection={true}
                  pagination={true}
                  paginationPageSize={500}
                  suppressPaginationPanel={true}
                  rowSelection={"multiple"}
                  rowMultiSelectWithClick={true}
                  noRowsOverlayComponent={noRowsOverlayComponent}
                  loadingOverlayComponent={loadingOverlayComponent}
                  suppressScrollOnNewData={true}
                ></AgGridReact>
              </div>
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
