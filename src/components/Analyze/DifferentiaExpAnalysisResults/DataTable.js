import {
  Container } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

const inputTooltips = {
  logNorm: "Log Transformation",
  heatmap: "Number of Differentially Abundant Proteins in Heatmap",
  foldChange: "Fold Change Threshold",
  pValue: "P-Value Threshold",
  pType: "P-Value Type",
  parametricTest: "Statistical Parametric Test",
};

const DataTable = (data) => {
  var columnDefs = [];
  Object.keys(data[0]).forEach((header) => {
    console.log(inputTooltips[header]);
    columnDefs.push({
      field: header,
      headerTooltip: inputTooltips[header],
      cellStyle: {
        textAlign: "left",
        width: "200%",
        borderLeftWidth: columnDefs.length === 0 ? "0px" : "1px",
      },
      resizable: true,
      flex: Object.keys(data[0]).length <= 5 ? 1 : 0,
      lockPosition: columnDefs.length === 0 ? "left" : "",
    });
  });
  return (
    <Container className="data-section-table" sx={{ margin: "0px" }}>
      <div
        className="ag-theme-material ag-theme-alpine"
        style={{
          overflowX: "auto", // Enable horizontal scrolling
          overflowY: "hidden",
          width: "95%",
        }}
      >
        <AgGridReact
          rowData={data}
          rowStyle={{ BorderStyle: "solid" }}
          columnDefs={columnDefs}
          defaultColDef={{
            wrapHeaderText: true,
            autoHeaderHeight: true,
            resizable: true,
            sortable: true,
          }}
          pagination={true}
          paginationPageSize={10}
          suppressFieldDotNotation={true}
          suppressColumnMoveAnimation={true}
          domLayout="autoHeight"
          colResizeDefault="shift"
          tooltipShowDelay={0}
          tooltipMouseTrack={true}
        />
      </div>
    </Container>
  );
};

export default DataTable;
