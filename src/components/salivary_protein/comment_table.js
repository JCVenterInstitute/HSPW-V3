import "../filter.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ReactComponent as Download_Logo } from "../table_icon/download.svg";
import { ReactComponent as Left_Arrow } from "../table_icon/left_arrow.svg";
import { ReactComponent as Right_Arrow } from "../table_icon/right_arrow.svg";
import { ReactComponent as Search } from "../table_icon/search.svg";

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

function App(props) {
  const [message, setMessage] = useState("");
  const [rowData, setRowData] = useState([]);

  const [gridApi, setGridApi] = useState();
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(0);
  const [count, setCount] = useState(1);
  const [docCount, setDocCount] = useState(0);

  const [pageNumArr, setPageNumArr] = useState([1]);

  useEffect(() => {
    console.log(props.data);
    const jsonData = props.data;

    // Transform JSON data into Ag-Grid compatible format
    const transformedData = jsonData.flatMap((annotation) => {
      const { annotation_type, annotation_description, features } = annotation;

      return annotation_description.map((description) => {
        const { description: annotation_description_text, evidences = [] } =
          description;

        const uniqueEvidenceCodes = Array.from(
          new Set(evidences.map((evidence) => evidence.evidenceCode))
        );
        const annotationDescription_evidences1 = uniqueEvidenceCodes.map(
          (evidenceCode) => ({
            source:
              evidences.find(
                (evidence) => evidence.evidenceCode === evidenceCode
              )?.source || "",
            id: evidences
              .filter((evidence) => evidence.evidenceCode === evidenceCode)
              .map((evidence) => evidence.id)
              .join(", "),
            evidenceCode: evidenceCode || "",
          })
        );
        const annotationDescription_evidences = evidences.map((evidence) => ({
          source: evidence.source || "",
          id: evidence.id || "",
          evidenceCode: evidence.evidenceCode || "",
        }));

        const annotationDescription_source_id =
          annotationDescription_evidences.map((evidence) => {
            // Check if evidence.source and evidence.id are empty, if yes, return an empty string
            if (!evidence.source && !evidence.id) {
              return "";
            }

            // Concatenate source and id with a colon
            return `${evidence.source}:${evidence.id}`;
          });

        return {
          annotation_type,
          annotation_description: annotation_description_text || "",
          annotationDescription_source_id,
          annotationDescription_evidenceCode: annotationDescription_evidences1
            .map((evidence) => evidence.evidenceCode)
            .join(", "),
        };
      });
    });

    setRowData(transformedData);
  }, []);

  let data1 = [];
  for (let i = 0; i < message.length; i++) {
    data1.push(message[i]["_source"]);
  }

  const columns = [
    {
      headerName: "Annotation Type",
      field: "annotation_type",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      maxWidth: 195,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Description",
      field: "annotation_description",
      minWidth: 355,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border", "comment_table_description"],
      resizable: true,
      autoHeight: true, // Make sure this is set
    },
    {
      headerName: "Evidences ID",
      field: "annotationDescription_source_id",
      wrapText: true,
      maxWidth: 195,
      cellStyle: { wordBreak: "break-word" },
      sortable: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      resizable: true,

      cellRenderer: (params) => {
        const ids = Array.isArray(params.value) ? params.value : "";
        const links = ids.map((id, index) => (
          <React.Fragment key={index}>
            <a href={`${id}`} target="_blank">
              {id}
            </a>
            {index < ids.length - 1 && <br />}{" "}
            {/* Add line break if it's not the last element */}
          </React.Fragment>
        ));
        return <>{links}</>;
      },
    },
    {
      headerName: "Evidences Code",
      field: "annotationDescription_evidenceCode",
      wrapText: true,
      maxWidth: 155,
      sortable: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Features Type",
      field: "features_type",
      wrapText: true,
      maxWidth: 145,
      sortable: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Features Position",
      field: "features_position",
      wrapText: true,
      maxWidth: 145,
      sortable: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
  ];

  const paginationNumberFormatter = useCallback((params) => {
    return "[" + params.value.toLocaleString() + "]";
  }, []);

  const defColumnDefs = {
    flex: 1,
    filter: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
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
      <div className="example-header" style={{ marginLeft: "35px" }}>
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
        <select id="page-size" onChange={onPageSizeChanged}>
          <option value="50">10</option>
          <option value="100">20</option>
          <option value="500">50</option>
          <option value="1000">100</option>
        </select>
        <text style={{ marginLeft: "5%" }}>Page</text>
        <select onChange={onPageNumChanged} value={pageNum} id="page-num">
          {pageNumArr}
        </select>
        <text style={{ marginLeft: "1%" }}>
          out of {Math.round(docCount / pageSize)}
        </text>
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
          rowData={rowData}
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

export default App;
