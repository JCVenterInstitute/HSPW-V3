import "./filter.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { DATA } from "./data_signature";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomHeaderGroup from "./customHeaderGroup.jsx";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";

import { ICellRendererParams } from "ag-grid-community";
import { ReactComponent as Download_Logo } from "./table_icon/download.svg";
import { ReactComponent as Left_Arrow } from "./table_icon/left_arrow.svg";
import { ReactComponent as Right_Arrow } from "./table_icon/right_arrow.svg";
import { ReactComponent as Search } from "./table_icon/search.svg";

function App() {
  const [message, setMessage] = useState("");
  const [interpro_id, set_interpro_id] = useState("");
  const [idC, setidC] = useState(false);
  const [typeC, settypeC] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(1);
  const [count, setCount] = useState(2);
  const [docCount, setDocCount] = useState(0);
  const [pageNumArr, setPageNumArr] = useState([1]);
  const [typeCount, settypeCount] = useState([]);
  const [typeArr, settypeArr] = useState([false, false, false, false]);
  const [typeVal, settypeVal] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/protein_signature")
      .then((res) => res.json())
      .then((data) => setMessage(data));
    console.log("diu:" + 321);
    const fetchTypeCount = async () => {
      const data = await fetch("http://localhost:8000/signature_type_counts");
      const json = data.json();
      return json;
    };
    const countTypeResult = fetchTypeCount().catch(console.errror);

    countTypeResult.then((value) => {
      if (value) {
        settypeCount(value);
      }
    });
  }, []);

  let data1 = [];
  for (let i = 0; i < message.length; i++) {
    data1.push(message[i]["_source"]);
  }

  console.log(data1.length);

  const [gridApi, setGridApi] = useState();
  const rowData = data1;

  const columns = [
    {
      headerName: "InterPro_ID",
      field: "InterPro ID",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      headerCheckboxSelection: true,
      maxWidth: 320,
    },
    { headerName: "Type", field: "Type", wrapText: true, maxWidth: 145 },
    {
      headerName: "Name",
      field: "Name",
      wrapText: true,
      autoHeight: true,
      cellStyle: { "word-break": "break-word" },
    },
    {
      headerName: "# of Members",
      field: "# of Members.length",
      wrapText: true,
      maxWidth: 205,
    },
  ];

  const defColumnDefs = { flex: 1, filter: true };

  const onGridReady = (params) => {
    setGridApi(params);
  };

  const gridRef = useRef();

  const onPageSizeChanged = useCallback(() => {
    var value = document.getElementById("page-size").value;
    gridRef.current.api.paginationSetPageSize(Number(value));
  }, []);

  const onPageNumChanged = (event) => {
    var value = document.getElementById("page-num").value;
    setPageNum(value);
  };

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);

  const onBtNext = (event) => {
    if (count < docCount / pageSize) {
      var x = gridRef.current.api.paginationGetCurrentPage();
      setPageNum(x + count);
      setCount(count + 1);
    }
  };

  const onBtPrevious = (event) => {
    if (pageNum !== 1) {
      var x = pageNum;
      setPageNum(x - 1);
      setCount(count - 1);
    }
  };
  const rowHeight = 20;
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

  const filterType = (event) => {
    console.log(typeof event.target.value);
    if (event.target.value === "Protein Families") {
      settypeArr((prevTypeArr) => {
        const updatedTypeArr = [
          !prevTypeArr[0],
          prevTypeArr[1],
          prevTypeArr[2],
          prevTypeArr[3],
        ];
        if (updatedTypeArr[0] === true) {
          settypeC(true);
          settypeVal("families*");
        } else if (
          updatedTypeArr[0] === false &&
          updatedTypeArr[1] === false &&
          updatedTypeArr[2] === false &&
          updatedTypeArr[3] === false
        ) {
          settypeC(false);
          settypeVal("*");
        }
        return updatedTypeArr;
      });
    } else if (event.target.value === "Protein Domains") {
      settypeArr((prevTypeArr) => {
        const updatedTypeArr = [
          prevTypeArr[0],
          !prevTypeArr[1],
          prevTypeArr[2],
          prevTypeArr[3],
        ];
        if (updatedTypeArr[1] === true) {
          settypeC(true);
          settypeVal("not_detected*");
        } else if (
          updatedTypeArr[0] === false &&
          updatedTypeArr[1] === false &&
          updatedTypeArr[2] === false &&
          updatedTypeArr[3] === false
        ) {
          settypeC(false);
          settypeVal("*");
        }
        return updatedTypeArr;
      });
    } else if (event.target.value === "Protein Repeats") {
      settypeArr((prevTypeArr) => {
        const updatedTypeArr = [
          prevTypeArr[0],
          prevTypeArr[1],
          !prevTypeArr[2],
          prevTypeArr[3],
        ];
        if (updatedTypeArr[2] === true) {
          settypeC(true);
          settypeVal("low*");
        } else if (
          updatedTypeArr[0] === false &&
          updatedTypeArr[1] === false &&
          updatedTypeArr[2] === false &&
          updatedTypeArr[3] === false
        ) {
          settypeC(false);
          settypeVal("*");
        }
        return updatedTypeArr;
      });
    } else if (event.target.value === "Protein Sites") {
      settypeArr((prevTypeArr) => {
        const updatedTypeArr = [
          prevTypeArr[0],
          prevTypeArr[1],
          prevTypeArr[2],
          !prevTypeArr[3],
        ];
        if (updatedTypeArr[3] === true) {
          settypeC(true);
          settypeVal("n_a*");
        } else if (
          updatedTypeArr[0] === false &&
          updatedTypeArr[1] === false &&
          updatedTypeArr[2] === false &&
          updatedTypeArr[3] === false
        ) {
          settypeC(false);
          settypeVal("*");
        }
        return updatedTypeArr;
      });
    }
  };

  const handleIDChange = (e) => {
    if (e.target.value === "") {
      setidC(false);
    } else {
      setidC(true);
    }
    set_interpro_id(e.target.value);
  };

  return (
    <>
      <div className="rowC">
        <div className="sidebar1">
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
                  id="filter-accession-box"
                  placeholder="Search..."
                  onChange={handleIDChange}
                  style={{
                    width: "80%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={interpro_id}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">Type</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <text></text>
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
                <List
                  component="div"
                  disablePadding
                  sx={{ border: "1px groove" }}
                ></List>
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
          <text style={{ marginLeft: "5%" }}>Records Per Page</text>
          <select onChange={onPageSizeChanged} value={pageSize} id="page-size">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
          </select>
          <text style={{ marginLeft: "5%" }}>Page</text>
          <select onChange={onPageNumChanged} value={pageNum} id="page-num">
            {pageNumArr}
          </select>
          <text style={{ marginLeft: "1%" }}>
            out of {Math.round(docCount / pageSize)}
          </text>
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
          className="ag-theme-material ag-cell-wrap-text"
          style={{ height: 600 }}
        >
          <AgGridReact
            className="ag-cell-wrap-text"
            rowData={rowData}
            columnDefs={columns}
            ref={gridRef}
            defaultColDef={defColumnDefs}
            overlayNoRowsTemplate={
              '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">Loading</span>'
            }
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={50}
            rowHeight={rowHeight}
            suppressPaginationPanel={true}
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
