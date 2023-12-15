import { useState, useCallback, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import CustomLoadingOverlay from "./CustomLoadingOverlay";
import { Box } from "@mui/material";

const AnnotationsSearchResultsTable = ({
  entity,
  searchResults,
  columnDefs,
  recordsPerPage,
  handleGridApiChange,
}) => {
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);

  const defaultColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    minWidth: 170,
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
          } else if (entity === "PubMed Citations") {
            return (
              <span
                onClick={() =>
                  window.open(`/citation/${params.value}`, "_blank")
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
  }, [searchResults, columnDefs]);

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const onGridReady = useCallback((params) => {
    params.api.showLoadingOverlay();
    handleGridApiChange(params.api);
  }, []);

  return (
    <Box
      sx={{
        marginTop: "10px",
      }}
    >
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
          paginationPageSize={recordsPerPage}
          // suppressPaginationPanel={true}
          loadingOverlayComponent={loadingOverlayComponent}
          suppressScrollOnNewData={true}
        ></AgGridReact>
      </div>
    </Box>
  );
};

export default AnnotationsSearchResultsTable;
