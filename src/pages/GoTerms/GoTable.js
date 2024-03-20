import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import MainFeature from "../../assets/hero.jpeg";
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
import BreadCrumb from "../../components/Breadcrumbs";
import { AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";

function LinkComponent(props) {
  return (
    <div>
      <Link
        to={`/go-nodes/${props.value}`}
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
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedProperty, setSelectedProperty] =
    useState("Biological Process");

  const [elevatedOnly, setElevatedOnly] = useState("yes");
  const [salivaryOnly, setSalivaryOnly] = useState("yes");
  const [sortBy, setSortBy] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [recordCount, setRecordCount] = useState(10);

  const params = useParams();

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Browse" },
    { path: "Annotation Reports" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/go-nodes/${params.id}`
        );
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  });

  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
  };

  const handleElevateChange = (e) => {
    setElevatedOnly(e.target.value);
  };

  const handleSalivaryChange = (e) => {
    setSalivaryOnly(e.target.value);
  };

  const handleSearch = async () => {
    console.log("> Search called");
  };

  const handlePageSize = (e) => {
    setPageSize(e.target.value);
  };

  const handleSortBy = (e) => {
    setSortBy(e.target.value);
  };

  const handlePageChange = (e) => {
    setPageNumber(e.target.value);
  };

  const handleNextPage = (e) => {};

  const handlePrevPage = (e) => {};

  const columns = [
    {
      headerName: selectedProperty,
      field: "meta.basicPropertyValues.val",
      cellRenderer: "LinkComponent",
    },
    {
      headerName: "Protein Count",
      field: "",
    },
  ];

  const properties = [
    "Biological Process",
    "Biomarker",
    "Cellular Component",
    "Molecular Function",
    "Pathway",
    "Subcellular Location",
    "Disease",
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
                labelId="property-select-label"
                id="property-select"
                onChange={handlePropertyChange}
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
              onClick={handleSearch}
            >
              Search
            </Button>
          </ListItem>
        </Stack>
      </Container>
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
                  id="sort-by-select"
                  onChange={handleSortBy}
                  label="Sort By"
                  value={sortBy}
                  sx={{ width: "240px", marginRight: "20px" }}
                >
                  <MenuItem value={selectedProperty}>
                    {selectedProperty}
                  </MenuItem>
                  <MenuItem value={"Protein Count"}>Protein Count</MenuItem>
                </TextField>
              </FormControl>
              <FormControl onChange={handlePageSize}>
                <TextField
                  select
                  labelId="page-size-label"
                  id="page-size-select"
                  onChange={handlePageSize}
                  label="Page Size"
                  value={pageSize}
                  sx={{ width: "120px", marginRight: "20px" }}
                >
                  {[10, 20, 50, 100, 200, 500].map((size) => (
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
            <ListItem>
              <FormControl
                variant="outlined"
                sx={{ flexDirection: "row", alignItems: "center" }}
              >
                Page
                <TextField
                  select
                  id="page-number-select"
                  value={pageNumber + 1}
                  onChange={handlePageChange}
                  sx={{ marginX: "10px" }}
                >
                  <MenuItem value={pageNumber + 1}>{pageNumber + 1}</MenuItem>
                </TextField>
                <span sx={{ marginLeft: "10px" }}>{` of ${Math.ceil(
                  recordCount / pageSize
                )}`}</span>
              </FormControl>
            </ListItem>
          </Stack>
        </Box>
        <div
          className="ag-theme-material ag-cell-wrap-text ag-theme-alpine saliva_table"
          style={{ height: 3200 }}
        >
          <AgGridReact
            ref={gridRef}
            columnDefs={columns}
            defaultColDef={{ resizable: true }}
            rowData={rowData}
            components={{ LinkComponent }}
          />
        </div>
      </Container>
    </>
  );
};
export default GoTable;
