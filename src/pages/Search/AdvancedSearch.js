import React from "react";
import { useState } from "react";
import main_feature from "../../components/hero.jpeg";
import {
  Typography,
  Container,
  Box,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const AdvancedSearch = () => {
  const [entity, setEntity] = useState("");
  const [rows, setRows] = useState([{ id: Date.now() }]); // Start with one row

  const handleAddRow = () => {
    // Use a unique ID for key purposes, like a timestamp
    setRows([...rows, { id: Date.now() }]);
  };

  const handleRemoveRow = (rowId) => {
    setRows(rows.filter((row) => row.id !== rowId));
  };

  const entities = [
    "Genes",
    "Protein Clusters",
    "Protein Signatures",
    "Proteins",
    "PubMed Citations",
    "Salivary Proteins",
    "Sequences",
    "Annotations",
  ];

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
          Advanced Search
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
          This search interface allows you to build complex queries exploiting
          the semantic annotations stored in this database.
        </p>
      </div>
      <Container>
        <Box component="fieldset" sx={{ p: 2, mb: 2, mt: 3 }}>
          <legend
            style={{
              fontSize: "100%",
              backgroundColor: "#e5e5e5",
              color: "#222",
              padding: "0.1em 0.5em",
              border: "2px solid #d8d8d8",
            }}
          >
            STEP 1 - Select the type of entities you wish to search
          </legend>
          <Box
            sx={{
              display: "flex", // Enable Flexbox
              alignItems: "center", // Vertically center the children
              gap: 1, // Optional: adds space between children
            }}
          >
            <Typography display="inline" sx={{ color: "black" }}>
              Search for
            </Typography>
            <TextField
              select
              label="Property"
              value={entity}
              size="small"
              onChange={(e) => setEntity(e.target.value)}
              sx={{ width: "200px" }}
            >
              {entities.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <Typography display="inline" sx={{ color: "black" }}>
              containing all of the following properties
            </Typography>
          </Box>
        </Box>
        <Box component="fieldset" sx={{ p: 2, mb: 2, mt: 3 }}>
          <legend
            style={{
              fontSize: "100%",
              backgroundColor: "#e5e5e5",
              color: "#222",
              padding: "0.1em 0.5em",
              border: "2px solid #d8d8d8",
            }}
          >
            STEP 2 - Specify the properties and their values to include in the
            query, using the plus (+) sign to add fields
          </legend>
          <Box
            sx={{
              backgroundColor: "#fafafa",
              border: "1px solid #ccc",
              padding: "0.4em",
              color: "#666",
            }}
          >
            Use the builder below to create your search
          </Box>
          <Typography sx={{ mt: 2, mb: 2, color: "#1463B9" }}>
            Builder
          </Typography>
          <Grid container spacing={2}>
            {rows.map((row, index) => (
              <React.Fragment key={row.id}>
                <Grid item xs={0.5}>
                  <IconButton onClick={handleAddRow} color="primary">
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={0.5}>
                  {rows.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveRow(row.id)}
                      color="secondary"
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  )}
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    select
                    label="Property"
                    defaultValue=""
                    size="small"
                    fullWidth
                  >
                    <MenuItem value="">(Select a property)</MenuItem>
                    <MenuItem value="activeSite">Active site</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    select
                    label="Operation"
                    defaultValue=""
                    size="small"
                    fullWidth
                  >
                    <MenuItem value="is equal to">is equal to</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Value"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
        <Box component="fieldset" sx={{ p: 2, mb: 2, mt: 3 }}>
          <legend
            style={{
              fontSize: "100%",
              backgroundColor: "#e5e5e5",
              color: "#222",
              padding: "0.1em 0.5em",
              border: "2px solid #d8d8d8",
            }}
          >
            STEP 3 - Choose the properties that you want to display
          </legend>
        </Box>
        <Box component="fieldset" sx={{ p: 2, mb: 2, mt: 3 }}>
          <legend
            style={{
              fontSize: "100%",
              backgroundColor: "#e5e5e5",
              color: "#222",
              padding: "0.1em 0.5em",
              border: "2px solid #d8d8d8",
            }}
          >
            STEP 4 - Configure the optional parameters
          </legend>
        </Box>
        <Box component="fieldset" sx={{ p: 2, mb: 2, mt: 3 }}>
          <legend
            style={{
              fontSize: "100%",
              backgroundColor: "#e5e5e5",
              color: "#222",
              padding: "0.1em 0.5em",
              border: "2px solid #d8d8d8",
            }}
          >
            STEP 5 - Press Search to display the results
          </legend>
        </Box>
      </Container>
    </>
  );
};

export default AdvancedSearch;
