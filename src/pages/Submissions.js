import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Paper, Box, IconButton, Typography } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import CustomCell from "../components/CustomCell";

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

  // Handle updating the important (pinned) status
  const handlePinChange = (row) => {
    const updatedRow = { ...row, important: !row.important };

    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/submissions/${row.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ important: updatedRow.important }), // Only send the important field
    })
      .then((response) => response.json())
      .then((updatedData) => {
        // Update the state by moving rows between pinned and unpinned
        if (updatedRow.important) {
          setPinnedTopRowData((prevPinnedRows) => [
            ...prevPinnedRows,
            updatedData,
          ]);
          setRowData((prevUnpinnedRows) =>
            prevUnpinnedRows.filter((item) => item.id !== updatedRow.id)
          );
        } else {
          setPinnedTopRowData((prevPinnedRows) =>
            prevPinnedRows.filter((item) => item.id !== updatedRow.id)
          );
          setRowData((prevUnpinnedRows) => [...prevUnpinnedRows, updatedData]);
        }
      })
      .catch((error) => console.error("Error updating data:", error));
  };

  // Handle name editing through SweetAlert prompt
  const handleNameEdit = (row) => {
    Swal.fire({
      title: "Edit Name",
      input: "text",
      inputLabel: "Update the name of this submission",
      inputValue: row.name,
      showCancelButton: true,
      confirmButtonText: "Save",
      showLoaderOnConfirm: true,
      preConfirm: (newName) => {
        if (newName === "") {
          Swal.showValidationMessage("Name cannot be empty");
        } else {
          return fetch(
            `${process.env.REACT_APP_API_ENDPOINT}/api/submissions/${row.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: newName }), // Send updated name
            }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to update name in DynamoDB");
              }
              return response.json();
            })
            .then((data) => {
              // Update the rowData directly with the new name
              setRowData((prevRowData) =>
                prevRowData.map((item) =>
                  item.id === row.id ? { ...item, name: data.name } : item
                )
              );
              setPinnedTopRowData((prevPinnedRowData) =>
                prevPinnedRowData.map((item) =>
                  item.id === row.id ? { ...item, name: data.name } : item
                )
              );

              Swal.fire("Saved!", "Name has been updated", "success");
            })
            .catch((error) => {
              Swal.fire("Error", "Failed to update name", "error");
            });
        }
      },
    });
  };

  // Column definitions for the AgGridReact
  const columnDefs = [
    {
      headerName: "",
      field: "important",
      maxWidth: 50,
      resizable: false,
      cellRenderer: (params) => (
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
    },
    {
      headerName: "Type",
      field: "type",
      minWidth: 120,
      width: 220,
      cellRenderer: (params) => <CustomCell value={params.value} />,
    },
    {
      headerName: "Name",
      field: "name",
      minWidth: 125,
      width: 200,
      cellRenderer: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Lato, sans-serif",
            fontSize: "14px",
          }}
        >
          <Typography
            sx={{
              flexGrow: 1,
              fontFamily: "Lato",
              fontSize: "14px",
              marginLeft: "20px !important",
              marginTop: "4px",
            }}
          >
            {params.value}
          </Typography>
          <IconButton
            onClick={() => handleNameEdit(params.data)}
            sx={{ marginTop: "2px" }}
          >
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
    {
      headerName: "Status",
      field: "status",
      minWidth: 125,
      width: 100,
      cellRenderer: (params) => <CustomCell value={params.value} />,
    },
    {
      headerName: "Submission Date",
      field: "submission_date",
      minWidth: 200,
      width: 200,
      sort: "desc",
      sortable: true,
      cellRenderer: (params) => <CustomCell value={params.value} />,
    },
    {
      headerName: "Link",
      field: "link",
      maxWidth: 105,
      resizable: false,
      cellRenderer: (params) => (
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
