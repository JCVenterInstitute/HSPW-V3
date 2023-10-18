import "./filter.css";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { rgb } from "d3";
import "./table.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CustomHeaderGroup from "./customHeaderGroup.jsx";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ICellRendererParams } from "ag-grid-community";
import { ReactComponent as Download_Logo } from "./table_icon/download.svg";
import { ReactComponent as Left_Arrow } from "./table_icon/left_arrow.svg";
import { ReactComponent as Right_Arrow } from "./table_icon/right_arrow.svg";
import { ReactComponent as Search } from "./table_icon/search.svg";

const styles = {
  transform: "translate(0, 0)",
};

const styles1 = {
  transform: "translate(2, 0)",
};
function WSComponent(props: ICellRendererParams) {
  const d = props.value;
  if (d < 10 || d === "low") {
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
          {Number(d).toFixed(2)}
        </div>
      </>
    );
  } else if (d < 100 || d === "medium") {
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
          {Number(d).toFixed(2)}
        </div>
      </>
    );
  } else if (d > 100 || d === "high") {
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
          {Number(d).toFixed(2)}
        </div>
      </>
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

function opinionComponent(props: ICellRendererParams) {
  const d = props.value;
  if (d === "Confirmed") {
    return <span>C</span>;
  } else if (d === "Unsubstantiated") {
    return <span>US</span>;
  }
}

function IHCComponent(props: ICellRendererParams) {
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
          N/A
        </div>
      </>
    );
  } else {
    return (
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
        <rect style={{ fill: "url(#stripe2)", width: "100%", height: "100%" }}>
          <title>Data not available</title>
        </rect>
      </svg>
    );
  }
}

function LinkComponent(props: ICellRendererParams) {
  const d = props.value;

  if (d < 10 || d === "low") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(250,180,180)",
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
      </>
    );
  } else if (d < 100 || d === "medium") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(190,70,70)",
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
      </>
    );
  } else if (d > 100 || d === "high") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(100,0,0)",
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
      </>
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

