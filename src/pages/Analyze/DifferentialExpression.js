import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import main_feature from "../../components/hero.jpeg";
import {
  Container,
  TextField,
  Box,
  MenuItem,
  Grid,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
import CustomHeaderGroup from "./CustomHeaderGroup";
import CustomLoadingOverlay from "./CustomLoadingOverlay";
import CustomNoRowsOverlay from "./CustomNoRowsOverlay";
import CircleCheckedFilled from "@mui/icons-material/CheckCircle";
import CircleUnchecked from "@mui/icons-material/RadioButtonUnchecked";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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

const DifferentialExpression = () => {
  const gridRef = useRef();
  const [gridApi, setGridApi] = useState();
  const [gridApiGroupA, setGridApiGroupA] = useState();
  const [gridApiGroupB, setGridApiGroupB] = useState();
  const [expanded, setExpanded] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [totalPageNumber, setTotalPageNumber] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [rowData, setRowData] = useState();
  const [groupARowData, setGroupARowData] = useState([]);
  const [groupBRowData, setGroupBRowData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [logNorm, setLogNorm] = useState("NULL");
  const [foldChangeThreshold, setFoldChangeThreshold] = useState("2.0");
  const [pValueThreshold, setPValueThreshold] = useState("0.05");
  const [pValueType, setPValueType] = useState("Raw");

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const noRowsOverlayComponent = useMemo(() => {
    return CustomNoRowsOverlay;
  }, []);

  const onGridReady = useCallback((params) => {
    axios
      .get("http://localhost:8000/api/study")
      .then((res) => res.data)
      .then((data) => data.map((item) => item._source))
      .then((sourceData) => {
        setRowData(sourceData);
        setTotalRecordCount(sourceData.length);
      })
      .then(() => {
        setTotalPageNumber(params.api.paginationProxy.totalPages);
        setGridApi(params.api);
      });
  }, []);

  const onGroupAGridReady = useCallback((params) => {
    setGridApiGroupA(params.api);
  }, []);

  const onGroupBGridReady = useCallback((params) => {
    setGridApiGroupB(params.api);
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
    "Sample Title",
    "Tissue Type",
    "Institution",
    "Disease",
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
      headerName: "Sample ID",
      field: "experiment_id_key",
      wrapText: true,
      minWidth: 230,
      headerClass: ["header-border"],
      checkboxSelection: true,
      headerCheckboxSelection: true,
      sort: "asc",
    },
    {
      headerName: "Sample Title",
      field: "experiment_title",
      wrapText: true,
      minWidth: 500,
      headerClass: ["header-border"],
    },
    {
      headerName: "Tissue Type",
      field: "sample_type",
      wrapText: true,
      headerClass: ["header-border"],
    },
    {
      headerName: "Institution",
      field: "institution",
      wrapText: true,
      headerClass: ["header-border"],
    },
    {
      headerName: "Disease",
      field: "condition_type",
      wrapText: true,
      headerClass: ["header-border"],
    },
    {
      headerName: "Protein Count",
      field: "experiment_protein_count",
      wrapText: true,
      headerClass: ["header-border"],
    },
  ];

  const groupAColDef = [
    {
      headerName: "Group A",
      headerGroupComponent: CustomHeaderGroup,
      headerClass: ["header-border"],
      children: [
        {
          headerName: "Sample ID",
          field: "experiment_id_key",
          minWidth: "220",
          headerClass: ["header-border"],
          checkboxSelection: true,
          headerCheckboxSelection: true,
          sort: "asc",
        },
        {
          headerName: "Sample Title",
          field: "experiment_title",
          minWidth: "450",
          headerClass: ["header-border"],
        },
      ],
      wrapText: true,
      cellStyle: { textAlign: "center" },
    },
  ];

  const groupBColDef = [
    {
      headerName: "Group B",
      headerGroupComponent: CustomHeaderGroup,
      headerClass: ["header-border"],
      children: [
        {
          headerName: "Sample ID",
          field: "experiment_id_key",
          minWidth: "220",
          headerClass: ["header-border"],
          checkboxSelection: true,
          headerCheckboxSelection: true,
          sort: "asc",
        },
        {
          headerName: "Sample Title",
          field: "experiment_title",
          minWidth: "450",
          headerClass: ["header-border"],
        },
      ],
      wrapText: true,
      cellStyle: { textAlign: "center" },
    },
  ];

  const defaultColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    minWidth: 150,
    filter: "text",
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleAddGroupA = () => {
    const selectedRows = gridApi.getSelectedRows();
    console.log("To Group A: ", selectedRows);

    const existingIds = new Set(
      groupARowData.map((row) => row.experiment_id_key)
    );

    // Filter out selected rows that are already present in Group A
    const newRowsToAdd = selectedRows.filter(
      (row) => !existingIds.has(row.experiment_id_key)
    );

    setGroupARowData([...groupARowData, ...newRowsToAdd]);
  };

  const handleDeleteGroupA = () => {
    const selectedRows = gridApiGroupA.getSelectedRows();
    console.log("Out Group A: ", selectedRows);

    const selectedIdSet = new Set(
      selectedRows.map((row) => row.experiment_id_key)
    );

    const newGroupRowData = groupARowData.filter(
      (row) => !selectedIdSet.has(row.experiment_id_key)
    );

    setGroupARowData(newGroupRowData);
  };

  const handleAddGroupB = () => {
    const selectedRows = gridApi.getSelectedRows();
    console.log("To Group B: ", selectedRows);

    const existingIds = new Set(
      groupBRowData.map((row) => row.experiment_id_key)
    );

    // Filter out selected rows that are already present in Group A
    const newRowsToAdd = selectedRows.filter(
      (row) => !existingIds.has(row.experiment_id_key)
    );

    setGroupBRowData([...groupBRowData, ...newRowsToAdd]);
  };

  const handleDeleteGroupB = () => {
    const selectedRows = gridApiGroupB.getSelectedRows();
    console.log("Out Group B: ", selectedRows);

    const selectedIdSet = new Set(
      selectedRows.map((row) => row.experiment_id_key)
    );

    const newGroupRowData = groupBRowData.filter(
      (row) => !selectedIdSet.has(row.experiment_id_key)
    );

    setGroupBRowData(newGroupRowData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
      };
      reader.readAsText(file); // Read the file as text
    }
  };

  const handleAnalyze = async () => {
    await axios.post(
      "http://localhost:8000/api/differential-expression/analyze",
      {
        groupAData: groupARowData,
        groupBData: groupBRowData,
        logNorm,
        foldChangeThreshold,
        pValueThreshold,
        pValueType,
      }
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
          Differential Expression Analysis
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
          Please choose experiments from the following table for differential
          expression analysis. This analysis will identify proteins with
          differential abundance between experiments in Groups A and B based on
          their normalized spectral counts.
        </p>
      </div>
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
            width: "250px",
            height: "2000px",
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
          {filterList.map((filter) => {
            return (
              <Accordion
                expanded={expanded === `${filter}`}
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
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                    blandit leo lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
        <Container maxWidth="xl" sx={{ marginTop: "30px" }}>
          <Box sx={{ display: "flex" }}>
            <Box style={{ display: "flex", width: "100%", maxWidth: "550px" }}>
              <TextField
                variant="outlined"
                size="small"
                label="Search..."
                InputProps={{
                  style: {
                    height: "44px",
                    width: "500px",
                    borderRadius: "16px 0 0 16px",
                  },
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
                value={pageNumber}
                sx={{ marginLeft: "10px", marginRight: "10px" }}
                onChange={(event) => {
                  setPageNumber(event.target.value);
                  gridApi.paginationGoToPage(event.target.value - 1);
                }}
              >
                {Array.from({ length: totalPageNumber }, (_, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
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
              className="ag-theme-material ag-cell-wrap-text ag-theme-alpine differential-expression"
              style={{ height: 620 }}
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
                noRowsOverlayComponent={noRowsOverlayComponent}
                loadingOverlayComponent={loadingOverlayComponent}
                suppressScrollOnNewData={true}
              ></AgGridReact>
            </div>
          </Box>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Box sx={{ m: 4, justifyContent: "center", display: "center" }}>
                <Stack direction="row" spacing={5}>
                  <Button variant="contained" onClick={handleAddGroupA}>
                    Add
                  </Button>
                  <Button variant="outlined" onClick={handleDeleteGroupA}>
                    Delete
                  </Button>
                </Stack>
              </Box>
              <div
                className="ag-theme-material ag-cell-wrap-text ag-theme-alpine differential-expression"
                style={{
                  height: 400,
                  border: "2px solid #3592E4",
                  borderRadius: "18px 18px 0 0",
                }}
              >
                <AgGridReact
                  className="ag-cell-wrap-text"
                  rowData={groupARowData}
                  columnDefs={groupAColDef}
                  defaultColDef={defaultColDef}
                  onGridReady={onGroupAGridReady}
                  enableCellTextSelection={true}
                  suppressPaginationPanel={true}
                  rowSelection={"multiple"}
                  rowMultiSelectWithClick={true}
                  suppressScrollOnNewData={true}
                ></AgGridReact>
              </div>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ m: 4, justifyContent: "center", display: "center" }}>
                <Stack direction="row" spacing={5}>
                  <Button variant="contained" onClick={handleAddGroupB}>
                    Add
                  </Button>
                  <Button variant="outlined" onClick={handleDeleteGroupB}>
                    Delete
                  </Button>
                </Stack>
              </Box>
              <div
                className="ag-theme-material ag-cell-wrap-text ag-theme-alpine differential-expression"
                style={{
                  height: 400,
                  border: "2px solid #3592E4",
                  borderRadius: "18px 18px 0 0",
                }}
              >
                <AgGridReact
                  className="ag-cell-wrap-text"
                  rowData={groupBRowData}
                  columnDefs={groupBColDef}
                  defaultColDef={defaultColDef}
                  onGridReady={onGroupBGridReady}
                  enableCellTextSelection={true}
                  suppressPaginationPanel={true}
                  rowSelection={"multiple"}
                  rowMultiSelectWithClick={true}
                  suppressScrollOnNewData={true}
                ></AgGridReact>
              </div>
            </Grid>
          </Grid>
          <div
            style={{
              height: "3px",
              background: "linear-gradient(to right, #1463B9, #ffffff)",
              margin: "40px 0",
            }}
          ></div>
          <Box>
            <Typography
              sx={{
                fontFamily: "Montserrat",
                color: "#1463B9",
              }}
            >
              OR
            </Typography>
            <Typography
              sx={{
                fontFamily: "Montserrat",
                color: "#1463B9",
              }}
            >
              PLAIN TEXT FILE (.TxT OR .CSV):
            </Typography>
            <Box
              sx={{
                backgroundColor: "#f9f8f7",
                height: "84px",
                mt: "20px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                padding: "0 16px",
              }}
            >
              <Typography
                display="inline"
                sx={{
                  fontFamily: "Lato",
                  color: "#464646",
                  mr: 2,
                }}
              >
                SELECT FILE:
              </Typography>
              <Button
                component="label"
                variant="contained"
                sx={{ mr: 6 }}
                startIcon={<CloudUploadIcon />}
                onChange={handleFileChange}
              >
                Upload file
                <VisuallyHiddenInput type="file" />
              </Button>
              <Typography
                display="inline"
                sx={{
                  fontFamily: "Lato",
                  color: "#464646",
                  mr: 2,
                }}
              >
                TEMPLATE:
              </Typography>
              <Button variant="contained" sx={{ mr: 6 }}>
                DOWNLOAD
              </Button>
              <Typography
                display="inline"
                sx={{
                  fontFamily: "Lato",
                  color: "#464646",
                  mr: 2,
                }}
              >
                FILE NAME:
              </Typography>
              <Typography
                display="inline"
                sx={{
                  fontFamily: "Lato",
                  color: "#464646",
                  mr: 2,
                  fontStyle: "italic",
                }}
              >
                {fileName}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  marginLeft: "auto",
                  marginRight: 5,
                }}
              >
                UPLOAD
              </Button>
            </Box>
          </Box>
          <div
            style={{
              height: "3px",
              background: "linear-gradient(to right, #1463B9, #ffffff)",
              margin: "40px 0",
            }}
          ></div>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: "Lato" }}>
              ANALYSIS OPTIONS
            </Typography>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#1463B9",
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  mt: 3,
                }}
              >
                Log Transformation:
              </Typography>
              <Checkbox
                icon={<CircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                checked={logNorm === "NULL"}
                onChange={() => setLogNorm("NULL")}
                sx={{ paddingLeft: 0 }}
              />
              <Typography
                display="inline"
                variant="body2"
                sx={{ fontFamily: "Lato", color: "#464646", mr: 2 }}
              >
                NULL
              </Typography>
              <Checkbox
                icon={<CircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                checked={logNorm === "LogNorm"}
                onChange={() => setLogNorm("LogNorm")}
              />
              <Typography
                display="inline"
                variant="body2"
                sx={{ fontFamily: "Lato", color: "#464646" }}
              >
                Log Normalization
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#1463B9",
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  mt: 3,
                }}
              >
                Fold change threshold:
              </Typography>
              <TextField
                size="small"
                value={foldChangeThreshold}
                onChange={(event) => {
                  setFoldChangeThreshold(event.target.value);
                }}
                sx={{ width: "80px" }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#1463B9",
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  mt: 3,
                }}
              >
                P-value threshold:
              </Typography>
              <TextField
                size="small"
                value={pValueThreshold}
                onChange={(event) => {
                  setPValueThreshold(event.target.value);
                }}
                sx={{ width: "80px", mr: 3 }}
              />
              <Checkbox
                icon={<CircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                checked={pValueType === "Raw"}
                onChange={() => setPValueType("Raw")}
                sx={{ paddingLeft: 0 }}
              />
              <Typography
                display="inline"
                variant="body2"
                sx={{ fontFamily: "Lato", color: "#464646", mr: 2 }}
              >
                Raw
              </Typography>
              <Checkbox
                icon={<CircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                checked={pValueType === "fdr"}
                onChange={() => setPValueType("fdr")}
              />
              <Typography
                display="inline"
                variant="body2"
                sx={{ fontFamily: "Lato", color: "#464646" }}
              >
                FDR
              </Typography>
            </Box>
            <Button variant="contained" sx={{ mt: 5 }} onClick={handleAnalyze}>
              ANALYZE
            </Button>
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default DifferentialExpression;
