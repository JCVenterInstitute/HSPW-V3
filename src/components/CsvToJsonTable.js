import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { useEffect } from "react";
import axios from "axios";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import "./Filter.css";

function App() {
  const [testData, setData] = useState([]);
  const [colDefs, setcolDefs] = useState([]);

  async function fetchData() {
    try {
      const response = await axios.get(
        "https://raw.githubusercontent.com/choiwhmarco/hspw_new/main/test.json"
      );
      setData(response.data);
      setcolDefs(getDynamicColumns(response.data[0]));
    } catch (error) {
      console.error(error);
    }
  }

  const rowData = [
    { make: "Porsche", model: "Boxter", price: 72000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const getDynamicColumns = (obj) => {
    return Object.keys(obj).map((key) => ({ field: key }));
  };

  const defColumnDefs = { flex: 1, filter: true, minWidth: 300 };

  return (
    <div className="AppBox1">
      <div
        className="ag-theme-material ag-cell-wrap-text"
        style={{ height: 600 }}
      >
        <AgGridReact
          className="ag-cell-wrap-text"
          defaultColDef={defColumnDefs}
          pagination={true}
          columnDefs={colDefs}
          rowData={testData}
          paginationPageSize={50}
        />
      </div>
    </div>
  );
}

export default App;
