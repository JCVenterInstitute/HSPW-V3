import "./filter.css";
import React, { useState, useEffect,useCallback,useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { Link } from "react-router-dom";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { DATA } from "./data_cluster";

function App() {
  const [message, setMessage] = useState("");
  const gridRef = useRef();
  useEffect(() => {
    fetch("http://localhost:8000/protein_cluster")
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
      headerName: "Cluster",
      field: "Cluster ID",
      headerCheckboxSelection: true,
      maxWidth:195,
      minWidth:195,
      checkboxSelection: false,
      headerCheckboxSelection: false,
      wrapText: true
    },
    { headerName: "Representative Protein", field: "Representative Salivary Protein",maxWidth:205,wrapText: true,suppressSizeToFit: true, sortable: true },
    { headerName: "Representative Protein Name", field: "Representative_Protein_Name", sortable: true,wrapText: true,autoHeight: true,cellStyle:{'word-break': 'break-word'} },
    { headerName: "# of Members", field: "# of Members Salivary Protein.length", sortable: true,wrapText: true,maxWidth:145,maxWidth:145 },

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
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={defColumnDefs}
          onGridReady={onGridReady}
          cacheQuickFilter={true}
          pagination= {true}
          overlayNoRowsTemplate={
            '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">Loading</span>'
          }
          paginationNumberFormatter={paginationNumberFormatter}
          paginationPageSize= {50}
          onFirstDataRendered={onFirstDataRendered}
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