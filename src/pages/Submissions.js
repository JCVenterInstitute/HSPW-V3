import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Paper, Box, IconButton } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import LinkIcon from "@mui/icons-material/Link";

const Submissions = () => {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/submissions/testUser`)
      .then((response) => response.json())
      .then((data) => {
        setRowData(data);
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
        <IconButton onClick={() => handlePinChange(params.data)}>
          <PushPinIcon
            sx={{
              color: params.value ? "blue" : "gray",
            }}
          />
        </IconButton>
      ),
    },
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
      headerName: "Link",
      field: "link",
      minWidth: 150,
      width: 150,
      cellRendererFramework: (params) => (
        <IconButton
          component="a"
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkIcon sx={{ color: "blue" }} />
        </IconButton>
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
    const updatedRow = { ...row, important: !row.important };

    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/submissions/${row.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRow),
    })
      .then((response) => response.json())
      .then((data) => {
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
