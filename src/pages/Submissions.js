import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Paper, Box } from "@mui/material";

const Submissions = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/submissions/testUser`)
      .then((response) => response.json())
      .then((data) => {
        setRowData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const columnDefs = [
    { headerName: "Type", field: "type", minWidth: 220, initialWidth: 220 },
    { headerName: "Name", field: "name" },
    { headerName: "Status", field: "status" },
    { headerName: "Submission Date", field: "submission_date" },
  ];

  const defColumnDefs = {
    flex: 1,
    filter: true,
    resizable: true,
    sortable: true,
    wrapHeaderText: true,
    wrapText: true,
    autoHeaderHeight: true,
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        height: "100vh", // Ensure the container takes full viewport height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px", // Padding around the container
        boxSizing: "border-box", // Include padding in height calculation
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "1rem", // Reduced padding for less space around content
          borderRadius: "10px",
          width: "100%",
          maxWidth: "1200px",
          height: "80vh", // Limit height to avoid excessive empty space
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="ag-theme-material ag-cell-wrap-text ag-theme-alpine"
          style={{ flexGrow: 1, width: "100%" }}
        >
          <AgGridReact
            className="ag-cell-wrap-text"
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defColumnDefs}
            suppressMovable
            enableCellTextSelection={true}
            paginationPageSize={50}
            domLayout="autoHeight"
          />
        </div>
      </Paper>
    </Box>
  );
};

export default Submissions;
