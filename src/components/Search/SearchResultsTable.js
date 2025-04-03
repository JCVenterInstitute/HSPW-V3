import { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import LoadingOverlay from "../../components/Shared/LoadingOverlay";

import { Box } from "@mui/material";

const SearchResultsTable = ({
  entity,
  columnApi,
  searchResults,
  columnDefs,
  recordsPerPage,
  handleGridApiChange,
  handleColumnApiChange,
  handleSortedColumnChange,
}) => {
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);

  const defaultColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    minWidth: 170,
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
                onClick={() => (window.location.href = `/gene/${params.value}`)}
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
                  (window.location.href = `/protein-cluster/${params.value}`)
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
                  (window.location.href = `/protein-signature/${params.value}`)
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
          } else if (entity === "Proteins") {
            return (
              <span
                onClick={() =>
                  (window.location.href = `/experiment-protein/${params.value}`)
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
                  (window.location.href = `/citation/${params.value}`)
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
          } else if (entity === "Salivary Proteins") {
            return (
              <span
                onClick={() =>
                  (window.location.href = `/protein/${params.value}`)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults, columnDefs]);

  /**
   * Track which column is selected for sort by user
   */
  const onSortChanged = () => {
    const columnState = columnApi.getColumnState();
    const sortedColumn = columnState.filter((col) => col.sort !== null);

    if (sortedColumn.length !== 0) {
      const { sort, colId } = sortedColumn[0];
      if (entity === "Salivary Proteins") {
        handleSortedColumnChange({
          attribute: `salivary_proteins.${colId}`,
          order: sort,
        });
      } else {
        handleSortedColumnChange({ attribute: colId, order: sort });
      }
    } else {
      handleSortedColumnChange(null);
    }
  };

  const loadingOverlayComponent = useMemo(() => {
    return LoadingOverlay;
  }, []);

  const onGridReady = (params) => {
    params.api.showLoadingOverlay();
    handleGridApiChange(params.api);
    handleColumnApiChange(params.columnApi);
  };

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
          suppressPaginationPanel={true}
          loadingOverlayComponent={loadingOverlayComponent}
          suppressScrollOnNewData={true}
          onSortChanged={onSortChanged}
        ></AgGridReact>
      </div>
    </Box>
  );
};

export default SearchResultsTable;
