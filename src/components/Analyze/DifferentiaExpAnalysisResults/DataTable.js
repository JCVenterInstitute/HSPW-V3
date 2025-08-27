import { Container } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

const inputTooltips = {
  logNorm: "Log Transformation",
  heatmap: "Number of Differentially Abundant Proteins in Heatmap",
  foldChange: "Fold Change Threshold",
  pValue: "P-Value Threshold",
  pType: "P-Value Type",
  parametricTest: "Statistical Parametric Test",
};

/**
 *
 * @param {[{}, {}, ...]} tableData data mattrix
 * @param {Boolean} hasCustomCells whether a table will have custom cells
 * @param {Array} customCells Array of numbers identifying which columns have custom cells
 * @param {Array} cellRenderer Array of functions for custom cells
 * @returns an AgGrid Component
 */
const DataTable = ({
  data,
  hasCustomCells = false,
  customCells = [],
  cellRenderer = [],
}) => {
  var columnDefs = [];
  var currentCellRenderer = 0;

  const isNumeric = (value) => {
    return value != null && value !== "" && !isNaN(Number(value));
  };

  Object.keys(data[0]).forEach((header) => {
    const colDef = {
      field: header,
      headerTooltip: inputTooltips[header],
      cellStyle: {
        textAlign: "left",
        width: "200px",
        borderLeftWidth: columnDefs.length === 0 ? "0px" : "1px",
      },
      resizable: true,
      flex: Object.keys(data[0]).length <= 5 ? 1 : 0,
      lockPosition: columnDefs.length === 0 ? "left" : "",
    };

    // Check the first row's data for this header to see if it's numeric
    if (data.length > 0 && isNumeric(data[0][header])) {
      colDef.comparator = (valueA, valueB) => {
        return Number(valueA) - Number(valueB);
      };
    }

    columnDefs.push(colDef);

    if (
      hasCustomCells &&
      columnDefs.length - 1 === customCells[currentCellRenderer] &&
      cellRenderer[currentCellRenderer]
    ) {
      columnDefs[columnDefs.length - 1]["cellRenderer"] =
        cellRenderer[currentCellRenderer++];
    }
  });

  return (
    <Container
      className="data-section-table"
      sx={{ margin: "0px" }}
    >
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
