import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Paper, Box, IconButton, Typography } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import LinkIcon from "@mui/icons-material/Link";

const Submissions = () => {
  const [rowData, setRowData] = useState([]);
  const [pinnedTopRowData, setPinnedTopRowData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/submissions/testUser`)
      .then((response) => response.json())
      .then((data) => {
        const pinnedRows = data.filter((row) => row.important);
        const unpinnedRows = data.filter((row) => !row.important);
        setPinnedTopRowData(pinnedRows);
        setRowData(unpinnedRows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const columnDefs = [
    {
      headerName: "Important",
      field: "important",
      cellRendererFramework: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton onClick={() => handlePinChange(params.data)}>
            <PushPinIcon sx={{ color: params.value ? "blue" : "gray" }} />
          </IconButton>
        </div>
      ),
      cellStyle: { paddingLeft: "15px" }, // Add padding for alignment
    },
    {
      headerName: "Type",
      field: "type",
      minWidth: 220,
      width: 220,
      cellStyle: { paddingLeft: "15px" }, // Ensure cell text aligns with header
    },
    {
      headerName: "Name",
      field: "name",
      minWidth: 200,
      width: 200,
      cellStyle: { paddingLeft: "15px" }, // Ensure cell text aligns with header
    },
    {
      headerName: "Status",
      field: "status",
      minWidth: 120,
      width: 100,
      cellStyle: { paddingLeft: "15px" }, // Ensure cell text aligns with header
    },
    {
      headerName: "Submission Date",
      field: "submission_date",
      minWidth: 200,
      width: 200,
      sort: "desc", // Default sorting applied here
      sortable: true,
      cellStyle: { paddingLeft: "15px" }, // Ensure cell text aligns with header
    },
    {
      headerName: "Link",
      field: "link",
      minWidth: 150,
      width: 150,
      cellRendererFramework: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            component="a"
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon sx={{ color: "blue" }} />
          </IconButton>
        </div>
      ),
      cellStyle: { paddingLeft: "15px" }, // Ensure cell text aligns with header
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
    const updatedRow = { ...row, important: !row.important };

    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/submissions/${row.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRow),
    })
      .then((response) => response.json())
      .then(() => {
        if (updatedRow.important) {
          setPinnedTopRowData((prevPinnedRows) => [
            ...prevPinnedRows,
            updatedRow,
          ]);
          setRowData((prevUnpinnedRows) =>
            prevUnpinnedRows.filter((item) => item.id !== updatedRow.id)
          );
        } else {
          setPinnedTopRowData((prevPinnedRows) =>
            prevPinnedRows.filter((item) => item.id !== updatedRow.id)
          );
          setRowData((prevUnpinnedRows) => [...prevUnpinnedRows, updatedRow]);
        }
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
          padding: "2rem",
          width: "100%",
          maxWidth: "1200px",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Submissions
        </Typography>
        <div
          className="ag-theme-material ag-cell-wrap-text ag-theme-alpine"
          style={{
            flexGrow: 1,
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "10px", // Ensure the table has rounded corners
          }}
        >
          <AgGridReact
            className="ag-cell-wrap-text"
            rowData={rowData}
            pinnedTopRowData={pinnedTopRowData}
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
