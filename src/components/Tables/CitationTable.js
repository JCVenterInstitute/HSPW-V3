import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { AgGridReact } from "ag-grid-react";
import Typography from "@mui/material/Typography";
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
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Link } from "react-router-dom";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import LoadingOverlay from "@Components/Shared/LoadingOverlay";
import { ReactComponent as DownloadLogo } from "@Assets/table-icon/download.svg";
import "../Filter.css";

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
    <div>
      <Link
        rel="noopener noreferrer"
        to={`/citation/${props.value}`}
      >
        {props.value}
      </Link>
    </div>
  );
}

const customHeaders = { "Content-Type": "application/json" };

const CitationTable = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [gridApi, setGridApi] = useState();
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [columnApi, setColumnApi] = useState(null);

  const [facetFilters, setFacetFilters] = useState({
    PubDate: {
      start: dayjs("1957-08-17").format("YYYY/MM/DD"),
      end: dayjs(new Date()).format("YYYY/MM/DD"),
    },
  });

  const loadingOverlayComponent = useMemo(() => {
    return LoadingOverlay;
  }, []);

  const columns = [
    {
      headerName: "Citation",
      field: "PubMed_ID",
      cellRenderer: "LinkComponent",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      sortable: true,
      maxWidth: 145,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border", "citation-cell"],
    },
    {
      headerName: "Date of Publication",
      field: "PubDate",
      maxWidth: 205,
      sortable: true,
      wrapText: true,
      headerClass: ["header-border", "citation-header"],
      cellClass: ["table-border", "citation-cell"],
    },
    {
      headerName: "Title",
      field: "Title",
      minWidth: 600,
      wrapText: true,
      autoHeight: true,
      cellStyle: { wordBreak: "break-word" },
      sortable: true,
      headerClass: ["header-border"],
      cellClass: ["table-border", "citation-cell"],
    },
    {
      headerName: "Journal",
      field: "journal_title",
      wrapText: true,
      sortable: true,
      headerClass: ["header-border"],
      cellClass: ["table-border", "citation-cell"],
    },
  ];

  const defColumnDefs = {
    flex: 1,
    resizable: true,
    wrapHeaderText: true,
    autoHeight: true,
    autoHeaderHeight: true,
  };

  const stringAttributes = ["Title", "journal_title", "PubMed_ID"];
  const numberAttributes = ["PubDate"];

  const fetchCitationData = async () => {
    const filterQueries = queryBuilder(facetFilters);

    const data = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/citations/${pageSize}/${
        pageNum * pageSize
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
    ).then((res) => res.json());

    const { hits, total } = data.hits;
    const totalResultsCount = total.value;
    const tableData = hits.map((rec) => rec._source);

    setDocCount(totalResultsCount > 10000 ? 10000 : totalResultsCount); // pagination breaks for results after 10k so limit results

    setRowData(tableData);
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

  /**
   * Creates a range query for a number field for OpenSearch
   * @param {{ attrName, start, end }} input Necessary fields for range query
   * @returns OpenSearch range query based on inputs
   */
  const createRangeQuery = ({ attrName, start, end }) => {
    const rangeQuery = {
      bool: {
        filter: [
          {
            range: {
              [attrName]: {
                ...(start && { gte: start }),
                ...(end && { lte: end }),
              },
            },
          },
        ],
      },
    };

    return rangeQuery;
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

  /**
   * Returns a term query used by the Citation search
   * @param {{attrName, value}} Input Contains attribute name & value used for term query
   * @returns OpenSearch Term Query Filter
   */
  const createTermQuery = ({ attrName, value }) => {
    return {
      bool: {
        filter: [
          {
            term: {
              [attrName]: value,
            },
          },
        ],
      },
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
      // else if (exactMatches.includes(attr)) {
      // queries.push(createTermQuery({ attrName: attr, value: filters[attr] }));
      // }
    }

    return queries;
  };

  useEffect(() => {
    fetchCitationData();
  }, []);

  useEffect(() => {
    // Needed to delay search so users can type before triggering search
    const delayDebounceFn = setTimeout(() => {
      setPageNum(0);
      fetchCitationData();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [facetFilters, searchText]);

  useEffect(() => {
    // FIXME: Pagination work
    fetchCitationData();
  }, [pageSize, pageNum]);

  // Update records when new sort is applied & go back to first page
  useEffect(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
      setPageNum(0);
      fetchCitationData();
    }
  }, [sortedColumn]);

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

  /**
   * Handle Publications date range filter changes
   * @param {String} dateTime Either "start" or "end"
   * @param {date} dateValue Value for the start or end date
   */
  const handleDateChange = (dateTime, dateValue) => {
    dateValue = dayjs(dateValue).format("YYYY/MM/DD");
    const oldPubDateFilter = facetFilters["PubDate"];

    const currentFilters = {
      ...facetFilters,
      PubDate: {
        ...oldPubDateFilter,
        [dateTime]: dateValue,
      },
    };

    setFacetFilters(currentFilters);
  };

  // Set new page to next page
  const onBtNext = () => {
    if (pageNum < docCount / pageSize - 1) {
      setPageNum(pageNum + 1);
    }
  };

  // Set new page to prev page
  const onBtPrevious = () => {
    if (pageNum !== 0) {
      setPageNum(pageNum - 1);
    }
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

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };

  // Export current page as CSV file
  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  /**
   * Escape all special characters for input string
   * Special Characters include: [-[\]{}()*+?.,\\^$|#\s
   * @param {String} inputVal Non-escaped string value entered by user
   * @returns String where special characters are escaped with slashes
   */
  const escapeSpecialCharacters = (inputVal) => {
    return inputVal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  const clearSearch = () => {
    setSearchText("");
  };

  /**
   * Reset all search facets
   */
  const resetFilters = () => {
    setFacetFilters({
      PubDate: {
        start: dayjs("1957-08-17").format("YYYY/MM/DD"),
        end: dayjs(new Date()).format("YYYY/MM/DD"),
      },
    });
    setPageNum(0);
    setDocCount(0);
    setSearchText("");
    setPageSize(50);
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
            height: "auto",
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
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Citation ID
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
                  name="PubMed_ID"
                  onChange={handleInputChange}
                  value={
                    facetFilters["PubMed_ID"] ? facetFilters["PubMed_ID"] : ""
                  }
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Date of Publication
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ paddingX: "10px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Container components={["DatePicker", "DatePicker"]}>
                    <DatePicker
                      label="Start Date"
                      format="YYYY/MM/DD"
                      minDate={dayjs("1957-08-17")}
                      maxDate={dayjs(new Date())}
                      value={dayjs(facetFilters["PubDate"]["start"])}
                      onChange={(newValue) =>
                        handleDateChange("start", newValue)
                      }
                    />
                  </Container>
                  <br />
                  <Container
                    components={["DatePicker", "DatePicker"]}
                    sx={{ paddingX: "10px" }}
                  >
                    <DatePicker
                      label="End Date"
                      format="YYYY/MM/DD"
                      minDate={dayjs("1957-08-17")}
                      maxDate={dayjs(new Date())}
                      value={dayjs(dayjs(facetFilters["PubDate"]["end"]))}
                      onChange={(newValue) => handleDateChange("end", newValue)}
                    />
                  </Container>
                </LocalizationProvider>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Title
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
                  value={facetFilters["Title"] ? facetFilters["Title"] : ""}
                  name="Title"
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Journal
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
                  value={
                    facetFilters["journal_title"]
                      ? facetFilters["journal_title"]
                      : ""
                  }
                  name="journal_title"
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
                // maxWidth: "550px"
              }}
            >
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
                out of {Math.ceil(docCount / pageSize)}
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
              style={{ height: 2470 }}
            >
              <AgGridReact
                className="ag-cell-wrap-text"
                ref={gridRef}
                rowData={rowData}
                columnDefs={columns}
                defaultColDef={defColumnDefs}
                onGridReady={onGridReady}
                cacheQuickFilter={true}
                loadingOverlayComponent={loadingOverlayComponent}
                components={{
                  LinkComponent,
                }}
                enableCellTextSelection={true}
                onSortChanged={onSortChanged}
                paginationPageSize={pageSize}
              />
            </div>
            <div style={{ display: "flex" }}>
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

export default CitationTable;
