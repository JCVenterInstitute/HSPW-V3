import "./filter.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { rgb } from "d3";
import "./table.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import CustomHeaderGroup from "./customHeaderGroup.jsx";
import { ICellRendererParams } from "ag-grid-community";

const DATA = [
  {
    uniprot_accession: "P02814",
    gene_symbol: "SMR3B",
    protein_name: "Submaxillary gland androgen-regulated protein 3B",
    expert_opinion: "",
    WS: 4034.84,
    Par: 1934.69,
    Sub: 6954.67,
    B: "",
    IHC: "?",
    mRNA: 217144.9,
  },
  {
    uniprot_accession: "P15516",
    gene_symbol: "HTN3",
    protein_name: "Histatin-3",
    expert_opinion: "",
    WS: 63.53,
    Par: 35.53,
    Sub: 90.41,
    B: "",
    IHC: "high",
    mRNA: 136053.4,
  },
  {
    uniprot_accession: "Q96DA0",
    gene_symbol: "ZG16B",
    protein_name: "Zymogen granule protein 16 homolog B",
    expert_opinion: "",
    WS: 2147.86,
    Par: 91,
    Sub: 606.94,
    B: "",
    IHC: "high",
    mRNA: 63926.2,
  },
  {
    uniprot_accession: "P15515",
    gene_symbol: "HTN1",
    protein_name: "Histatin-1",
    expert_opinion: "",
    WS: 158.21,
    Par: 199.13,
    Sub: 689.49,
    B: "",
    IHC: "not detected",
    mRNA: 48372.4,
  },
  {
    uniprot_accession: "P01036",
    gene_symbol: "CST4",
    protein_name: "Cystatin-S",
    expert_opinion: "",
    WS: 15114.49,
    Par: 231.75,
    Sub: 8950.85,
    B: "",
    IHC: "high",
    mRNA: 29036.2,
  },
  {
    uniprot_accession: "P01037",
    gene_symbol: "CST1",
    protein_name: "Cystatin-SN",
    expert_opinion: "",
    WS: 9660.64,
    Par: 142.14,
    Sub: 7420.58,
    B: "",
    IHC: "medium",
    mRNA: 28401.8,
  },
  {
    uniprot_accession: "Q8TAX7",
    gene_symbol: "MUC7",
    protein_name: "Mucin-7",
    expert_opinion: "",
    WS: 156.08,
    Par: 25.28,
    Sub: 465.28,
    B: "",
    IHC: "high",
    mRNA: 26019.1,
  },
];

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
          }}
        >
          {d}
        </div>
      </>
    );
  } else if (d < 100 || d === "medium") {
    return (
      <svg
        width={108}
        height={78}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <rect width={108} height={78} fill="rgb(190,70,70)">
          <title>Medium</title>
        </rect>
      </svg>
    );
  } else if (d > 100 || d === "high") {
    return (
      <svg
        width={108}
        height={78}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <rect width={108} height={78} fill="rgb(100,0,0)">
          <title>High</title>
        </rect>
      </svg>
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
  const [message1, setMessage1] = useState("");
  const [number, setNumber] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState(50);
  const [count, setCount] = useState(2);
  const [docCount, setDocCount] = useState(0);

  useEffect(() => {
    fetch(
      "http://localhost:8000/saliva_protein_table/" + pageSize + "/" + pageNum
    )
      .then((res) => res.json())
      .then((data) => setMessage(data));
    fetch("http://localhost:8000/saliva_protein_count/")
      .then((res) => res.json())
      .then((data) => setDocCount(data.count));
  }, [pageSize, pageNum]);
  console.log(docCount);
  let data1 = [];
  for (let i = 0; i < message.length; i++) {
    data1.push(message[i]["_source"]);
  }
  console.log(data1);
  const rowData = data1;
  console.log(rowData);
  const columns = [
    {
      headerName: "Accession",
      field: "UniProt Accession",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      width: "205",
      cellStyle: { "word-break": "break-word" },
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Gene Symbol",
      minWidth: "65",
      field: "Gene Symbol",
      wrapText: true,
      autoHeight: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      cellStyle: { "word-break": "break-word" },
    },
    {
      headerName: "Protein Name",
      minWidth: "65",
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
      minWidth: "65",
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
          minWidth: "105",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          headerName: "Par",
          field: "parotid_gland_abundance",
          minWidth: "105",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          headerName: "Sub",
          field: "sm/sl_abundance",
          minWidth: "105",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          headerName: "B",
          field: "plasma_abundance",
          minWidth: "105",
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
      minWidth: "105",
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
          minWidth: "125",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          field: "specificity",
          minWidth: "170",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
      ],
    },
  ];
  const gridRef = useRef();

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
      console.log(count);
    }
  };

  const onBtPrevious = useCallback(() => {
    if (count !== 1) {
      setPageNum(gridRef.current.api.paginationGetCurrentPage() - 1);
    }
  }, []);
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

  const rowHeight = 20;
  return (
    <div className="AppBox1">
      <div className="example-header" style={{ marginLeft: "35px" }}>
        <div style={{ marginBottom: "10px" }}>
          <button onClick={onBtPrevious}>To Previous</button>
          <button onClick={onBtNext}>To Next</button>
        </div>
        <label>Search: </label>
        <input
          type="text"
          id="filter-text-box"
          placeholder="Filter..."
          onInput={onFilterTextBoxChanged}
          style={{ width: "50%", padding: "0.25rem 0.75rem" }}
        />
        <b style={{ marginLeft: "15%" }}>Page size: </b>
        <select onChange={onPageSizeChanged} value={pageSize} id="page-size">
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
        </select>

        <button
          onClick={onBtExport}
          style={{
            marginBottom: "5px",
            fontWeight: "bold",
            textAlign: "right",
            marginLeft: "3%",
          }}
        >
          Export to Excel
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
    </div>
  );
}

export default App;
