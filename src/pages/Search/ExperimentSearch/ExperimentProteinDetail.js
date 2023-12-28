import { Box, Typography, TextField, MenuItem, Container } from "@mui/material";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import CustomLoadingOverlay from "./CustomLoadingOverlay";
import MainFeature from "../../../assets/hero.jpeg";
import { useParams } from "react-router-dom";

const generateColumnDefs = (data) => {
  if (!data || data.length === 0) return [];
  const columnDef = [
    {
      headerName: "Submitted Protein Accession",
      field: "Uniprot_accession",
      wrapText: true,
      minWidth: 350,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "xC",
      field: "xc",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "DeltaCn",
      field: "dcn",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "Sp",
      field: "sp",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "RSp",
      field: "rsp",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "Ions",
      field: "ions",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "Mass",
      field: "mass",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "Charge",
      field: "charge",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "Peptide Sequence",
      field: "peptide_sequence",
      wrapText: true,
      minWidth: 550,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
    {
      headerName: "Sequence",
      field: "Uniprot_accession",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["differential-cell"],
    },
  ];

  return columnDef;
};

const ExperimentProteinDetail = ({ searchText }) => {
  const { uniprotid } = useParams();
  const [gridApi, setGridApi] = useState();
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchResults, setSearchResults] = useState();
  const [columnDefs, setColumnDefs] = useState();

  const defaultColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    minWidth: 170,
    filter: "agTextColumnFilter",
  };

  const handlePageChange = (newPage) => {
    gridApi.showLoadingOverlay();
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  const onGridReady = useCallback((params) => {
    params.api.showLoadingOverlay();
    setGridApi(params.api);
  }, []);

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const fetchData = async (page = currentPage, pageSize = recordsPerPage) => {
    const from = (page - 1) * pageSize;
    const response = await axios
      .post(`http://localhost:8000/api/experiment-protein/${uniprotid}`, {
        size: pageSize,
        from,
      })
      .then((res) => {
        setTotalPages(Math.ceil(res.data.total.value / pageSize));
        return res.data.hits.map((item) => item._source);
      });

    const columns = generateColumnDefs(response);
    console.log(response);

    setColumnDefs(columns);
    setSearchResults(response);
  };

  useEffect(() => {
    fetchData(1);
    setCurrentPage(1);
  }, [searchText]);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${MainFeature})`,
        }}
        className="head_background"
      >
        <h1
          className="head_title"
          align="left"
        >
          Protein: {uniprotid}
        </h1>
      </div>
      <Container
        sx={{ mt: 2 }}
        maxWidth="xl"
      >
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              textAlign: "right",
              justifyContent: "flex-end", // To push content to the right
              flexGrow: 1, // To make the right Box occupy remaining space
            }}
          >
            <Typography
              display="inline"
              sx={{
                fontFamily: "Lato",
                fontSize: "18px",
                color: "#464646",
              }}
            >
              Records Per Page
            </Typography>
            <TextField
              select
              size="small"
              InputProps={{
                style: {
                  borderRadius: "10px",
                },
              }}
              value={recordsPerPage}
              onChange={(event) => {
                const newRecordsPerPage = event.target.value;
                setRecordsPerPage(newRecordsPerPage);
                gridApi.showLoadingOverlay();
                setCurrentPage(1);
                fetchData(1, newRecordsPerPage);
              }}
              sx={{ marginLeft: "10px", marginRight: "30px" }}
            >
              {[20, 50, 100].map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <Typography
              display="inline"
              sx={{
                fontFamily: "Lato",
                fontSize: "18px",
                color: "#464646",
              }}
            >
              Page
            </Typography>
            {searchResults && (
              <TextField
                select
                size="small"
                InputProps={{
                  style: {
                    borderRadius: "10px",
                  },
                }}
                value={currentPage}
                sx={{ marginLeft: "10px", marginRight: "10px" }}
                onChange={(e) => handlePageChange(e.target.value)}
              >
                {Array.from({ length: totalPages }, (_, index) => (
                  <MenuItem
                    key={index + 1}
                    value={index + 1}
                  >
                    {index + 1}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <Typography
              display="inline"
              sx={{
                fontFamily: "Lato",
                fontSize: "18px",
                color: "#464646",
                marginRight: "30px",
              }}
            >
              out of {totalPages}
            </Typography>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                color: currentPage === 1 ? "#D3D3D3" : "#F6921E",
                background: "white",
                fontSize: "20px",
                border: "none",
                cursor: currentPage === 1 ? "default" : "pointer",
                transition: currentPage === 1 ? "none" : "background 0.3s",
                borderRadius: "5px",
                marginRight: "15px",
                pointerEvents: currentPage === 1 ? "none" : "auto",
                paddingBottom: "5px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(246, 146, 30, 0.2)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              <ArrowBackIosIcon
                style={{
                  display: "inline",
                  position: "relative",
                  top: "0.2em",
                  fontWeight: "bold",
                }}
              />
              prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                color: currentPage === totalPages ? "#D3D3D3" : "#F6921E",
                background: "white",
                fontSize: "20px",
                border: "none",
                cursor: currentPage === totalPages ? "default" : "pointer",
                transition:
                  currentPage === totalPages ? "none" : "background 0.3s",
                borderRadius: "5px",
                pointerEvents: currentPage === totalPages ? "none" : "auto",
                paddingBottom: "5px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(246, 146, 30, 0.2)";
              }}
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              next
              <ArrowForwardIosIcon
                style={{
                  display: "inline",
                  position: "relative",
                  top: "0.2em",
                  fontWeight: "bold",
                }}
              />
            </button>
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: "10px",
          }}
        >
          <div
            id="differential"
            className="ag-theme-material ag-cell-wrap-text ag-theme-alpine differential-expression"
            style={{ height: 700 }}
          >
            <AgGridReact
              className="ag-cell-wrap-text"
              rowData={searchResults}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              enableCellTextSelection={true}
              pagination={true}
              paginationPageSize={recordsPerPage}
              suppressPaginationPanel={true}
              loadingOverlayComponent={loadingOverlayComponent}
              suppressScrollOnNewData={true}
            ></AgGridReact>
          </div>
        </Box>
      </Container>
    </>
  );
};

export default ExperimentProteinDetail;
