import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Container,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  MenuItem,
} from "@mui/material";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClearIcon from "@mui/icons-material/Clear";

import { ReactComponent as DownloadLogo } from "../../assets/table-icon/download.svg";
import "../Filter.css";

function LinkComponent(props) {
  return (
    <a
      rel="noopener noreferrer"
      href={`/citation/${props.value}`}
    >
      {props.value}
    </a>
  );
}

function Comment_Table(props) {
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [gridApi, setGridApi] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [totalPageNumber, setTotalPageNumber] = useState(1);
  const [docCount, setDocCount] = useState(0);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    wrapText: true,
  };

  const columns = [
    {
      headerName: "Annotation Type",
      field: "annotation_type",
      headerClass: ["header-border"],
      maxWidth: 200,
    },
    {
      headerName: "Type",
      field: "type",
      headerClass: ["header-border"],
      maxWidth: 100,
    },
    {
      headerName: "Description",
      field: "description",
      headerClass: ["header-border"],
      cellClass: ["table-border", "comment_table_description"],
    },
    {
      headerName: "Position",
      field: "position",
      headerClass: ["header-border"],
      maxWidth: 150,
    },
    {
      headerName: "Evidence ID",
      field: "evidenceIds",
      cellStyle: {
        wordBreak: "break-word",
        textWrap: "wrap",
        height: "100%",
      },
      headerClass: ["header-border"],
    },
    {
      headerName: "Evidences Code",
      field: "evidenceCode",
      headerClass: ["header-border"],
      cellStyle: {
        wordBreak: "break-word",
        textWrap: "wrap",
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        width: "auto",
        height: "auto",
      },
    },
  ];

  const recordsPerPageList = [
    {
      value: 10,
      label: 10,
    },
    {
      value: 20,
      label: 20,
    },
    {
      value: 50,
      label: 50,
    },
    {
      value: 100,
      label: 100,
    },
  ];

  useEffect(() => {
    const relevantAnnotationTypes = ["FUNCTION", "PTM", "DOMAIN"];
    const jsonData = props.data;
    const rowData = [];

    for (const rec of jsonData) {
      const { annotation_type, annotation_description, features } = rec;

      // Use first description as tooltip text if available
      const popoverText =
        annotation_description.length !== 0
          ? annotation_description[0].description
          : "";

      // Skip any annotation type that's now FUNCTION, PTM, or DOMAIN
      if (!relevantAnnotationTypes.includes(annotation_type)) continue;

      if (features.length === 0) {
        rowData.push({
          popoverText,
          annotation_type,
        });
      } else {
        for (const feature of features) {
          const { description, type, evidences, position } = feature;

          rowData.push({
            popoverText,
            annotation_type,
            description,
            type,
            evidenceCode: evidences.map((evidence) => evidence.evidenceCode),
            evidenceIds: evidences.map((evidence) => evidence.id),
            position,
          });
        }
      }
    }

    setTotalPageNumber(Math.ceil(rowData.length / pageSize));
    setDocCount(rowData.length);
    setRowData(rowData);
  }, [props.data, pageSize]);

  const onBtNext = () => {
    if (pageNum < totalPageNumber) {
      const newPageNumber = pageNum + 1;
      setPageNum(newPageNumber);
      if (gridApi) {
        gridApi.paginationGoToPage(newPageNumber - 1);
      }
    }
  };

  const onBtPrevious = () => {
    if (pageNum > 1) {
      const newPageNumber = pageNum - 1;
      setPageNum(newPageNumber);
      if (gridApi) {
        gridApi.paginationGoToPage(newPageNumber - 1);
      }
    }
  };

  const handleFilter = (searchKeyword) => {
    gridRef.current.api.setQuickFilter(searchKeyword);
    setDocCount(gridApi.paginationGetTotalPages());
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridRef.current.api.sizeColumnsToFit();
  };

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const getRowHeight = useCallback((params) => {
    return params.data.rowHeight;
  }, []);

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ margin: "30px 0 30px 20px" }}
      >
        <Box sx={{ display: "flex" }}>
          <Box
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "550px",
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              label="Search..."
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFilter(e.target.value);
                }
              }}
              InputProps={{
                style: {
                  height: "44px",
                  width: "500px",
                  borderRadius: "16px 0 0 16px",
                },
                endAdornment: filterKeyword && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={() => {
                        handleFilter("");
                        setFilterKeyword("");
                      }}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <button
              type="submit"
              style={{
                border: "2px solid #1463B9",
                width: "50px",
                height: "44px",
                backgroundColor: "#1463B9",
                borderColor: "#1463B9",
                cursor: "pointer",
                borderRadius: "0 16px 16px 0",
              }}
              onClick={() => handleFilter(filterKeyword)}
            >
              <SearchIcon sx={{ color: "white" }} />
            </button>
          </Box>
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
              value={pageSize}
              onChange={(event) => {
                setPageSize(event.target.value);
                setTotalPageNumber(Math.ceil(docCount / event.target.value));
                gridApi.paginationSetPageSize(Number(event.target.value));
              }}
              sx={{ marginLeft: "10px", marginRight: "30px" }}
            >
              {recordsPerPageList.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
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
            {rowData.length !== 0 && (
              <TextField
                select
                size="small"
                InputProps={{
                  style: {
                    borderRadius: "10px",
                  },
                }}
                value={pageNum}
                sx={{ marginLeft: "10px", marginRight: "10px" }}
                onChange={(event) => {
                  setPageNum(event.target.value);
                  gridApi.paginationGoToPage(event.target.value - 1);
                }}
              >
                {Array.from(
                  { length: Math.ceil(docCount / pageSize) },
                  (_, index) => (
                    <MenuItem
                      key={index + 1}
                      value={index + 1}
                    >
                      {index + 1}
                    </MenuItem>
                  )
                )}
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
              out of {Math.ceil(docCount / pageSize)}
            </Typography>
            <button
              onClick={onBtPrevious}
              disabled={pageNum === 1}
              style={{
                color: pageNum === 1 ? "#D3D3D3" : "#F6921E",
                background: "white",
                fontSize: "20px",
                border: "none",
                cursor: pageNum === 1 ? "default" : "pointer",
                transition: pageNum === 1 ? "none" : "background 0.3s",
                borderRadius: "5px",
                marginRight: "15px",
                pointerEvents: pageNum === 1 ? "none" : "auto",
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
              onClick={onBtNext}
              disabled={pageNum === totalPageNumber}
              style={{
                color: pageNum === totalPageNumber ? "#D3D3D3" : "#F6921E",
                background: "white",
                fontSize: "20px",
                border: "none",
                cursor: pageNum === totalPageNumber ? "default" : "pointer",
                transition:
                  pageNum === totalPageNumber ? "none" : "background 0.3s",
                borderRadius: "5px",
                pointerEvents: pageNum === totalPageNumber ? "none" : "auto",
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
      </Container>
      <div
        className="ag-theme-material ag-cell-wrap-text ag-theme-alpine"
        style={{ height: "500px" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columns}
          pagination={true}
          suppressPaginationPanel={true}
          defaultColDef={defaultColDef}
          enableCellTextSelection={true}
          getRowHeight={getRowHeight}
          onGridReady={onGridReady}
          paginationPageSize={10}
          components={{
            LinkComponent,
          }}
        />
      </div>
      <button
        onClick={onBtExport}
        style={{
          fontWeight: "bold",
          textAlign: "center",
          color: "#F6921E",
          background: "white",
          fontSize: "20",
          border: "none",
          cursor: "pointer",
        }}
      >
        <DownloadLogo
          style={{
            marginRight: "10px",
            paddingTop: "5px",
            display: "inline",
            position: "relative",
            top: "0.15em",
          }}
        />
        Download Spreadsheet
      </button>
    </>
  );
}

export default Comment_Table;
