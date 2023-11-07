import "./filter.css";
import "./table.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ICellRendererParams } from "ag-grid-community";
import { ReactComponent as Download_Logo } from "./table_icon/download.svg";
import { ReactComponent as Left_Arrow } from "./table_icon/left_arrow.svg";
import { ReactComponent as Right_Arrow } from "./table_icon/right_arrow.svg";
import { ReactComponent as Search } from "./table_icon/search.svg";
function LinkComponent(props: ICellRendererParams) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={"http://localhost:3000/gene/" + props.value}
    >
      {props.value}
    </a>
  );
}
const rowHeight = 20;
function App() {
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState("");
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(0);
  const [count, setCount] = useState(1);
  const [docCount, setDocCount] = useState(0);
  const [queryArr, setQueryArr] = useState([]);
  const [geneIDC, setGeneIDC] = useState(false);
  const [pageNumArr, setPageNumArr] = useState([1]);
  const [rowData, setRowData] = useState([]);
  const [geneNameC, setGeneNameC] = useState(false);
  const [gridApi, setGridApi] = useState();
  const [geneID, setGeneID] = useState("");
  const [geneName, setGeneName] = useState("");
  const [locationC, setLocationC] = useState(false);
  const [geneLocation, setGeneLocation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `http://localhost:8000/genes/${pageSize}/${pageNum}`
      );
      const json = data.json();
      return json;
    };
    let test = [];

    const queryString = encodeURIComponent(JSON.stringify(queryArr));
    const url = `http://localhost:8000/genes_search/${pageSize}/${pageNum}/`;

    const customHeaders = {
      "Content-Type": "application/json",
    };
    const fetchQuery = async () => {
      console.log(JSON.stringify(queryArr));
      const data = await fetch(url, {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(queryArr),
      });
      const json = data.json();
      console.log("73" + JSON.stringify(json));
      return json;
    };
    console.log(url);

    if (geneIDC === true || geneNameC === true || locationC === true) {
      const queryResult = fetchQuery().catch(console.errror);
      queryResult.then((value) => {
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
      });
    } else {
      const result = fetchData().catch(console.errror);
      console.log(`http://localhost:8000/genes/${pageSize}/${pageNum}`);
      console.log(result);
      result.then((value) => {
        if (value.hits) {
          console.log(value);
          let data1 = [];
          for (let i = 0; i < value.hits.length; i++) {
            data1.push(value.hits[i]["_source"]);
          }
          console.log(data1);
          setRowData(data1);
        }
        setDocCount(value.total.value);
        const newOptions = [];
        for (let i = 1; i <= Math.round(value.total.value / pageSize); i++) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }
        setPageNumArr(newOptions);
      });
    }
  }, [geneID, pageSize, pageNum, geneName, queryArr]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `http://localhost:8000/genes/${pageSize}/${pageNum}`
      );
      const json = data.json();
      return json;
    };
    const result = fetchData().catch(console.errror);
    console.log(result);
    result.then((value) => {
      if (value.hits) {
        console.log(value);
        let data1 = [];
        for (let i = 0; i < value.hits.length; i++) {
          data1.push(value.hits[i]["_source"]);
        }
        console.log(data1);
        setRowData(data1);
      }
      setDocCount(value.total.value);
      const newOptions = [];
      for (let i = 1; i <= Math.round(value.total.value / pageSize); i++) {
        newOptions.push(
          <option key={i} value={i}>
            {i}
          </option>
        );
      }
      setPageNumArr(newOptions);
    });
  }, []);

  const columns = [
    {
      headerName: "Gene",
      field: "GeneID",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      cellRenderer: "LinkComponent",
    },
    {
      headerName: "Gene Name",
      field: "Gene Name",
      wrapText: true,
      autoHeight: true,
      cellStyle: { "word-break": "break-word" },
    },
    { headerName: "Location", field: "Location" },
  ];

  const defColumnDefs = { flex: 1, filter: true };

  const onGridReady = (params) => {
    setGridApi(params);
  };

  const gridRef = useRef();

  const paginationNumberFormatter = useCallback((params) => {
    return params.value.toLocaleString();
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    gridRef.current.api.paginationGoToPage(0);
  }, []);

  const onPageSizeChanged = useCallback(() => {
    var value = document.getElementById("page-size").value;
    gridRef.current.api.paginationSetPageSize(Number(value));
  }, []);

  const handleIDChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setGeneIDC(false);
    } else {
      setGeneIDC(true);
    }

    // Add new element for InterPro ID with updated input value
    const newIDQuery =
      inputValue !== ""
        ? {
            wildcard: {
              GeneID: {
                value: `${inputValue}*`,
                case_insensitive: true,
              },
            },
          }
        : null;

    setGeneID(inputValue);
    updateQuery(newIDQuery);
  };

  const handleNameChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setGeneNameC(false);
    } else {
      setGeneNameC(true);
    }

    // Add new element for Name with updated input value
    const newNameQuery =
      inputValue !== ""
        ? {
            wildcard: {
              "Gene Name": {
                value: `${inputValue}*`,
                case_insensitive: true,
              },
            },
          }
        : null;

    setGeneName(inputValue);
    updateQuery(newNameQuery);
  };

  const handleLocationChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setLocationC(false);
    } else {
      setLocationC(true);
    }

    // Add new element for Name with updated input value
    const newNameQuery =
      inputValue !== ""
        ? {
            wildcard: {
              Location: {
                value: `${inputValue}*`,
                case_insensitive: true,
              },
            },
          }
        : null;

    setGeneLocation(inputValue);
    updateQuery(newNameQuery);
  };

  const updateQuery = (newQuery) => {
    setQueryArr((prevArray) => {
      // Remove existing queries of the same type (InterPro ID or Name)
      const filteredArray = prevArray.filter((p) => {
        return !(
          newQuery &&
          p.wildcard.hasOwnProperty(Object.keys(newQuery.wildcard)[0])
        );
      });

      // Add the new query to the filtered array
      return newQuery ? [...filteredArray, newQuery] : filteredArray;
    });
  };

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);

  const onBtNext = (event) => {
    if (count < docCount / pageSize) {
      var x = gridRef.current.api.paginationGetCurrentPage();
      console.log("count2:" + count);
      console.log("page num:" + pageNum);
      setPageNum(pageNum + 1);
      console.log("page num2:" + pageNum);
      setCount(count + 1);
    }
  };

  const onPageNumChanged = (event) => {
    var value = document.getElementById("page-num").value;
    setPageNum(value);
    setCount(value);
    console.log("count1:" + count);
  };

  const onBtPrevious = (event) => {
    if (pageNum !== 1) {
      var x = pageNum;
      setPageNum(x - 1);
      setCount(count - 1);
    }
  };
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

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
                <Typography variant="h6">Gene ID</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-id-box"
                  onChange={handleIDChange}
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
                  value={geneID}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">Gene Name</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  onChange={handleNameChange}
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
                  value={geneName}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">Location</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  onChange={handleLocationChange}
                  type="text"
                  id="filter-location-box"
                  placeholder="Search"
                  style={{
                    width: "80%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={geneLocation}
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
          <text style={{ marginLeft: "5%" }}>Records Per Page</text>
          <select id="page-size">
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
          className="ag-theme-material ag-cell-wrap-text ag-theme-alpine"
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
            frameworkComponents={{
              LinkComponent,
            }}
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
