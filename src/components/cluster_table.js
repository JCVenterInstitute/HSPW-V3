import React, { useState, useEffect, useCallback, useRef } from "react";
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

import { ReactComponent as Download_Logo } from "./table_icon/download.svg";
import { ReactComponent as Left_Arrow } from "./table_icon/left_arrow.svg";
import { ReactComponent as Right_Arrow } from "./table_icon/right_arrow.svg";
import { ReactComponent as Search } from "./table_icon/search.svg";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { DATA } from "./data_cluster";
import "./filter.css";
import "./table.css";

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
  const [pageNum, setPageNum] = useState(0);
  const [count, setCount] = useState(1);
  const [pageNumArr, setPageNumArr] = useState([1]);
  const [docCount, setDocCount] = useState(0);
  const gridRef = useRef();
  useEffect(() => {
    fetch("http://localhost:8000/protein_cluster")
      .then((res) => res.json())
      .then((data) => setMessage(data));
  }, []);

  let data1 = [];
  for (let i = 0; i < message.length; i++) {
    data1.push(message[i]["_source"]);
  }

  const [gridApi, setGridApi] = useState();
  const rowData = data1;
  const onPageNumChanged = (event) => {
    var value = document.getElementById("page-num").value;
    setPageNum(value);
    setCount(value);
    console.log("count1:" + count);
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

  const onBtNext = (event) => {
    if (count < docCount / pageSize) {
      setPageNum((prevPageNum) => {
        console.log("Updated pageNum:", prevPageNum + 1);
        return prevPageNum + 1;
      });
      setCount((prevCount) => prevCount + 1);
    }
  };

  const onBtPrevious = (event) => {
    if (pageNum + 1 !== 1) {
      var x = pageNum;
      setPageNum(x - 1);
      setCount(count - 1);
    }
  };
  const defColumnDefs = {
    flex: 1,
    filter: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };

  const onGridReady = (params) => {
    setGridApi(params);
  };

  const applyQuickFilter = (e) => {
    const searchText = e.target.value;
    gridApi.api.setQuickFilter(searchText);
  };

  const onPageSizeChanged = useCallback(() => {
    var value = document.getElementById("page-size").value;
    gridRef.current.api.paginationSetPageSize(Number(value));
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

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
      </Container>
      <div className="rowC">
        <div className="sidebar1" style={{ height: "45rem" }}>
          <h2
            style={{
              margin: "26px",
              color: "#1463B9",
              fontFamily: "Montserrat",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "130%",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            FILTER
          </h2>

          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">InterPro ID</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-id-box"
                  placeholder="Search..."
                  style={{
                    width: "80%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">Name</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-name-box"
                  placeholder="Search..."
                  style={{
                    width: "80%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="AppBox1">
        <div className="example-header" style={{ marginLeft: "35px" }}>
          <form
            onSubmit={onFilterTextBoxChanged}
            style={{ display: "inline", position: "relative" }}
          >
            <input
              type="text"
              id="filter-text-box"
              placeholder="Search..."
              onInput={onFilterTextBoxChanged}
              style={{
                width: "30%",
                padding: "0.25rem 0.75rem",
                borderRadius: "10px 0 0 10px",
                borderColor: "#1463B9",
                display: "inline",
                position: "relative",
              }}
            />
            <button
              type="submit"
              style={{
                display: "inline",
                position: "relative",
                top: "0.3em",
                backgroundColor: "#1463B9",
                borderColor: "#1463B9",
                cursor: "pointer",
                width: "5%",
                borderRadius: "0 10px 10px 0",
              }}
            >
              <Search />
            </button>
          </form>
          <span style={{ marginLeft: "5%" }}>Records Per Page</span>
          <select onChange={onPageSizeChanged} value={pageSize} id="page-size">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
          </select>
          <span style={{ marginLeft: "5%" }}>Page</span>
          <select onChange={onPageNumChanged} value={pageNum + 1} id="page-num">
            {pageNumArr}
          </select>
          <span style={{ marginLeft: "1%" }}>
            out of {Math.round(docCount / pageSize)}
          </span>
          <button
            onClick={onBtPrevious}
            style={{
              marginLeft: "5%",
              fontWeight: "bold",
              marginLeft: "3%",
              marginTop: "10px",
              color: "#F6921E",
              background: "white",
              fontSize: "20",
              padding: ".3em 2em",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Left_Arrow
              style={{
                marginRight: "10px",
                paddingTop: "5px",
                display: "inline",
                position: "relative",
                top: "0.15em",
              }}
            />
            prev
          </button>
          <button
            onClick={onBtNext}
            style={{
              fontWeight: "bold",
              marginTop: "10px",
              marginLeft: "1%",
              color: "#F6921E",
              background: "white",
              fontSize: "20",
              padding: "2em .3em ",
              border: "none",
              cursor: "pointer",
            }}
          >
            next
            <Right_Arrow
              style={{
                marginLeft: "10px",
                paddingTop: "5px",
                display: "inline",
                position: "relative",
                top: "0.15em",
              }}
            />
          </button>
        </div>

        <div
          className="ag-theme-material ag-cell-wrap-text ag-theme-alpine"
          style={{ height: 600 }}
        >
          <AgGridReact
            className="ag-cell-wrap-text"
            ref={gridRef}
            rowData={rowData}
            columnDefs={columns}
            defaultColDef={defColumnDefs}
            onGridReady={onGridReady}
            cacheQuickFilter={true}
            enableCellTextSelection={true}
            pagination={true}
            overlayNoRowsTemplate={
              '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">Loading</span>'
            }
            paginationPageSize={50}
          />
        </div>
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
          <Download_Logo
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
    </>
  );
}
export default App;
