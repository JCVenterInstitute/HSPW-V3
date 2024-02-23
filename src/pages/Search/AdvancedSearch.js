import React, { useMemo, useRef } from "react";
import { useState, useEffect } from "react";
import main_feature from "../../assets/hero.jpeg";
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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import CustomLoadingOverlay from "../../components/Search/CustomLoadingOverlay";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Link } from "react-router-dom";
import BreadCrumb from "../../components/Breadcrumbs";
import { Helmet } from "react-helmet";

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
  } else if (entity === "Proteins") {
    fields = fields.filter((field) => field !== "Uniprot_id");
    fields.unshift("Uniprot_id");
  } else if (entity === "PubMed Citations") {
    fields = fields.filter((field) => field !== "PubMed_ID");
    fields.unshift("PubMed_ID");
  } else if (entity === "Salivary Proteins" || entity === "Annotations") {
    fields = fields.filter((field) => field !== "uniprot_accession");
    fields.unshift("uniprot_accession");
  }

  // Generate column definitions based on the keys
  return fields.map((field, index) => {
    // Common properties for all columns
    const columnDef = {
      headerName: field.charAt(0).toUpperCase() + field.slice(1),
      field: field,
      wrapText: true,
      minWidth: 200,
      headerClass: ["header-border"],
      cellClass: ["table-border", "global-search-cell"],
    };

    // Conditional cellRenderer for the first column of 'Annotations'
    if (entity === "Annotations" && index === 0) {
      columnDef.cellRenderer = (params) => {
        return (
          <Link
            to={`/protein/${params.value}`}
            style={{
              cursor: "pointer",
              color: "blue",
              textDecoration: "underline",
            }}
          >
            {params.value}
          </Link>
        );
      };
    } else {
      columnDef.cellRenderer = (params) => {
        const dataValue = params.value;

        // Special handling for 'keywords' field
        if (field === "keywords" && Array.isArray(dataValue)) {
          return dataValue.map((keywordObj) => keywordObj.keyword).join(", ");
        }

        // Check if dataValue is an array of objects
        if (
          Array.isArray(dataValue) &&
          dataValue.length > 0 &&
          typeof dataValue[0] === "object"
        ) {
          return JSON.stringify(dataValue);
        }

        // If it's an array of strings (or other non-object values), join them with a comma
        if (Array.isArray(dataValue)) {
          return dataValue.join(", ");
        }

        // For non-array values, just return the value
        return dataValue;
      };
    }

    return columnDef;
  });
};

const isRowInvalid = (row) => {
  return (
    !row.selectedProperty ||
    (!row.selectedOperation && row.selectedOperation !== "exists") ||
    (row.selectedOperation !== "exists" && !row.value)
  );
};

let nextPaginationKey = [];
let allData = []; // Global array to store all the data

