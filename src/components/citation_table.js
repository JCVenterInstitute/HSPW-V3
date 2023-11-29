import "./filter.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import dayjs, { Dayjs } from "dayjs";
import { ReactComponent as Download_Logo } from "./table_icon/download.svg";
import { ReactComponent as Left_Arrow } from "./table_icon/left_arrow.svg";
import { ReactComponent as Right_Arrow } from "./table_icon/right_arrow.svg";
import { ReactComponent as Search } from "./table_icon/search.svg";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function LinkComponent(props: ICellRendererParams) {
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

function App() {
  const [message, setMessage] = useState("");
  const [rowData, setRowData] = useState([]);

  const [gridApi, setGridApi] = useState();
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(0);
  const [count, setCount] = useState(1);
  const [docCount, setDocCount] = useState(0);
  const [queryArr, setQueryArr] = useState([]);
  const [CitationIDC, setCitationIDC] = useState(false);
  const [citationID, setCitationID] = useState("");
  const [title, setTitle] = useState("");
  const [journal, setJournal] = useState("");
  const [titleInputted, setTitleInputted] = useState(false);
  const [journalInputted, setJournalInputted] = useState(false);
  const [dateC, setdateC] = useState(false);
  const [pageNumArr, setPageNumArr] = useState([1]);
  const [startDate, setStartDate] = useState(dayjs("1957-08-17"));
  const [endDate, setEndDate] = useState(dayjs("2021-03-16"));
  const [dateInputted, setDateInputted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(
          `http://localhost:8000/citation/${pageSize}/${pageNum}`
        );
        const json = await data.json();

        if (json.hits) {
          const data1 = json.hits.map((hit) => hit._source);
          setRowData(data1);
        }

        setDocCount(json.total.value);
        const newOptions = Array.from(
          { length: Math.round(json.total.value / pageSize) },
          (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          )
        );
        setPageNumArr(newOptions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [pageSize, pageNum]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(
          `http://localhost:8000/citation/${pageSize}/${pageNum}`
        );
        const json = await data.json();

        if (json.hits) {
          const data1 = json.hits.map((hit) => hit._source);
          setRowData(data1);
        }

        setDocCount(json.total.value);
        const newOptions = Array.from(
          { length: Math.round(json.total.value / pageSize) },
          (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          )
        );
        setPageNumArr(newOptions);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchQuery = async () => {
      try {
        const url = `http://localhost:8000/citation_search/${pageSize}/${pageNum}`;
        const customHeaders = { "Content-Type": "application/json" };
        const data = await fetch(url, {
          method: "POST",
          headers: customHeaders,
          body: JSON.stringify(queryArr),
        });
        const json = await data.json();

        if (json.hits && json.hits.hits) {
          const data1 = json.hits.hits.map((hit) => hit._source);
          setRowData(data1);
        }

        setDocCount(json.hits.total.value);
        const newOptions = Array.from(
          { length: Math.round(json.hits.total.value / pageSize) },
          (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          )
        );
        setPageNumArr(newOptions);
      } catch (error) {
        console.error(error);
      }
    };

    if (
      CitationIDC === true ||
      dateInputted ||
      journalInputted ||
      titleInputted
    ) {
      console.log(queryArr);
      fetchQuery();
    } else {
      fetchData();
    }
  }, [
    pageSize,
    pageNum,
    citationID,
    dateInputted,
    queryArr,
    CitationIDC,
    journalInputted,
    titleInputted,
  ]);

  let data1 = [];
  for (let i = 0; i < message.length; i++) {
    data1.push(message[i]["_source"]);
  }

  const columns = [
    {
      headerName: "Citation",
      field: "PubMedID",
      cellRenderer: "LinkComponent",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      maxWidth: 145,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Date of Publication",
      field: "PubDate",
      maxWidth: 205,
      wrapText: true,
      suppressSizeToFit: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Title",
      field: "Title",
      wrapText: true,
      autoHeight: true,
      cellStyle: { "word-break": "break-word" },
      sortable: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Journal",
      field: "journalTitle",
      wrapText: true,
      maxWidth: 145,
      maxWidth: 145,
      sortable: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
  ];

  const defColumnDefs = {
    flex: 1,
    filter: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };
  const handleDateChange = (start, end) => {
    const formatDate = (date) => {
      if (!date) return null;

      const [day, month, year] = new Date(date)
        .toLocaleDateString("en-GB")
        .split("/");
      return `${year}/${month}/${day}`;
    };

    const newDateQuery = {
      range: {
        "Date of Publication": {
          gte: formatDate(start) || "1957/08/17",
          lte: formatDate(end) || "2021/03/16",
        },
      },
    };
    updateQuery(newDateQuery);

    // Set the boolean to true when at least one date is inputted
    setDateInputted(Boolean(start) || Boolean(end));
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

  const updateQuery = (newQuery) => {
    setQueryArr((prevArray) => {
      // Remove existing queries of the same type (wildcard or range) for the same field
      const filteredArray = prevArray.filter((p) => {
        const existingQueryType = p?.wildcard
          ? "wildcard"
          : p?.range
          ? "range"
          : null;

        const newQueryType = newQuery?.wildcard
          ? "wildcard"
          : newQuery?.range
          ? "range"
          : null;

        return !(
          newQuery &&
          existingQueryType &&
          newQueryType &&
          p[newQueryType] &&
          Object.keys(p[newQueryType])[0] ===
            Object.keys(newQuery[newQueryType])[0]
        );
      });

      // Add the new query to the filtered array
      return newQuery ? [...filteredArray, newQuery] : filteredArray;
    });
  };

  const handleIDChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setCitationIDC(false);
    } else {
      setCitationIDC(true);
    }

    // Add new element for InterPro ID with updated input value
    const newIDQuery =
      inputValue !== ""
        ? {
            wildcard: {
              CitationID: {
                value: `${inputValue}*`,
                case_insensitive: true,
              },
            },
          }
        : null;

    setCitationID(inputValue);
    updateQuery(newIDQuery);
  };

  const handleTitleChange = (e) => {
    const inputValue = e.target.value;

    // You can modify the condition based on your requirements
    if (inputValue === "") {
      // If the input is empty, set the boolean variable to false
      // (you might need to adjust this logic based on your specific requirements)
      // For example, you might want to consider setting it to true only if the length is greater than a certain threshold.
      setTitleInputted(false);
    } else {
      setTitleInputted(true);
    }

    // Add new element for Title with updated input value
    const newTitleQuery =
      inputValue !== ""
        ? {
            wildcard: {
              Title: {
                value: `${inputValue}*`,
                case_insensitive: true,
              },
            },
          }
        : null;

    setTitle(inputValue);
    updateQuery(newTitleQuery);
  };

  const handleJournalChange = (e) => {
    const inputValue = e.target.value;

    // You can modify the condition based on your requirements
    if (inputValue === "") {
      // If the input is empty, set the boolean variable to false
      // (you might need to adjust this logic based on your specific requirements)
      // For example, you might want to consider setting it to true only if the length is greater than a certain threshold.
      setJournalInputted(false);
    } else {
      setJournalInputted(true);
    }

    // Add new element for Journal with updated input value
    const newJournalQuery =
      inputValue !== ""
        ? {
            wildcard: {
              Journal: {
                value: `${inputValue}*`,
                case_insensitive: true,
              },
            },
          }
        : null;

    setJournal(inputValue);
    updateQuery(newJournalQuery);
  };

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
      <div className="rowC">
        <div className="sidebar1" style={{ height: "45em" }}>
          <h2
            style={{
              margin: "26px",
              color: "#1463B9",
              fontFamily: "Montserrat",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "130%",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            FILTER
          </h2>

          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">Citation ID</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-id-box"
                  placeholder="Search..."
                  onChange={handleIDChange}
                  style={{
                    width: "80%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">Date of Publication</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <label htmlFor="start" style={{ marginRight: "10px" }}>
                  Start date:
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start date:"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </LocalizationProvider>
                <input
                  type="date"
                  id="start"
                  name="pub-start"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min="1957-08-17"
                  max="2021-03-16"
                  style={{ marginBottom: "10px" }}
                />
                <br />
                <label htmlFor="end" style={{ marginRight: "15px" }}>
                  End date:
                </label>
                <input
                  type="date"
                  id="end"
                  name="pub-end"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min="1957-08-17"
                  max="2021-03-16"
                />
                <button
                  onClick={() => handleDateChange(startDate, endDate)}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#1463B9",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Apply
                </button>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">Title</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-title-box"
                  placeholder="Search"
                  onChange={handleTitleChange}
                  style={{
                    width: "80%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">Journal</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-journal-box"
                  placeholder="Search"
                  onChange={handleJournalChange}
                  style={{
                    width: "80%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="AppBox1">
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
          <text style={{ marginLeft: "5%" }}>Records Per Page</text>
          <select id="page-size">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
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
          style={{ height: 600 }}
        >
          <AgGridReact
            className="ag-cell-wrap-text"
            rowData={rowData}
            columnDefs={columns}
            ref={gridRef}
            defaultColDef={defColumnDefs}
            enableCellTextSelection={true}
            overlayNoRowsTemplate={
              '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">Loading</span>'
            }
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={50}
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
      </div>
    </>
  );
}

export default App;
