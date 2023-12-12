import "./filter.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";

import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Container,
  TextField,
  Box,
  MenuItem,
  Stack,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
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

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  marginBottom: "15px",
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .1)"
        : "rgba(0, 0, 0, .05)",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<PlayArrowIcon sx={{ fontSize: "1.1rem", color: "#454545" }} />}
    {...props}
  />
))(({ theme }) => ({
  paddingLeft: "25px",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(2),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  backgroundColor: "#f9f8f7",
  color: "#454545",
  fontFamily: "Montserrat",
}));

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

function App() {
  const [message, setMessage] = useState("");
  const [rowData, setRowData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [memberC, setMemberC] = useState(false);
  const [globalSC, setGlobalSC] = useState(false);
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
        console.log(`http://localhost:8000/citation/${pageSize}/${pageNum}`);
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

  const rowHeight = 80;
  const columns = [
    {
      headerName: "Citation",
      field: "PubMed_ID",
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
      cellStyle: { wordBreak: "break-word" },
      sortable: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Journal",
      field: "journal_title",
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
    if (pageNum + 1 < docCount / pageSize) {
      setPageNum((prevPageNum) => {
        console.log("Updated pageNum:", prevPageNum + 1);
        return prevPageNum + 1;
      });
      setCount((prevCount) => prevCount + 1);
    }
  };

  const onBtPrevious = (event) => {
    if (pageNum + 1 !== 1) {
      var x = pageNum;
      setPageNum(x - 1);
      setCount(count - 1);
    }
  };
  const onPageNumChanged = (event) => {
    var value = document.getElementById("page-num").value;
    setPageNum(value);
    setCount(value);
  };
  const recordsPerPageList = [
    {
      value: 50,
      label: 50,
    },
    {
      value: 100,
      label: 100,
    },
    {
      value: 500,
      label: 500,
    },
    {
      value: 1000,
      label: 1000,
    },
  ];

  const updateQuery = (newQuery, fieldName) => {
    setQueryArr((prevArray) => {
      // If newQuery is null, remove only the corresponding type of query from the array
      if (newQuery === null) {
        const targetTypePrev = findEmptyField(prevArray, fieldName);
        console.log("TargetType (null case):", targetTypePrev);

        const updatedArray = prevArray.filter((p) => {
          const hasWildcard =
            p &&
            p.bool &&
            p.bool.filter &&
            p.bool.filter[0] &&
            p.bool.filter[0].wildcard;

          const wildcardProperty =
            hasWildcard && Object.keys(p.bool.filter[0].wildcard)[0];

          const hasQueryString =
            p.bool &&
            p.bool.filter &&
            p.bool.filter[0] &&
            p.bool.filter[0].query_string;

          const isNameQuery =
            hasWildcard &&
            wildcardProperty === "Name" &&
            p.bool.filter[0].wildcard["Name"].value === "";

          const isIHCQuery =
            hasWildcard &&
            wildcardProperty === "IHC" &&
            p.bool.filter[0].wildcard["IHC"].value === "";
          // Adjust the condition based on the targetTypePrev boolean value
          return hasWildcard || hasQueryString
            ? targetTypePrev
              ? wildcardProperty !== fieldName &&
                !(
                  isNameQuery &&
                  isIHCQuery &&
                  p.bool.filter[0].query_string[fieldName] !== undefined
                )
              : isNameQuery ||
                isIHCQuery ||
                wildcardProperty === fieldName ||
                (hasQueryString &&
                  p.bool.filter[0].query_string[fieldName] !== undefined)
            : true;
        });

        console.log("Updated Array (null case):", updatedArray);

        return updatedArray;
      }

      const nonEmptyQueries = prevArray.filter((query) => {
        const wildcardProperty =
          query.bool &&
          query.bool.filter &&
          query.bool.filter[0].wildcard &&
          Object.keys(query.bool.filter[0].wildcard)[0];

        // Check if the field is not empty in the new query
        return !(
          wildcardProperty &&
          newQuery.bool.filter &&
          newQuery.bool.filter[0].wildcard &&
          Object.keys(newQuery.bool.filter[0].wildcard)[0] ===
            wildcardProperty &&
          newQuery.bool.filter[0].wildcard[wildcardProperty] === ""
        );
      });

      console.log("Non-empty Queries:", nonEmptyQueries);

      const updatedArray = nonEmptyQueries.map((p) => {
        const isSame = isSameType(p, newQuery);
        console.log(
          `Comparing: ${JSON.stringify(p)} and ${JSON.stringify(
            newQuery
          )} => ${isSame}`
        );
        return isSame ? newQuery : p;
      });

      // If the new query does not exist or has an empty value, remove it from the array
      if (
        newQuery.bool.filter !== undefined &&
        !nonEmptyQueries.some((p) => isSameType(p, newQuery)) &&
        !(newQuery.bool.filter[0]?.wildcard?.[fieldName]?.value === "")
      ) {
        // Check if there's an existing query for the same field and remove it
        const updatedArrayWithoutExisting = updatedArray.filter((p) => {
          if (
            p.bool &&
            p.bool.filter &&
            p.bool.filter[0].wildcard &&
            Object.keys(p.bool.filter[0].wildcard)[0] === fieldName
          ) {
            // Remove the existing query if the new query is not empty
            return newQuery.bool.filter[0]?.wildcard?.[fieldName]?.value !== "";
          }
          return true;
        });

        // Add the new query only if it's not an empty wildcard
        if (newQuery.bool.filter[0]?.wildcard?.[fieldName]?.value !== "") {
          updatedArrayWithoutExisting.push(newQuery);
          console.log("New Query Added:", updatedArrayWithoutExisting);
        }

        return updatedArrayWithoutExisting;
      }

      return updatedArray;
    });
  };

  const findEmptyField = (queries, fieldName) => {
    console.log("Queries:", queries);
    console.log("Field Name:", fieldName);

    const findFieldInFilter = (filter) => {
      if (filter.wildcard) {
        return filter && filter.wildcard && filter.wildcard[fieldName];
      } else if (filter.range) {
        return filter && filter.range && filter.range[fieldName];
      } else if (filter.query_string) {
        console.log("1272", filter.query_string);
        return filter.query_string; // Directly return the found filter
      }
    };

    const searchQuery = (query) => {
      if (query && query.bool && query.bool.filter) {
        return query.bool.filter.some(findFieldInFilter);
      }

      return false;
    };

    const result = queries.some(searchQuery); // Use some instead of find

    console.log(result ? "Field Found:" : "Field Not Found");

    return result;
  };

  // Helper function to check if two queries have the same wildcard type
  const isSameType = (query1, query2) => {
    const type1 = query1.bool?.filter?.[0]?.wildcard
      ? Object.keys(query1.bool.filter[0].wildcard)[0]
      : null;
    const type2 = query2.bool?.filter?.[0]?.wildcard
      ? Object.keys(query2.bool.filter[0].wildcard)[0]
      : null;

    // Check both type and value for wildcard queries
    if (type1 === type2 && type1 === "wildcard") {
      const value1 = query1.bool.filter[0].wildcard[type1].value;
      const value2 = query2.bool.filter[0].wildcard[type2].value;
      return value1 === value2;
    }

    return type1 === type2;
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
            bool: {
              must: [],
              must_not: [],
              filter: [
                {
                  wildcard: {
                    "PubMed ID": {
                      value: `*${inputValue}*`,
                      case_insensitive: true,
                    },
                  },
                },
              ],
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
            bool: {
              must: [],
              must_not: [],
              filter: [
                {
                  wildcard: {
                    Title: {
                      value: `*${inputValue}*`,
                      case_insensitive: true,
                    },
                  },
                },
              ],
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
            bool: {
              must: [],
              must_not: [],
              filter: [
                {
                  wildcard: {
                    journal_title: {
                      value: `*${inputValue}*`,
                      case_insensitive: true,
                    },
                  },
                },
              ],
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
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const escapeRegExp = (string) => {
    console.log(typeof string);
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const onFilterTextBoxChanged = (e) => {
    // Check if the event is a delete key press or a synthetic event
    const isDeleteKey =
      e.nativeEvent && e.nativeEvent.inputType === "deleteContentBackward";

    let inputValue = e;

    if (isDeleteKey) {
      // Handle delete key press by removing the last character
      inputValue = inputValue.slice(0, -1);
    }

    // Ensure that inputValue is defined
    inputValue = inputValue || "";

    // Escape special characters
    const escapedInputValue = escapeRegExp(inputValue);

    console.log("Input Value: " + escapedInputValue);

    if (escapedInputValue !== "") {
      console.log("415", escapedInputValue);
      setSearchText(escapedInputValue);
      setGlobalSC(true);
    } else {
      setGlobalSC(false);
      setSearchText("");
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setGlobalSC(false);
  };
  return (
    <>
      <Container
        maxWidth="false"
        sx={{
          width: "100%",
          display: "flex",
          paddingLeft: "0px !important",
          // paddingRight: "0px !important",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#f9f8f7",
            width: "270px",
            height: "47rem",
            overflow: "scroll",
          }}
        >
          <h1
            style={{
              color: "#1463B9",
              display: "center",
              textAlign: "center",
              paddingTop: "30px",
              fontSize: "25px",
              paddingBottom: "40px",
            }}
          >
            Filters
          </h1>
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Citation ID
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Search..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  onChange={handleIDChange}
                  value={citationID}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Date of Publication
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <label htmlFor="start" style={{ marginRight: "10px" }}>
                  Start date:
                </label>

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
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Title
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Search..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  onChange={handleTitleChange}
                  value={title}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Journal
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Search..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  onChange={handleJournalChange}
                  value={journal}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </Box>
        <Container maxWidth="xl" sx={{ marginTop: "30px", marginLeft: "20px" }}>
          <Box sx={{ display: "flex" }}>
            <Box style={{ display: "flex", width: "100%", maxWidth: "550px" }}>
              <TextField
                variant="outlined"
                size="small"
                label="Search..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    console.log("key wodn", e.key);
                    console.log(e.target.value);
                    onFilterTextBoxChanged(e.target.value);
                  }
                }}
                InputProps={{
                  style: {
                    height: "44px",
                    width: "500px",
                    borderRadius: "16px 0 0 16px",
                  },
                  endAdornment: searchText && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={() => {
                          clearSearch();
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
                onClick={() => {
                  const syntheticEvent = {
                    target: { value: searchText },
                    nativeEvent: { inputType: "insertText" }, // Mimic an input event
                  };
                  onFilterTextBoxChanged(syntheticEvent);
                }}
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
                }}
                sx={{ marginLeft: "10px", marginRight: "30px" }}
              >
                {recordsPerPageList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
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
                value={pageNum ? pageNum + 1 : 1}
                sx={{ marginLeft: "10px", marginRight: "10px" }}
                onChange={(event) => {
                  setPageNum(event.target.value);
                }}
              >
                {Array.from(
                  { length: Math.ceil(docCount / pageSize) },
                  (_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
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
                disabled={pageNum + 1 === 1}
                style={{
                  color: pageNum + 1 === 1 ? "#D3D3D3" : "#F6921E",
                  background: "white",
                  fontSize: "20px",
                  border: "none",
                  cursor: pageNum + 1 === 1 ? "default" : "pointer",
                  transition: pageNum + 1 === 1 ? "none" : "background 0.3s",
                  borderRadius: "5px",
                  marginRight: "15px",
                  pointerEvents: pageNum + 1 === 1 ? "none" : "auto",
                  paddingBottom: "5px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(246, 146, 30, 0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
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
                disabled={pageNum === Math.ceil(docCount / pageSize)}
                style={{
                  color:
                    pageNum === Math.ceil(docCount / pageSize)
                      ? "#D3D3D3"
                      : "#F6921E",
                  background: "white",
                  fontSize: "20px",
                  border: "none",
                  cursor:
                    pageNum === Math.ceil(docCount / pageSize)
                      ? "default"
                      : "pointer",
                  transition:
                    pageNum === Math.ceil(docCount / pageSize)
                      ? "none"
                      : "background 0.3s",
                  borderRadius: "5px",
                  pointerEvents:
                    pageNum === Math.ceil(docCount / pageSize)
                      ? "none"
                      : "auto",
                  paddingBottom: "5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(246, 146, 30, 0.2)";
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
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
              marginTop: "20px",
            }}
          >
            <div
              className="ag-theme-material ag-cell-wrap-text ag-theme-alpine saliva_table"
              style={{ height: 600 }}
            >
              <AgGridReact
                className="ag-cell-wrap-text"
                ref={gridRef}
                rowData={rowData}
                columnDefs={columns}
                defaultColDef={defColumnDefs}
                onGridReady={onGridReady}
                cacheQuickFilter={true}
                frameworkComponents={{
                  LinkComponent,
                }}
                enableCellTextSelection={true}
                overlayNoRowsTemplate={
                  '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">Loading</span>'
                }
                paginationPageSize={50}
              />
            </div>
          </Box>
        </Container>
      </Container>
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
                  value={citationID}
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
                  value={title}
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
                  value={journal}
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
          <span style={{ marginLeft: "5%" }}>Records Per Page</span>
          <select id="page-size">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
          </select>
          <span style={{ marginLeft: "5%" }}>Page</span>
          <select onChange={onPageNumChanged} value={pageNum} id="page-num">
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
      </div>
    </>
  );
}

export default App;