const AdvancedSearch = () => {
  const gridRef = useRef(null);
  const [entity, setEntity] = useState("");
  const [booleanOperator, setBooleanOperator] = useState("AND");
  const [properties, setProperties] = useState([]);
  const [propertiesOptions, setPropertiesOptions] = useState([]);
  const [rows, setRows] = useState([
    { id: Date.now(), selectedProperty: "", selectedOperation: "", value: "" },
  ]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [searchStarted, setSearchStarted] = useState(false);
  const [searchResults, setSearchResults] = useState();
  const [columnDefs, setColumnDefs] = useState();
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [gridApi, setGridApi] = useState();
  const [columnApi, setColumnApi] = useState(null);
  const [sortedColumn, setSortedColumn] = useState(null);

  const defaultColDef = {
    flex: 1,
    resizable: true,
    // sortable: true,
    minWidth: 170,
  };

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const flattenData = (hits) => {
    return hits.flatMap((hit) => {
      const uniprotAccession = hit._source.salivary_proteins.uniprot_accession;
      return hit._source.salivary_proteins.annotations.flatMap((annotation) => {
        if (
          annotation.annotation_description &&
          annotation.annotation_description.length
        ) {
          return annotation.annotation_description.map((description) => ({
            uniprot_accession: uniprotAccession,
            annotation_type: annotation.annotation_type,
            annotation_description: description.description,
          }));
        } else {
          return [
            {
              uniprot_accession: uniprotAccession,
              annotation_type: annotation.annotation_type,
              annotation_description: "No description available",
            },
          ];
        }
      });
    });
  };

  const dataSource = {
    async getRows(params) {
      const { startRow, endRow } = params;
      gridRef.current.api.showLoadingOverlay();
      try {
        const payload = {
          entity,
          rows,
          booleanOperator,
          selectedProperties,
          size: 100,
          paginationKey:
            startRow && nextPaginationKey.length !== 0
              ? nextPaginationKey[nextPaginationKey.length - 1]
              : null,
        };
        await axios
          .post(
            `${process.env.REACT_APP_API_ENDPOINT}/api/advanced-search/build-query`,
            payload
          )
          .then((res) => {
            const newResults = flattenData(res.data.hits);

            // Append new results to the existing data
            if (startRow === 0) {
              allData = newResults;
              setColumnDefs(generateColumnDefs("Annotations", allData));
            }
            if (endRow >= allData.length) {
              allData = [...allData, ...newResults];
            }

            if (endRow >= allData.length - 100) {
              nextPaginationKey.push(
                res.data.hits[res.data.hits.length - 1].sort
              );
            }

            gridRef.current.api.hideOverlay();

            const rowsThisBlock = allData.slice(startRow, endRow);

            params.successCallback(rowsThisBlock, -1);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        params.failCallback();
      }
    },
  };

  const onGridReady = (params) => {
    const { api, columnApi } = params;
    setGridApi(api);
    gridRef.current.grid = api;
    gridRef.current.column = columnApi;
    params.api.setDatasource(dataSource);
    nextPaginationKey = [];
  };

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

  const handleGridApiChange = (params) => {
    setGridApi(params);
  };

  const handleColumnApiChange = (params) => {
    setColumnApi(params);
  };

  const handleSortedColumnChange = (params) => {
    setSortedColumn(params);
  };

  const handleAddRow = () => {
    // Use a unique ID for key purposes, like a timestamp
    setRows([
      ...rows,
      {
        id: Date.now(),
        selectedProperty: properties[0] || "",
        selectedOperation: "",
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
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/properties/${e.target.value}`
        )
        .then((res) => res.data);
      setPropertiesOptions(propertyList);

      if (e.target.value === "Genes") {
        propertyList = propertyList.filter((item) => item !== "GeneID");
        setSelectedProperties(["GeneID"]);
      } else if (e.target.value === "Protein Clusters") {
        propertyList = propertyList.filter((item) => item !== "uniprot_id");
        setSelectedProperties(["uniprot_id"]);
      } else if (e.target.value === "Protein Signatures") {
        propertyList = propertyList.filter((item) => item !== "InterPro ID");
        setSelectedProperties(["InterPro ID"]);
      } else if (e.target.value === "Proteins") {
        propertyList = propertyList.filter((item) => item !== "Uniprot_id");
        setSelectedProperties(["Uniprot_id"]);
      } else if (e.target.value === "PubMed Citations") {
        propertyList = propertyList.filter((item) => item !== "PubMed_ID");
        setSelectedProperties(["PubMed_ID"]);
      } else if (
        e.target.value === "Salivary Proteins" ||
        e.target.value === "Annotations"
      ) {
        propertyList = propertyList.filter(
          (item) => item !== "uniprot_accession"
        );
        setSelectedProperties(["uniprot_accession"]);
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
    if (newValue === "Date of Publication" || newValue === "PubDate") {
      setRows(
        rows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                selectedProperty: newValue,
                selectedOperation: "between",
                value: {
                  startDate: dayjs("1957-08-17").format("YYYY/MM/DD"),
                  endDate: dayjs(new Date()).format("YYYY/MM/DD"),
                },
              }
            : row
        )
      );
    } else {
      setRows(
        rows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                selectedProperty: newValue,
                selectedOperation: "",
                value: "",
              }
            : row
        )
      );
    }
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

  const handleDateChange = (rowId, newValue, dateTimeType) => {
    const dateValue = dayjs(newValue).format("YYYY/MM/DD");
    setRows(
      rows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            value: {
              ...row.value,
              [dateTimeType]: dateValue, // Update startDate or endDate based on dateTimeType
            },
          };
        }
        return row;
      })
    );
  };

  const handleSelectedPropertiesChange = (newSelectedProperties) => {
    setSelectedProperties(newSelectedProperties);
  };

  const handlePageChange = (newPage) => {
    gridApi.showLoadingOverlay();
    setCurrentPage(newPage);
    handleSearch(newPage);
  };

  const handleSearch = async (
    page = currentPage,
    pageSize = recordsPerPage
  ) => {
    const from = (page - 1) * pageSize;

    setSearchStarted(true);

    if (entity !== "Annotations") {
      const payload = {
        entity,
        rows,
        booleanOperator,
        selectedProperties,
        size: pageSize,
        from,
        sortedColumn,
      };
      const result = await axios
        .post(
          `${process.env.REACT_APP_API_ENDPOINT}/api/advanced-search/build-query`,
          payload
        )
        .then((res) => {
          const totalResultsCount =
            res.data.total.value > 10000 ? 10000 : res.data.total.value;
          setTotalPages(Math.ceil(totalResultsCount / pageSize));
          if (entity === "Salivary Proteins") {
            return res.data.hits.map((item) => item._source.salivary_proteins);
          }
          return res.data.hits.map((item) => item._source);
        });

      const columns = generateColumnDefs(entity, result);

      setColumnDefs(columns);
      setSearchResults(result);
      if (gridApi) {
        gridApi.hideOverlay();
      }
    }
  };

  useEffect(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedColumn]);

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

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Search" },
    { path: "Advanced Search" },
  ];

  return (
    <>
      <Helmet>
        <title>HSP | Advanced Search</title>
      </Helmet>
      <div
        className="head_background"
        style={{ backgroundImage: `url(${main_feature})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Advanced Search</h1>
          <p className="head_text">
            This search interface allows you to build complex queries exploiting
            the semantic annotations stored in this database.
          </p>
        </Container>
      </div>
      <Container maxWidth="xl">
        <Box
          component="fieldset"
          sx={{ p: 2, mb: 2, mt: 3 }}
        >
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
            <Typography
              display="inline"
              sx={{ color: "black" }}
            >
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
                <MenuItem
                  key={option}
                  value={option}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <Typography
              display="inline"
              sx={{ color: "black" }}
            >
              containing
            </Typography>
            <Checkbox
              icon={<CircleUnchecked />}
              checkedIcon={<CircleCheckedFilled />}
              checked={booleanOperator === "AND"}
              onChange={() => setBooleanOperator("AND")}
              sx={{ p: 0, ml: 2 }}
            />
            <Typography
              display="inline"
              sx={{ mr: 2 }}
            >
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
        <Box
          component="fieldset"
          sx={{ p: 2, mb: 2, mt: 3 }}
        >
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
          <Grid
            container
            spacing={2}
          >
            {rows.map((row, index) => (
              <React.Fragment key={row.id}>
                <Grid
                  item
                  xs={0.5}
                >
                  <IconButton
                    onClick={handleAddRow}
                    color="primary"
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Grid>
                <Grid
                  item
                  xs={0.5}
                >
                  {rows.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveRow(row.id)}
                      color="secondary"
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  )}
                </Grid>
                <Grid
                  item
                  xs={3}
                >
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
                      <MenuItem
                        key={property}
                        value={property}
                      >
                        {property}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid
                  item
                  xs={3}
                >
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
                    row.selectedProperty === "experiment_id_key" ||
                    row.selectedProperty === "mass" ||
                    row.selectedProperty === "protein_sequence_length" ? (
                      numericOperations.map((operation) => (
                        <MenuItem
                          key={operation}
                          value={operation}
                        >
                          {operation}
                        </MenuItem>
                      ))
                    ) : row.selectedProperty === "Date of Publication" ||
                      row.selectedProperty === "PubDate" ? (
                      <MenuItem
                        key="between"
                        value="between"
                      >
                        between
                      </MenuItem>
                    ) : (
                      operations.map((operation) => (
                        <MenuItem
                          key={operation}
                          value={operation}
                        >
                          {operation}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </Grid>
                {row.selectedProperty === "Date of Publication" ||
                row.selectedProperty === "PubDate" ? (
                  <>
                    <Grid
                      item
                      xs={2.5}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Container components={["DatePicker", "DatePicker"]}>
                          <DatePicker
                            label="Start Date"
                            format="YYYY/MM/DD"
                            minDate={dayjs("1957-08-17")}
                            maxDate={dayjs(new Date())}
                            slotProps={{ textField: { size: "small" } }}
                            value={dayjs(row.value.startDate)}
                            onChange={(newValue) =>
                              handleDateChange(row.id, newValue, "startDate")
                            }
                          />
                        </Container>
                      </LocalizationProvider>
                    </Grid>
                    <Grid
                      item
                      xs={2.5}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Container components={["DatePicker", "DatePicker"]}>
                          <DatePicker
                            label="End Date"
                            format="YYYY/MM/DD"
                            minDate={dayjs("1957-08-17")}
                            maxDate={dayjs(new Date())}
                            slotProps={{ textField: { size: "small" } }}
                            value={dayjs(row.value.endDate)}
                            onChange={(newValue) =>
                              handleDateChange(row.id, newValue, "endDate")
                            }
                          />
                        </Container>
                      </LocalizationProvider>
                    </Grid>
                  </>
                ) : (
                  <Grid
                    item
                    xs={5}
                  >
                    <TextField
                      fullWidth
                      label="Value"
                      size="small"
                      variant="outlined"
                      value={row.value}
                      onChange={(e) =>
                        handleValueChange(row.id, e.target.value)
                      }
                      disabled={row.selectedOperation === "exists"}
                    />
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>
        </Box>
        <Box
          component="fieldset"
          sx={{ p: 2, mb: 2, mt: 3 }}
        >
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
              selectedProperties={selectedProperties}
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
          <Button
            variant="contained"
            onClick={() => {
              setSortedColumn(null);
              setCurrentPage(1);
              handleSearch(1);
            }}
            disabled={rows.some(isRowInvalid)}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
        {searchStarted &&
          (entity !== "Annotations" ? (
            <Box
              component="fieldset"
              sx={{ p: 2, mb: 2, mt: 3 }}
            >
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
              <Box sx={{ display: "flex" }}>
                <Box
                  sx={{
                    textAlign: "right",
                    justifyContent: "flex-end", // To push content to the right
                    flexGrow: 1, // To make the right Box occupy remaining space
                  }}
                >
                  <Typography
                    display="inline"
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "18px",
                      color: "#464646",
                    }}
                  >
                    Records Per Page
                  </Typography>
                  <TextField
                    select
                    size="small"
                    InputProps={{
                      style: {
                        borderRadius: "10px",
                      },
                    }}
                    value={recordsPerPage}
                    onChange={(event) => {
                      const newRecordsPerPage = event.target.value;
                      setRecordsPerPage(newRecordsPerPage);
                      gridApi.showLoadingOverlay();
                      setCurrentPage(1);
                      handleSearch(1, newRecordsPerPage);
                    }}
                    sx={{ marginLeft: "10px", marginRight: "30px" }}
                  >
                    {[50, 100, 500, 1000].map((option) => (
                      <MenuItem
                        key={option}
                        value={option}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Typography
                    display="inline"
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "18px",
                      color: "#464646",
                    }}
                  >
                    Page
                  </Typography>
                  {searchResults && (
                    <TextField
                      select
                      size="small"
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                        },
                      }}
                      value={currentPage}
                      sx={{ marginLeft: "10px", marginRight: "10px" }}
                      onChange={(e) => handlePageChange(e.target.value)}
                    >
                      {Array.from({ length: totalPages }, (_, index) => (
                        <MenuItem
                          key={index + 1}
                          value={index + 1}
                        >
                          {index + 1}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                  <Typography
                    display="inline"
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "18px",
                      color: "#464646",
                      marginRight: "30px",
                    }}
                  >
                    out of {totalPages}
                  </Typography>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      color: currentPage === 1 ? "#D3D3D3" : "#F6921E",
                      background: "white",
                      fontSize: "20px",
                      border: "none",
                      cursor: currentPage === 1 ? "default" : "pointer",
                      transition:
                        currentPage === 1 ? "none" : "background 0.3s",
                      borderRadius: "5px",
                      marginRight: "15px",
                      pointerEvents: currentPage === 1 ? "none" : "auto",
                      paddingBottom: "5px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(246, 146, 30, 0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    <ArrowBackIosIcon
                      style={{
                        display: "inline",
                        position: "relative",
                        top: "0.2em",
                        fontWeight: "bold",
                      }}
                    />
                    prev
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      color: currentPage === totalPages ? "#D3D3D3" : "#F6921E",
                      background: "white",
                      fontSize: "20px",
                      border: "none",
                      cursor:
                        currentPage === totalPages ? "default" : "pointer",
                      transition:
                        currentPage === totalPages ? "none" : "background 0.3s",
                      borderRadius: "5px",
                      pointerEvents:
                        currentPage === totalPages ? "none" : "auto",
                      paddingBottom: "5px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(246, 146, 30, 0.2)";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    next
                    <ArrowForwardIosIcon
                      style={{
                        display: "inline",
                        position: "relative",
                        top: "0.2em",
                        fontWeight: "bold",
                      }}
                    />
                  </button>
                </Box>
              </Box>
              <SearchResultsTable
                entity={entity}
                columnApi={columnApi}
                searchResults={searchResults}
                columnDefs={columnDefs}
                recordsPerPage={recordsPerPage}
                handleGridApiChange={handleGridApiChange}
                handleColumnApiChange={handleColumnApiChange}
                handleSortedColumnChange={handleSortedColumnChange}
              />
            </Box>
          ) : (
            <Box
              component="fieldset"
              sx={{ p: 2, mb: 2, mt: 3 }}
            >
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
              <div
                id="differential"
                className="ag-theme-material ag-cell-wrap-text ag-theme-alpine differential-expression"
                style={{ height: 800, width: "100%" }}
              >
                <AgGridReact
                  className="ag-cell-wrap-text"
                  ref={gridRef}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  onGridReady={onGridReady}
                  rowModelType="infinite"
                  paginationPageSize={1}
                  maxConcurrentDatasourceRequests={1}
                  infiniteInitialRowCount={100}
                  loadingOverlayComponent={loadingOverlayComponent}
                />
              </div>
            </Box>
          ))}
      </Container>
    </>
  );
};

export default AdvancedSearch;
