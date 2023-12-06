import React from "react";
import { useState } from "react";
import main_feature from "../../components/hero.jpeg";
import {
  Typography,
  Container,
  Box,
  MenuItem,
  Grid,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import SelectAllTransferList from "../../components/Search/SelectAllTransferList";

const AdvancedSearch = () => {
  const [entity, setEntity] = useState("");
  const [properties, setProperties] = useState([]);
  const [rows, setRows] = useState([
    { id: Date.now(), selectedProperty: "", selectedOperation: "" },
  ]); // Start with one row

  const entities = [
    "Genes",
    "Protein Clusters",
    "Protein Signatures",
    "Proteins",
    "PubMed Citations",
    "Salivary Proteins",
    "Annotations",
  ];

  const operations = [
    "exists",
    "is equal to",
    "is unequal to",
    "starts with",
    "ends with",
    "contains",
    "doesn't start with",
    "doesn't end with",
    "doesn't contain",
  ];

  const handleAddRow = () => {
    // Use a unique ID for key purposes, like a timestamp
    setRows([
      ...rows,
      {
        id: Date.now(),
        selectedProperty: properties[0] || "",
        selectedOperation: "contains",
      },
    ]);
  };

  const handleRemoveRow = (rowId) => {
    setRows(rows.filter((row) => row.id !== rowId));
  };

  const handleEntityChange = async (e) => {
    setEntity(e.target.value);

    try {
      const res = await axios.get(
        `http://localhost:8000/api/properties/${e.target.value}`
      );
      const newProperties = Object.keys(res.data);
      setProperties(newProperties);

      // Set the first property as default for each row
      setRows(
        rows.map((row) => ({
          ...row,
          selectedProperty: newProperties[0] || "",
          selectedOperation: "contains",
        }))
      );
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handlePropertyChange = (rowId, newValue) => {
    setRows(
      rows.map((row) =>
        row.id === rowId ? { ...row, selectedProperty: newValue } : row
      )
    );
  };

  const handleOperationChange = (rowId, newValue) => {
    setRows(
      rows.map((row) =>
        row.id === rowId ? { ...row, selectedOperation: newValue } : row
      )
    );
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
              display: "flex",
              alignItems: "center", // Vertically center the children
              gap: 1, // Adds space between children
            }}
          >
            <Typography display="inline" sx={{ color: "black" }}>
              Search for
            </Typography>
            <TextField
              select
              label="Entity"
              value={entity}
              size="small"
              onChange={handleEntityChange}
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
            query, using the plus (+) sign to add fields and the minus (-) sign
            to remove fields
          </legend>
          {/* <Box
            sx={{
              backgroundColor: "#fafafa",
              border: "1px solid #ccc",
              padding: "0.4em",
              color: "#666",
            }}
          >
            Use the builder below to create your search
          </Box>
          <Typography sx={{ mt: 4, mb: 2, color: "#1463B9" }}>
            Builder
          </Typography> */}
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
                    value={row.selectedProperty}
                    size="small"
                    fullWidth
                    onChange={(e) =>
                      handlePropertyChange(row.id, e.target.value)
                    }
                  >
                    {properties.map((property) => (
                      <MenuItem key={property} value={property}>
                        {property}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    select
                    label="Operation"
                    value={row.selectedOperation}
                    size="small"
                    fullWidth
                    onChange={(e) =>
                      handleOperationChange(row.id, e.target.value)
                    }
                  >
                    {operations.map((operation) => (
                      <MenuItem key={operation} value={operation}>
                        {operation}
                      </MenuItem>
                    ))}
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
          {properties.length !== 0 && (
            <SelectAllTransferList properties={properties} />
          )}
        </Box>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center", // Centers the buttons horizontally
            gap: 2,
          }}
        >
          <Button variant="contained">Search</Button>
          <Button variant="outlined">Reset</Button>
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
            Search Results
          </legend>
        </Box>
      </Container>
    </>
  );
};

export default AdvancedSearch;
