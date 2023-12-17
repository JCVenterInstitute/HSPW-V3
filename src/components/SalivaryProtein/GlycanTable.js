import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import FontAwesome from "react-fontawesome";
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

const th = {
  background: "#f2f2f2",
  textAlign: "center",
  border: "1px solid #aaa",
  fontWeight: "bold",
  fontSize: "20px",
  padding: "0.2em",
  maxWidth: "1000px",
};

function Glycan_Table(props) {
  const [rowData, setRowData] = useState([]);
  const [message, setMessage] = useState("");
  const [totalPageNumber, setTotalPageNumber] = useState(1);
  const [gridApi, setGridApi] = useState();
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(0);
  const [count, setCount] = useState(1);
  const [docCount, setDocCount] = useState(0);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [pageNumArr, setPageNumArr] = useState([1]);
  const gridRef = useRef();
  let data1 = [];
  for (let i = 0; i < message.length; i++) {
    data1.push(message[i]["_source"]);
  }

  const ImageRenderer = ({ value }) => (
    <img
      src={value}
      alt="Glygen"
    />
  );
  const LinkRenderer = ({ value }) => (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={value}
    >
      {value}
    </a>
  );

  const SourceRenderer = ({ value }) => (
    <TableHead>
      <TableRow>
        <TableCell
          sx={th}
          style={{
            backgroundColor: "#1463B9",
            color: "white",
            fontFamily: "Montserrat",
            fontSize: "17px",
            fontWeight: "bold",
            border: "1px solid #3592E4",
            borderTopLeftRadius: "10px",
          }}
        >
          ID
        </TableCell>
        <TableCell
          sx={th}
          style={{
            backgroundColor: "#1463B9",
            color: "white",
            fontFamily: "Montserrat",
            fontSize: "17px",
            fontWeight: "bold",
            border: "1px solid #3592E4",
            borderTopRightRadius: "10px",
          }}
        >
          Database
        </TableCell>
      </TableRow>
      {value.map((val, index) => (
        <React.Fragment key={index}>
          <TableRow>
            <TableCell
              style={{
                border: "1px solid #CACACA",
              }}
            >
              {val.url ? (
                <>
                  <a href={val.url}>{val.id}</a>{" "}
                  <a href={val.url}>
                    <FontAwesome
                      className="super-crazy-colors"
                      name="external-link"
                      style={{
                        textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </a>
                </>
              ) : (
                val.id
              )}
            </TableCell>
            <TableCell
              style={{
                border: "1px solid #CACACA",
              }}
            >
              {val.database}
            </TableCell>
          </TableRow>
        </React.Fragment>
      ))}
    </TableHead>
  );

  function LinkComponent(props) {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={"http://localhost:3000/citation/" + props.value}
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
      cellRendererFramework: ImageRenderer,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      autoHeight: true,
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
      autoHeight: true,
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
  const onPageNumChanged = (event) => {
    var value = document.getElementById("page-num").value;
    setPageNum(value);
    setCount(value);
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

  const onPageSizeChanged = useCallback(() => {
    var value = document.getElementById("page-size").value;
    gridRef.current.api.paginationSetPageSize(Number(value));
  }, []);

  const onGridReady = (params) => {
    setGridApi(params);
  };

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

  return (
    <>
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
          enableCellTextSelection={true}
          overlayNoRowsTemplate={
            '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">Loading</span>'
          }
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          paginationNumberFormatter={paginationNumberFormatter}
          suppressPaginationPanel={true}
          frameworkComponents={{
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
  );
}

export default Glycan_Table;
