import React, { useRef, useState, useCallback } from "react";
import main_feature from "../../assets/hero.jpeg";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";
import { ReactComponent as DownloadLogo } from "../../assets/table-icon/download.svg";
import BreadCrumb from "../../components/Breadcrumbs";
import { Helmet } from "react-helmet";

function ProteinLinkComponent(props) {
  return (
    <div>
      <Link
        rel="noopener noreferrer"
        to={`/protein/${props.value}`}
      >
        {props.value}
      </Link>
    </div>
  );
}

function GeneLinkComponent(props) {
  const { value } = props;
  const genes = value.split(",");
  const links = [];

  for (let geneIndex = 0; geneIndex < genes.length; geneIndex++) {
    // [GeneId, Gene Symbol]
    const geneDetail = genes[geneIndex].split(";");

    links.push(
      <>
        {`${geneDetail[0]}: `}
        <Link
          key={`gene-${geneDetail[0]}`}
          rel="noopener noreferrer"
          to={`/gene/${geneDetail[0]}`}
        >
          {`${geneDetail[1]}`}
        </Link>
        {geneIndex === genes.length - 1 ? "" : ", "}
      </>
    );
  }
  return <div>{links}</div>;
}

const ProteinSetSearch = () => {
  const [searchType, setSearchType] = useState("uniprot_accession");
  const [rowData, setRowData] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const gridRef = useRef();

  const onGridReady = (params) => {
    gridRef.current.api.sizeColumnsToFit();
  };

  const resetSearch = () => {
    setSearchType("uniprot_accession");
    setRowData([]);
    setSearchInput("");
  };

  // Export current page as CSV file
  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  /**
   * Creates a query for a string field for OpenSearch
   * @param {{attrName, value}} input necessary fields for string query
   * @returns
   */
  const createStringQuery = ({ attrName, value }) => {
    const escapedInput = escapeSpecialCharacters(value);

    return {
      bool: {
        filter: [
          {
            regexp: {
              [`salivary_proteins.${attrName}.keyword`]: {
                value: `.*${escapedInput}.*`,
                flags: "ALL",
                case_insensitive: true,
              },
            },
          },
        ],
      },
    };
  };

  const handleSearch = async () => {
    // Remove any spaces, split csv values by commas
    const inputs = searchInput.replace(/\s/g, "").split(",");

    const query = inputs.map((val) => {
      return createStringQuery({ attrName: searchType, value: val });
    });

    await fetchData(query);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchInput(value);
  };

  const handleSearchType = (e) => {
    const { value } = e.target;
    setSearchType(value);
  };

  const defaultColDef = {
    sortable: true,
    resizable: true,
    wrapText: true,
  };

  const columnDef = [
    {
      headerName: "Protein",
      field: "uniprot_accession",
      headerClass: ["header-border"],
      cellRenderer: "ProteinLinkComponent",
      cellClass: ["table-border", "protein-set-search-cell"],
    },
    {
      headerName: "Gene",
      field: "gene_symbol",
      headerClass: ["header-border"],
      cellRenderer: "GeneLinkComponent",
      cellClass: ["table-border", "protein-set-search-cell"],
    },
    {
      headerName: "Protein Name",
      field: "protein_name",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      cellClass: ["table-border", "protein-set-search-cell"],
    },
    {
      headerName: "Data Source",
      field: "",
      valueFormatter: (params) => {
        console.log("> Params", params);
        if (params.value === undefined) {
          return "Uniprot";
        }
      },
      headerClass: ["header-border"],
      cellClass: ["table-border", "protein-set-search-cell"],
    },
  ];

  /**
   * Escape all special characters for input string
   * Special Characters include: [-[\]{}()*+?.,\\^$|#\s
   * @param {String} inputVal Non-escaped string value entered by user
   * @returns String where special characters are escaped with slashes
   */
  const escapeSpecialCharacters = (inputVal) => {
    return inputVal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  const fetchData = async (query) => {
    const data = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/proteins/1000/0/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filters: query }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const { hits } = data;
        return hits.hits.map((rec) => rec._source.salivary_proteins);
      });

    console.log("> Query results", data);

    setRowData(data);
  };

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Search" },
    { path: "Protein Set Search" },
  ];

  return (
    <>
      <Helmet>
        <title>HSP | Protein Set Search</title>
      </Helmet>
      <BreadCrumb path={breadcrumbPath} />
      <div
        style={{
          backgroundImage: `url(${main_feature})`,
        }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Protein Set Search</h1>
          <p className="head_text">
            Use the form below to search for salivary proteins stored in this
            database. Enter on each line one accession number or gene symbol.
            Accepted identifier types include UniProt, International Protein
            Index (IPI), RefSeq, Protein Data Bank (PDB), and Ensembl. To ensure
            accurate results, please use genes symbols (e.g. AMY2B) approved by
            the HUGO Gene Nomenclature Committee.
          </p>
          <p className="head_text">
            If you have a large set of proteins, please consider making multiple
            searches with no more than 100 proteins at a time.
          </p>
        </Container>
      </div>
      <Container maxWidth="xl">
        <form
          name="proteinSetSearch"
          id="proteinSetSearch"
          method="post"
          style={{ display: "block", margin: "25px auto", maxWidth: "80vw" }}
        >
          <input
            type="hidden"
            name="method"
            value="proteinSetSearch"
          />
          <FormControl>
            <InputLabel>{"Search by"}</InputLabel>
            <Select
              labelId="search-type"
              id="demo-simple-select"
              label="Search By"
              onChange={handleSearchType}
              value={searchType}
            >
              <MenuItem value="uniprot_accession">Accession Number</MenuItem>
              <MenuItem value="gene_symbol">Official Gene Symbol</MenuItem>
            </Select>
          </FormControl>
          <TextField
            required
            fullWidth
            multiline
            rows={12}
            onChange={handleInputChange}
            value={searchInput}
            sx={{ marginY: "25px" }}
            InputProps={{
              inputProps: {
                pattern: "[,a-zA-Z0-9\\s]*",
              },
            }}
          />
          <Typography sx={{ mb: 2, color: "black", paddingY: "10px" }}>
            <Button
              sx={{ marginRight: "10px" }}
              variant="contained"
              onClick={handleSearch}
            >
              Search
            </Button>
            <Button
              sx={{ marginX: "10px" }}
              variant="contained"
              onClick={resetSearch}
            >
              Reset
            </Button>
          </Typography>
        </form>
      </Container>
      <Container maxWidth="xl">
        {rowData.length !== 0 ? (
          <>
            <Box
              sx={{
                margin: "25px auto",
                maxWidth: "80vw",
              }}
            >
              <div
                className="ag-theme-material ag-cell-wrap-text ag-theme-alpine saliva_table"
                style={{ height: 600 }}
              >
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData}
                  defaultColDef={defaultColDef}
                  columnDefs={columnDef}
                  onGridReady={onGridReady}
                  components={{ ProteinLinkComponent, GeneLinkComponent }}
                  enableCellTextSelection={true}
                  suppressPaginationPanel={true}
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
                  <DownloadLogo
                    style={{
                      marginRight: "10px",
                    }}
                  />
                  Download Spreadsheet
                </Button>
              </div>
            </Box>
          </>
        ) : null}
      </Container>
    </>
  );
};

export default ProteinSetSearch;
