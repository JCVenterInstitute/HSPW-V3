import { useState, useCallback, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import CustomHeaderGroup from "./CustomHeaderGroup";
import CustomLoadingOverlay from "./CustomLoadingOverlay";
import CustomNoRowsOverlay from "./CustomNoRowsOverlay";

const SearchResultsTable = ({ entity, searchResults, columnDefs }) => {
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);

  const defaultColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    minWidth: 170,
    autoHeight: true,
    filter: "agTextColumnFilter",
  };

  useEffect(() => {
    if (columnDefs && columnDefs.length > 0) {
      // Modify the first column definition
      const modifiedColumnDefs = [...columnDefs];
      modifiedColumnDefs[0] = {
        ...modifiedColumnDefs[0],
        cellRenderer: (params) => {
          // Conditional rendering based on 'entity'
          if (entity === "Genes") {
            return (
              <span
                onClick={() => window.open(`/gene/${params.value}`, "_blank")}
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                {params.value}
              </span>
            );
          } else if (entity === "Protein Clusters") {
            return (
              <span
                onClick={() =>
                  window.open(`/protein_clusters/${params.value}`, "_blank")
                }
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                {params.value}
              </span>
            );
          } else if (entity === "Protein Signatures") {
            return (
              <span
                onClick={() =>
                  window.open(`/protein_signature/${params.value}`, "_blank")
                }
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                {params.value}
              </span>
            );
          } else {
            // Default rendering for other entities
            return <span>{params.value}</span>;
          }
        },
      };
      setColumns(modifiedColumnDefs);
    }
    setRowData(searchResults);
  }, [searchResults, columnDefs, history]);

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const noRowsOverlayComponent = useMemo(() => {
    return CustomNoRowsOverlay;
  }, []);

  const onGridReady = useCallback((params) => {}, []);

  return (
    <div
      id="differential"
      className="ag-theme-material ag-cell-wrap-text ag-theme-alpine differential-expression"
      style={{ height: 800 }}
    >
      <AgGridReact
        className="ag-cell-wrap-text"
        rowData={rowData}
        columnDefs={columns}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        enableCellTextSelection={true}
        pagination={true}
        paginationPageSize={50}
        noRowsOverlayComponent={noRowsOverlayComponent}
        loadingOverlayComponent={loadingOverlayComponent}
        suppressScrollOnNewData={true}
      ></AgGridReact>
    </div>
  );
};

export default SearchResultsTable;
