import "./filter.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { Link } from "react-router-dom";
import { rgb } from "d3";
import "./table.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import CustomHeaderGroup from "./customHeaderGroup.jsx";
import { TransitEnterexit, WorkRounded } from "@mui/icons-material";
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
            color: "#FFF",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        ></div>
        {d}
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
          }}
        >
          {d}
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
          }}
        >
          {d}
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

function IHCComponent(props: ICellRendererParams) {
  const d = props.value;
  console.log(d);
  if (d === "Low") {
    return (
      <svg
        width={95}
        height={65}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <rect width={95} height={65} fill="rgb(180,250,180)">
          <title>Low</title>
        </rect>
        <text
          x="30"
          y="37"
          class="heavy"
          style={{ fill: "black", stroke: "black" }}
        >
          Low
        </text>
      </svg>
    );
  } else if (d === "Medium") {
    return (
      <svg
        width={95}
        height={65}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <rect width={95} height={65} fill="rgb(70,170,70)">
          <title>Medium</title>
        </rect>
        <text
          x="16"
          y="37"
          class="heavy"
          style={{ fill: "white", stroke: "white" }}
        >
          Medium
        </text>
      </svg>
    );
  } else if (d === "High") {
    return (
      <svg
        width={95}
        height={65}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <rect width={95} height={65} fill="rgb(0,100,0)">
          <title>High</title>
        </rect>
        <text
          x="28"
          y="37"
          class="heavy"
          style={{ fill: "white", stroke: "white" }}
        >
          High
        </text>
      </svg>
    );
  } else if (d === "Not detected") {
    return (
      <svg
        width={95}
        height={65}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <g>
          <rect width={95} height={65} fill="rgb(255,255,255)">
            <title>Not uniquely observed</title>
          </rect>
          <text
            x="31"
            y="37"
            class="heavy"
            style={{ fill: "black", stroke: "black" }}
          >
            N/A
          </text>
        </g>
      </svg>
    );
  } else {
    return (
      <svg
        width={95}
        height={65}
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
        <rect width={95} height={65} style={{ fill: "url(#stripe2)" }}>
          <title>Data not available</title>
        </rect>
      </svg>
    );
  }
}

function LinkComponent(props: ICellRendererParams) {
  const d = props.value;
  console.log("123");
  if (d << 10) {
    return (
      <svg
        width={18}
        height={18}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <rect width={18} height={18} fill="rgb(250,180,180)">
          <title>Low</title>
        </rect>
      </svg>
    );
  } else if (d << 100) {
    return (
      <svg
        width={18}
        height={18}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <rect width={18} height={18} fill="rgb(190,70,70)">
          <title>Medium</title>
        </rect>
      </svg>
    );
  } else if (d > 100) {
    return (
      <svg
        width={18}
        height={18}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <rect width={18} height={18} fill="rgb(100,0,0)">
          <title>High</title>
        </rect>
      </svg>
    );
  }
}

function App() {
  const [gridApi, setGridApi] = useState();

  const [message, setMessage] = useState("");
  const [number, setNumber] = useState("");
  useEffect(() => {
    fetch("http://localhost:8000/protein")
      .then((res) => res.json())
      .then((data) => setMessage(data));
  }, []);
  let data1 = [];
  for (let i = 0; i < message.length; i++) {
    data1.push(message[i]["_source"]["Salivary Proteins"]);
  }

  const rowData = data1;
  console.log(rowData);
  const columns = [
    {
      headerName: "Accession",
      field: "Uniprot Accession",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      width: "205",
      cellStyle: { "word-break": "break-word" },
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Gene Symbol",
      minWidth: "135",
      field: "Gene Symbol",
      wrapText: true,
      autoHeight: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      cellStyle: { "word-break": "break-word" },
    },
    {
      headerName: "Protein Name",
      minWidth: "135",
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
      field: "Expert Opinion",
      autoHeight: true,
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
          field: "WS",
          minWidth: "105",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          field: "Par",
          minWidth: "105",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          field: "Sub",
          minWidth: "105",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          headerName: "B",
          field: "Plasma_abundance",
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
      minWidth: "90",
      autoHeight: true,
      wrapText: true,
      cellRenderer: "WSComponent",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      children: [
        {
          field: "value",
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
      <div
        className="ag-theme-material ag-cell-wrap-text ag-theme-alpine"
        style={{ height: 600 }}
      >
        <AgGridReact
          className="ag-cell-wrap-text"
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={defColumnDefs}
          frameworkComponents={{
            LinkComponent,
            WSComponent,
            IHCComponent,
          }}
          overlayNoRowsTemplate={
            '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">Loading</span>'
          }
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={50}
          rowHeight={rowHeight}
        />
      </div>
    </div>
  );
}

export default App;
