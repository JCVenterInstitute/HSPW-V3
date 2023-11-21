import React, { useEffect, useState } from "react";
import main_feature from "../../components/hero.jpeg";
import {
  Container,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const DifferentialExpressionResults = () => {
  const { jobId } = useParams();
  const [selected, setSelected] = useState("Valcano Plot");
  const [alignment, setAlignment] = useState("VISUALISATION");

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const handleSelect = (item) => {
    setSelected(item);
  };

  const option = [
    "Valcano Plot",
    "Heatmap",
    "T-Tests",
    "Venn-Diagram",
    "Normalization",
    "Result Data",
    "Download",
  ];

  useEffect(() => {
    handleS3Download();
  }, []);

  const handleS3Download = async () => {
    await axios.get(`http://localhost:8000/api/s3Download/${jobId}`);
  };

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
                    VISUALISATION
                  </ToggleButton>
                  <ToggleButton value="DATA_MATRIX">DATA MATRIX</ToggleButton>
                </ToggleButtonGroup>
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
        </Container>
      </Container>
    </>
  );
};
export default DifferentialExpressionResults;
