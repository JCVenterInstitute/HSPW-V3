import { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Container,
  TextField,
  Box,
  MenuItem,
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
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import { ReactComponent as DownloadLogo } from "../assets/table-icon/download.svg";
import "./Filter.css";
import "./Table.css";

const Accordion = styled((props) => (
  <MuiAccordion
    disableGutters
    elevation={0}
    square
    {...props}
  />
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

function LinkComponent(props) {
  return (
    <div style={{ paddingLeft: "20px" }}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/gene/${props.value}`}
      >
        {props.value}
      </a>
    </div>
  );
}

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

const stringAttributes = ["GeneID", "Gene Name", "Location"];
const numberAttributes = [];

const columns = [
  {
    headerName: "Gene",
    field: "GeneID",
    maxWidth: "120",
    checkboxSelection: false,
    headerCheckboxSelection: false,
    cellRenderer: "LinkComponent",
    headerClass: ["header-border"],
    cellClass: ["table-border"],
  },
  {
    headerName: "Gene Name",
    field: "Gene Name",
    wrapText: true,
    autoHeight: true,
    cellStyle: { wordBreak: "break-word" },
    headerClass: ["header-border"],
    cellClass: ["table-border"],
  },
  {
    headerName: "Location",
    field: "Location",
    maxWidth: "150",
    headerClass: ["header-border"],
    cellClass: ["table-border"],
  },
];

const customHeaders = {
  "Content-Type": "application/json",
};

const defColumnDefs = { flex: 1, sortable: true };

const GeneTable = () => {
  const gridRef = useRef();

  const [gridApi, setGridApi] = useState();
  const [columnApi, setColumnApi] = useState(null);
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(0);
  const [facetFilters, setFacetFilters] = useState({});
  const [sortedColumn, setSortedColumn] = useState(null);
  const [docCount, setDocCount] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const globalSearch = (input) => {
    setSearchText(input);
  };

  const escapeSpecialCharacters = (inputVal) => {
    return inputVal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

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

    return {
      bool: {
        filter: [rangeQuery],
      },
    };
  };

  /**
   * Create a proper search query for whichever search string is entered into the search bar
   */
  const createGlobalSearchQuery = () => {
    const escapedInput = escapeSpecialCharacters(searchText);

    return {
      query_string: {
        query: `*${escapedInput}*`,
        fields: [...stringAttributes],
        default_operator: "AND",
        analyze_wildcard: true,
      },
    };
  };

  /**
   * Create a proper sort query for whichever sort attribute is selected
   */
  const createSortQuery = () => {
    const { attribute, order } = sortedColumn;

    // Have to include .keyword when sorting string attributes
    const sortAttrKey = `${sortedColumn.attribute}${
      stringAttributes.includes(attribute) && attribute !== "Gene Name"
        ? ".keyword"
        : ""
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

  /**
   * Build OpenSearch Query based on user facet filters
   * @param {Object} filters Object containing all key & values for all user selected facet filters
   * @returns Returns an array of queries for each non empty filter applied by user
   */
  const queryBuilder = (filters) => {
    const queries = [];

    for (const attr of Object.keys(filters)) {
      if (stringAttributes.includes(attr)) {
        queries.push(
          createStringQuery({ attrName: attr, value: filters[attr] })
        );
      } else if (numberAttributes.includes(attr)) {
        queries.push(createRangeQuery({ attrName: attr, ...filters[attr] }));
      }
    }

    return queries;
  };

  const fetchData = async () => {
    const filterQueries = queryBuilder(facetFilters);

    await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/genes/${pageSize}/${
        pageSize * pageNum
      }`,
      {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify({
          filters: filterQueries,
          ...(searchText && { keyword: createGlobalSearchQuery() }),
          ...(sortedColumn && createSortQuery()),
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const { hits, total } = data.hits;
        setRowData(hits.map((rec) => rec._source));

        setDocCount(total.value > 10000 ? 10000 : total.value); // pagination breaks for results after 10k so limit results
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (gridApi) gridApi.showLoadingOverlay();

    // Needed to delay search so users can type before triggering search
    const delayDebounceFn = setTimeout(() => {
      setPageNum(0);
      fetchData();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [facetFilters, searchText, pageSize, gridApi]);

  useEffect(() => {
    if (gridApi) gridApi.showLoadingOverlay();
    fetchData();
  }, [pageNum, gridApi]);

  useEffect(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
      setPageNum(0);
      fetchData();
    }
  }, [sortedColumn]);

  /**
   * Creates a query for a string field for OpenSearch
   * @param {{attrName, value}} input necessary fields for string query
   * @returns
   */
  const createStringQuery = ({ attrName, value }) => {
    const escapedInput = escapeSpecialCharacters(value);

    return {
      bool: {
        filter: [
          {
            regexp: {
              [attrName !== "Gene Name" ? `${attrName}.keyword` : attrName]: {
                value: `${escapedInput}.*`,
                flags: "ALL",
                case_insensitive: true,
              },
            },
          },
        ],
      },
    };
  };

  const onGridReady = (params) => {
    params.api.showLoadingOverlay();
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };

  /**
   * Handle Input changes for all the text boxes
   */
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    const currentFilters = facetFilters;

    if (currentFilters[name] !== undefined && value === "") {
      // Remove empty filter
      delete currentFilters[name];
      setFacetFilters({
        ...currentFilters,
      });
    } else {
      // Add new filter
      setFacetFilters({
        ...currentFilters,
        [name]: value,
      });
    }
  };

  const resetFilters = () => {
    setFacetFilters({});
    setSearchText("");
    setSortedColumn(null);
  };

  /**
   * Track which column is selected for sort by user
   */
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

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const onBtNext = () => {
    if (pageNum < docCount / pageSize - 1) {
      setPageNum(pageNum + 1);
    }
  };

  const onBtPrevious = () => {
    if (pageNum !== 0) {
      setPageNum(pageNum - 1);
    }
  };

  const clearSearch = () => {
    setSearchText("");
  };

  const handleGlobalSearch = (input) => {
    setSearchText(input);
  };

  return (
    <>
      <Container
        maxWidth="false"
        sx={{
          width: "100%",
          display: "flex",
          paddingLeft: "0px !important",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#f9f8f7",
            width: "285px",
            overflow: "scroll",
            maxHeight: "760px",
          }}
        >
          <h1
            style={{
              color: "#1463B9",
              display: "center",
              textAlign: "center",
              paddingTop: "30px",
              fontSize: "25px",
            }}
          >
            Filters
          </h1>
          <Button
            variant="text"
            size="small"
            sx={{
              display: "block",
              marginBottom: "20px",
              marginX: "auto",
              textAlign: "center",
            }}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
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
                  Gene ID
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
                  onChange={handleInputChange}
                  name="GeneID"
                  value={facetFilters["GeneID"] ? facetFilters["GeneID"] : ""}
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
                  Gene Name
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
                  onChange={handleInputChange}
                  name="Gene Name"
                  value={
                    facetFilters["Gene Name"] ? facetFilters["Gene Name"] : ""
                  }
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
                  Location
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
                  onChange={handleInputChange}
                  name="Location"
                  value={
                    facetFilters["Location"] ? facetFilters["Location"] : ""
                  }
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </Box>
        <Container
          maxWidth="xl"
          sx={{ marginTop: "30px" }}
        >
          <Box sx={{ display: "flex" }}>
            <Box style={{ display: "flex", width: "100%", maxWidth: "550px" }}>
              <TextField
                variant="outlined"
                size="small"
                label="Search..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
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
                          clearSearch();
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
                  setPageNum(0);
                  setPageSize(event.target.value);
                }}
                sx={{ marginLeft: "10px", marginRight: "30px" }}
              >
                {recordsPerPageList.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
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
              {rowData.length !== 0 && (
                <TextField
                  select
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: "10px",
                    },
                  }}
                  value={pageNum === 0 ? 1 : pageNum + 1}
                  sx={{ marginLeft: "10px", marginRight: "10px" }}
                  onChange={(event) => {
                    setPageNum(event.target.value - 1);
                  }}
                >
                  {Array.from(
                    { length: Math.ceil(docCount / pageSize) },
                    (_, index) => (
                      <MenuItem
                        key={index + 1}
                        value={index + 1}
                      >
                        {index + 1}
                      </MenuItem>
                    )
                  )}
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
                out of {docCount === 0 ? 0 : Math.ceil(docCount / pageSize)}
              </Typography>
              <button
                onClick={onBtPrevious}
                disabled={pageNum === 0}
                style={{
                  color: pageNum === 0 ? "#D3D3D3" : "#F6921E",
                  background: "white",
                  fontSize: "20px",
                  border: "none",
                  cursor: pageNum === 0 ? "default" : "pointer",
                  transition: pageNum === 0 ? "none" : "background 0.3s",
                  borderRadius: "5px",
                  marginRight: "15px",
                  pointerEvents: pageNum === 0 ? "none" : "auto",
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
                disabled={pageNum === Math.ceil(docCount / pageSize - 1)}
                style={{
                  color:
                    pageNum === Math.ceil(docCount / pageSize - 1)
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
                components={{
                  LinkComponent,
                }}
                onSortChanged={onSortChanged}
                enableCellTextSelection={true}
              />
            </div>
            <div>
              <button
                onClick={onBtExport}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#F6921E",
                  background: "white",
                  fontSize: "20",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <DownloadLogo
                  style={{
                    marginRight: "10px",
                    paddingTop: "5px",
                    display: "inline",
                    position: "relative",
                    top: "0.15em",
                  }}
                />
                Download Spreadsheet
              </button>
            </div>
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default GeneTable;
