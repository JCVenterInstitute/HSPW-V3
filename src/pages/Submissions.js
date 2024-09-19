import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Paper, Box, Checkbox } from "@mui/material";

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
    { headerName: "Type", field: "type", minWidth: 220, width: 220 },
    { headerName: "Name", field: "name", minWidth: 200, width: 200 },
    { headerName: "Status", field: "status", minWidth: 120, width: 100 },
    {
      headerName: "Submission Date",
      field: "submission_date",
      minWidth: 200,
      width: 200,
    },
    {
      headerName: "Important",
      field: "important",
      cellRendererFramework: (params) => (
        <Checkbox
          checked={params.value}
          onChange={() => handlePinChange(params.data)}
          color="primary"
        />
      ),
    },
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

  const handlePinChange = (row) => {
    // Toggle the important field
    const updatedRow = { ...row, important: !row.important };

    // Correct the endpoint and request type
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/submissions/${row.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRow),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the local state with the new pinned state
        setRowData((prevData) =>
          prevData.map((item) =>
            item.id === updatedRow.id
              ? { ...item, important: data.important }
              : item
          )
        );
      })
      .catch((error) => console.error("Error updating data:", error));
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "1rem",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "1200px",
          height: "80vh",
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
