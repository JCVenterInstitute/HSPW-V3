import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Container,
  TextField,
  Box,
  MenuItem,
  Stack,
  Checkbox,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AgGridReact } from "ag-grid-react";
import { ReactComponent as DownloadLogo } from "../table_icon/download.svg";

import CustomLoadingOverlay from "../customLoadingOverlay.jsx";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import "../filter.css";
import "../table.css";

const HOST_ENDPOINT = `http://localhost:8000`;

const escapeSpecialCharacters = (inputVal) => {
  return inputVal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const stringAttributes = ["protein_name", "uniprot_id"];

const numberAttributes = ["number_of_members"];

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  marginBottom: "15px",
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .1)"
        : "rgba(0, 0, 0, .05)",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<PlayArrowIcon sx={{ fontSize: "1.1rem", color: "#454545" }} />}
    {...props}
  />
))(({ theme }) => ({
  paddingLeft: "25px",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(2),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  backgroundColor: "#f9f8f7",
  color: "#454545",
  fontFamily: "Montserrat",
}));

function App() {
  const [message, setMessage] = useState("");
  const [pageSize, setPageSize] = useState(50);
  const [searchText, setSearchText] = useState("");
  const [globalSC, setGlobalSC] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [count, setCount] = useState(1);
  const [pageNumArr, setPageNumArr] = useState([1]);
  const [docCount, setDocCount] = useState(0);
  const [facetFilter, setFacetFilters] = useState({});
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();
  const [columnApi, setColumnApi] = useState(null);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [gridApi, setGridApi] = useState(null);

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const createSortQuery = () => {
    const { attribute, order } = sortedColumn;

    // Have to include .keyword when sorting string attributes
    const sortAttrKey = `${sortedColumn.attribute}${
      stringAttributes.includes(attribute) ? ".keyword" : ""
    }`;

    return {
      sort: [
        {
          [sortAttrKey]: {
            order,
          },
        },
      ],
    };
  };

  const createGlobalSearchQuery = () => {
    const escapedInput = escapeSpecialCharacters(searchText);

    return {
      query_string: {
        query: `*${escapedInput}*`,
        default_operator: "AND",
        analyze_wildcard: true,
      },
    };
  };

  const customHeaders = {
    "Content-Type": "application/json",
  };

  const fetchData = async () => {
    const apiPayload = {
      filters: queryBuilder(facetFilter),

      ...(sortedColumn && createSortQuery()),
      ...(searchText && { keyword: createGlobalSearchQuery() }),
    };
    const data = await fetch(
      `${HOST_ENDPOINT}/api/cluster_search/${pageSize}/${pageNum * pageSize}`,
      {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(apiPayload),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const { hits, aggregations } = data;

        // Set number of total records returned
        setDocCount(hits.total.value);

        return hits.hits.map((rec) => rec._source);
      });
    console.log("162", data);
    setRowData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Needed to delay search so users can type before triggering search
    const delayDebounceFn = setTimeout(() => {
      setPageNum(0);
      fetchData();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [facetFilter, pageSize, searchText]);

  useEffect(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
      setPageNum(0);
      fetchData();
    }
  }, [sortedColumn]);

  useEffect(() => {
    fetchData();
  }, [pageNum]);

  /**
   * Creates a range query for a number field for OpenSearch
   * @param {{ attrName, start, end }} input Necessary fields for range query
   * @returns OpenSearch range query based on inputs
   */
  const createRangeQuery = ({ attrName, start, end }) => {
    let rangeQuery = {
      range: {
        [attrName]: {
          ...(start && { gte: start }),
          ...(end && { lte: end }),
        },
      },
    };

    return rangeQuery;
  };

  /**
   * Creates a query for a string field for OpenSearch
   * @param {{attrName, value}} input necessary fields for string query
   * @returns
   */
  const createStringQuery = ({ attrName, value }) => {
    return {
      bool: {
        filter: [
          {
            regexp: {
              [`${attrName}.keyword`]: {
                value: `${value}.*`,
                flags: "ALL",
                case_insensitive: true,
              },
            },
          },
        ],
      },
    };
  };

  /**
   * Remove all empty filters to prevent building queries with empty values
   * @param {Object} filters Object with Key value pairs of all facet fields
   * @returns Object with all non empty filter values for building queries
   */
  const removeEmptyFilters = (filters) => {
    const attributes = Object.keys(filters);

    for (const attr of attributes) {
      const attrType = typeof filters[attr];

      if (attrType === "string" && filters[attr] === "") {
        // Remove empty string filters (e.g { "value": "" })
        delete filters[attr];
      } else if (attrType === "object") {
        // Filter out empty range filters (e.g. { "rangeField": { start: "", end: "" }})
        const fil = filters[attr];

        for (const key of Object.keys(fil)) {
          if (fil[key] === "") delete fil[key];
        }

        if (Object.keys(filters[attr]).length === 0) {
          delete filters[attr];
        }
      }
    }

    return filters;
  };

  /**
   * Build OpenSearch Query based on user facet filters
   * @param {Object} filters Object containing all key & values for all user selected facet filters
   * @returns Returns an array of queries for each non empty filter applied by user
   */
  const queryBuilder = (filters) => {
    const queries = [];

    filters = removeEmptyFilters(filters);

    for (const attr of Object.keys(filters)) {
      if (stringAttributes.includes(attr)) {
        queries.push(
          createStringQuery({ attrName: attr, value: filters[attr] })
        );
      } else if (numberAttributes.includes(attr)) {
        queries.push(createRangeQuery({ attrName: attr, ...filters[attr] }));
      }
    }

    console.log("> Queries", queries);
    return queries;
  };

  const columns = [
    {
      headerName: "Representative Protein",
      field: "uniprot_id",
      maxWidth: 205,
      wrapText: true,
      suppressSizeToFit: true,
      sortable: true,
    },
    {
      headerName: "Representative Protein Name",
      field: "protein_name",
      sortable: true,
      wrapText: true,
      autoHeight: true,
      cellStyle: { wordBreak: "break-word" },
    },
    {
      headerName: "# of Members",
      field: "number_of_members",
      sortable: true,
      wrapText: true,
      maxWidth: 145,
      maxWidth: 145,
    },
  ];

  const handleAccessionChange = (e) => {
    let { value } = e.target;
    value = escapeSpecialCharacters(value);
    setFacetFilters({
      ...facetFilter,
      uniprot_id: value,
    });
  };

  const handleNameChange = (e) => {
    let { value } = e.target;
    value = escapeSpecialCharacters(value);
    setFacetFilters({
      ...facetFilter,
      protein_name: value,
    });
  };

  const handleStartMemberChange = (e) => {
    let inputValue = e.target.value;

    const updateFacet = facetFilter;

    if (updateFacet.number_of_members) {
      updateFacet.number_of_members = {
        ...updateFacet.number_of_members,
        start: inputValue,
      };
    } else {
      updateFacet.number_of_members = {
        start: inputValue,
      };
    }

    setFacetFilters({ ...updateFacet });
  };

  const handleEndMemberChange = (e) => {
    const { value } = e.target;

    const updateFacet = facetFilter;

    if (updateFacet.number_of_members) {
      updateFacet.number_of_members = {
        ...updateFacet.number_of_members,
        end: value,
      };
    } else {
      updateFacet.number_of_members = {
        end: value,
      };
    }

    setFacetFilters({ ...updateFacet });
  };

  const handleGlobalSearch = (input) => {
    setSearchText(input);
  };

  const clearSearchBar = () => {
    setSearchText("");
  };

  const onSortChanged = () => {
    const columnState = columnApi.getColumnState();
    const sortedColumn = columnState.filter((col) => col.sort !== null);

    if (sortedColumn.length !== 0) {
      const { sort, colId } = sortedColumn[0];
      setSortedColumn({ attribute: colId, order: sort });
    } else {
      setSortedColumn(null);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setGlobalSC(false);
  };

  const onBtNext = (event) => {
    if (pageNum < docCount / pageSize - 1) {
      setPageNum(pageNum + 1);
    }
  };

  const onBtPrevious = (event) => {
    if (pageNum !== 0) {
      setPageNum(pageNum - 1);
    }
  };
  const defColumnDefs = {
    flex: 1,
    filter: true,
    resizable: true,
    sortable: true,
    wrapHeaderText: true,
    wrapText: true,
    autoHeaderHeight: true,
    headerClass: ["header-border"],
    headerComponentParams: {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        // '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
        '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
        '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
        '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
        '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
        '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
        '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
        // '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
        "  </div>" +
        "</div>",
    },
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    gridRef.current.api.sizeColumnsToFit();
  };

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const recordsPerPageList = [
    {
      value: 50,
      label: 50,
    },
    {
      value: 100,
      label: 100,
    },
    {
      value: 500,
      label: 500,
    },
    {
      value: 1000,
      label: 1000,
    },
  ];

  return (
    <>
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
            height: "47rem",
            overflow: "scroll",
          }}
        >
          <h1
            style={{
              color: "#1463B9",
              display: "center",
              textAlign: "center",
              paddingTop: "30px",
              fontSize: "25px",
              paddingBottom: "40px",
            }}
          >
            Filters
          </h1>
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Representative Protein
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Search..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  onChange={handleAccessionChange}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Representative Protein Name
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Search..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  onChange={handleNameChange}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  # of Members
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  label="Start..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  value={
                    facetFilter["number_of_members"] &&
                    facetFilter["number_of_members"].start
                      ? facetFilter["number_of_members"].start
                      : ""
                  }
                  onChange={handleStartMemberChange}
                />
                <Typography
                  variant="p"
                  style={{
                    margin: "5px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  to
                </Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  label="End..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  value={
                    facetFilter["number_of_members"] &&
                    facetFilter["number_of_members"].end
                      ? facetFilter["number_of_members"].end
                      : ""
                  }
                  onChange={handleEndMemberChange}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </Box>
        <Container maxWidth="xl" sx={{ marginTop: "30px" }}>
          <Box sx={{ display: "flex" }}>
            <Box style={{ display: "flex", width: "100%", maxWidth: "550px" }}>
              <TextField
                variant="outlined"
                size="small"
                label="Search..."
                value={searchText}
                onChange={(e) => handleGlobalSearch(e.target.value)}
                InputProps={{
                  style: {
                    height: "44px",
                    width: "500px",
                    borderRadius: "16px 0 0 16px",
                  },
                  endAdornment: searchText && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={() => {
                          clearSearchBar();
                        }}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <button
                type="submit"
                style={{
                  border: "2px solid #1463B9",
                  width: "50px",
                  height: "44px",
                  backgroundColor: "#1463B9",
                  borderColor: "#1463B9",
                  cursor: "pointer",
                  borderRadius: "0 16px 16px 0",
                }}
                onClick={() => {
                  handleGlobalSearch(searchText);
                }}
              >
                <SearchIcon sx={{ color: "white" }} />
              </button>
            </Box>
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
                value={pageSize}
                onChange={(event) => {
                  setPageSize(event.target.value);
                }}
                sx={{ marginLeft: "10px", marginRight: "30px" }}
              >
                {recordsPerPageList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
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
              <TextField
                select
                size="small"
                InputProps={{
                  style: {
                    borderRadius: "10px",
                  },
                }}
                value={pageNum ? pageNum + 1 : 1}
                sx={{ marginLeft: "10px", marginRight: "10px" }}
                onChange={(event) => {
                  setPageNum(event.target.value);
                }}
              >
                {Array.from(
                  { length: Math.ceil(docCount / pageSize) },
                  (_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {index + 1}
                    </MenuItem>
                  )
                )}
              </TextField>
              <Typography
                display="inline"
                sx={{
                  fontFamily: "Lato",
                  fontSize: "18px",
                  color: "#464646",
                  marginRight: "30px",
                }}
              >
                out of {Math.ceil(docCount / pageSize)}
              </Typography>
              <button
                onClick={onBtPrevious}
                disabled={pageNum + 1 === 1}
                style={{
                  color: pageNum + 1 === 1 ? "#D3D3D3" : "#F6921E",
                  background: "white",
                  fontSize: "20px",
                  border: "none",
                  cursor: pageNum + 1 === 1 ? "default" : "pointer",
                  transition: pageNum + 1 === 1 ? "none" : "background 0.3s",
                  borderRadius: "5px",
                  marginRight: "15px",
                  pointerEvents: pageNum + 1 === 1 ? "none" : "auto",
                  paddingBottom: "5px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(246, 146, 30, 0.2)")
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
                onClick={onBtNext}
                disabled={pageNum === Math.ceil(docCount / pageSize)}
                style={{
                  color:
                    pageNum === Math.ceil(docCount / pageSize)
                      ? "#D3D3D3"
                      : "#F6921E",
                  background: "white",
                  fontSize: "20px",
                  border: "none",
                  cursor:
                    pageNum === Math.ceil(docCount / pageSize)
                      ? "default"
                      : "pointer",
                  transition:
                    pageNum === Math.ceil(docCount / pageSize)
                      ? "none"
                      : "background 0.3s",
                  borderRadius: "5px",
                  pointerEvents:
                    pageNum === Math.ceil(docCount / pageSize)
                      ? "none"
                      : "auto",
                  paddingBottom: "5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(246, 146, 30, 0.2)";
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
          <Box
            sx={{
              marginTop: "20px",
            }}
          >
            <div
              className="ag-theme-material ag-cell-wrap-text ag-theme-alpine saliva_table"
              style={{ height: 600 }}
            >
              <AgGridReact
                className="ag-cell-wrap-text"
                ref={gridRef}
                rowData={rowData}
                columnDefs={columns}
                defaultColDef={defColumnDefs}
                onGridReady={onGridReady}
                enableCellTextSelection={true}
                pagination={true}
                onSortChanged={onSortChanged}
                overlayNoRowsTemplate={
                  '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">Loading</span>'
                }
                loadingOverlayComponent={loadingOverlayComponent}
                paginationPageSize={pageSize}
                suppressPaginationPanel={true}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={onBtExport}
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: "10px",
                  textTransform: "unset",
                  color: "#F6921E",
                  fontSize: "20",
                  "&:hover": {
                    backgroundColor: "inherit",
                  },
                }}
              >
                <DownloadLogo
                  style={{
                    marginRight: "10px",
                  }}
                />
                Download Spreadsheet
              </Button>
            </div>
          </Box>
        </Container>
      </Container>
    </>
  );
}
export default App;
