import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";

import MainFeature from "../../assets/hero.jpeg";
import BreadCrumb from "../../components/Breadcrumbs";

function LinkComponent(props) {
  const goNodeLink = props.value.split(":");

  return (
    <div style={{ paddingLeft: "20px" }}>
      <Link
        to={`/go-nodes/${goNodeLink[0]}`}
        rel="noopener noreferrer"
      >
        {props.value}
      </Link>
    </div>
  );
}

const GoTable = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);
  const [selectedProperty, setSelectedProperty] =
    useState("Biological Process");
  const [elevatedOnly, setElevatedOnly] = useState("yes");
  const [salivaryOnly, setSalivaryOnly] = useState("yes");
  const [pageSize, setPageSize] = useState(100);
  const [pageNumber, setPageNumber] = useState(0);
  const [recordCount, setRecordCount] = useState(10);
  const [columnApi, setColumnApi] = useState(null);
  const [search, setSearch] = useState(false);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [gridApi, setGridApi] = useState(null);

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Browse" },
    { path: "Annotation Reports" },
  ];

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };

  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
  };

  const handleElevateChange = (e) => {
    setElevatedOnly(e.target.value);
  };

  const handleSalivaryChange = (e) => {
    setSalivaryOnly(e.target.value);
  };

  useEffect(() => {
    if (search) {
      handleSearch();
    }
  }, [search, selectedProperty, pageSize]);

  useEffect(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
      setPageNumber(0);
      setSearch(true);
    }
  }, [sortedColumn]);

  useEffect(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
    }

    if (pageNumber !== 0 && !search) {
      handleSearch();
    }
  }, [pageNumber]);

  const handleSearch = async () => {
    const query = {
      bool: {
        filter: [
          {
            term: {
              "meta.basicPropertyValues.val.keyword": selectedProperty
                .toLowerCase()
                .replace(" ", "_"),
            },
          },
          {
            term: {
              "meta.basicPropertyValues.pred.keyword": "hasOBONamespace",
            },
          },
        ],
      },
    };

    const res = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/go-nodes/${pageSize}/${
        pageNumber * pageSize
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          _source: ["id", "lbl"],
          size: pageSize,
          ...(sortedColumn && createSortQuery()),
        }),
      }
    ).then((res) => res.json());

    const { hits, total } = res;
    const tableData = hits.map((rec) => rec._source);

    setRecordCount(total.value > 10000 ? 10000 : total.value);
    setRowData(tableData);
    setSearch(false);
    if (gridApi) gridApi.hideOverlay();
  };

  const handlePageSize = (e) => {
    setSearch(true);
    setPageSize(e.target.value);
    setPageNumber(0);
  };

  const handlePageChange = (e) => {
    setPageNumber(e.target.value - 1);
    setSearch(true);
  };

  const onBtPrevious = () => {
    if (pageNumber !== 0) {
      setPageNumber(pageNumber - 1);
      setSearch(true);
    }
  };

  const onBtNext = () => {
    if (pageNumber < recordCount / pageSize - 1) {
      setPageNumber(pageNumber + 1);
      setSearch(true);
    }
  };

  /**
   * Create a proper sort query for whichever sort attribute is selected
   */
  const createSortQuery = () => {
    const { attribute, order } = sortedColumn;

    // Have to include .keyword when sorting string attributes
    const sortAttrKey = `${attribute}.keyword`;

    return {
      sort: [
        {
          [sortAttrKey]: {
            order,
          },
        },
      ],
    };
  };

  const columns = [
    {
      headerName: "Id",
      field: "id",
      cellRenderer: "LinkComponent",
      width: 150,
    },
    {
      headerName: "Label",
      field: "lbl",
      width: 1000,
      cellClass: ["table-border"],
      cellStyle: {
        wordBreak: "break-word",
      },
    },
    {
      headerName: "Protein Count",
      field: "",
    },
  ];

  /**
   * Track which column is selected for sort by user
   */
  const onSortChanged = () => {
    const columnState = columnApi.getColumnState();
    const sortedColumn = columnState.filter((col) => col.sort !== null);

    if (sortedColumn.length !== 0) {
      const { sort, colId } = sortedColumn[0];
      setSortedColumn({ attribute: colId, order: sort });
    } else {
      setSortedColumn(null);
    }
  };

  // Export current page as CSV file
  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const properties = [
    "Biological Process",
    "Cellular Component",
    "Molecular Function",
    "Biomarker", // no data
    "Pathway", // no data
    "Subcellular Location", // no data
    "Disease", // no data
  ];

  return (
    <>
      <Helmet>
        <title>HSP | Annotation Reports</title>
      </Helmet>
      <BreadCrumb path={breadcrumbPath} />
      <div
        style={{
          backgroundImage: `url(${MainFeature})`,
        }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1 className="head_title">
            Annotation Report for Salivary Proteins
          </h1>
          <p className="head_text">
            Many semantic properties are annotated using controlled vocabulary
            terms, such as those in the Gene Ontology. This page allows you to
            retrieve all the values that have been used to annotate such
            properties in the salivary proteome catalog. The number of
            occurrence for each value will also be computed. Click on the counts
            to view the list of proteins with the associated annotations.
          </p>
        </Container>
      </div>
      <Container
        maxWidth="xl"
        sx={{ paddingY: "20px" }}
      >
        <Stack spacing={2}>
          <ListItem sx={{ paddingLeft: "0px" }}>
            <FormControl
              sx={{ m: 1, minWidth: 230 }}
              size="small"
            >
              <InputLabel id="property-select-label">Property:</InputLabel>
              <Select
                id="property-select"
                onChange={(e) => handlePropertyChange(e)}
                autoWidth
                label="Property"
                value={selectedProperty}
              >
                {properties.map((property) => {
                  return (
                    <MenuItem
                      key={`${property}`}
                      value={property}
                    >
                      {property}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl onChange={handleElevateChange}>
              <FormLabel>
                Limit to proteins with elevated transcript levels in salivary
                glands?
              </FormLabel>
              <Stack direction={"row"}>
                <RadioGroup
                  row
                  aria-labelledby="elevated-salivary"
                  defaultValue="yes"
                  name="elevated-transcript-select"
                >
                  <FormControlLabel
                    value="yes"
                    label="Yes"
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="no"
                    label="No"
                    control={<Radio />}
                  />
                </RadioGroup>
              </Stack>
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl onChange={handleSalivaryChange}>
              <FormLabel>
                Limit to proteins confirmed to have salivary gland origin?
              </FormLabel>
              <Stack direction={"row"}>
                <RadioGroup
                  row
                  aria-labelledby="salivary-gland-only"
                  defaultValue="yes"
                  name="elevated-transcript-select"
                >
                  <FormControlLabel
                    value="yes"
                    label="Yes"
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="no"
                    label="No"
                    control={<Radio />}
                  />
                </RadioGroup>
              </Stack>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              onClick={() => setSearch(true)}
            >
              Search
            </Button>
          </ListItem>
        </Stack>
      </Container>
      {
        rowData.length !== 0 ? (
          <Container maxWidth="xl">
            <Box sx={{ marginBottom: "40px" }}>
              <Stack
                direction={"row"}
                spacing={1}
              >
                <ListItem>
                  <FormControl>
                    <TextField
                      select
                      id="page-size-select"
                      onChange={handlePageSize}
                      label="Page Size"
                      value={pageSize}
                      sx={{ width: "120px", marginRight: "20px" }}
                    >
                      {[100, 200, 500, 1000].map((size) => (
                        <MenuItem
                          key={`page-size-${size}`}
                          value={size}
                        >
                          {size}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </ListItem>
                <ListItem sx={{ justifyContent: "end" }}>
                  <FormControl
                    variant="outlined"
                    sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: "15px",
                    }}
                  >
                    Page
                    <TextField
                      select
                      id="page-number-select"
                      value={pageNumber + 1}
                      onChange={handlePageChange}
                      sx={{ marginX: "10px" }}
                    >
                      {Array.from(
                        { length: Math.ceil(recordCount / pageSize) },
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
                    <span sx={{ marginLeft: "10px" }}>{` of ${Math.ceil(
                      recordCount / pageSize
                    )}`}</span>
                  </FormControl>
                  <button
                    onClick={onBtPrevious}
                    disabled={pageNumber === 0}
                    style={{
                      color: pageNumber === 0 ? "#D3D3D3" : "#F6921E",
                      background: "white",
                      fontSize: "20px",
                      border: "none",
                      cursor: pageNumber === 0 ? "default" : "pointer",
                      transition: pageNumber === 0 ? "none" : "background 0.3s",
                      borderRadius: "5px",
                      marginRight: "15px",
                      pointerEvents: pageNumber === 0 ? "none" : "auto",
                      paddingBottom: "5px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(246, 146, 30, 0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    prev
                  </button>
                  <button
                    onClick={onBtNext}
                    disabled={
                      pageNumber === Math.ceil(recordCount / pageSize - 1)
                    }
                    style={{
                      color:
                        pageNumber === Math.ceil(recordCount / pageSize - 1)
                          ? "#D3D3D3"
                          : "#F6921E",
                      background: "white",
                      fontSize: "20px",
                      border: "none",
                      cursor:
                        pageNumber === Math.ceil(recordCount / pageSize)
                          ? "default"
                          : "pointer",
                      transition:
                        pageNumber === Math.ceil(recordCount / pageSize)
                          ? "none"
                          : "background 0.3s",
                      borderRadius: "5px",
                      pointerEvents:
                        pageNumber === Math.ceil(recordCount / pageSize)
                          ? "none"
                          : "auto",
                      paddingBottom: "5px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(246, 146, 30, 0.2)";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    next
                  </button>
                </ListItem>
              </Stack>
            </Box>
            <div
              className="ag-theme-material ag-cell-wrap-text ag-theme-alpine saliva_table"
              style={{ height: 500 }}
            >
              <AgGridReact
                ref={gridRef}
                columnDefs={columns}
                defaultColDef={{ resizable: true, sortable: true }}
                rowData={rowData}
                onSortChanged={onSortChanged}
                components={{ LinkComponent }}
                onGridReady={onGridReady}
                suppressDragLeaveHidesColumns
                suppressMovable
                enableCellTextSelection={true}
              />
            </div>
            <div style={{ display: "flex" }}>
              <Button
                onClick={onBtExport}
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: "10px",
                  textTransform: "unset",
                  color: "#F6921E",
                  fontSize: "20",
                  "&:hover": {
                    backgroundColor: "inherit",
                  },
                }}
              >
                <DownloadIcon />
                Download Spreadsheet
              </Button>
            </div>
          </Container>
        ) : null
        // <Container maxWidth="xl">
        //   <Box sx={{ marginLeft: "10px" }}>No data found</Box>
        // </Container>
      }
    </>
  );
};
export default GoTable;
