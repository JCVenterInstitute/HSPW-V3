import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  Container,
  TextField,
  Box,
  MenuItem,
  Grid,
  Button,
  Stack,
  Checkbox,
  InputAdornment,
  IconButton,
  FormGroup,
  FormControlLabel,
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
import axios from "axios";
import CircleCheckedFilled from "@mui/icons-material/CheckCircle";
import CircleUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import Swal from "sweetalert2";
import ClearIcon from "@mui/icons-material/Clear";
import Papa from "papaparse";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import CustomLoadingOverlay from "./CustomLoadingOverlay";
import PageHeader from "../../components/PageHeader";

const toExcelColumn = (colIndex) => {
  let column = "";
  let dividend = colIndex;
  let modulo;

  while (dividend > 0) {
    modulo = (dividend - 1) % 26;
    column = String.fromCharCode(65 + modulo) + column;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return column;
};

const validateFile = (fileContent) => {
  let isValid = true;
  let errorMessage = "";

  Papa.parse(fileContent, {
    complete: (result) => {
      const data = result.data;

      // Check headers
      if (data[0][0] !== "Identifiers" || data[0][1] !== "Group") {
        isValid = false;
        errorMessage =
          'The first row must have "Identifiers" in column 1 and "Group" in column 2';
        return;
      }

      // Check if all other values except for row 1 and columns 1 & 2 are numeric and not blank
      for (let i = 1; i < data.length; i++) {
        for (let j = 2; j < data[i].length; j++) {
          const cellValue = data[i][j];
          if (
            cellValue === null ||
            cellValue === undefined ||
            cellValue.toString().trim() === ""
          ) {
            isValid = false;
            const excelColumn = toExcelColumn(j + 1); // +1 because columns are 1-indexed in Excel
            errorMessage = `Blank cell found at row ${
              i + 1
            }, column ${excelColumn}`;
            return;
          }

          if (!cellValue.toString().match(/^-?\d*(\.\d+)?$/)) {
            isValid = false;
            const excelColumn = toExcelColumn(j + 1); // +1 because columns are 1-indexed in Excel
            errorMessage = `Non-numeric value found at row ${
              i + 1
            }, column ${excelColumn}`;
            return;
          }
        }
      }
    },
    skipEmptyLines: false, // Set to false to check for blank lines
  });

  return { isValid, errorMessage };
};

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

const DifferentialExpression = () => {
  const gridRef = useRef();
  const [gridApi, setGridApi] = useState();
  const [gridApiGroupA, setGridApiGroupA] = useState();
  const [gridApiGroupB, setGridApiGroupB] = useState();
  const [expanded, setExpanded] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [totalPageNumber, setTotalPageNumber] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [rowData, setRowData] = useState();
  const [groupARowData, setGroupARowData] = useState([]);
  const [groupBRowData, setGroupBRowData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [logNorm, setLogNorm] = useState("NULL");
  const [
    numberOfDifferentiallyAbundantProteinsInHeatmap,
    setNumberOfDifferentiallyAbundantProteinsInHeatmap,
  ] = useState("25");
  const [foldChangeThreshold, setFoldChangeThreshold] = useState("2.0");
  const [pValueThreshold, setPValueThreshold] = useState("0.05");
  const [pValueType, setPValueType] = useState("Raw");
  const [parametricTest, setParametricTest] = useState("F");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [sampleIdFilter, setSampleIdFilter] = useState("");
  const [sampleTitleFilter, setSampleTitleFilter] = useState("");
  const [tissueTypeFilter, setTissueTypeFilter] = useState([]);
  const [institutionFilter, setInstitutionFilter] = useState([]);
  const [diseaseFilter, setDiseaseFilter] = useState([]);
  const [tissueTypeFilterList, setTissueTypeFilterList] = useState([]);
  const [institutionFilterList, setInstitutionFilterList] = useState([]);
  const [diseaseFilterList, setDiseaseFilterList] = useState([]);
  const [lowerLimit, setLowerLimit] = useState(0);
  const [upperLimit, setUpperLimit] = useState(20000);
  const [inputData, setInputData] = useState("");
  const [fileIsValid, setFileIsValid] = useState(true);

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
    const totalPages = gridApi.paginationGetTotalPages();
    setTotalPageNumber(totalPages);
    if (pageNumber > totalPages) {
      setPageNumber(1);
    }
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
        const totalPages = Math.ceil(totalCount / recordsPerPage);
        setTotalPageNumber(totalPages);
        if (pageNumber > totalPages) {
          setPageNumber(1);
        }
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
    "Sample ID",
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
      minWidth: 200,
      cellStyle: { wordBreak: "break-word" },
      headerClass: ["header-border", "differential-expression-header"],
      cellClass: ["differential-expression-cell"],
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      sort: "asc",
    },
    {
      headerName: "Sample Title",
      field: "experiment_title",
      wrapText: true,
      minWidth: 300,
      headerClass: ["header-border", "differential-expression-header"],
      cellClass: ["differential-expression-cell"],
    },
    {
      headerName: "Tissue Type",
      field: "sample_type",
      wrapText: true,
      headerClass: ["header-border", "differential-expression-header"],
      cellClass: ["differential-expression-cell"],
    },
    {
      headerName: "Institution",
      field: "institution",
      wrapText: true,
      headerClass: ["header-border", "differential-expression-header"],
      cellClass: ["differential-expression-cell"],
    },
    {
      headerName: "Disease",
      field: "condition_type",
      wrapText: true,
      headerClass: ["header-border", "differential-expression-header"],
      cellClass: ["differential-expression-cell"],
    },
    {
      headerName: "Protein Count",
      field: "experiment_protein_count",
      wrapText: true,
      minWidth: 230,
      headerClass: ["header-border", "differential-expression-header"],
      cellClass: ["differential-expression-cell"],
      filter: "agNumberColumnFilter",
    },
  ];

  const groupAColDef = [
    {
      headerName: "Group A",
      headerClass: ["header-border", "differential-expression-header"],
      children: [
        {
          headerName: "Sample ID",
          field: "experiment_id_key",
          minWidth: 200,
          cellStyle: { wordBreak: "break-word" },
          headerClass: ["header-border", "differential-expression-header"],
          cellClass: ["differential-expression-cell"],
          checkboxSelection: true,
          headerCheckboxSelection: true,
          sort: "asc",
        },
        {
          headerName: "Sample Title",
          field: "experiment_title",
          minWidth: 370,
          headerClass: ["header-border", "differential-expression-header"],
          cellClass: ["differential-expression-cell"],
        },
      ],
      wrapText: true,
      cellStyle: { textAlign: "center" },
    },
  ];

  const groupBColDef = [
    {
      headerName: "Group B",
      headerClass: ["header-border", "differential-expression-header"],
      children: [
        {
          headerName: "Sample ID",
          field: "experiment_id_key",
          minWidth: 200,
          cellStyle: { wordBreak: "break-word" },
          headerClass: ["header-border", "differential-expression-header"],
          cellClass: ["differential-expression-cell"],
          checkboxSelection: true,
          headerCheckboxSelection: true,
          sort: "asc",
        },
        {
          headerName: "Sample Title",
          field: "experiment_title",
          minWidth: 370,
          headerClass: ["header-border", "differential-expression-header"],
          cellClass: ["differential-expression-cell"],
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
    autoHeight: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
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
    gridApi.deselectAll();
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
    gridApi.deselectAll();
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

  const handleFilter = (searchKeyword) => {
    gridApi.hideOverlay();
    gridApi.setQuickFilter(searchKeyword);
    const totalPages = gridApi.paginationGetTotalPages();
    setTotalPageNumber(totalPages);
    if (pageNumber > totalPages) {
      setPageNumber(1);
    }
    if (gridApi.paginationGetTotalPages() === 0) {
      gridApi.showNoRowsOverlay();
    }
  };

  const handleTissueTypeFilterChange = (option) => {
    setTissueTypeFilter((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleInstitutionFilterChange = (option) => {
    setInstitutionFilter((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleDiseaseFilterChange = (option) => {
    setDiseaseFilter((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const externalFilterChanged = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.onFilterChanged();
      const totalPages = gridRef.current.api.paginationGetTotalPages();
      setTotalPageNumber(totalPages);
      if (pageNumber > totalPages) {
        setPageNumber(1);
      }
    }
  }, [gridRef]);

  const isExternalFilterPresent = useCallback(() => {
    return (
      tissueTypeFilter.length > 0 ||
      institutionFilter.length > 0 ||
      diseaseFilter.length > 0
    );
  }, [tissueTypeFilter, institutionFilter, diseaseFilter]);

  const doesExternalFilterPass = useCallback(
    (node) => {
      const tissueTypeMatch =
        tissueTypeFilter.length === 0 ||
        tissueTypeFilter.includes(node.data.sample_type);
      const institutionMatch =
        institutionFilter.length === 0 ||
        institutionFilter.includes(node.data.institution);
      const diseaseMatch =
        diseaseFilter.length === 0 ||
        diseaseFilter.includes(node.data.condition_type);

      return tissueTypeMatch && institutionMatch && diseaseMatch;
    },
    [tissueTypeFilter, institutionFilter, diseaseFilter]
  );

  useEffect(() => {
    externalFilterChanged();
  }, [
    tissueTypeFilter,
    institutionFilter,
    diseaseFilter,
    externalFilterChanged,
  ]);

  const handleSideFilter = (searchKeyword, columnName) => {
    gridApi.hideOverlay();
    let filterModel = gridApi.getFilterModel();

    if (columnName === "Sample ID") {
      setSampleIdFilter(searchKeyword);
      filterModel.experiment_id_key = {
        type: "contains",
        filter: searchKeyword,
      };
    } else if (columnName === "Sample Title") {
      setSampleTitleFilter(searchKeyword);
      filterModel.experiment_title = {
        type: "contains",
        filter: searchKeyword,
      };
    }

    gridApi.setFilterModel(filterModel);
    const totalPages = gridApi.paginationGetTotalPages();
    setTotalPageNumber(totalPages);
    if (pageNumber > totalPages) {
      setPageNumber(1);
    }
    if (gridApi.paginationGetTotalPages() === 0) {
      gridApi.showNoRowsOverlay();
    }
  };

  const handleResetFilter = () => {
    gridApi.hideOverlay();
    gridApi.setQuickFilter("");
    gridApi.setFilterModel({});
    const totalPages = gridApi.paginationGetTotalPages();
    setTotalPageNumber(totalPages);
    if (pageNumber > totalPages) {
      setPageNumber(1);
    }
    setSampleIdFilter("");
    setSampleTitleFilter("");
    setTissueTypeFilter([]);
    setInstitutionFilter([]);
    setDiseaseFilter([]);
    setLowerLimit(0);
    setUpperLimit(20000);
    setFilterKeyword("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const { isValid, errorMessage } = validateFile(content);

        if (!isValid) {
          Swal.fire({
            icon: "error",
            title: "Invalid File",
            text: errorMessage,
          });
          setFileIsValid(false);
          return;
        }
        setFileIsValid(true);
        setInputData(content);
      };
      reader.readAsText(file); // Read the file as text

      // Reset the value of the input to allow re-uploading the same file
      e.target.value = null;
    }
  };

  const handleDownloadTemplateData = async () => {
    try {
      const response = await axios
        .get(`${process.env.REACT_APP_API_ENDPOINT}/api/download-template-data`)
        .then((res) => res.data);

      const { url } = response;
      // Create a link and trigger the download
      const link = document.createElement("a");
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  const handleDownloadDataStandard = async () => {
    try {
      const response = await axios
        .get(`${process.env.REACT_APP_API_ENDPOINT}/api/download-data-standard`)
        .then((res) => res.data);

      const { url } = response;
      // Create a link and trigger the download
      const link = document.createElement("a");
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  const handleAnalyze = async () => {
    if (!fileName) {
      if (groupARowData.length === 0 || groupBRowData.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "GroupA and/or GroupB cannot be empty. Please try again.",
        });
        return;
      } else if (groupARowData.length < 3 || groupBRowData.length < 3) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "GroupA and/or GroupB need to have at least 3 samples. Please try again.",
        });
        return;
      }

      const checkDuplicate = new Set();
      groupARowData.forEach((row) => checkDuplicate.add(row.experiment_id_key));

      for (const row of groupBRowData) {
        if (checkDuplicate.has(row.experiment_id_key)) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Duplicate samples in both groups. Please try again.",
          });
          return;
        }
      }
    }

    if (!fileIsValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please fix/reupload the file",
      });
      return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}${month}${day}-${hours}${minutes}${seconds}`;

    const jobId = `differential-expression-${formattedDate}`;

    const workingDirectory = `/home/ec2-user/differential-expression-result/${year}-${month}-${day}/${jobId}`;

    Swal.fire({
      title: "Submitting the job, please wait...",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    Swal.showLoading();

    try {
      if (fileName) {
        await axios
          .post(
            `${process.env.REACT_APP_API_ENDPOINT}/api/differential-expression/analyze-file`,
            {
              inputData,
              logNorm,
              numberOfDifferentiallyAbundantProteinsInHeatmap,
              foldChangeThreshold,
              pValueThreshold,
              pValueType,
              parametricTest,
              timestamp: {
                year,
                month,
                day,
                hours,
                minutes,
                seconds,
              },
              formattedDate,
              workingDirectory,
            }
          )
          .then(() => {
            // Wait for 3 seconds before redirecting
            setTimeout(() => {
              window.location.href = `/differential-expression/results/${jobId}?logNorm=${logNorm}&heatmap=${numberOfDifferentiallyAbundantProteinsInHeatmap}&foldChange=${foldChangeThreshold}&pValue=${pValueThreshold}&pType=${pValueType}&parametricTest=${parametricTest}`;
              Swal.close();
            }, 3000);
          });
      } else {
        await axios
          .post(
            `${process.env.REACT_APP_API_ENDPOINT}/api/differential-expression/analyze`,
            {
              groupAData: groupARowData,
              groupBData: groupBRowData,
              logNorm,
              numberOfDifferentiallyAbundantProteinsInHeatmap,
              foldChangeThreshold,
              pValueThreshold,
              pValueType,
              parametricTest,
              timestamp: {
                year,
                month,
                day,
                hours,
                minutes,
                seconds,
              },
              formattedDate,
              workingDirectory,
            }
          )
          .then(() => {
            // Wait for 3 seconds before redirecting
            setTimeout(() => {
              window.location.href = `/differential-expression/results/${jobId}?logNorm=${logNorm}&heatmap=${numberOfDifferentiallyAbundantProteinsInHeatmap}&foldChange=${foldChangeThreshold}&pValue=${pValueThreshold}&pType=${pValueType}&parametricTest=${parametricTest}`;
              Swal.close();
            }, 3000);
          });
      }
    } catch (error) {
      const payload = {
        message: error.response.data,
      };
      try {
        await axios
          .post(
            `${process.env.REACT_APP_API_ENDPOINT}/api/differential-expression/send-support-email`,
            payload
          )
          .then((res) => {
            console.log(res);
            if (res.status === 201) {
              Swal.fire({
                icon: "error",
                title:
                  "Error - The error/issue has been sent to the support team.",
                text: error.response.data,
              });
            }
          });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error - The error/issue has been sent to the support team.",
          text: error.response.data,
        });
      }
    }
  };

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Analyze" },
    { path: "Differential Expression Analysis" },
  ];

  return (
    <>
      <PageHeader
        tabTitle={"HSP | Differential Expression"}
        breadcrumb={breadcrumbPath}
        title={"Differential Expression Analysis"}
        description={
          "Please choose experiments from the following table for differential expression analysis. This analysis will identify proteins with differential abundance between experiments in Groups A and B based on their normalized spectral counts."
        }
      />
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
                  {filter === "Sample ID" || filter === "Sample Title" ? (
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
                        filter === "Sample ID"
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
                              checked={tissueTypeFilter.includes(option.key)}
                              onChange={() => {
                                handleTissueTypeFilterChange(option.key);
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
                              checked={institutionFilter.includes(option.key)}
                              onChange={() => {
                                handleInstitutionFilterChange(option.key);
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
                  ) : filter === "Disease" ? (
                    <FormGroup>
                      {diseaseFilterList.map((option, subIndex) => (
                        <FormControlLabel
                          key={`${option}-${index}-${subIndex}`}
                          control={
                            <Checkbox
                              checked={diseaseFilter.includes(option.key)}
                              onChange={() =>
                                handleDiseaseFilterChange(option.key)
                              }
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
          maxWidth="false"
          sx={{ margin: "30px 0 30px 20px" }}
        >
          <Box sx={{ display: "flex" }}>
            <Box
              style={{
                display: "flex",
              }}
            >
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
                  const totalPages = Math.ceil(
                    totalRecordCount / event.target.value
                  );
                  setTotalPageNumber(totalPages);
                  if (pageNumber > totalPages) {
                    setPageNumber(1);
                  }
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
              style={{ height: 620 }}
            >
              <AgGridReact
                ref={gridRef}
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
                isExternalFilterPresent={isExternalFilterPresent}
                doesExternalFilterPass={doesExternalFilterPass}
              ></AgGridReact>
            </div>
          </Box>
          <Grid
            container
            spacing={8}
          >
            <Grid
              item
              xs={6}
            >
              <Box sx={{ m: 4, justifyContent: "center", display: "center" }}>
                <Stack
                  direction="row"
                  spacing={5}
                >
                  <Button
                    variant="contained"
                    onClick={handleAddGroupA}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleDeleteGroupA}
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
              <div
                id="differential"
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
            <Grid
              item
              xs={6}
            >
              <Box sx={{ m: 4, justifyContent: "center", display: "center" }}>
                <Stack
                  direction="row"
                  spacing={5}
                >
                  <Button
                    variant="contained"
                    onClick={handleAddGroupB}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleDeleteGroupB}
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
              <div
                id="differential"
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
                mt: "20px",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                padding: "16px",
              }}
            >
              {/* First line */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row", // Set to row for horizontal layout
                  marginBottom: "8px", // Add space between lines
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
                  sx={{ mr: 2 }}
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
                    ml: 6,
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
              </Box>

              {/* Second line */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row", // Keep this row horizontal
                  mt: 2,
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
                  TEMPLATE DATA:
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mr: 2 }}
                  onClick={handleDownloadTemplateData}
                >
                  DOWNLOAD
                </Button>
                <Typography
                  display="inline"
                  sx={{
                    fontFamily: "Lato",
                    color: "#464646",
                    mr: 2,
                    ml: 6,
                  }}
                >
                  DATA STANDARD:
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleDownloadDataStandard}
                >
                  DOWNLOAD
                </Button>
              </Box>
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
            <Typography
              variant="h5"
              sx={{ fontFamily: "Lato" }}
            >
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
                Number of differentially abundant proteins in heatmap:
              </Typography>
              <TextField
                size="small"
                value={numberOfDifferentiallyAbundantProteinsInHeatmap}
                onChange={(event) => {
                  const value = event.target.value;
                  // Allow only numeric input (including decimal points)
                  if (/^\d*\.?\d*$/.test(value) || value === "") {
                    setNumberOfDifferentiallyAbundantProteinsInHeatmap(value);
                  }
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
                Fold change threshold:
              </Typography>
              <TextField
                size="small"
                value={foldChangeThreshold}
                onChange={(event) => {
                  const value = event.target.value;
                  // Allow only numeric input (including decimal points)
                  if (/^\d*\.?\d*$/.test(value) || value === "") {
                    setFoldChangeThreshold(value);
                  }
                }}
                sx={{ width: "80px" }}
              />
              {/* <Typography
                variant="subtitle1"
                sx={{
                  color: "#1463B9",
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  mt: 3,
                }}
              >
                Cluster Samples:
              </Typography>
              <Checkbox
                icon={<CircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                checked={clusterSamples === "T"}
                onChange={() => setClusterSamples("T")}
                sx={{ paddingLeft: 0 }}
              />
              <Typography
                display="inline"
                variant="body2"
                sx={{ fontFamily: "Lato", color: "#464646", mr: 2 }}
              >
                Yes
              </Typography>
              <Checkbox
                icon={<CircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                checked={clusterSamples === "F"}
                onChange={() => setClusterSamples("F")}
                sx={{ paddingLeft: 0 }}
              />
              <Typography
                display="inline"
                variant="body2"
                sx={{ fontFamily: "Lato", color: "#464646", mr: 2 }}
              >
                No
              </Typography> */}
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
                  const value = event.target.value;
                  // Allow only numeric input (including decimal points)
                  if (/^\d*\.?\d*$/.test(value) || value === "") {
                    setPValueThreshold(value);
                  }
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
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#1463B9",
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  mt: 3,
                }}
              >
                Statistical Parametric Test:
              </Typography>
              <Checkbox
                icon={<CircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                checked={parametricTest === "F"}
                onChange={() => setParametricTest("F")}
                sx={{ paddingLeft: 0 }}
              />
              <Typography
                display="inline"
                variant="body2"
                sx={{ fontFamily: "Lato", color: "#464646", mr: 2 }}
              >
                T-Test
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
                Statistical Non-Parametric Test:
              </Typography>
              <Checkbox
                icon={<CircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                checked={parametricTest === "T"}
                onChange={() => setParametricTest("T")}
                sx={{ paddingLeft: 0 }}
              />
              <Typography
                display="inline"
                variant="body2"
                sx={{ fontFamily: "Lato", color: "#464646" }}
              >
                Wilcoxon Signed-rank Test
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{ mt: 5 }}
              onClick={handleAnalyze}
            >
              ANALYZE
            </Button>
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default DifferentialExpression;
