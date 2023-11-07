import "./filter.css";
import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import Filter from "./filter.js";
import DonutChart_google from "../components/donutChart_google.tsx";
import BarChart_google from "../components/barChart_google.tsx";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { DATA } from "./data";
import { ICellRendererParams } from "ag-grid-community";
import "./table.css";
import first_pic from "./first_pic.png";
import second_pic from "./second_pic.png";
import third_pic from "./third_pic.png";

function LinkComponent(props: ICellRendererParams) {
  return (
    <>
      <a target="_blank" rel="noopener noreferrer" href={props.value}>
        <img
          src={first_pic}
          style={{ marginLeft: "5px", marginRight: "5px" }}
        />
      </a>
      <a target="_blank" rel="noopener noreferrer" href={props.value}>
        <img
          src={second_pic}
          style={{ marginLeft: "5px", marginRight: "5px" }}
        />
      </a>
      <a target="_blank" rel="noopener noreferrer" href={props.value}>
        <img
          src={third_pic}
          style={{ marginLeft: "5px", marginRight: "5px" }}
        />
      </a>
    </>
  );
}

function App() {
  const [gridApi, setGridApi] = useState();
  const rowData = DATA;

  const rowHeight = 20;

  const columns = [
    {
      headerName: "Study #",
      field: "study",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      maxWidth: 141.5,
      maxHeight: 10,
      autoHeight: true,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Study Name",
      field: "project",
      autoHeight: true,
      wrapText: true,
      cellStyle: { "word-break": "break-word" },
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Disease",
      field: "disease",
      maxWidth: 175.8,
      autoHeight: true,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Institution",
      field: "institution",
      maxWidth: 290,
      autoHeight: true,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Year",
      field: "year",
      maxWidth: 115,
      autoHeight: true,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Download",
      field: "download",
      cellRenderer: "LinkComponent",
      maxWidth: 205,
      autoHeight: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
  ];

  const defColumnDefs = {
    flex: 1,
    filter: true,
    editable: true,
    sortable: true,
  };

  const onGridReady = (params) => {
    setGridApi(params);
  };

  return (
    <>
      <div className="AppBox" style={{ width: "76%" }}>
        <div
          className="ag-theme-material ag-cell-wrap-text ag-theme-alpine"
          style={{ height: 600 }}
        >
          <AgGridReact
            rowData={rowData}
            frameworkComponents={{
              LinkComponent,
            }}
            rowHeight={rowHeight}
            className="ag-cell-wrap-text"
            columnDefs={columns}
            defaultColDef={defColumnDefs}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </>
  );
}

export default App;
