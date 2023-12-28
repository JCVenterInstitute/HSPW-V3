import { Box, Typography, TextField, MenuItem } from "@mui/material";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import CustomLoadingOverlay from "../CustomLoadingOverlay";

const generateColumnDefs = (entity, data) => {
  if (!data || data.length === 0) return [];

  // Get the keys from the first object in the data array
  let fields = Object.keys(data[0]);

  // Generate column definitions based on the keys
  return fields.map((field, index) => {
    // Common properties for all columns
    const columnDef = {
      headerName: field.charAt(0).toUpperCase() + field.slice(1),
      field: field,
      wrapText: true,
      minWidth: 200,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    };

    // Conditional cellRenderer for the first column of 'Annotations'
    if (index === 0) {
      columnDef.cellRenderer = (params) => {
        return (
          <span
            onClick={() =>
              window.open(`/protein-cluster/${params.value}`, "_blank")
            }
            style={{
              cursor: "pointer",
              color: "blue",
              textDecoration: "underline",
            }}
          >
            {params.value}
          </span>
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

const ProteinClusters = ({ searchText }) => {
  const [gridApi, setGridApi] = useState();
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchResults, setSearchResults] = useState();
  const [columnDefs, setColumnDefs] = useState();

  const defaultColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    minWidth: 170,
    filter: "agTextColumnFilter",
  };

  const handlePageChange = (newPage) => {
    gridApi.showLoadingOverlay();
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  const onGridReady = useCallback((params) => {
    params.api.showLoadingOverlay();
    setGridApi(params.api);
  }, []);

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const fetchData = async (page = currentPage, pageSize = recordsPerPage) => {
    const entity = "Protein Clusters";
    const from = (page - 1) * pageSize;
    const response = await axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/api/global-search`, {
        entity,
        size: pageSize,
        from,
        searchText,
      })
      .then((res) => {
        setTotalPages(Math.ceil(res.data.total.value / pageSize));
        return res.data.hits.map((item) => item._source);
      });

    const columns = generateColumnDefs(entity, response);

    setColumnDefs(columns);
    setSearchResults(response);
  };

  useEffect(() => {
    fetchData(1);
    setCurrentPage(1);
  }, [searchText]);

  return (
    <>
      <Box
        component="fieldset"
        sx={{ p: 2, mb: "90px", mt: 3 }}
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
          Protein Clusters
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
                fetchData(1, newRecordsPerPage);
              }}
              sx={{ marginLeft: "10px", marginRight: "30px" }}
            >
              {[10, 50, 100].map((option) => (
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
                transition: currentPage === 1 ? "none" : "background 0.3s",
                borderRadius: "5px",
                marginRight: "15px",
                pointerEvents: currentPage === 1 ? "none" : "auto",
                paddingBottom: "5px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(246, 146, 30, 0.2)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
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
                cursor: currentPage === totalPages ? "default" : "pointer",
                transition:
                  currentPage === totalPages ? "none" : "background 0.3s",
                borderRadius: "5px",
                pointerEvents: currentPage === totalPages ? "none" : "auto",
                paddingBottom: "5px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(246, 146, 30, 0.2)";
              }}
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
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
        <Box
          sx={{
            marginTop: "10px",
          }}
        >
          <div
            id="differential"
            className="ag-theme-material ag-cell-wrap-text ag-theme-alpine differential-expression"
            style={{ height: 550 }}
          >
            <AgGridReact
              className="ag-cell-wrap-text"
              rowData={searchResults}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              enableCellTextSelection={true}
              pagination={true}
              paginationPageSize={recordsPerPage}
              suppressPaginationPanel={true}
              loadingOverlayComponent={loadingOverlayComponent}
              suppressScrollOnNewData={true}
            ></AgGridReact>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default ProteinClusters;
