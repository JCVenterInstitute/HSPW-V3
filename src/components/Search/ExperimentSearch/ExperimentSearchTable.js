import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Container,
  TextField,
  Box,
  MenuItem,
  Button,
  Checkbox,
  InputAdornment,
  IconButton,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import axios from "axios";
import CustomLoadingOverlay from "../../CustomLoadingOverlay";
import ClearIcon from "@mui/icons-material/Clear";

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
        href={`/experiment-search/${props.value}`}
      >
        {props.value}
      </a>
    </div>
  );
}

const ExperimentSearchTable = () => {
  const [gridApi, setGridApi] = useState();
  const [expanded, setExpanded] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [totalPageNumber, setTotalPageNumber] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [rowData, setRowData] = useState();
  const [filterKeyword, setFilterKeyword] = useState("");
  const [sampleIdFilter, setSampleIdFilter] = useState("");
  const [sampleTitleFilter, setSampleTitleFilter] = useState("");
  const [tissueTypeFilter, setTissueTypeFilter] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("");
  const [diseaseFilter, setDiseaseFilter] = useState("");
  const [tissueTypeFilterList, setTissueTypeFilterList] = useState([]);
  const [institutionFilterList, setInstitutionFilterList] = useState([]);
  const [diseaseFilterList, setDiseaseFilterList] = useState([]);
  const [lowerLimit, setLowerLimit] = useState(0);
  const [upperLimit, setUpperLimit] = useState(20000);

  useEffect(() => {
    // Apply the filter whenever the limits change
    if (gridApi) {
      handleProteinCountFilter(lowerLimit, upperLimit);
    }
  }, [lowerLimit, upperLimit]);

  const handleProteinCountFilter = (lowerLimit, upperLimit) => {
    let filterModel = gridApi.getFilterModel();

    // Assuming the column name for protein count is "Protein Count"
    filterModel.experiment_protein_count = {
      type: "inRange",
      filter: lowerLimit,
      filterTo: upperLimit,
    };

    gridApi.setFilterModel(filterModel);
    setTotalPageNumber(gridApi.paginationGetTotalPages());
  };

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const onGridReady = useCallback((params) => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/api/study`)
      .then((res) => res.data)
      .then((data) => {
        setTissueTypeFilterList([...data.aggregations.sample_type.buckets]);
        setInstitutionFilterList([...data.aggregations.institution.buckets]);
        setDiseaseFilterList([...data.aggregations.condition_type.buckets]);

        return data.hits.hits.map((item) => {
          return {
            ...item._source,
            experiment_protein_count: Number(
              item._source.experiment_protein_count
            ),
          };
        });
      })
      .then((sourceData) => {
        setRowData(sourceData);
        setTotalRecordCount(sourceData.length);
        return sourceData.length;
      })
      .then((totalCount) => {
        setTotalPageNumber(Math.ceil(totalCount / recordsPerPage));
        setGridApi(params.api);
      });
  }, []);

  // Previous Button Click Handler
  const onPrevPage = () => {
    if (pageNumber > 1) {
      const newPageNumber = pageNumber - 1;
      setPageNumber(newPageNumber);
      if (gridApi) {
        gridApi.paginationGoToPage(newPageNumber - 1);
      }
    }
  };

  // Next Button Click Handler
  const onNextPage = () => {
    if (pageNumber < totalPageNumber) {
      const newPageNumber = pageNumber + 1;
      setPageNumber(newPageNumber);
      if (gridApi) {
        gridApi.paginationGoToPage(newPageNumber - 1);
      }
    }
  };

  const filterList = [
    "Experiment ID",
    "Experiment Title",
    "Tissue Type",
    "Institution",
    "Condition Type",
    "Protein Count",
  ];

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

  const columns = [
    {
      headerName: "Experiment ID",
      field: "experiment_id_key",
      cellRenderer: "LinkComponent",
      wrapText: true,
      minWidth: 220,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
      sort: "asc",
    },
    {
      headerName: "Experiment Title",
      field: "experiment_title",
      wrapText: true,
      minWidth: 440,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "Tissue Type",
      field: "sample_type",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "Institution",
      field: "institution",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "Condition Type",
      field: "condition_type",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "Protein Count",
      field: "experiment_protein_count",
      wrapText: true,
      minWidth: 230,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
      filter: "agNumberColumnFilter",
    },
  ];

  const defaultColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    minWidth: 170,
    autoHeight: true,
    filter: "agTextColumnFilter",
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded((prevExpanded) => {
      if (isExpanded) {
        return [...prevExpanded, panel];
      } else {
        return prevExpanded.filter((exp) => exp !== panel);
      }
    });
  };

  const handleFilter = (searchKeyword) => {
    gridApi.setQuickFilter(searchKeyword);
    setTotalPageNumber(gridApi.paginationGetTotalPages());
  };

  const handleSideFilter = (searchKeyword, columnName) => {
    let filterModel = gridApi.getFilterModel();

    if (columnName === "Experiment ID") {
      setSampleIdFilter(searchKeyword);
      filterModel.experiment_id_key = {
        type: "contains",
        filter: searchKeyword,
      };
    } else if (columnName === "Experiment Title") {
      setSampleTitleFilter(searchKeyword);
      filterModel.experiment_title = {
        type: "contains",
        filter: searchKeyword,
      };
    } else if (columnName === "Tissue Type") {
      filterModel.sample_type = {
        type: "contains",
        filter: searchKeyword,
      };
    } else if (columnName === "Institution") {
      filterModel.institution = {
        type: "contains",
        filter: searchKeyword,
      };
    } else if (columnName === "Condition Type") {
      filterModel.condition_type = {
        type: "contains",
        filter: searchKeyword,
      };
    }

    gridApi.setFilterModel(filterModel);
    setTotalPageNumber(gridApi.paginationGetTotalPages());
  };

  const handleResetFilter = () => {
    gridApi.setQuickFilter("");
    gridApi.setFilterModel({});
    setTotalPageNumber(gridApi.paginationGetTotalPages());
    setSampleIdFilter("");
    setSampleTitleFilter("");
    setTissueTypeFilter("");
    setInstitutionFilter("");
    setDiseaseFilter("");
    setLowerLimit(0);
    setUpperLimit(20000);
    setFilterKeyword("");
  };

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
              marginTop: "10px",
              marginBottom: "30px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
            }}
            onClick={handleResetFilter}
          >
            Reset Filter
          </Button>
          {filterList.map((filter, index) => {
            return (
              <Accordion
                key={filter}
                expanded={expanded.includes(filter)}
                onChange={handleChange(filter)}
              >
                <AccordionSummary
                  aria-controls={`${filter}-content`}
                  id={`${filter}-header`}
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
                    {filter}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {filter === "Experiment ID" ||
                  filter === "Experiment Title" ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      label="Search..."
                      InputProps={{
                        style: {
                          borderRadius: "16px",
                        },
                      }}
                      value={
                        filter === "Experiment ID"
                          ? sampleIdFilter
                          : sampleTitleFilter
                      }
                      onChange={(e) => handleSideFilter(e.target.value, filter)}
                    />
                  ) : filter === "Tissue Type" ? (
                    <FormGroup>
                      {tissueTypeFilterList.map((option, subIndex) => (
                        <FormControlLabel
                          key={`${option}-${index}-${subIndex}`}
                          control={
                            <Checkbox
                              checked={tissueTypeFilter === option.key}
                              onChange={() => {
                                if (tissueTypeFilter === option.key) {
                                  setTissueTypeFilter("");
                                  handleSideFilter("", filter);
                                } else {
                                  setTissueTypeFilter(option.key);
                                  handleSideFilter(option.key, filter);
                                }
                              }}
                            />
                          }
                          label={`${option.key} (${option.doc_count})`}
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "16px", // Set your desired font size here
                            },
                          }}
                        />
                      ))}
                    </FormGroup>
                  ) : filter === "Institution" ? (
                    <FormGroup>
                      {institutionFilterList.map((option, subIndex) => (
                        <FormControlLabel
                          key={`${option}-${index}-${subIndex}`}
                          control={
                            <Checkbox
                              checked={institutionFilter === option.key}
                              onChange={() => {
                                if (institutionFilter === option.key) {
                                  setInstitutionFilter("");
                                  handleSideFilter("", filter);
                                } else {
                                  setInstitutionFilter(option.key);
                                  handleSideFilter(option.key, filter);
                                }
                              }}
                            />
                          }
                          label={`${option.key} (${option.doc_count})`}
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "16px", // Set your desired font size here
                            },
                          }}
                        />
                      ))}
                    </FormGroup>
                  ) : filter === "Condition Type" ? (
                    <FormGroup>
                      {diseaseFilterList.map((option, subIndex) => (
                        <FormControlLabel
                          key={`${option}-${index}-${subIndex}`}
                          control={
                            <Checkbox
                              checked={diseaseFilter === option.key}
                              onChange={() => {
                                if (diseaseFilter === option.key) {
                                  setDiseaseFilter("");
                                  handleSideFilter("", filter);
                                } else {
                                  setDiseaseFilter(option.key);
                                  handleSideFilter(option.key, filter);
                                }
                              }}
                            />
                          }
                          label={`${option.key} (${option.doc_count})`}
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "16px", // Set your desired font size here
                            },
                          }}
                        />
                      ))}
                    </FormGroup>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        size="small"
                        value={lowerLimit}
                        onChange={(e) => setLowerLimit(e.target.value)}
                        InputProps={{
                          style: {
                            borderRadius: "16px",
                            width: "80px",
                          },
                        }}
                      />
                      <span style={{ margin: "0 8px" }}>to</span>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={upperLimit}
                        onChange={(e) => setUpperLimit(e.target.value)}
                        InputProps={{
                          style: {
                            borderRadius: "16px",
                            width: "80px",
                          },
                        }}
                      />
                    </div>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
        <Container
          maxWidth="xl"
          sx={{ margin: "30px 0 30px 20px" }}
        >
          <Box sx={{ display: "flex" }}>
            <Box style={{ display: "flex", width: "100%", maxWidth: "550px" }}>
              <TextField
                variant="outlined"
                size="small"
                label="Search..."
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleFilter(e.target.value);
                  }
                }}
                InputProps={{
                  style: {
                    height: "44px",
                    width: "500px",
                    borderRadius: "16px 0 0 16px",
                  },
                  endAdornment: filterKeyword && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={() => {
                          handleFilter("");
                          setFilterKeyword("");
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
                onClick={() => handleFilter(filterKeyword)}
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
                value={recordsPerPage}
                onChange={(event) => {
                  setRecordsPerPage(event.target.value);
                  setTotalPageNumber(
                    Math.ceil(totalRecordCount / event.target.value)
                  );
                  gridApi.paginationSetPageSize(Number(event.target.value));
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
              <TextField
                select
                size="small"
                InputProps={{
                  style: {
                    borderRadius: "10px",
                  },
                }}
                value={pageNumber}
                sx={{ marginLeft: "10px", marginRight: "10px" }}
                onChange={(event) => {
                  setPageNumber(event.target.value);
                  gridApi.paginationGoToPage(event.target.value - 1);
                }}
              >
                {Array.from({ length: totalPageNumber }, (_, index) => (
                  <MenuItem
                    key={index + 1}
                    value={index + 1}
                  >
                    {index + 1}
                  </MenuItem>
                ))}
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
                out of {totalPageNumber}
              </Typography>
              <button
                onClick={onPrevPage}
                disabled={pageNumber === 1}
                style={{
                  color: pageNumber === 1 ? "#D3D3D3" : "#F6921E",
                  background: "white",
                  fontSize: "20px",
                  border: "none",
                  cursor: pageNumber === 1 ? "default" : "pointer",
                  transition: pageNumber === 1 ? "none" : "background 0.3s",
                  borderRadius: "5px",
                  marginRight: "15px",
                  pointerEvents: pageNumber === 1 ? "none" : "auto",
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
                onClick={onNextPage}
                disabled={pageNumber === totalPageNumber}
                style={{
                  color: pageNumber === totalPageNumber ? "#D3D3D3" : "#F6921E",
                  background: "white",
                  fontSize: "20px",
                  border: "none",
                  cursor:
                    pageNumber === totalPageNumber ? "default" : "pointer",
                  transition:
                    pageNumber === totalPageNumber ? "none" : "background 0.3s",
                  borderRadius: "5px",
                  pointerEvents:
                    pageNumber === totalPageNumber ? "none" : "auto",
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
              id="differential"
              className="ag-theme-material ag-cell-wrap-text ag-theme-alpine differential-expression"
              style={{ height: 700 }}
            >
              <AgGridReact
                className="ag-cell-wrap-text"
                rowData={rowData}
                columnDefs={columns}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                enableCellTextSelection={true}
                pagination={true}
                paginationPageSize={recordsPerPage}
                suppressPaginationPanel={true}
                rowSelection={"multiple"}
                rowMultiSelectWithClick={true}
                loadingOverlayComponent={loadingOverlayComponent}
                suppressScrollOnNewData={true}
                components={{
                  LinkComponent,
                }}
              ></AgGridReact>
            </div>
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default ExperimentSearchTable;