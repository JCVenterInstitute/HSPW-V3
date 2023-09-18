import "./filter.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ICellRendererParams } from "ag-grid-community";

function LinkComponent(props: ICellRendererParams) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={"http://localhost:3000/gene/" + props.value}
    >
      EntrezGene:{props.value}
    </a>
  );
}

function App() {
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState("");
  useEffect(() => {
    fetch("http://localhost:8000/genes")
      .then((res) => res.json())
      .then((data) => setMessage(data));
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
    expandFilters(params, "gene");
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

  const onPrintQuickFilterTexts = useCallback(() => {
    gridRef.current.api.forEachNode(function (rowNode, index) {
      console.log(
        "Row " +
          index +
          " quick filter text is " +
          rowNode.quickFilterAggregateText
      );
    });
  }, []);

  return (
    <div className="AppBox1">
      <div className="example-header" style={{ marginLeft: "35px" }}>
        <label>Search: </label>
        <input
          type="text"
          id="filter-text-box"
          placeholder="Filter..."
          onInput={onFilterTextBoxChanged}
          style={{ width: "50%", padding: "0.25rem 0.75rem" }}
        />
        <b style={{ marginLeft: "15%" }}>Page size: </b>
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
        className="ag-theme-material ag-cell-wrap-text"
        style={{ height: 600 }}
      >
        <AgGridReact
          className="ag-cell-wrap-text"
          ref={gridRef}
          cacheQuickFilter={true}
          paginationNumberFormatter={paginationNumberFormatter}
          onFirstDataRendered={onFirstDataRendered}
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={defColumnDefs}
          overlayNoRowsTemplate={
            '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">Loading</span>'
          }
          onGridReady={onGridReady}
          pagination={true}
          frameworkComponents={{
            LinkComponent,
          }}
          paginationPageSize={50}
          sideBar={{
            position: "left",
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
            defaultToolPanel: "filters",
            // position: "right",
          }}
        />
      </div>
    </div>
  );
}

export default App;
