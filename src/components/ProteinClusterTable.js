import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  Container,
  TextField,
  Box,
  Button,
  MenuItem,
  InputAdornment,
  IconButton,
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

import { ReactComponent as DownloadLogo } from "../assets/table-icon/download.svg";
import CustomLoadingOverlay from "./CustomLoadingOverlay";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
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
        rel="noopener noreferrer"
        target="_blank"
        href={`protein-cluster/${props.value}`}
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

const ProteinClusterTable = () => {
  const gridRef = useRef();
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [facetFilters, setFacetFilters] = useState({});
  const [sortedColumn, setSortedColumn] = useState(null);
  const [rowData, setRowData] = useState([]);

  const stringAttributes = ["uniprot_id", "protein_name"];
  const termAttributes = ["number_of_members"];

  const defColumnDefs = {
    flex: 1,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };

  const columns = [
    {
      headerName: "Cluster Representative Protein",
      field: "uniprot_id",
      maxWidth: 305,
      wrapText: true,
      suppressSizeToFit: true,
      sortable: true,
      cellStyle: { paddingLeft: "15px !important" },
      cellRenderer: "LinkComponent",
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
    },
  ];

  const customHeaders = {
    "Content-Type": "application/json",
  };

  /**
   * Escape all special characters for input string
   * Special Characters include: [-[\]{}()*+?.,\\^$|#\s
   * @param {String} inputVal Non-escaped string value entered by user
   * @returns String where special characters are escaped with slashes
   */
  const escapeSpecialCharacters = (inputVal) => {
    return inputVal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
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

  const fetchData = () => {
    const filterQueries = queryBuilder(facetFilters);

    fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/protein-cluster/${pageSize}/${
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
        setDocCount(total.value);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setNextPage = () => {
    if (pageNum < docCount / pageSize - 1) {
      setPageNum(pageNum + 1);
    }
  };

  const setPrevPage = () => {
    if (pageNum !== 0) {
      setPageNum(pageNum - 1);
    }
  };

  const onGridReady = (params) => {
    params.api.showLoadingOverlay();
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const handleGlobalSearch = (input) => {
    setSearchText(input);
  };

  const clearSearchBar = () => {
    setSearchText("");
  };

  const resetFilters = () => {
    setFacetFilters({});
    setSearchText("");
    setSortedColumn(null);
  };

  useEffect(() => {
    // Needed to delay search so users can type before triggering search
    const delayDebounceFn = setTimeout(() => {
      setPageNum(0);
      fetchData();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [facetFilters, searchText, pageSize]);

  // Fetch data for new page selected
  // No delay needed when switching pages no filter updates
  useEffect(() => {
    if (gridApi) gridApi.showLoadingOverlay();
    fetchData();
  }, [pageNum, gridApi]);

  // Update records when new sort is applied & go back to first page
  useEffect(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
      setPageNum(0);
      fetchData();
    }
  }, [sortedColumn]);

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

  /**
   * Creates a term query for a field for OpenSearch
   * @param {{ attrName, value }} input Necessary fields for term query
   * @returns OpenSearch term query based on inputs
   */
  const createTermQuery = ({ attrName, value }) => {
    return {
      term: {
        [attrName]: value,
      },
    };
  };

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
              [`${attrName}.keyword`]: {
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

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

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
      } else if (termAttributes.includes(attr)) {
        queries.push(createTermQuery({ attrName: attr, value: filters[attr] }));
      }
    }

    return queries;
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

  return (
    <>
      <Container
        maxWidth="xl"
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
            height: "auto",
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
                  Representative Protein
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Search..."
                  onChange={handleInputChange}
                  name="uniprot_id"
                  value={
                    facetFilters["uniprot_id"] ? facetFilters["uniprot_id"] : ""
                  }
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
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
                  onChange={handleInputChange}
                  name="protein_name"
                  value={
                    facetFilters["protein_name"]
                      ? facetFilters["protein_name"]
                      : ""
                  }
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
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
                  variant="outlined"
                  size="small"
                  label="Search..."
                  type="number"
                  onChange={handleInputChange}
                  name="number_of_members"
                  value={
                    facetFilters["number_of_members"]
                      ? facetFilters["number_of_members"]
                      : ""
                  }
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </Box>
        <Container
          maxWidth="false"
          sx={{ marginTop: "30px", marginLeft: "20px" }}
        >
          <Box sx={{ display: "flex" }}>
            <Box
              style={{
                display: "flex",
                // width: "100%",
                // maxWidth: "550px",
              }}
            >
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
                out of {Math.ceil(docCount / pageSize)}
              </Typography>
              <button
                onClick={setPrevPage}
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
                onClick={setNextPage}
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
              style={{ height: 1200 }}
            >
              <AgGridReact
                className="ag-cell-wrap-text"
                onSortChanged={onSortChanged}
                ref={gridRef}
                rowData={rowData}
                columnDefs={columns}
                defaultColDef={defColumnDefs}
                onGridReady={onGridReady}
                enableCellTextSelection={true}
                suppressDragLeaveHidesColumns
                suppressMovable
                loadingOverlayComponent={loadingOverlayComponent}
                components={{
                  LinkComponent,
                }}
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
};
export default ProteinClusterTable;
