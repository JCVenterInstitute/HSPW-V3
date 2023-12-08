import List from "@material-ui/core/List";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { rgb } from "d3";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Switch from "@mui/material/Switch";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Container,
  TextField,
  Box,
  MenuItem,
  Stack,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import CustomLoadingOverlay from "../customLoadingOverlay.jsx";
import CustomHeaderGroup from "../customHeaderGroup.jsx";
import { ReactComponent as DownloadLogo } from "../table_icon/download.svg";
import "../filter.css";
import "../table.css";

// TODO: Move to some sort of env file
const HOST_ENDPOINT = `http://localhost:8000`;

const styles = {
  transform: "translate(0, 0)",
};

const styles1 = {
  transform: "translate(2, 0)",
};

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
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

function WSComponent(props) {
  const d = props.value;

  if (d < 10 || d === "low") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgb(180,250,180)",
          color: "black",
          fontFamily: "Lato",
          fontSize: "16px",
          lineHeight: "24px",
          textAlign: "center",
          paddingTop: "22%",
        }}
      >
        {Number(d).toFixed(2)}
      </div>
    );
  } else if (d < 100 || d === "medium") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgb(70,170,70)",
          color: "#FFF",
          fontFamily: "Lato",
          fontSize: "16px",
          lineHeight: "24px",
          textAlign: "center",
          paddingTop: "22%",
        }}
      >
        {Number(d).toFixed(2)}
      </div>
    );
  } else if (d > 100 || d === "high") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgb(0,100,0)",
          color: "#FFF",
          fontFamily: "Lato",
          fontSize: "16px",
          lineHeight: "24px",
          textAlign: "center",
          paddingTop: "22%",
        }}
      >
        {Number(d).toFixed(2)}
      </div>
    );
  } else if (d === "not detected" || d === 0) {
    return (
      <svg
        width={18}
        height={18}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <rect width={18} height={18} fill="rgb(255,255,255)">
          <title>Not uniquely observed</title>
        </rect>
      </svg>
    );
  } else {
    return (
      <svg
        width={18}
        height={18}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <defs>
          <pattern
            id="stripe2"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
            x="0"
            y="0"
            width="4"
            height="4"
            viewBox="0 0 10 10"
          >
            <rect
              width={2}
              height={4}
              fill={rgb(220, 220, 220)}
              style={styles}
            ></rect>
            <rect
              width={2}
              height={4}
              fill={rgb(255, 255, 255)}
              style={styles1}
            ></rect>
          </pattern>
        </defs>
        <rect width={18} height={18} style={{ fill: "url(#stripe2)" }}>
          <title>Data not available</title>
        </rect>
      </svg>
    );
  }
}

function opinionComponent(props) {
  const { value } = props;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span>
        {value === "Confirmed" ? "C" : value === "Unsubstantiated" ? "US" : ""}
      </span>
    </div>
  );
}

function IHCComponent(props) {
  const d = props.value;
  if (d === "low") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(180,250,180)",
            color: "black",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "22%",
          }}
        >
          <span style={{ textAlign: "center" }}>{d}</span>
        </div>
      </>
    );
  } else if (d === "medium") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(70,170,70)",
            color: "#FFF",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "22%",
          }}
        >
          <span style={{ textAlign: "center" }}>{d}</span>
        </div>
      </>
    );
  } else if (d === "high") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(0,100,0)",
            color: "#FFF",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "22%",
          }}
        >
          <span style={{ textAlign: "center" }}>{d}</span>
        </div>
      </>
    );
  } else if (d === "not detected") {
    return (
      <>
        <svg
          style={{
            stroke: "black",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <defs>
            <pattern
              id="stripe2"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
              x="0"
              y="0"
              width="4"
              height="4"
              viewBox="0 0 10 10"
            >
              <rect
                width="100%"
                height={4}
                fill={rgb(220, 220, 220)}
                style={styles}
              ></rect>
              <rect
                width="100%"
                height={4}
                fill={rgb(255, 255, 255)}
                style={styles1}
              ></rect>
            </pattern>
          </defs>
          <rect
            style={{
              fill: "url(#stripe2)",
              width: "100%",
              height: "100%",
            }}
          >
            <title>Data not available</title>
          </rect>
        </svg>
      </>
    );
  } else {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgb(250,250,250)",
          color: "black",
          fontFamily: "Lato",
          fontSize: "16px",
          lineHeight: "24px",
          textAlign: "center",
          paddingTop: "25%",
        }}
      >
        n/a
      </div>
    );
  }
}

function proteinLinkComponent(props) {
  return (
    <div style={{ paddingLeft: "20px" }}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`${window.location.origin}/protein/${props.value}`}
      >
        {props.value}
      </a>
    </div>
  );
}

const commonStyles = {
  width: "100%",
  height: "100%",
  fontFamily: "Lato",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "center",
};

