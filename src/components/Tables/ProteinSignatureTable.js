import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import List from "@mui/material/List";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import {
  Container,
  TextField,
  Box,
  MenuItem,
  Checkbox,
  InputAdornment,
  Button,
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
import { Link } from "react-router-dom";

import { ReactComponent as DownloadLogo } from "../../assets/table-icon/download.svg";
import CustomLoadingOverlay from "../CustomLoadingOverlay";
import "../Filter.css";
import "../Table.css";

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
        to={`/protein-signature/${props.value}`}
      >
        {props.value}
      </Link>
    </div>
  );
}

const columns = [
  {
    headerName: "InterPro ID",
    field: "InterPro ID",
    cellRenderer: "LinkComponent",
    maxWidth: 150,
    headerClass: ["header-border"],
    cellClass: ["table-border", "protein-signature-cell"],
  },
  {
    headerName: "Type",
    field: "Type",
    wrapText: true,
    maxWidth: 145,
    headerClass: ["header-border"],
    cellClass: ["table-border", "protein-signature-cell"],
  },
  {
    headerName: "Name",
    field: "Name",
    wrapText: true,
    autoHeight: true,
    cellStyle: { wordBreak: "break-word" },
    headerClass: ["header-border"],
    cellClass: ["table-border", "protein-signature-cell"],
  },
  {
    headerName: "# of Members",
    colId: "# of Members",
    field: "# of Members.length",
    wrapText: true,
    maxWidth: 205,
    headerClass: ["header-border"],
    cellClass: ["table-border", "protein-signature-cell"],
  },
];

const defColumnDefs = {
  flex: 1,
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  wrapText: true,
  autoHeaderHeight: true,
  autoHeight: true,
  headerStyle: { wordBreak: "break-word" },
  initialWidth: 200,
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

const stringAttributes = ["InterPro ID", "Type", "Name", "# of Members"];

const customHeaders = {
  "Content-Type": "application/json",
};

const typeValues = [
  "Protein Families",
  "Protein Domains",
  "Protein Repeats",
  "Protein Sites",
];

const ProteinSignatureTable = () => {
  const gridRef = useRef();
  const [gridApi, setGridApi] = useState();
  const [columnApi, setColumnApi] = useState(null);
  const [typeCount, setTypeCount] = useState([]);
  const [typeArr, setTypeArr] = useState([false, false, false, false]);
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [docCount, setDocCount] = useState(0);
  const [facetFilters, setFacetFilters] = useState({});
  const [searchText, setSearchText] = useState("");
  const [sortedColumn, setSortedColumn] = useState(null);

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

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
              [attrName !== "Name" ? `${attrName}.keyword` : `${attrName}`]: {
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
      }
    }

    return queries;
  };

  const fetchData = async () => {
    const apiPayload = {
      filters: queryBuilder(facetFilters),
      // Pass sort query if any sort is applied
      ...(sortedColumn && createSortQuery()),
      ...(searchText && { keyword: createGlobalSearchQuery() }),
    };

    const data = await fetch(
      `${
        process.env.REACT_APP_API_ENDPOINT
      }/api/protein-signature/${pageSize}/${pageNum * pageSize}`,
      {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(apiPayload),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const { hits, aggregations } = data;

        for (const aggr of Object.keys(aggregations)) {
          const displayedAggs = aggregations[aggr].buckets;

          if (aggr === "Type") {
            setTypeCount(displayedAggs);
          }
        }

        // Set number of total records returned
        setDocCount(hits.total.value);

        return hits.hits.map((rec) => rec._source);
      });

    setRowData(data);
  };

  // Export the current page data as CSV file
  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const handleGlobalSearch = (input) => {
    setSearchText(input);
  };

  /**
   * Create a proper sort query for whichever sort attribute is selected
   */
  const createSortQuery = () => {
    const { attribute, order } = sortedColumn;

    // Have to include .keyword when sorting string attributes
    const sortAttrKey = `${sortedColumn.attribute}${
      stringAttributes.includes(attribute)
        ? attribute !== "Name" // Name attribute is of type Keyword in OpenSearch
          ? ".keyword"
          : ""
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
   * Create a proper search query for whichever search string is entered into the search bar
   */
  const createGlobalSearchQuery = () => {
    const escapedInput = escapeSpecialCharacters(searchText);

    return {
      query_string: {
        query: `*${escapedInput}*`,
        fields: ["Type", "InterPro ID", "Name"],
        default_operator: "AND",
        analyze_wildcard: true,
      },
    };
  };

  const onGridReady = (params) => {
    params.api.showLoadingOverlay();
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    gridRef.current.api.sizeColumnsToFit();
  };

  const onBtNext = () => {
    if (pageNum < docCount / pageSize - 1) {
      setPageNum(pageNum + 1);
    }
  };

  const resetFilters = () => {
    setFacetFilters({});
    setSearchText("");
    setSortedColumn(null);
    setTypeArr([false, false, false, false]);
  };

  const onBtPrevious = () => {
    if (pageNum !== 0) {
      setPageNum(pageNum - 1);
    }
  };

  const clearSearch = () => {
    setSearchText("");
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update data when filters are updated
  useEffect(() => {
    // Needed to delay search so users can type before triggering search
    const delayDebounceFn = setTimeout(() => {
      setPageNum(0);
      fetchData();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [facetFilters, searchText, pageSize]);

  // Update records when new sort is applied & go back to first page
  useEffect(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
      setPageNum(0);
      fetchData();
    }
  }, [sortedColumn]);

  // Fetch data for new page selected
  // No delay needed when switching pages no filter updates
  useEffect(() => {
    if (gridApi) gridApi.showLoadingOverlay();
    fetchData();
  }, [pageNum, gridApi]);

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
            width: "270px",
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
                  InterPro ID
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
                  name="InterPro ID"
                  onChange={handleInputChange}
                  value={
                    facetFilters["InterPro ID"]
                      ? facetFilters["InterPro ID"]
                      : ""
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
                  Type
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <List
                  component="div"
                  disablePadding
                  sx={{ border: "1px groove" }}
                >
                  {typeCount.map((child, i) =>
                    child.key !== "?" ? (
                      <FormGroup
                        key={`type-${i}`}
                        sx={{ ml: "8px", mt: "10px" }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                typeArr[typeValues.indexOf(child.key.trim())]
                              }
                              name={child.key}
                              onClick={(e) => {
                                const { checked, name } = e.target;

                                if (!checked) {
                                  delete facetFilters["Type"];
                                }

                                const updatedType = [...typeArr];
                                updatedType[typeValues.indexOf(name)] = checked;

                                setTypeArr(updatedType);

                                setFacetFilters({
                                  ...facetFilters,
                                  ...(checked && {
                                    ["Type"]: name,
                                  }), // Only pass when checked
                                });
                              }}
                            />
                          }
                          label={child.key + " (" + child.doc_count + ")"}
                        />
                      </FormGroup>
                    ) : null
                  )}
                </List>
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
                  Name
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
                  name="Name"
                  value={facetFilters["Name"] ? facetFilters["Name"] : ""}
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
                suppressMovable
                loadingOverlayComponent={loadingOverlayComponent}
                onSortChanged={onSortChanged}
                components={{
                  LinkComponent,
                }}
                enableCellTextSelection={true}
                paginationPageSize={50}
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

export default ProteinSignatureTable;
