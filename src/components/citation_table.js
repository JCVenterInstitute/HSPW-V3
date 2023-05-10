import "./filter.css";
import React, { useState,useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { Link } from "react-router-dom";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { DATA } from "./data_citations";

function LinkComponent(props: ICellRendererParams) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={'http://localhost:3000/citation/'+props.value}
    >
      {props.value}
    </a>
  );
}

function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("http://localhost:8000/citation")
      .then((res) => res.json())
      .then((data) => setMessage(data));

  }, []);
  let data1 = [];
  for(let i = 0; i < message.length;i++){
    data1.push(message[i]["_source"]);
  }

  const [gridApi, setGridApi] = useState();
  const rowData = data1;

  const columns = [
    {
      headerName: "Citation",
      field: "CitationID",
      cellRenderer: "LinkComponent",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      minWidth:185,
      wrapText: true
    },
    { headerName: "Date of Publication", field: "Date of Publication",maxWidth:205,wrapText: true,suppressSizeToFit: true, sortable: true,sort: 'asc' },
    { headerName: "Title", field: "Title",wrapText: true,autoHeight: true,cellStyle:{'word-break': 'break-word'} },
    { headerName: "Journal", field: "Journal",wrapText: true,maxWidth:145,maxWidth:145 },

];

  const defColumnDefs = { flex: 1, filter: true,wrapHeaderText: true,
    autoHeaderHeight: true, };

  const onGridReady = (params) => {
    setGridApi(params);
    expandFilters(params, "Cluster");
  };

  const expandFilters = (params, ...filters) => {
    const applyFilters = filters?.length > 0 ? filters : null;
    params.api.getToolPanelInstance("filters").expandFilters(applyFilters);
  };

  const applyQuickFilter = (e) => {
    const searchText = e.target.value;
    gridApi.api.setQuickFilter(searchText);
  };
  return (
    <div className="AppBox1">
      <div className="ag-theme-material ag-cell-wrap-text ag-theme-alpine" style={{ height: 600 }}>
        <AgGridReact
          className="ag-cell-wrap-text"
          rowData={rowData}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'
          }
          overlayNoRowsTemplate={
            '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">Loading</span>'
          }
          columnDefs={columns}
          frameworkComponents={{
            LinkComponent
          }}
          defaultColDef={defColumnDefs}
          onGridReady={onGridReady}
          pagination= {true}
          paginationPageSize= {50}
          sideBar={{
            position: 'left',
            toolPanels: [
              {
                id: "columns",
                labelDefault: "Columns",
                labelKey: "columns",
                iconKey: "columns",
                toolPanel: "agColumnsToolPanel",
                toolPanelParams: {
                  suppressPivotMode: true,
                  suppressRowGroups: true,
                  suppressValues: true,
                  suppressColumnFilter: false,
                  suppressColumnSelectAll: false,
                },
              },
              {
                id: "filters",
                labelDefault: "Filters",
                labelKey: "filters",
                iconKey: "filter",
                toolPanel: "agFiltersToolPanel",
                toolPanelParams: {
                  suppressFilterSearch: false,
                },
              },
              {
                id: "QuickSearch",
                labelDefault: "Quick Search",
                labelKey: "QuickSearch",
                iconKey: "menu",
                toolPanel: () => (
                  <div>
                    <h4>Global Search</h4>
                    <input
                      placeholder="Search..."
                      type="search"
                      style={{
                        width: 190,
                        height: 35,
                        outline: "none",
                        border: "none",
                        borderBottom: `1px #181616 solid`,
                        padding: `0 5px`,
                      }}
                      onChange={applyQuickFilter}
                    />
                  </div>
                ),
              },
            ],
            defaultToolPanel: 'filters'
            // position: "right",
          }}
        />
      </div>
    </div>
  );
}

export default App;