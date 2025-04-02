import React, { useState, useEffect, useContext } from "react";
import { AgGridReact } from "ag-grid-react";
import { IconButton, Typography, Container } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";

import { AuthContext } from "../services/AuthContext";
import CustomCell from "../components/CustomCell";
import PageHeader from "../components/Layout/PageHeader";

const Submissions = () => {
  const { user, _ } = useContext(AuthContext);
  const [rowData, setRowData] = useState([]);
  const [pinnedTopRowData, setPinnedTopRowData] = useState([]);
  const username = user ? user.getUsername() : "test-user-local";

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

    if (rowData.length === 0) {
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
    }
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
      cellStyle: { borderRight: "1px solid #ccc" },
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
      cellStyle: { borderRight: "1px solid #ccc" },
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
      cellStyle: { borderRight: "1px solid #ccc" },
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
      maxWidth: 125,
      width: 100,
      cellStyle: { borderRight: "1px solid #ccc" },
      cellRenderer: (params) => {
        const getStatusStyle = (status) => {
          const cellStyle = {
            color: "white",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          };

          switch (status.toLowerCase()) {
            case "failed":
              return {
                ...cellStyle,
                backgroundColor: "red",
              };
            case "complete":
              return {
                ...cellStyle,
                backgroundColor: "green",
              };
            case "running":
              return {
                ...cellStyle,
                backgroundColor: "yellow",
                color: "black",
              };
            default:
              return {
                ...cellStyle,
                backgroundColor: "gray",
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
      cellStyle: { borderRight: "1px solid #ccc" },
      cellRenderer: (params) => {
        const isoTimestamp = params.value.split(".")[0].replace(" ", "T") + "Z"; // Append 'Z' to indicate UTC
        const utcDate = new Date(isoTimestamp);

        // Check if the date is valid
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZone: "America/New_York", // Convert to EST/EDT
        }).format(utcDate);

        return <CustomCell value={formattedDate} />;
      },
    },
    {
      headerName: "Completion Date",
      field: "completion_date",
      minWidth: 200,
      width: 200,
      sortable: true,
      cellStyle: { borderRight: "1px solid #ccc" },
      cellRenderer: (params) => {
        if (!params.value) {
          return <CustomCell value="" />; // Handle invalid date
        }

        // Remove the fractional seconds part
        const rawDate = params.value.split(".")[0]; // Splits the date at the fractional seconds part
        const date = new Date(rawDate.replace(" ", "T")); // Replace the space with 'T' to comply with ISO 8601
        if (!isNaN(date.getTime())) {
          // Check if the date is valid
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }).format(date);
          return <CustomCell value={formattedDate} />;
        } else {
          return <CustomCell value="" />; // Handle invalid date
        }
      },
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
    suppressMovable: true,
    cellStyle: { borderRight: "1px solid #ccc" },
  };

  return (
    <>
      <PageHeader
        title={"Submissions"}
        tabTitle={"HSP | Submissions"}
        breadcrumb={[
          { path: "Home", link: "/" },
          { path: "Account" },
          { path: "Submissions" },
        ]}
      />
      <Container
        maxWidth="xl"
        sx={{ marginTop: "25px" }}
      >
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
      </Container>
    </>
  );
};

export default Submissions;
