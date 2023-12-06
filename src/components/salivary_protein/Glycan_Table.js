import "../filter.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ReactComponent as Download_Logo } from "../table_icon/download.svg";
import { ReactComponent as Left_Arrow } from "../table_icon/left_arrow.svg";
import { ReactComponent as Right_Arrow } from "../table_icon/right_arrow.svg";
import { ReactComponent as Search } from "../table_icon/search.svg";
import FontAwesome from "react-fontawesome";

const th = {
  background: "#f2f2f2",
  textAlign: "center",
  border: "1px solid #aaa",
  fontWeight: "bold",
  fontSize: "20px",
  padding: "0.2em",
  maxWidth: "1000px",
};

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

function Glycan_Table(props) {
  const [rowData, setRowData] = useState([]);
  const [message, setMessage] = useState("");
  const [gridApi, setGridApi] = useState();
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(0);
  const [count, setCount] = useState(1);
  const [docCount, setDocCount] = useState(0);

  const [pageNumArr, setPageNumArr] = useState([1]);

  let data1 = [];
  for (let i = 0; i < message.length; i++) {
    data1.push(message[i]["_source"]);
  }

  const rowHeight = 500;
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

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };

  const onBtNext = (event) => {
    if (count < docCount / pageSize) {
      var x = gridRef.current.api.paginationGetCurrentPage();

      setPageNum(pageNum + 1);

      setCount(count + 1);
    }
  };

  const onPageNumChanged = (event) => {
    var value = document.getElementById("page-num").value;
    setPageNum(value);
    setCount(value);
  };

  const onBtPrevious = (event) => {
    if (pageNum !== 1) {
      var x = pageNum;
      setPageNum(x - 1);
      setCount(count - 1);
    }
  };

  const onPageSizeChanged = useCallback(() => {
    var value = document.getElementById("page-size").value;
    gridRef.current.api.paginationSetPageSize(Number(value));
  }, []);

  const onGridReady = (params) => {
    setGridApi(params);
  };

  const gridRef = useRef();

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
      <div
        className="example-header"
        style={{ marginLeft: "35px" }}
      >
        <form
          onSubmit={onFilterTextBoxChanged}
          style={{ display: "inline", position: "relative" }}
        >
          <input
            type="text"
            id="filter-text-box"
            placeholder="Search..."
            onInput={onFilterTextBoxChanged}
            style={{
              width: "30%",
              padding: "0.25rem 0.75rem",
              borderRadius: "10px 0 0 10px",
              borderColor: "#1463B9",
              display: "inline",
              position: "relative",
            }}
          />
          <button
            type="submit"
            style={{
              display: "inline",
              position: "relative",
              top: "0.3em",
              backgroundColor: "#1463B9",
              borderColor: "#1463B9",
              cursor: "pointer",
              width: "5%",
              borderRadius: "0 10px 10px 0",
            }}
          >
            <Search />
          </button>
        </form>
        <span style={{ marginLeft: "5%" }}>Records Per Page</span>
        <select
          id="page-size"
          onChange={onPageSizeChanged}
        >
          <option value="50">10</option>
          <option value="100">20</option>
          <option value="500">50</option>
          <option value="1000">100</option>
        </select>
        <span style={{ marginLeft: "5%" }}>Page</span>
        <select
          onChange={onPageNumChanged}
          value={pageNum}
          id="page-num"
        >
          {pageNumArr}
        </select>
        <span style={{ marginLeft: "1%" }}>
          out of {Math.round(docCount / pageSize)}
        </span>
        <button
          onClick={onBtPrevious}
          style={{
            marginLeft: "5%",
            fontWeight: "bold",
            marginLeft: "3%",
            marginTop: "10px",
            color: "#F6921E",
            background: "white",
            fontSize: "20",
            padding: ".3em 2em",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Left_Arrow
            style={{
              marginRight: "10px",
              paddingTop: "5px",
              display: "inline",
              position: "relative",
              top: "0.15em",
            }}
          />
          prev
        </button>
        <button
          onClick={onBtNext}
          style={{
            fontWeight: "bold",
            marginTop: "10px",
            marginLeft: "1%",
            color: "#F6921E",
            background: "white",
            fontSize: "20",
            padding: "2em .3em ",
            border: "none",
            cursor: "pointer",
          }}
        >
          next
          <Right_Arrow
            style={{
              marginLeft: "10px",
              paddingTop: "5px",
              display: "inline",
              position: "relative",
              top: "0.15em",
            }}
          />
        </button>
      </div>
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
          paginationPageSize={20}
          paginationNumberFormatter={paginationNumberFormatter}
          suppressPaginationPanel={true}
          frameworkComponents={{
            LinkComponent,
          }}
          defaultColDef={defaultColDef}
          rowHeight={rowHeight}
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
        <Download_Logo
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