function App() {
  const [gridApi, setGridApi] = useState();
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(1);
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(2);
  const [docCount, setDocCount] = useState(0);
  const [pageNumArr, setPageNumArr] = useState([1]);
  const [accessionC, setAccessionC] = useState(false);
  const [geneC, setGeneC] = useState(false);
  const [nameC, setNameC] = useState(false);
  const [open, setOpen] = useState([false, false]);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);
  const [open7, setOpen7] = useState(false);
  const [open8, setOpen8] = useState(false);
  const [open9, setOpen9] = useState(false);
  const [open10, setOpen10] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [genePrefix, setGenePrefix] = useState("");
  const [namePrefix, setNamePrefix] = useState("");
  const [opCount, setOpCount] = useState([]);
  const [IHCCount, setIHCCount] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    fetch(
      "http://localhost:8000/saliva_protein_table/" + pageSize + "/" + pageNum
    )
      .then((res) => res.json())
      .then((data) => {
        setMessage(data);
        let data1 = [];
        for (let i = 0; i < message.length; i++) {
          data1.push(message[i]["_source"]);
        }

        setRowData(data1);
      });

    fetch("http://localhost:8000/opCount")
      .then((res) => res.json())
      .then((data) => {
        setOpCount(data);
      });
    /*
    fetch("http://localhost:8000/IHCCount")
      .then((res) => res.json())
      .then((data) => {
        setIHCCount(data);
      });

    fetch("http://localhost:8000/saliva_protein_count/")
      .then((res) => res.json())
      .then((data) => setDocCount(data.count));
    const newOptions = [];
    for (let i = 1; i <= Math.round(docCount / pageSize); i++) {
      newOptions.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    setPageNumArr(newOptions);
    if (accessionC && prefix.trim() !== "") {
      fetch(
        "http://localhost:8000/filter_search/saliva_protein_test/uniprot_accession/" +
          prefix +
          "/" +
          pageSize +
          "/" +
          pageNum
      )
        .then((res) => res.json())
        .then((data) => {
          setMessage(data.hits);
          setDocCount(data.total.value - 1);
        });
      let data1 = [];
      for (let i = 0; i < message.length; i++) {
        data1.push(message[i]["_source"]);
      }
      setRowData(data1);
    }
    */
  }, [
    IHCCount,
    pageNumArr,
    pageSize,
    pageNum,
    docCount,
    opCount,
    accessionC,
    prefix,
    rowData,
  ]);

  const columns = [
    {
      headerName: "Accession",
      field: "UniProt Accession",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      minWidth: "135",
      wordWrap: true,
      autoHeight: true,
      cellStyle: { "word-break": "break-word" },
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Gene Symbol",
      minWidth: "120",
      field: "Gene Symbol",
      wrapText: true,
      autoHeight: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      cellStyle: { "word-break": "break-word" },
    },
    {
      headerName: "Protein Name",
      minWidth: "115",
      maxHeight: "5",
      field: "Protein Name",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      autoHeight: true,
      cellStyle: { "word-break": "break-word" },
    },
    {
      headerName: "Expert Opinion",
      minWidth: "120",
      field: "expert_opinion",
      autoHeight: true,
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
          minWidth: "95",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          headerName: "Par",
          field: "parotid_gland_abundance",
          minWidth: "95",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          headerName: "Sub",
          field: "sm/sl_abundance",
          minWidth: "95",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          headerName: "B",
          field: "plasma_abundance",
          minWidth: "95",
          cellRenderer: "LinkComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
      ],
      autoHeight: true,
      wrapText: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "IHC",
      field: "IHC",
      minWidth: "95",
      autoHeight: true,
      wrapText: true,
      cellRenderer: "IHCComponent",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "mRNA",
      headerGroupComponent: CustomHeaderGroup,
      minWidth: "105",
      autoHeight: true,
      wrapText: true,
      cellRenderer: "WSComponent",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      children: [
        {
          headerName: "value",
          field: "mRNA",
          minWidth: "95",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          field: "specificity",
          minWidth: "105",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          field: "specificity score",
          minWidth: "105",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
      ],
    },
  ];
  const gridRef = useRef();

  const searchAccession = () => {
    setAccessionC(true);
  };

  const searchGene = () => {
    setGeneC(true);
  };

  const searchName = () => {
    setNameC(true);
  };

  const paginationNumberFormatter = useCallback((params) => {
    return params.value.toLocaleString();
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    gridRef.current.api.paginationGoToPage(0);
  }, []);

  const onPageSizeChanged = (event) => {
    var value = document.getElementById("page-size").value;
    gridRef.current.api.paginationSetPageSize(Number(value));
    setPageSize(value);
  };

  const onPageNumChanged = (event) => {
    var value = document.getElementById("page-num").value;
    setPageNum(value);
  };

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
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
  const defColumnDefs = {
    flex: 1,
    filter: true,
    resizable: true,
    wrapHeaderText: true,
    wrapText: true,
    autoHeaderHeight: true,
    autoHeight: true,
    headerStyle: { "word-break": "break-word" },
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

  const onGridReady = (params) => {
    setGridApi(params);
  };

  const handleClick1 = () => {
    setOpen1((prev) => !prev);
  };

  const handleClick2 = () => {
    setOpen2((prev) => !prev);
  };

  const handleClick3 = () => {
    setOpen3((prev) => !prev);
  };
  const handleClick4 = () => {
    setOpen4((prev) => !prev);
  };
  const handleClick5 = () => {
    setOpen5((prev) => !prev);
  };
  const handleClick6 = () => {
    setOpen6((prev) => !prev);
  };
  const handleClick7 = () => {
    setOpen7((prev) => !prev);
  };
  const handleClick8 = () => {
    setOpen8((prev) => !prev);
  };
  const handleClick9 = () => {
    setOpen9((prev) => !prev);
  };
  const handleClick10 = () => {
    setOpen10((prev) => !prev);
  };

  const handleAccessionChange = (e) => {
    setPrefix(e.target.value);
  };

  const handleGeneChange = (e) => {
    setGenePrefix(e.target.value);
  };

  const handleNameChange = (e) => {
    setNamePrefix(e.target.value);
  };

  const rowHeight = 20;
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
          <ListItem button onClick={handleClick1} divider="true">
            {open1 ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
            <ListItemText primary={"Uniprot Accession"} />
          </ListItem>
          <div>
            <Collapse in={open1} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{ border: "1px groove" }}
              >
                <input
                  type="text"
                  id="filter-accession-box"
                  placeholder="Search..."
                  onChange={handleAccessionChange}
                  style={{
                    width: "70%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px 0 0 10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={prefix}
                />
                <button
                  type="submit"
                  onClick={searchAccession}
                  style={{
                    display: "inline",
                    position: "relative",
                    top: "0.3em",
                    backgroundColor: "#1463B9",
                    borderColor: "#1463B9",
                    cursor: "pointer",
                    width: "15%",
                    borderRadius: "0 10px 10px 0",
                  }}
                >
                  <Search />
                </button>
              </List>
            </Collapse>
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
          className="ag-theme-material ag-cell-wrap-text ag-theme-alpine"
          style={{ height: 600 }}
        >
          <AgGridReact
            className="ag-cell-wrap-text"
            rowData={rowData}
            columnDefs={columns}
            ref={gridRef}
            defaultColDef={defColumnDefs}
            frameworkComponents={{
              LinkComponent,
              WSComponent,
              IHCComponent,
              opinionComponent,
            }}
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
            marginTop: "10px",
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
