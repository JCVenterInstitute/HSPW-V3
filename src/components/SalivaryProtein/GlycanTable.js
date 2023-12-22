import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import {
  Container,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClearIcon from "@mui/icons-material/Clear";

import { ReactComponent as DownloadLogo } from "../../assets/table-icon/download.svg";
import "../Filter.css";

function Glycan_Table(props) {
  const [rowData, setRowData] = useState([]);
  const [message, setMessage] = useState("");
  const [totalPageNumber, setTotalPageNumber] = useState(1);
  const [gridApi, setGridApi] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [docCount, setDocCount] = useState(0);
  const [filterKeyword, setFilterKeyword] = useState("");
  const gridRef = useRef();
  let data1 = [];
  for (let i = 0; i < message.length; i++) {
    data1.push(message[i]["_source"]);
  }

  const ImageRenderer = ({ value }) => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={value}
        alt="Glygen"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
        }}
      />
    </div>
  );

  useEffect(() => {
    const data = props.data[0]._source.salivary_proteins.glycans.filter(
      (glycan) => glycan.glytoucan_accession !== ""
    );

    setDocCount(data.length);
    setRowData(data);
  }, []);

  const SourceRenderer = ({ value }) => {
    return (
      <div>
        {value.map((src, i) => {
          const { database, url, id } = src;

          return (
            <React.Fragment key={`glycan-img-${i}`}>
              <span>
                {`${database}: `}
                <a
                  target="_blank"
                  href={url}
                >
                  {id}
                </a>
              </span>
              {i !== value.length ? ",   " : ""}
              {i !== 0 && i % 3 === 0 ? <br /> : ""}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  function LinkComponent(props) {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/citation/${props.value}`}
      >
        {props.value}
      </a>
    );
  }

  const columns = [
    { headerName: "Accession", field: "glytoucan_accession" },
    {
      headerName: "Image",
      field: "image",
      minWidth: 425,
      wrapText: true,
      cellRenderer: ImageRenderer,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Type",
      field: "type",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },

    {
      headerName: "Mass",
      field: "mass",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      wrapText: true,
    },
    {
      headerName: "Source",
      field: "source",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      minWidth: 800,
      wrapText: true,
      cellRendererFramework: SourceRenderer,
    },
  ];

  const paginationNumberFormatter = useCallback((params) => {
    return "[" + params.value.toLocaleString() + "]";
  }, []);

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

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };

  const onBtNext = (event) => {
    if (pageNum < totalPageNumber) {
      const newPageNumber = pageNum + 1;
      setPageNum(newPageNumber);
      if (gridApi) {
        gridRef.current.api.paginationGoToPage(newPageNumber - 1);
      }
    }
  };
  const handleFilter = (searchKeyword) => {
    gridRef.current.api.setQuickFilter(searchKeyword);
    setDocCount(gridApi.paginationGetTotalPages());
  };

  const onBtPrevious = (event) => {
    if (pageNum > 1) {
      const newPageNumber = pageNum - 1;
      setPageNum(newPageNumber);
      if (gridApi) {
        gridRef.current.api.paginationGoToPage(newPageNumber - 1);
      }
    }
  };

  const onGridReady = (params) => {
    setGridApi(params);
  };

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  return rowData.length !== 0 ? (
    <>
      <h2
        style={{
          color: "black",
          marginBottom: "24px",
          fontWeight: "bold",
          fontFamily: "Lato",
          marginTop: "10px",
        }}
        id="glycan"
      >
        Glycans
      </h2>
      <Container
        maxWidth="xl"
        sx={{ margin: "30px 0 30px 20px" }}
      >
        <Box sx={{ display: "flex" }}>
          <Box style={{ display: "flex", width: "100%", maxWidth: "550px" }}>
            <TextField
              variant="outlined"
              size="small"
              label="Search..."
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              onKeyPress={(e) => {
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
          className="ag-cell-wrap-text"
          rowData={props.data[0]._source.salivary_proteins.glycans.filter(
            (glycan) => glycan.glytoucan_accession !== ""
          )}
          columnDefs={columns}
          ref={gridRef}
          autoHeight
          rowHeight={140}
          enableCellTextSelection={true}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          paginationNumberFormatter={paginationNumberFormatter}
          suppressPaginationPanel={true}
          components={{
            LinkComponent,
          }}
          defaultColDef={defaultColDef}
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
  ) : null;
}

export default Glycan_Table;
