import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../services/AuthContext";
import { AgGridReact } from "ag-grid-react";
import { Paper, Box, IconButton, Typography } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import CustomCell from "../components/CustomCell";

const Submissions = () => {
  const { user, session } = useContext(AuthContext);
  const [rowData, setRowData] = useState([]);
  const [pinnedTopRowData, setPinnedTopRowData] = useState([]);
  const username = "test-user-local";

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/submissions/${username}`)
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

  const handlePinChange = (row) => {
    const updatedRow = { ...row, important: !row.important };

    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/submissions/${row.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ important: updatedRow.important }),
    })
      .then((response) => response.json())
      .then((updatedData) => {
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
              body: JSON.stringify({ name: newName }),
            }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to update name in DynamoDB");
              }
              return response.json();
            })
            .then((data) => {
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
      cellRenderer: (params) => {
        const capitalizeWords = (str) => {
          return str.replace(/\b\w/g, (char) => char.toUpperCase());
        };

        return <CustomCell value={capitalizeWords(params.value)} />;
      },
    },
    {
      headerName: "Name",
      field: "name",
      minWidth: 125,
      width: 200,
      cellStyle: (params) => ({
        borderRight: params.column.colId === "link" ? "none" : "1px solid #ccc",
      }),
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
      cellRenderer: (params) => {
        const getStatusStyle = (status) => {
          switch (status.toLowerCase()) {
            case "failed":
              return {
                backgroundColor: "red",
                color: "white",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              };
            case "complete":
              return {
                backgroundColor: "green",
                color: "white",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              };
            case "running":
              return {
                backgroundColor: "yellow",
                color: "black",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              };
            default:
              return {
                backgroundColor: "gray",
                color: "white",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              };
          }
        };

        return <div style={getStatusStyle(params.value)}>{params.value}</div>;
      },
    },

    {
      headerName: "Submission Date",
      field: "submission_date",
      minWidth: 200,
      width: 200,
      sort: "desc",
      sortable: true,
      cellStyle: (params) => ({
        borderRight: params.column.colId === "link" ? "none" : "1px solid #ccc",
      }),
      cellRenderer: (params) => <CustomCell value={params.value} />,
    },
    {
      headerName: "Link",
      field: "link",
      maxWidth: 105,
      minWidth: 105,
      resizable: false,
      cellStyle: { borderRight: "none" },
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
    suppressMovable: true, // Disable column movement
    cellStyle: (params) => ({
      borderRight: params.column.colId === "link" ? "none" : "1px solid #ccc",
    }),
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
            borderRadius: "10px",
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
