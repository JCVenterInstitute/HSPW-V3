import "./filter.css";
import React, { useState, useEffect,useCallback,useRef } from "react";
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
    { headerName: "Date of Publication", field: "Date of Publication",maxWidth:205, sortable: true,wrapText: true,suppressSizeToFit: true, sortable: true,sort: 'asc' },
    { headerName: "Title", field: "Title",wrapText: true,autoHeight: true,cellStyle:{'word-break': 'break-word'}, sortable: true },
    { headerName: "Journal", field: "Journal",wrapText: true,maxWidth:145,maxWidth:145, sortable: true },

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
  const gridRef = useRef();

  const paginationNumberFormatter = useCallback((params) => {
    return params.value.toLocaleString();
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    gridRef.current.api.paginationGoToPage(0);
  }, []);

  const onPageSizeChanged = useCallback(() => {
    var value = document.getElementById('page-size').value;
    gridRef.current.api.paginationSetPageSize(Number(value));
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    );
  }, []);

  const onPrintQuickFilterTexts = useCallback(() => {
    gridRef.current.api.forEachNode(function (rowNode, index) {
      console.log(
        'Row ' +
          index +
          ' quick filter text is ' +
          rowNode.quickFilterAggregateText
      );
    });
  }, []);

  return (
    <div className="AppBox1">
      <div className="example-header" style={{marginLeft:'35px'}}>
      <label>Search: </label>
      <input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
            style={{width:'50%',padding:'0.25rem 0.75rem'}}
          />
          <b style={{marginLeft:'15%'}}>Page size: </b>
          <select onChange={onPageSizeChanged} id="page-size">
            <option value="50" selected={true}>
              50
            </option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
          </select>

          <button
            onClick={onBtExport}
            style={{ marginBottom: '5px', fontWeight: 'bold', textAlign: 'right',marginLeft:'3%' }}
          >
            Export to Excel
          </button>
        </div>
      <div className="ag-theme-material ag-cell-wrap-text ag-theme-alpine" style={{ height: 600 }}>
        <AgGridReact
          className="ag-cell-wrap-text"
          ref={gridRef}
          cacheQuickFilter={true}
          paginationNumberFormatter={paginationNumberFormatter}
          onFirstDataRendered={onFirstDataRendered}
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