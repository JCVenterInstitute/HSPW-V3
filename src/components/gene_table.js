import "./filter.css";
import "./table.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
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
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ReactComponent as Download_Logo } from "./table_icon/download.svg";
import { ReactComponent as Left_Arrow } from "./table_icon/left_arrow.svg";
import { ReactComponent as Right_Arrow } from "./table_icon/right_arrow.svg";
import { ReactComponent as Search } from "./table_icon/search.svg";

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
      href={"http://localhost:3000/gene/" + props.value}
    >
      {props.value}
    </a>
  );
}
const rowHeight = 60;
function App() {
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(0);
  const [count, setCount] = useState(1);
  const [docCount, setDocCount] = useState(0);
  const [queryArr, setQueryArr] = useState([]);
  const [geneIDC, setGeneIDC] = useState(false);
  const [pageNumArr, setPageNumArr] = useState([1]);
  const [rowData, setRowData] = useState([]);
  const [geneNameC, setGeneNameC] = useState(false);
  const [gridApi, setGridApi] = useState();
  const [geneID, setGeneID] = useState("");
  const [geneName, setGeneName] = useState("");
  const [locationC, setLocationC] = useState(false);
  const [geneLocation, setGeneLocation] = useState("");
  const [searchText, setSearchText] = useState("");
  const [globalSC, setGlobalSC] = useState(false);

  const globalSearch = async () => {
    const data = await fetch(
      `http://localhost:8000/multi_search/genes/${searchText}`
    );
    console.log(`http://localhost:8000/multi_search/genes/${searchText}`);
    const json = data.json();
    return json;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `http://localhost:8000/genes/${pageSize}/${pageNum}`
      );
      const json = data.json();
      return json;
    };
    let test = [];

    const queryString = encodeURIComponent(JSON.stringify(queryArr));
    const url = `http://localhost:8000/genes_search/${pageSize}/${pageNum}/`;

    const customHeaders = {
      "Content-Type": "application/json",
    };
    const fetchQuery = async () => {
      console.log(JSON.stringify(queryArr));
      const data = await fetch(url, {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(queryArr),
      });
      const json = data.json();
      console.log("73" + JSON.stringify(json));
      return json;
    };
    console.log(url);

    if (geneIDC === true || geneNameC === true || locationC === true) {
      const queryResult = fetchQuery().catch(console.errror);
      queryResult.then((value) => {
        if (value.hits.hits) {
          console.log(value);
          let data1 = [];
          for (let i = 0; i < value.hits.hits.length; i++) {
            data1.push(value.hits.hits[i]["_source"]);
          }
          console.log(data1);
          setRowData(data1);
        }
        setDocCount(value.hits.total.value);
        const newOptions = [];
        for (
          let i = 1;
          i <= Math.round(value.hits.total.value / pageSize);
          i++
        ) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }
        setPageNumArr(newOptions);
      });
    } else if (globalSC === true) {
      const result = globalSearch().catch(console.errror);
      result.then((value) => {
        if (value.hits.hits) {
          console.log(value);
          let data1 = [];
          for (let i = 0; i < value.hits.hits.length; i++) {
            data1.push(value.hits.hits[i]["_source"]);
          }
          console.log(data1);
          setRowData(data1);
        }
        setDocCount(value.hits.total.value);
        const newOptions = [];
        for (
          let i = 1;
          i <= Math.round(value.hits.total.value / pageSize);
          i++
        ) {
          newOptions.push(
            <option key={i} value={i}>
              {i + 1}
            </option>
          );
        }

        setPageNumArr(newOptions);
        setCount(2);
      });
    } else {
      const result = fetchData().catch(console.errror);
      console.log(`http://localhost:8000/genes_search/${pageSize}/${pageNum}`);
      console.log(result);
      result.then((value) => {
        if (value.hits) {
          console.log(value);
          let data1 = [];
          for (let i = 0; i < value.hits.length; i++) {
            data1.push(value.hits[i]["_source"]);
          }
          console.log(data1);
          setRowData(data1);
        }
        setDocCount(value.total.value);
        const newOptions = [];
        for (let i = 1; i <= Math.round(value.total.value / pageSize); i++) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }
        setPageNumArr(newOptions);
      });
    }
  }, [geneID, pageSize, pageNum, geneName, queryArr, globalSC]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `http://localhost:8000/genes/${pageSize}/${pageNum}`
      );
      const json = data.json();
      return json;
    };
    const result = fetchData().catch(console.errror);
    console.log(result);
    result.then((value) => {
      if (value.hits) {
        console.log(value);
        let data1 = [];
        for (let i = 0; i < value.hits.length; i++) {
          data1.push(value.hits[i]["_source"]);
        }
        console.log(data1);
        setRowData(data1);
      }
      setDocCount(value.total.value);
      const newOptions = [];
      for (let i = 1; i <= Math.round(value.total.value / pageSize); i++) {
        newOptions.push(
          <option key={i} value={i}>
            {i}
          </option>
        );
      }
      setPageNumArr(newOptions);
    });
  }, []);

  const columns = [
    {
      headerName: "Gene",
      field: "GeneID",
      maxWidth: "120",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      cellRenderer: "LinkComponent",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Gene Name",
      field: "Gene Name",
      wrapText: true,
      autoHeight: true,
      cellStyle: { wordBreak: "break-word" },
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Location",
      field: "Location",
      maxWidth: "150",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
  ];

  const defColumnDefs = { flex: 1, filter: true };

  const onGridReady = (params) => {
    setGridApi(params);
  };

  const gridRef = useRef();

  const handleIDChange = (e) => {
    const isDeleteKey = e.nativeEvent.inputType === "deleteContentBackward";

    let inputValue = e.target.value;
    setGeneID(inputValue);
    if (isDeleteKey) {
      // Handle delete key press by removing the last character
      inputValue = inputValue.slice(0, -1);
    }

    // Remove double backslashes
    inputValue = inputValue.replace(/\\\\/g, "");

    // Escape special characters
    inputValue = inputValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    if (inputValue === "") {
      setGeneIDC(false);
    } else {
      setGeneIDC(true);
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
                    GeneID: {
                      value: `${inputValue}*`,
                      case_insensitive: true,
                    },
                  },
                },
              ],
            },
          }
        : null;

    updateQuery(newIDQuery, "GeneID");
  };

  const handleNameChange = (e) => {
    const isDeleteKey = e.nativeEvent.inputType === "deleteContentBackward";

    let inputValue = e.target.value;
    setGeneName(inputValue);
    if (isDeleteKey) {
      // Handle delete key press by removing the last character
      inputValue = inputValue.slice(0, -1);
    }

    // Remove double backslashes
    inputValue = inputValue.replace(/\\\\/g, "");

    // Escape special characters
    inputValue = inputValue.replace(/[[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    if (inputValue === "") {
      setGeneNameC(false);
    } else {
      setGeneNameC(true);
    }

    if (inputValue.includes("-")) {
      inputValue = inputValue.replace("-", "\\-");
      console.log(inputValue);
    }
    // Add new element for Name with updated input value
    const newNameQuery =
      inputValue !== ""
        ? {
            bool: {
              must: [],
              must_not: [],
              filter: [
                {
                  wildcard: {
                    "Gene Name": {
                      value: `${inputValue}*`,
                      case_insensitive: true,
                    },
                  },
                },
              ],
            },
          }
        : null;

    updateQuery(newNameQuery, "Gene Name");
  };

  const handleLocationChange = (e) => {
    const isDeleteKey = e.nativeEvent.inputType === "deleteContentBackward";

    let inputValue = e.target.value;
    setGeneLocation(inputValue);
    if (isDeleteKey) {
      // Handle delete key press by removing the last character
      inputValue = inputValue.slice(0, -1);
    }

    // Remove double backslashes
    inputValue = inputValue.replace(/\\\\/g, "");

    // Escape special characters
    inputValue = inputValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    if (inputValue === "") {
      setLocationC(false);
    } else {
      setLocationC(true);
    }

    // Add new element for Name with updated input value
    const newNameQuery =
      inputValue !== ""
        ? {
            bool: {
              must: [],
              must_not: [],
              filter: [
                {
                  wildcard: {
                    Location: {
                      value: `${inputValue}*`,
                      case_insensitive: true,
                    },
                  },
                },
              ],
            },
          }
        : null;

    updateQuery(newNameQuery, "Location");
  };

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
            wildcardProperty === "Gene Name" &&
            p.bool.filter[0].wildcard["Gene Name"].value === "";

          const isLocationQuery =
            hasWildcard &&
            wildcardProperty === "Location" &&
            p.bool.filter[0].wildcard["Location"].value === "";
          // Adjust the condition based on the targetTypePrev boolean value
          return hasWildcard || hasQueryString
            ? targetTypePrev
              ? wildcardProperty !== fieldName &&
                !(
                  isNameQuery &&
                  isLocationQuery &&
                  p.bool.filter[0].query_string[fieldName] !== undefined
                )
              : isNameQuery ||
                isLocationQuery ||
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

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

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

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const onFilterTextBoxChanged = (e) => {
    if (e.key === "Enter") {
      console.log("key entered", e.key);

      // Check if the event is a delete key press or a synthetic event
      const isDeleteKey =
        e.nativeEvent && e.nativeEvent.inputType === "deleteContentBackward";

      let inputValue = e.target.value;

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
        setSearchText(escapedInputValue);
        setGlobalSC(true);
      } else {
        setGlobalSC(false);
        setSearchText("");
      }
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setGlobalSC(false);
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
                  Gene ID
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
                  value={geneID}
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
                  Gene Name
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
                  onChange={handleNameChange}
                  value={geneName}
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
                  Location
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
                  onChange={handleLocationChange}
                  value={geneLocation}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </Box>
        <Container maxWidth="xl" sx={{ marginTop: "30px" }}>
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
