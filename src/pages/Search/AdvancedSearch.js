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
  Checkbox,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import SelectAllTransferList from "../../components/Search/SelectAllTransferList";
import CircleCheckedFilled from "@mui/icons-material/CheckCircle";
import CircleUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import SearchResultsTable from "../../components/Search/SearchResultsTable";

const generateColumnDefs = (entity, data) => {
  if (!data || data.length === 0) return [];

  // Get the keys from the first object in the data array
  let fields = Object.keys(data[0]);

  // If the entity is "Genes", rearrange to make "GeneID" the first element
  if (entity === "Genes") {
    fields = fields.filter((field) => field !== "GeneID"); // Remove "GeneID" if it exists
    fields.unshift("GeneID"); // Add "GeneID" at the beginning
  } else if (entity === "Protein Clusters") {
    fields = fields.filter((field) => field !== "uniprot_id");
    fields.unshift("uniprot_id");
  } else if (entity === "Protein Signatures") {
    fields = fields.filter((field) => field !== "InterPro ID");
    fields.unshift("InterPro ID");
  }

  // Generate column definitions based on the keys
  return fields.map((field) => ({
    headerName: field,
    field: field,
    wrapText: true,
    minWidth: 200,
    headerClass: ["header-border"],
    cellClass: ["differential-cell"],
    // Add other common properties here if needed
  }));
};

const AdvancedSearch = () => {
  const [entity, setEntity] = useState("");
  const [booleanOperator, setBooleanOperator] = useState("AND");
  const [properties, setProperties] = useState([]);
  const [propertiesOptions, setPropertiesOptions] = useState([]);
  const [rows, setRows] = useState([
    { id: Date.now(), selectedProperty: "", selectedOperation: "", value: "" },
  ]); // Start with one row
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [searchStarted, setSearchStarted] = useState(false);
  const [searchResults, setSearchResults] = useState();
  const [columnDefs, setColumnDefs] = useState();

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

  const numericOperations = ["exists", "is equal to", "is unequal to"];

  const handleAddRow = () => {
    // Use a unique ID for key purposes, like a timestamp
    setRows([
      ...rows,
      {
        id: Date.now(),
        selectedProperty: properties[0] || "",
        selectedOperation: properties[0] || "",
        value: "",
      },
    ]);
  };

  const handleRemoveRow = (rowId) => {
    setRows(rows.filter((row) => row.id !== rowId));
  };

  const handleEntityChange = async (e) => {
    setEntity(e.target.value);
    setSearchStarted(false);

    try {
      let propertyList = await axios
        .get(`http://localhost:8000/api/properties/${e.target.value}`)
        .then((res) => res.data);
      setPropertiesOptions(propertyList);
      if (e.target.value === "Genes") {
        propertyList = propertyList.filter((item) => item !== "GeneID");
      } else if (e.target.value === "Protein Clusters") {
        propertyList = propertyList.filter((item) => item !== "uniprot_id");
      } else if (e.target.value === "Protein Signatures") {
        propertyList = propertyList.filter((item) => item !== "InterPro ID");
      }
      setProperties(propertyList);

      // Set the first property as default for each row
      setRows(
        rows.map((row) => ({
          ...row,
          selectedProperty: propertyList[0] || "",
          selectedOperation: "",
          value: "",
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
        row.id === rowId
          ? {
              ...row,
              selectedOperation: newValue,
              value: newValue === "exists" ? "" : row.value, // Clear value if operation is 'exists'
            }
          : row
      )
    );
  };

  const handleValueChange = (rowId, newValue) => {
    setRows(
      rows.map((row) => (row.id === rowId ? { ...row, value: newValue } : row))
    );
  };

  const handleSelectedPropertiesChange = (newSelectedProperties) => {
    setSelectedProperties(newSelectedProperties);
  };

  const handleSearch = async () => {
    console.log("> Searching...");
    console.log("> Search Query:", rows);

    setSearchStarted(true);

    const result = await axios
      .post("http://localhost:8000/api/advanced-search/build-query", {
        entity,
        rows,
        booleanOperator,
        selectedProperties,
      })
      .then((res) => res.data.map((item) => item._source));
    console.log(result);

    const columns = generateColumnDefs(entity, result);

    setColumnDefs(columns);
    setSearchResults(result);
  };

  const handleReset = () => {
    setEntity("");
    setBooleanOperator("AND");
    setProperties([]);
    setRows([
      {
        id: Date.now(),
        selectedProperty: "",
        selectedOperation: "",
        value: "",
      },
    ]);
    setSearchStarted(false);
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
              containing
            </Typography>
            <Checkbox
              icon={<CircleUnchecked />}
              checkedIcon={<CircleCheckedFilled />}
              checked={booleanOperator === "AND"}
              onChange={() => setBooleanOperator("AND")}
              sx={{ p: 0, ml: 2 }}
            />
            <Typography display="inline" sx={{ mr: 2 }}>
              (AND) all of the following properties
            </Typography>
            <Checkbox
              icon={<CircleUnchecked />}
              checkedIcon={<CircleCheckedFilled />}
              checked={booleanOperator === "OR"}
              onChange={() => setBooleanOperator("OR")}
              sx={{ p: 0 }}
            />
            <Typography display="inline">
              (OR) any of the following properties
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
                    {propertiesOptions.map((property) => (
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
                    {row.selectedProperty === "number_of_members" ||
                    row.selectedProperty === "experiment_id_key"
                      ? numericOperations.map((operation) => (
                          <MenuItem key={operation} value={operation}>
                            {operation}
                          </MenuItem>
                        ))
                      : operations.map((operation) => (
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
                    value={row.value}
                    onChange={(e) => handleValueChange(row.id, e.target.value)}
                    disabled={row.selectedOperation === "exists"}
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

          {properties.length !== 0 ? (
            <SelectAllTransferList
              properties={properties}
              onSelectedPropertiesChange={handleSelectedPropertiesChange}
            />
          ) : (
            <Typography>Please select an entity type first</Typography>
          )}
        </Box>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center", // Centers the buttons horizontally
            gap: 2,
            mb: 3,
          }}
        >
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
        </Box>
        {searchStarted && (
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
            <SearchResultsTable
              entity={entity}
              searchResults={searchResults}
              columnDefs={columnDefs}
            />
          </Box>
        )}
      </Container>
    </>
  );
};

export default AdvancedSearch;