function LinkComponent(props) {
  const d = props.value;

  // Assuming value is a number
  const normalizedValue = typeof d === "number" ? d : 0;

  // Interpolate between light red and dark red
  const interpolateColor = (start, end, percent) => {
    const r = Math.round(start[0] + (end[0] - start[0]) * percent);
    const g = Math.round(start[1] + (end[1] - start[1]) * percent);
    const b = Math.round(start[2] + (end[2] - start[2]) * percent);
    return `rgb(${r},${g},${b})`;
  };

  // Define light red and dark red
  const lightRed = [255, 200, 200]; // Light red color
  const darkRed = [255, 0, 0]; // Dark red color

  // Calculate color based on normalized value
  const percent = (normalizedValue - 0.8) / (4.3 - 0.8); // Adjust the range as needed
  const color = interpolateColor(lightRed, darkRed, percent);

  return (
    <div
      style={{
        ...commonStyles,
        backgroundColor: color,
        color: "black",
        paddingTop: "22%",
      }}
    >
      {Number(d).toFixed(2)}
    </div>
  );
}

function App() {
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(0);
  const [gridApi, setGridApi] = useState("");
  const [count, setCount] = useState(2);
  const [docCount, setDocCount] = useState(0);
  const [pageNumArr, setPageNumArr] = useState([1]);
  const [accessionC, setAccessionC] = useState(false);
  const [geneC, setGeneC] = useState(false);
  const [nameC, setNameC] = useState(false);
  const [eoC, seteoC] = useState(false);
  const [ihcC, setihcC] = useState(false);
  const [wsC, setwsC] = useState(false);
  const [parC, setparC] = useState(false);
  const [subC, setsubC] = useState(false);
  const [plasmaC, setplasmaC] = useState(false);
  const [mRNAC, setmRNAC] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [genePrefix, setGenePrefix] = useState("");
  const [namePrefix, setNamePrefix] = useState("");
  const [opCount, setOpCount] = useState([]);
  const [IHCCount, setIHCCount] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [opinionVal, setopinionVal] = useState("");
  const [IHCVal, setIHCVal] = useState("*");
  const [parStart, setparStart] = useState("");
  const [parEnd, setparEnd] = useState("");
  const [subStart, setsubStart] = useState("");
  const [subEnd, setsubEnd] = useState("");
  const [pStart, setpStart] = useState("");
  const [pEnd, setpEnd] = useState("");
  const [wsStart, setwsStart] = useState("");
  const [wsEnd, setwsEnd] = useState("");
  const [mRNAStart, setmRNAStart] = useState("");
  const [mRNAEnd, setmRNAEnd] = useState("");
  const [queryArr, setQueryArr] = useState([]);
  const [opArr, setOpArr] = useState([false, false]);
  const [orChecked, setorChecked] = useState(false);
  const [exclude, setExclude] = useState(false);
  const [IHCArr, setIHCArr] = useState([false, false, false, false, false]);

  const [searchText, setSearchText] = useState("");
  const [globalSC, setGlobalSC] = useState(false);
  useEffect(() => {
    const fetchOpCount = async () => {
      const data = await fetch("http://localhost:8000/opCount");
      const json = data.json();
      return json;
    };
    const countOpResult = fetchOpCount().catch(console.errror);
    countOpResult.then((value) => {
      if (value) {
        setOpCount(value);
      }
    });

    const fetchIHCCount = async () => {
      const data = await fetch("http://localhost:8000/IHCCount");
      const json = data.json();
      return json;
    };
    const countIHCResult = fetchIHCCount().catch(console.errror);
    countIHCResult.then((value) => {
      if (value) {
        setIHCCount(value);
        console.log(IHCCount);
      }
    });

    fetch("http://localhost:8000/saliva_protein_count/")
      .then((res) => res.json())
      .then((data) => {
        setDocCount(data.count);
        const newOptions = [];
        for (let i = 1; i <= Math.round(data.count / pageSize); i++) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }
        setPageNumArr(newOptions);
      });
  }, []);

  const globalSearch = async () => {
    const data = await fetch(
      `http://localhost:8000/multi_search/new_saliva_protein_test/${searchText}`
    );
    console.log(
      `http://localhost:8000/multi_search/new_saliva_protein_test/${searchText}`
    );
    const json = data.json();
    return json;
  };
  const customHeaders = {
    "Content-Type": "application/json",
  };
  const fetchAndData = async () => {
    console.log("123", JSON.stringify(queryArr));
    const data = await fetch(
      `http://localhost:8000/and_search/${pageSize}/${pageNum}/`,
      {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(queryArr),
      }
    );
    const json = data.json();
    return json;
  };

  const fetchOrData = async () => {
    const data = await fetch(
      `http://localhost:8000/or_search/${pageSize}/${pageNum}/`,
      {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(queryArr),
      }
    );
    const json = data.json();
    return json;
  };

  useEffect(() => {
    console.log("Exclude value:", exclude);
    if (
      (accessionC === true ||
        geneC === true ||
        nameC === true ||
        eoC === true ||
        ihcC === true ||
        wsC === true ||
        parC === true ||
        subC === true ||
        plasmaC === true ||
        mRNAC === true) &&
      orChecked === false
    ) {
      console.log("1");
      const result = fetchAndData().catch(console.errror);
      result.then((value) => {
        if (value.hits.hits) {
          console.log(value);
          let data1 = [];
          for (let i = 0; i < value.hits.hits.length; i++) {
            data1.push(value.hits.hits[i]["_source"]);
          }
          console.log(data1);
          setRowData(data1);
        }
        setDocCount(value.hits.total.value);
        const newOptions = [];
        for (
          let i = 1;
          i <= Math.round(value.hits.total.value / pageSize);
          i++
        ) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }

        setPageNumArr(newOptions);
        setCount(2);
        setOpCount(value.aggregations.expert_opinion.buckets);
        setIHCCount(value.aggregations.IHC.buckets);
      });
    } else if (globalSC === true) {
      const result = globalSearch().catch(console.errror);
      result.then((value) => {
        if (value.hits.hits) {
          console.log(value);
          let data1 = [];
          for (let i = 0; i < value.hits.hits.length; i++) {
            data1.push(value.hits.hits[i]["_source"]);
          }
          console.log(data1);
          setRowData(data1);
        }
        setDocCount(value.hits.total.value);
        const newOptions = [];
        for (
          let i = 1;
          i <= Math.round(value.hits.total.value / pageSize);
          i++
        ) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }

        setPageNumArr(newOptions);
        setCount(2);
      });
    } else {
      const fetchData = async () => {
        const data = await fetch(
          "http://localhost:8000/saliva_protein_table/" +
            pageSize +
            "/" +
            pageNum
        );

        const json = data.json();

        return json;
      };
      const result = fetchData().catch(console.errror);
      result.then((value) => {
        if (value.hits.hits) {
          let data1 = [];
          for (let i = 0; i < value.hits.hits.length; i++) {
            data1.push(value.hits.hits[i]["_source"]);
          }

          setRowData(data1);
        }
        setDocCount(value.hits.total.value);
        const newOptions = [];
        for (
          let i = 1;
          i <= Math.round(value.hits.total.value / pageSize);
          i++
        ) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }

        setPageNumArr(newOptions);

        setOpCount(value.aggregations.expert_opinion.buckets);
        setIHCCount(value.aggregations.IHC.buckets);
      });

      const fetchOpCount = async () => {
        const data = await fetch("http://localhost:8000/opCount");
        const json = data.json();
        return json;
      };
      const countOpResult = fetchOpCount().catch(console.errror);
      countOpResult.then((value) => {
        if (value) {
          setOpCount(value);
        }
      });

      const fetchIHCCount = async () => {
        const data = await fetch("http://localhost:8000/IHCCount");
        const json = data.json();
        return json;
      };
      const countIHCResult = fetchIHCCount().catch(console.errror);
      countIHCResult.then((value) => {
        if (value) {
          setIHCCount(value);
        }
      });
    }
  }, [
    prefix,
    genePrefix,
    namePrefix,
    opArr,
    IHCArr,
    wsStart,
    wsEnd,
    parStart,
    parEnd,
    subStart,
    subEnd,
    pStart,
    pEnd,
    mRNAStart,
    mRNAEnd,
    pageSize,
    pageNum,
    globalSC,
    exclude,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `http://localhost:8000/saliva_protein_table/${pageSize}/${pageNum}`
      );
      const json = data.json();
      return json;
    };
    const result = fetchData().catch(console.errror);
    result.then((value) => {
      if (value.hits.hits) {
        let data1 = [];
        for (let i = 0; i < value.hits.hits.length; i++) {
          data1.push(value.hits.hits[i]["_source"]);
        }

        setRowData(data1);
      }
    });
  }, []);

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const noRowsOverlayComponent = useMemo(() => {
    return CustomNoRowsOverlay;
  }, []);

  const columns = [
    {
      headerName: "Accession",
      field: "UniProt Accession",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      minWidth: "155",
      wordWrap: true,

      cellStyle: { wordBreak: "break-word" },
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      cellRenderer: "proteinLinkComponent",
    },
    {
      headerName: "Gene Symbol",
      minWidth: "132",
      field: "Gene Symbol",
      wrapText: true,

      headerClass: ["header-border"],
      cellClass: ["table-border"],
      cellStyle: { wordBreak: "break-word" },
    },
    {
      headerName: "Protein Name",
      minWidth: "133",
      maxHeight: "5",
      field: "Protein Name",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],

      cellStyle: { wordBreak: "break-word" },
    },
    {
      headerName: "Expert Opinion",
      minWidth: "140",
      field: "expert_opinion",

      cellRenderer: "opinionComponent",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      wrapText: true,
    },
    {
      headerName: "MS",
      headerGroupComponent: CustomHeaderGroup,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      children: [
        {
          headerName: "WS",
          field: "saliva_abundance",
          minWidth: "98",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["square_table", "salivary-proteins-colored-cell"],
        },
        {
          headerName: "Par",
          field: "parotid_gland_abundance",
          minWidth: "97",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["square_table", "salivary-proteins-colored-cell"],
        },
        {
          headerName: "Sub",
          field: "sm/sl_abundance",
          minWidth: "101",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["square_table", "salivary-proteins-colored-cell"],
        },
        {
          headerName: "B",
          field: "plasma_abundance",
          minWidth: "95",
          cellRenderer: "LinkComponent",
          headerClass: ["header-border"],
          cellClass: ["square_table", "salivary-proteins-colored-cell"],
        },
      ],

      wrapText: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "IHC",
      field: "IHC",
      minWidth: "101",

      wrapText: true,
      cellRenderer: "IHCComponent",
      headerClass: ["header-border"],
      cellClass: ["square_table", "salivary-proteins-colored-cell"],
    },
    {
      headerName: "mRNA",
      headerGroupComponent: CustomHeaderGroup,
      minWidth: "105",

      wrapText: true,
      cellRenderer: "WSComponent",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      children: [
        {
          headerName: "Value",
          field: "mRNA",
          minWidth: "116",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["square_table", "salivary-proteins-colored-cell"],
        },
        {
          headerName: "Specificity",
          field: "Specificity",
          minWidth: "160",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          headerName: "Specificity Score",
          field: "Specificity_Score",
          minWidth: "159",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
      ],
    },
  ];
  const gridRef = useRef();

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const onFilterTextBoxChanged = (e) => {
    console.log("868", e.key);
    if (e.key === "Enter") {
      console.log("key entered", e.key);

      // Check if the event is a delete key press or a synthetic event
      const isDeleteKey =
        e.nativeEvent && e.nativeEvent.inputType === "deleteContentBackward";

      let inputValue = e.target.value;

      if (isDeleteKey) {
        // Handle delete key press by removing the last character
        inputValue = inputValue.slice(0, -1);
      }

      // Ensure that inputValue is defined
      inputValue = inputValue || "";

      // Escape special characters
      const escapedInputValue = escapeRegExp(inputValue);

      console.log("Input Value: " + escapedInputValue);

      if (escapedInputValue !== "") {
        setSearchText(escapedInputValue);
        setGlobalSC(true);
      } else {
        setGlobalSC(false);
        setSearchText("");
      }
    }
  };

  const clearSearch = () => {
    setGlobalSC(false);
    setSearchText("");
  };

  const onBtNext = (event) => {
    if (count < docCount / pageSize) {
      setPageNum(pageNum + 1);

      // Increment the count if needed
      setCount(count + 2);
    }
  };

  const onBtPrevious = (event) => {
    if (pageNum !== 1) {
      var x = pageNum;
      setPageNum(x - 1);
      setCount(count - 1);
    }
  };
  const defColumnDefs = {
    flex: 1,
    filter: true,
    resizable: true,
    wrapHeaderText: true,
    wrapText: true,
    autoHeaderHeight: true,
    headerStyle: { wordBreak: "break-word" },
    initialWidth: 200,
    headerComponentParams: {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
        '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
        '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
        '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
        '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
        '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
        '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
        '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
        "  </div>" +
        "</div>",
    },
  };

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

  const rowHeight = 80;

  const IHCValues = ["medium", "not detected", "low", "n/a", "high"];

  /**
   * Escape all special characters for input string
   * Special Characters include: [-[\]{}()*+?.,\\^$|#\s
   * @param {String} inputVal Non-escaped string value entered by user
   * @returns String where special characters are escaped with slashes
   */
  const escapeSpecialCharacters = (inputVal) => {
    return inputVal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  const stringAttributes = [
    "UniProt Accession",
    "Gene Symbol",
    "Protein Name",
    "IHC",
    "expert_opinion",
  ];

  const numberAttributes = [
    "saliva_abundance", // MS WS
    "parotid_gland_abundance", // MS PAR
    "sm/sl_abundance", // MS Sub
    "plasma_abundance", // MS B
    "mRNA", // mRNA
  ];

  function SalivaryProteinTable() {
    const gridRef = useRef();

    const [pageSize, setPageSize] = useState(50); // Default page data to 50 records per page
    const [pageNum, setPageNum] = useState(0);
    const [docCount, setDocCount] = useState(0); // Total # of records available for display
    const [ihcC, setihcC] = useState(false);
    const [opCount, setOpCount] = useState([]);
    const [IHCCount, setIHCCount] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [opArr, setOpArr] = useState([false, false]);
    const [orFilterOn, setOrFilterOn] = useState(false);
    const [IHCArr, setIHCArr] = useState([false, false, false, false, false]);
    const [searchText, setSearchText] = useState("");
    const [msBExcludeOn, setMsBExcludeOn] = useState(false);
    const [facetFilter, setFacetFilters] = useState({});
    const [columnApi, setColumnApi] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [sortedColumn, setSortedColumn] = useState(null);

    const loadingOverlayComponent = useMemo(() => {
      return CustomLoadingOverlay;
    }, []);

    // Export the current page data as CSV file
    const onBtExport = useCallback(() => {
      gridRef.current.api.exportDataAsCsv();
    }, []);

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
     * Create a proper search query for whichever search string is entered into the search bar
     */
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

    // Handle fetching data for table
    const fetchData = async () => {
      const apiPayload = {
        filters: queryBuilder(facetFilter),
        // Pass sort query if any sort is applied
        ...(sortedColumn && createSortQuery()),
        ...(searchText && { keyword: createGlobalSearchQuery() }),
      };

      const searchQuery = (query) => {
        if (query && query.bool && query.bool.filter) {
          return query.bool.filter.some(findFieldInFilter);
        }

        return false;
      };

      const result = queries.some(searchQuery); // Use some instead of find

      console.log(result ? "Field Found:" : "Field Not Found");

      return result;
    };

    // Helper function to check if two queries have the same wildcard type
    const isSameType = (query1, query2) => {
      const type1 = query1.bool?.filter?.[0]?.wildcard
        ? Object.keys(query1.bool.filter[0].wildcard)[0]
        : null;
      const type2 = query2.bool?.filter?.[0]?.wildcard
        ? Object.keys(query2.bool.filter[0].wildcard)[0]
        : null;

      // Check both type and value for wildcard queries
      if (type1 === type2 && type1 === "wildcard") {
        const value1 = query1.bool.filter[0].wildcard[type1].value;
        const value2 = query2.bool.filter[0].wildcard[type2].value;
        return value1 === value2;
      }

      return type1 === type2;
    };

    const handleAccessionChange = (e) => {
      // Check if the event is a delete key press
      const isDeleteKey = e.nativeEvent.inputType === "deleteContentBackward";

      let inputValue = e.target.value;
      setPrefix(inputValue);
      if (isDeleteKey) {
        // Handle delete key press by removing the last character
        inputValue = inputValue.slice(0, -1);
      }

      // Remove double backslashes
      inputValue = inputValue.replace(/\\\\/g, "");

      // Escape special characters
      inputValue = inputValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

      if (inputValue === "") {
        setAccessionC(false);
      } else {
        setAccessionC(true);
      }

      setPageNum(0);

      const newAccessionQuery =
        inputValue !== ""
          ? {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    wildcard: {
                      uniprot_accession: {
                        value: `${inputValue}*`,
                        case_insensitive: true,
                      },
                    },
                  },
                ],
              },
            }
          : null;

      updateQuery(newAccessionQuery, "uniprot_accession");
    };

    const handleGeneChange = (e) => {
      // Check if the event is a delete key press
      const isDeleteKey = e.nativeEvent.inputType === "deleteContentBackward";

      let inputValue = e.target.value;
      setGenePrefix(inputValue);
      if (isDeleteKey) {
        // Handle delete key press by removing the last character
        inputValue = inputValue.slice(0, -1);
      }

      // Remove double backslashes
      inputValue = inputValue.replace(/\\\\/g, "");

      // Escape special characters
      inputValue = inputValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      if (inputValue === "") {
        setGeneC(false);
      } else if (inputValue !== "") {
        setGeneC(true);
      }
      setPageNum(0);
      const newGeneQuery =
        inputValue !== ""
          ? {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    wildcard: {
                      "Gene Symbol": {
                        value: `${inputValue}*`,
                        case_insensitive: true,
                      },
                    },
                  },
                ],
              },
            }
          : null;

      updateQuery(newGeneQuery, "Gene Symbol");
    };

    const handleNameChange = (e) => {
      // Check if the event is a delete key press
      const isDeleteKey = e.nativeEvent.inputType === "deleteContentBackward";

      let inputValue = e.target.value;

      if (isDeleteKey) {
        // Handle delete key press by removing the last character
        inputValue = inputValue.slice(0, -1);
      }

      // Remove double backslashes
      inputValue = inputValue.replace(/\\\\/g, "");

      // Escape special characters
      inputValue = inputValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      console.log(inputValue);
      if (inputValue === "") {
        console.log("wt");
        setNameC(false);
      } else if (inputValue !== "") {
        setNameC(true);
      }
      const newNameQuery =
        inputValue !== ""
          ? {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    wildcard: {
                      "Protein Name": {
                        value: `${inputValue}*`,
                        case_insensitive: true,
                      },
                    },
                  },
                ],
              },
            }
          : null;
      setNamePrefix(e.target.value);

      updateQuery(newNameQuery, "Protein Name");
    };

    const handlestartWSChange = (e) => {
      let inputValue = e.target.value;
      if (inputValue === "") {
        setwsC(false);
      } else if (inputValue !== "") {
        setwsC(true);
      }
      let newstartWSQuery =
        inputValue !== ""
          ? {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    range: {
                      saliva_abundance: { gte: inputValue, lte: parEnd },
                    },
                  },
                ],
              },
            }
          : null;
      if (wsEnd === "") {
        newstartWSQuery =
          inputValue !== ""
            ? {
                bool: {
                  must: [],
                  must_not: [],
                  filter: [
                    {
                      range: {
                        saliva_abundance: { gte: inputValue, lte: 20000 },
                      },
                    },
                  ],
                },
              }
            : null;
      }
      setwsStart(inputValue);
      if (inputValue === "") {
        newstartWSQuery =
          inputValue !== ""
            ? {
                bool: {
                  must: [],
                  must_not: [],
                  filter: [
                    {
                      range: {
                        saliva_abundance: { gte: 0, lte: 20000 },
                      },
                    },
                  ],
                },
              }
            : null;
      }

      if (inputValue === "" && wsEnd !== "") {
        newstartWSQuery =
          inputValue !== ""
            ? {
                bool: {
                  must: [],
                  must_not: [],
                  filter: [
                    {
                      bool: {
                        must_not: {
                          range: {
                            saliva_abundance: { lte: wsEnd, gte: 0 },
                          },
                        },
                      },
                    },
                  ],
                },
              }
            : null;
      }
      updateQuery(newstartWSQuery, "saliva_abundance");
    };

    const handleendWSChange = (e) => {
      const inputValue = e.target.value;
      const wsAbundance = inputValue === "" ? 20000 : inputValue;
      if (inputValue === "") {
        setwsC(false);
      } else if (inputValue !== "") {
        setwsC(true);
      }
      let newendWSQuery =
        inputValue !== ""
          ? {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    range: {
                      saliva_abundance: { lte: wsAbundance, gte: wsStart },
                    },
                  },
                ],
              },
            }
          : null;

      if (wsStart === "") {
        newendWSQuery =
          inputValue !== ""
            ? {
                bool: {
                  must: [],
                  must_not: [],
                  filter: [
                    {
                      range: {
                        saliva_abundance: { gte: 0, lte: inputValue },
                      },
                    },
                  ],
                },
              }
            : null;
      }
      setwsEnd(inputValue);
      if (inputValue === "") {
        newendWSQuery =
          inputValue !== ""
            ? {
                bool: {
                  must: [],
                  must_not: [],
                  filter: [
                    {
                      range: {
                        saliva_abundance: { gte: 0, lte: 20000 },
                      },
                    },
                  ],
                },
              }
            : null;
      }

      if (inputValue === "" && wsStart !== "") {
        newendWSQuery =
          inputValue !== ""
            ? {
                bool: {
                  must: [],
                  must_not: [],
                  filter: [
                    {
                      bool: {
                        must_not: {
                          range: {
                            saliva_abundance: {
                              lte: 20000,
                              gte: wsStart,
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              }
            : null;
      }
      updateQuery(newendWSQuery, "saliva_abundance");
    };

    const handlestartParChange = (e) => {
      let inputValue = e.target.value;

      if (inputValue === "") {
        setparC(false);
      } else if (inputValue !== "") {
        setparC(true);
      }
      let newstartParQuery =
        inputValue !== ""
          ? {
              bool: {
                must: [],
                must_not: [],
                filter: [
                  {
                    range: {
                      parotid_gland_abundance: { gte: inputValue, lte: parEnd },
                    },
                  },
                ],
              },
            }
          : null;
      if (parEnd === "") {
        newstartParQuery =
          inputValue !== ""
            ? {
                bool: {
                  must: [],
                  must_not: [],
                  filter: [
                    {
                      range: {
                        parotid_gland_abundance: {
                          gte: inputValue,
                          lte: 20000,
                        },
                      },
                    },
                  ],
                },
              }
            : null;
      }
      setparStart(inputValue);
      if (inputValue === "") {
        newstartParQuery =
          inputValue !== ""
            ? {
                bool: {
                  must: [],
                  must_not: [],
                  filter: [
                    {
                      range: {
                        parotid_gland_abundance: { gte: 0, lte: 20000 },
                      },
                    },
                  ],
                },
              }
            : null;
      }

      if (inputValue === "" && parEnd !== "") {
        newstartParQuery =
          inputValue !== ""
            ? {
                bool: {
                  must: [],
                  must_not: [],
                  filter: [
                    {
                      bool: {
                        must_not: {
                          range: {
                            parotid_gland_abundance: { lte: parEnd, gte: 0 },
                          },
                        },
                      },
                    },
                  ],
                },
              }
            : null;
      }
      updateQuery(newstartParQuery, "parotid_gland_abundance");
    };

    const handleendParChange = (e) => {
      const inputValue = e.target.value;
      const parGlandAbundance = inputValue === "" ? 20000 : inputValue;
      let newendParQuery = {
        bool: {
          must: [],
          must_not: [],
          filter: [
            {
              range: {
                parotid_gland_abundance: {
                  lte: parGlandAbundance,
                  gte: parStart,
                },
              },
            },
          ],
        },
      };
      if (parStart === "") {
        newendParQuery =
          inputValue !== ""
            ? {
                bool: {
                  must: [],
                  must_not: [],
                  filter: [
                    {
                      range: {
                        parotid_gland_abundance: { gte: 0, lte: inputValue },
                      },
                    },
                  ],
                },
              }
            : null;
      }
      setparC(inputValue !== ""); // Set parC based on whether inputValue is not empty

      setparEnd(inputValue);
      if (inputValue === "") {
        newendParQuery =
          inputValue !== ""
            ? {
                bool: {
                  must: [],
                  must_not: [],
                  filter: [
                    {
                      range: {
                        parotid_gland_abundance: { gte: 0, lte: 20000 },
                      },
                    },
                  ],
                },
              }
            : null;
      }

      if (inputValue === "" && parStart !== "") {
        newendParQuery =
          inputValue !== ""
            ? {
                bool: {
                  must: [],
                  must_not: [],
                  filter: [
                    {
                      bool: {
                        must_not: {
                          range: {
                            parotid_gland_abundance: {
                              lte: 20000,
                              gte: parStart,
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              }
            : null;
      }
      updateQuery(newendParQuery, "parotid_gland_abundance");
    };

    const handleStartWSChange = (e) => {
      let inputValue = e.target.value;

      const updateFacet = facetFilter;

      if (updateFacet.saliva_abundance) {
        updateFacet.saliva_abundance = {
          ...updateFacet.saliva_abundance,
          start: inputValue,
        };
      } else {
        updateFacet.saliva_abundance = {
          start: inputValue,
        };
      }

      setFacetFilters({ ...updateFacet });
    };

    const handleEndWSChange = (e) => {
      const { value } = e.target;

      const updateFacet = facetFilter;

      if (updateFacet.saliva_abundance) {
        updateFacet.saliva_abundance = {
          ...updateFacet.saliva_abundance,
          end: value,
        };
      } else {
        updateFacet.saliva_abundance = {
          end: value,
        };
      }

      setFacetFilters({ ...updateFacet });
    };

    const handleStartParChange = (e) => {
      const { value } = e.target;

      const updateFacet = facetFilter;

      if (updateFacet.parotid_gland_abundance) {
        updateFacet.parotid_gland_abundance = {
          ...updateFacet.parotid_gland_abundance,
          start: value,
        };
      } else {
        updateFacet.parotid_gland_abundance = {
          start: value,
        };
      }

      setFacetFilters({ ...updateFacet });
    };

    const handleEndParChange = (e) => {
      const { value } = e.target;

      const updateFacet = facetFilter;

      if (updateFacet.parotid_gland_abundance) {
        updateFacet.parotid_gland_abundance = {
          ...updateFacet.parotid_gland_abundance,
          end: value,
        };
      } else {
        updateFacet.parotid_gland_abundance = {
          end: value,
        };
      }

      setFacetFilters({ ...updateFacet });
    };

    const handleStartSubChange = (e) => {
      const { value } = e.target;

      const updateFacet = facetFilter;

      if (updateFacet["sm/sl_abundance"]) {
        updateFacet["sm/sl_abundance"] = {
          ...updateFacet["sm/sl_abundance"],
          start: value,
        };
      } else {
        updateFacet["sm/sl_abundance"] = {
          start: value,
        };
      }

      setFacetFilters({ ...updateFacet });
    };

    const handleEndSubChange = (e) => {
      const { value } = e.target;

      const updateFacet = facetFilter;

      if (updateFacet["sm/sl_abundance"]) {
        updateFacet["sm/sl_abundance"] = {
          ...updateFacet["sm/sl_abundance"],
          end: value,
        };
      } else {
        updateFacet["sm/sl_abundance"] = {
          end: value,
        };
      }

      setFacetFilters({ ...updateFacet });
    };

    const handleStartBChange = (e) => {
      const { value } = e.target;

      const updateFacet = facetFilter;

      if (updateFacet["plasma_abundance"]) {
        updateFacet["plasma_abundance"] = {
          ...updateFacet["plasma_abundance"],
          start: value,
        };
      } else {
        updateFacet["plasma_abundance"] = {
          start: value,
        };
      }

      setFacetFilters({ ...updateFacet });
    };

    const handleEndBChange = (e) => {
      const { value } = e.target;

      const updateFacet = facetFilter;

      if (updateFacet["plasma_abundance"]) {
        updateFacet["plasma_abundance"] = {
          ...updateFacet["plasma_abundance"],
          end: value,
        };
      } else {
        updateFacet["plasma_abundance"] = {
          end: value,
        };
      }

      setFacetFilters({ ...updateFacet });
    };

    const handleStartMRNAChange = (e) => {
      const { value } = e.target;

      const updateFacet = facetFilter;

      if (updateFacet.mRNA) {
        updateFacet.mRNA = {
          ...updateFacet.mRNA,
          start: value,
        };
      } else {
        updateFacet.mRNA = {
          start: value,
        };
      }

      setFacetFilters({ ...updateFacet });
    };

    const handleEndMRNAChange = (e) => {
      const updateFacet = facetFilter;
      const { value } = e.target;

      if (updateFacet.mRNA) {
        updateFacet.mRNA = {
          ...updateFacet.mRNA,
          end: value,
        };
      } else {
        updateFacet.mRNA = {
          end: value,
        };
      }

      setFacetFilters({ ...updateFacet });
    };

    const filterIHC = (event) => {
      const { value } = event.target;
      const valIndex = IHCValues.indexOf(value);
      const updatedIHCArr = IHCArr;
      updatedIHCArr[valIndex] = !IHCArr[valIndex];
      setihcC(updatedIHCArr);
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
                paddingBottom: "40px",
              }}
            >
              Filters
            </h1>
            <FormGroup style={{ marginLeft: "18%" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography color="common.black">And</Typography>
                <Switch
                  checked={orFilterOn}
                  inputProps={{ "aria-label": "ant design" }}
                  onChange={(event) => setOrFilterOn(event.target.checked)}
                />
                <Typography color="common.black">Or</Typography>
              </Stack>
            </FormGroup>
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
                    Accession
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
                    name="accession"
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
                    Gene Symbol
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
                    onChange={handleGeneChange}
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
                    Protein Name
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
                    Expert Opinion
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List
                    component="div"
                    disablePadding
                    sx={{ border: "1px groove" }}
                  >
                    {opCount.map((child, key) =>
                      child.key !== "" &&
                      child.key !== "D.D.S." &&
                      child.key != "Unknown" ? (
                        <FormGroup key={key} sx={{ ml: "10px" }}>
                          {child.key === "Unsubstantiated" ? (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={opArr[0]}
                                  onChange={filterOpUS}
                                />
                              }
                              label={"US (" + child.doc_count + ")"}
                            />
                          ) : (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={opArr[1]}
                                  onChange={filterOpC}
                                />
                              }
                              label={"C (" + (child.doc_count - 1) + ")"}
                            />
                          )}
                        </FormGroup>
                      ) : null
                    )}
                  </List>
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
                    IHC
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <List
                    component="div"
                    disablePadding
                    sx={{ border: "1px groove" }}
                  >
                    {IHCCount.map((child, i) =>
                      child.key !== "?" ? (
                        <FormGroup key={i} sx={{ ml: "10px" }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  IHCArr[IHCValues.indexOf(child.key.trim())]
                                } // Set the checked attribute based on IHCArr
                                onChange={filterIHC}
                                value={child.key}
                                onClick={(e) => {
                                  const { value, checked } = e.target;

                                  if (!checked) {
                                    delete facetFilter["IHC"];
                                  }

                                  setFacetFilters({
                                    ...facetFilter,
                                    ...(checked && {
                                      IHC: value,
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
                    Whole Saliva
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
                    onChange={handleStartWSChange}
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
                    onChange={handleEndWSChange}
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
                    Parotid Glands
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    variant="outlined"
                    size="small"
                    type="number"
                    label="Start..."
                    InputProps={{
                      style: {
                        borderRadius: "16px",
                      },
                    }}
                    onChange={handleStartParChange}
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
                    onChange={handleEndParChange}
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
                    SM/SL Glands
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    variant="outlined"
                    size="small"
                    label="Start..."
                    type="number"
                    InputProps={{
                      style: {
                        borderRadius: "16px",
                      },
                    }}
                    onChange={handleStartSubChange}
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
                    label="End..."
                    type="number"
                    InputProps={{
                      style: {
                        borderRadius: "16px",
                      },
                    }}
                    onChange={handleEndSubChange}
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
                    Blood
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup style={{ marginLeft: "2%" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography color="common.black">Include</Typography>
                      <Switch
                        checked={msBExcludeOn}
                        inputProps={{
                          "aria-label": "ant design",
                        }}
                        onChange={(event) => {
                          setMsBExcludeOn(event.target.checked);
                        }}
                      />
                      <Typography color="common.black">Exclude</Typography>
                    </Stack>
                  </FormGroup>
                  <TextField
                    variant="outlined"
                    size="small"
                    label="Start..."
                    InputProps={{
                      style: {
                        borderRadius: "16px",
                      },
                    }}
                    type="number"
                    onChange={handleStartBChange}
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
                    label="End..."
                    InputProps={{
                      style: {
                        borderRadius: "16px",
                      },
                    }}
                    type="number"
                    onChange={handleEndBChange}
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
                    mRNA
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    variant="outlined"
                    size="small"
                    label="Start..."
                    InputProps={{
                      style: {
                        borderRadius: "16px",
                      },
                    }}
                    onChange={handleStartMRNAChange}
                    type="number"
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
                    label="End..."
                    InputProps={{
                      style: {
                        borderRadius: "16px",
                      },
                    }}
                    onChange={handleEndMRNAChange}
                    type="number"
                  />
                </AccordionDetails>
              </Accordion>
            </div>
          </Box>
          <Container
            maxWidth="xl"
            sx={{ marginTop: "30px", marginLeft: "20px" }}
          >
            <Box sx={{ display: "flex" }}>
              <Box
                style={{
                  display: "flex",
                  width: "100%",
                  maxWidth: "550px",
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onFilterTextBoxChanged(e.target.value);
                    }
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
                  value={pageNum === 0 ? 1 : pageNum + 1}
                  sx={{ marginLeft: "10px", marginRight: "10px" }}
                  onChange={(event) => {
                    setPageNum(event.target.value - 1);
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
                  className="ag-cell-wrap-text saliva_table"
                  rowData={rowData}
                  columnDefs={columns}
                  ref={gridRef}
                  defaultColDef={defColumnDefs}
                  components={{
                    LinkComponent,
                    WSComponent,
                    IHCComponent,
                    opinionComponent,
                    proteinLinkComponent,
                  }}
                  onSortChanged={onSortChanged}
                  onGridReady={onGridReady}
                  loadingOverlayComponent={loadingOverlayComponent}
                  pagination={true}
                  enableCellTextSelection={true}
                  paginationPageSize={pageSize}
                  rowHeight={rowHeight}
                  suppressPaginationPanel={true}
                />
              </div>
              <button
                onClick={onBtExport}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: "10px",
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
            </Box>
          </Container>
        </Container>
      </>
    );
  }
}

export default SalivaryProteinTable;
