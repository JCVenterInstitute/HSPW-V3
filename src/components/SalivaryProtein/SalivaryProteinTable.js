import List from "@mui/material/List";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Container,
  TextField,
  Box,
  MenuItem,
  Stack,
  Checkbox,
  InputAdornment,
  IconButton,
  Button,
  Modal,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CustomLoadingOverlay from "../CustomLoadingOverlay";
import CustomHeaderGroup from "../CustomHeaderGroup";
import { ReactComponent as DownloadLogo } from "../../assets/table-icon/download.svg";
import "../Filter.css";
import "../Table.css";
import Legend from "./Legend.js";
import { Link } from "react-router-dom";
import NormalizationSwitch from "./NormalizationSwitch.js";

const Accordion = styled((props) => (
  <MuiAccordion
    disableGutters
    elevation={0}
    square
    {...props}
  />
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

const commonStyles = {
  display: "flex", // Enable flexbox
  flexDirection: "column", // Stack children vertically
  justifyContent: "center", // Center vertically in the container
  width: "100%",
  height: "100%",
  fontFamily: "Lato",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "center",
};

function opinionComponent(props) {
  const { value } = props;

  return (
    <div
      style={{
        ...commonStyles,
      }}
    >
      <span style={{ textAlign: "center" }}>
        {value === "Confirmed" ? "C" : value === "Unsubstantiated" ? "US" : ""}
      </span>
    </div>
  );
}

function specificityComponent(props) {
  const { value } = props;

  return (
    <div
      style={{
        ...commonStyles,
      }}
    >
      <span style={{ textAlign: "center" }}>
        {value ? parseFloat(value).toFixed(2) : value}
      </span>
    </div>
  );
}

function specificityScoreComponent(props) {
  const { value } = props;

  return (
    <div
      style={{
        ...commonStyles,
      }}
    >
      <span style={{ textAlign: "center" }}>
        {value === "Tissue enriched"
          ? "TE"
          : value === "Low tissue specificity"
          ? "LTS"
          : ""}
      </span>
    </div>
  );
}

function IHCComponent(props) {
  const d = props.value;
  if (d === "Low") {
    return (
      <>
        <div
          style={{
            ...commonStyles,
            backgroundColor: "rgb(180,250,180)",
            color: "black",
          }}
        >
          <span style={{ textAlign: "center" }}>{d}</span>
        </div>
      </>
    );
  } else if (d === "Medium") {
    return (
      <>
        <div
          style={{
            ...commonStyles,
            backgroundColor: "rgb(70,170,70)",
            color: "#FFF",
          }}
        >
          <span style={{ textAlign: "center" }}>{d}</span>
        </div>
      </>
    );
  } else if (d === "High") {
    return (
      <>
        <div
          style={{
            ...commonStyles,
            backgroundColor: "rgb(0,100,0)",
            color: "#FFF",
          }}
        >
          <span style={{ textAlign: "center" }}>{d}</span>
        </div>
      </>
    );
  } else if (d === "ND") {
    return (
      <>
        <div
          style={{
            ...commonStyles,
            color: "black",
          }}
        >
          <span style={{ textAlign: "center" }}>ND</span>
        </div>
      </>
    );
  } else {
    return (
      <div
        style={{
          ...commonStyles,
          backgroundColor: "rgb(250,250,250)",
          color: "black",
        }}
      >
        NA
      </div>
    );
  }
}

function proteinLinkComponent(props) {
  return (
    <div>
      <Link
        to={`/protein/${props.value}`}
        rel="noopener noreferrer"
      >
        {props.value}
      </Link>
    </div>
  );
}

function GreenComponent(props) {
  const data = typeof props.value === "number" ? props.value : 0;
  const dataMax = props.max.value;

  // Interpolate between light red and dark red
  const interpolateColor = (start, end, percent) => {
    const r = Math.round(start[0] + (end[0] - start[0]) * percent);
    const g = Math.round(start[1] + (end[1] - start[1]) * percent);
    const b = Math.round(start[2] + (end[2] - start[2]) * percent);
    return `rgb(${r},${g},${b})`;
  };

  // Define light green and dark green
  const lightGreen = [200, 255, 200]; // Light green color
  const darkGreen = [0, 100, 0]; // Dark green color

  // Calculate color based on normalized value
  const percent =
    props.normalizationSelected === true
      ? data / Math.log2(dataMax + 1)
      : data / dataMax;
  const color =
    data === 0 ? "white" : interpolateColor(lightGreen, darkGreen, percent);
  const textColor = percent > 0.6 ? "white" : "black";

  return (
    <div
      style={{
        ...commonStyles,
        backgroundColor: color,
        color: textColor,
      }}
    >
      {Number(data).toFixed(2)}
    </div>
  );
}

function RedComponent(props) {
  const data = typeof props.value === "number" ? props.value : 0;
  const dataMax = props.max.value;

  // Interpolate between light red and dark red
  const interpolateColor = (start, end, percent) => {
    const r = Math.round(start[0] + (end[0] - start[0]) * percent);
    const g = Math.round(start[1] + (end[1] - start[1]) * percent);
    const b = Math.round(start[2] + (end[2] - start[2]) * percent);
    return `rgb(${r},${g},${b})`;
  };

  // Define light red and dark red
  const lightRed = [255, 200, 200]; // Light red color
  const darkRed = [150, 0, 0]; // Dark red color

  // Calculate color based on normalized value
  const percent =
    props.normalizationSelected === true
      ? data / Math.log2(dataMax + 1)
      : data / dataMax;
  const color =
    data === 0 ? "white" : interpolateColor(lightRed, darkRed, percent);
  const textColor = percent > 0.6 ? "white" : "black";

  return (
    <div
      style={{
        ...commonStyles,
        backgroundColor: color,
        color: textColor,
      }}
    >
      {Number(data).toFixed(2)}
    </div>
  );
}

const customHeaders = {
  "Content-Type": "application/json",
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

const rowHeight = 80;

const IHCValues = ["", "Medium", "Low", "High"];

/**
 * Escape all special characters for input string
 * Special Characters include: [-[\]{}()*+?.,\\^$|#\s
 * @param {String} inputVal Non-escaped string value entered by user
 * @returns String where special characters are escaped with slashes
 */
const escapeSpecialCharacters = (inputVal) => {
  return inputVal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const stringAttributes = [
  "uniprot_accession",
  "Gene Symbol",
  "Protein Name",
  "IHC",
  "expert_opinion",
  "specificity_score",
  "specificity",
];

const numberAttributes = [
  "saliva_abundance", // MS WS
  "parotid_gland_abundance", // MS PAR
  "sm/sl_abundance", // MS Sub
  "plasma_abundance", // MS B
  "mRNA", // mRNA
];

const SalivaryProteinTable = () => {
  const gridRef = useRef();

  const [pageSize, setPageSize] = useState(50); // Default page data to 50 records per page
  const [pageNum, setPageNum] = useState(0);
  const [docCount, setDocCount] = useState(0); // Total # of records available for display
  const [opCount, setOpCount] = useState([]);
  const [IHCCount, setIHCCount] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [opArr, setOpArr] = useState([false, false]);
  const [orFilterOn, setOrFilterOn] = useState(false);
  const [IHCArr, setIHCArr] = useState([false, false, false, false]);
  const [searchText, setSearchText] = useState("");
  const [msBExcludeOn, setMsBExcludeOn] = useState(false);
  const [facetFilter, setFacetFilters] = useState({});
  const [columnApi, setColumnApi] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [openLegend, setOpenLegend] = useState(false);
  const [normalizationSelected, setNormalizationSelected] = useState(false);
  const [salivaryMaxAndSum, setSalivaryMaxAndSum] = useState({});

  const columns = [
    {
      headerName: "Accession",
      field: "uniprot_accession",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      wrapText: true,
      minWidth: 105,
      cellStyle: { wordBreak: "break-word" },
      cellClass: ["table-border", "salivary-protein-cell"],
      cellRenderer: "proteinLinkComponent",
    },
    {
      headerName: "Gene Symbol",
      field: "Gene Symbol",
      cellClass: ["table-border", "salivary-protein-cell"],
      cellStyle: {
        wordBreak: "break-word",
      },
    },
    {
      headerName: "Protein Name",
      field: "Protein Name",
      cellClass: ["table-border", "salivary-protein-protein-name-cell"],
      cellStyle: {
        wordBreak: "break-word",
        textWrap: "wrap",
      },
    },
    {
      headerName: "Expert Opinion",
      field: "expert_opinion",
      cellRenderer: "opinionComponent",
      cellClass: ["table-border"],
    },
    {
      headerName: "MS (obs.)",
      headerGroupComponent: CustomHeaderGroup,
      headerClass: ["header-border", "salivary-protein-header"],
      cellClass: ["table-border"],
      children: [
        {
          headerName: "Whole Saliva",
          field: "saliva_abundance",
          cellRenderer: "GreenComponent",
          cellRendererParams: {
            normalizationSelected,
            max: salivaryMaxAndSum.saliva_abundance_max,
          },
          cellClass: ["square_table", "salivary-proteins-colored-cell"],
        },
        {
          headerName: "Parotid Glands",
          field: "parotid_gland_abundance",
          cellRenderer: "GreenComponent",
          cellRendererParams: {
            normalizationSelected,
            max: salivaryMaxAndSum.parotid_gland_abundance_max,
          },
          cellClass: ["square_table", "salivary-proteins-colored-cell"],
        },
        {
          headerName: "SM/SL Glands",
          field: "sm/sl_abundance",
          cellRenderer: "GreenComponent",
          cellRendererParams: {
            normalizationSelected,
            max: salivaryMaxAndSum.sm_sl_abundance_max,
          },
          cellClass: ["square_table", "salivary-proteins-colored-cell"],
        },
        {
          headerName: "Blood",
          field: "plasma_abundance",
          cellRenderer: "RedComponent",
          cellRendererParams: {
            normalizationSelected,
            max: salivaryMaxAndSum.plasma_abundance_max,
          },
          cellClass: ["square_table", "salivary-proteins-colored-cell"],
        },
      ],
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "IHC",
      field: "IHC",
      wrapText: true,
      cellRenderer: "IHCComponent",
      cellClass: ["square_table", "salivary-proteins-colored-cell"],
    },
    {
      headerName: "mRNA (NX)",
      headerGroupComponent: CustomHeaderGroup,
      headerClass: ["header-border", "salivary-protein-header"],
      wrapText: true,
      cellClass: ["table-border"],
      children: [
        {
          headerName: "Value",
          field: "mRNA",
          cellRenderer: "GreenComponent",
          cellRendererParams: {
            normalizationSelected,
            max: salivaryMaxAndSum.mRNA_max,
          },
          maxWidth: 170,
          cellClass: ["square_table", "salivary-proteins-colored-cell"],
        },
        {
          headerName: "Specificity",
          field: "specificity",
          cellRenderer: "specificityComponent",
          cellClass: ["table-border", "salivary-proteins-colored-cell"],
        },
        {
          headerName: "Specificity Score",
          field: "specificity_score",
          cellRenderer: "specificityScoreComponent",
          cellClass: ["table-border", "salivary-proteins-colored-cell"],
        },
      ],
    },
    {
      headerName: "mRNA Large",
      headerGroupComponent: CustomHeaderGroup,
      headerClass: ["header-border", "salivary-protein-header"],
      wrapText: true,
      cellClass: ["table-border"],
      children: [
        {
          headerName: "SM",
          field: "SM",
          cellRenderer: "GreenComponent",
          cellRendererParams: {
            normalizationSelected,
            max: salivaryMaxAndSum.SM_max,
          },
          cellClass: ["square_table", "salivary-proteins-colored-cell"],
        },
        {
          headerName: "SL",
          field: "SL",
          cellRenderer: "GreenComponent",
          cellRendererParams: {
            normalizationSelected,
            max: salivaryMaxAndSum.SL_max,
          },
          cellClass: ["table-border", "salivary-proteins-colored-cell"],
        },
        {
          headerName: "PAR",
          field: "PAR",
          cellRenderer: "GreenComponent",
          cellRendererParams: {
            normalizationSelected,
            max: salivaryMaxAndSum.PAR_max,
          },
          cellClass: ["table-border", "salivary-proteins-colored-cell"],
        },
      ],
    },
  ];

  const defColumnDefs = {
    flex: 1,
    filter: true,
    resizable: true,
    sortable: true,
    wrapHeaderText: true,
    wrapText: true,
    autoHeaderHeight: true,
    headerClass: ["header-border", "salivary-protein-header"],
    headerComponentParams: {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        // '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
        '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
        '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
        '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
        '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
        '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
        '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal; font-size: 10px;"></span>' +
        // '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
        "  </div>" +
        "</div>",
    },
  };

  const handleOpenLegend = () => setOpenLegend(true);
  const handleCloseLegend = () => setOpenLegend(false);

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  // Export the current page data as CSV file
  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  /**
   * Create a proper sort query for whichever sort attribute is selected
   */
  const createSortQuery = () => {
    const { attribute, order } = sortedColumn;

    // Have to include .keyword when sorting string attributes
    const sortAttrKey = `${sortedColumn.attribute}${
      stringAttributes.includes(attribute) ? ".keyword" : ""
    }`;

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

  /**
   * Create a proper search query for whichever search string is entered into the search bar
   */
  const createGlobalSearchQuery = () => {
    const escapedInput = escapeSpecialCharacters(searchText);

    return {
      query_string: {
        query: `*${escapedInput}*`,
        default_operator: "AND",
        analyze_wildcard: true,
      },
    };
  };

  const normalizeData = (rowData, maxData) => {
    return rowData.map((item) => {
      // Helper function to check and normalize the value
      const normalizeAbundance = (value) => {
        // Check if value exists and is not an empty string; otherwise, return 0
        if (value === "" || value === undefined || value === null) {
          return 0;
        }
        // Apply Math.log2(value + 1) for normalization
        return Math.log2(Number(value) + 1);
      };

      // Normalize the fields
      return {
        ...item,
        saliva_abundance: normalizeAbundance(item.saliva_abundance),
        parotid_gland_abundance: normalizeAbundance(
          item.parotid_gland_abundance
        ),
        mRNA: normalizeAbundance(item.mRNA),
        plasma_abundance: normalizeAbundance(item.plasma_abundance),
        "sm/sl_abundance": normalizeAbundance(item["sm/sl_abundance"]),
        SM: normalizeAbundance(item.SM),
        SL: normalizeAbundance(item.SL),
        PAR: normalizeAbundance(item.PAR),
      };
    });
  };

  // Handle fetching data for table
  const fetchData = async () => {
    const apiPayload = {
      filters: queryBuilder(facetFilter),
      filterByOr: orFilterOn, // True if Or filter toggled
      // Pass sort query if any sort is applied
      ...(sortedColumn && createSortQuery()),
      ...(searchText && { keyword: createGlobalSearchQuery() }),
    };

    let data = await fetch(
      `${
        process.env.REACT_APP_API_ENDPOINT
      }/api/salivary-proteins/${pageSize}/${pageNum * pageSize}`,
      {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(apiPayload),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const { hits, aggregations } = data;

        for (const aggr of Object.keys(aggregations)) {
          const displayedAggs = aggregations[aggr].buckets;

          if (aggr === "IHC") {
            setIHCCount(displayedAggs);
          } else if (aggr === "expert_opinion") {
            // Only want to display unsubstantiated & confirmed agg for expert opinions
            setOpCount(
              displayedAggs.filter((agg) =>
                ["Unsubstantiated", "Confirmed"].includes(agg.key)
              )
            );
          }
        }

        // Set number of total records returned
        setDocCount(hits.total.value);

        return hits.hits.map((rec) => rec._source);
      });

    const salivaryMaxAndSum = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/get-salivary-max-and-sum`
    ).then((res) => res.json());

    setSalivaryMaxAndSum(salivaryMaxAndSum);

    if (normalizationSelected) {
      // Normalize the data with the sum values
      data = normalizeData(data, salivaryMaxAndSum);
    }

    setRowData(data);
    if (gridApi) gridApi.hideOverlay();
  };

  // Initial data fetch on page load
  useEffect(() => {
    if (gridApi) gridApi.showLoadingOverlay();
    fetchData();
  }, []);

  // Fetch new table data when page size is changed or filters are updated
  useEffect(() => {
    // Needed to delay search so users can type before triggering search
    const delayDebounceFn = setTimeout(() => {
      setPageNum(0);
      fetchData();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [facetFilter, pageSize, msBExcludeOn, searchText, orFilterOn]);

  // Update records when new sort is applied & go back to first page
  useEffect(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
      setPageNum(0);
      fetchData();
    }
  }, [sortedColumn]);

  // Fetch data for new page selected
  // No delay needed when switching pages no filter updates
  useEffect(() => {
    if (gridApi) gridApi.showLoadingOverlay();
    fetchData();
  }, [pageNum, normalizationSelected]);

  // Function to toggle the normalizationSelected state
  const handleToggleNormalization = (event) => {
    setNormalizationSelected(event.target.checked); // Update based on the switch's checked state
  };

  /**
   * Update search entered by user in search bar
   * @param {string} input String input to search bar
   */
  const handleGlobalSearch = (input) => {
    setSearchText(input);
  };

  const onGridReady = (params) => {
    params.api.showLoadingOverlay();
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    gridRef.current.api.sizeColumnsToFit();
  };

  const clearSearchBar = () => {
    setSearchText("");
  };

  // Set new page to prev page
  const setPrevPage = () => {
    if (pageNum !== 0) {
      setPageNum(pageNum - 1);
    }
  };

  // Set new page to next page
  const setNextPage = () => {
    if (pageNum < docCount / pageSize - 1) {
      setPageNum(pageNum + 1);
    }
  };

  /**
   * Creates a range query for a number field for OpenSearch
   * @param {{ attrName, start, end }} input Necessary fields for range query
   * @returns OpenSearch range query based on inputs
   */
  const createRangeQuery = ({ attrName, start, end }) => {
    let rangeQuery = {
      range: {
        [attrName]: {
          ...(start && { gte: start }),
          ...(end && { lte: end }),
        },
      },
    };

    if (attrName === "plasma_abundance" && msBExcludeOn) {
      rangeQuery = {
        bool: {
          filter: [
            {
              bool: {
                must_not: [rangeQuery],
              },
            },
          ],
        },
      };
    } else {
      rangeQuery = {
        bool: {
          filter: [rangeQuery],
        },
      };
    }

    return rangeQuery;
  };

  /**
   * Creates a query for a string field for OpenSearch
   * @param {{attrName, value}} input necessary fields for string query
   * @returns
   */
  const createStringQuery = ({ attrName, value }) => {
    let escapedInput = escapeSpecialCharacters(value);

    // Can't use regex query for empty strings
    if (attrName === "IHC" && value === "NA") {
      return {
        bool: {
          filter: [
            {
              term: {
                "IHC.keyword": "",
              },
            },
          ],
        },
      };
    }

    return {
      bool: {
        filter: [
          {
            regexp: {
              [`${attrName}.keyword`]: {
                value: `${escapedInput}.*`,
                flags: "ALL",
                case_insensitive: true,
              },
            },
          },
        ],
      },
    };
  };

  /**
   * Remove all empty filters to prevent building queries with empty values
   * @param {Object} filters Object with Key value pairs of all facet fields
   * @returns Object with all non empty filter values for building queries
   */
  const removeEmptyFilters = (filters) => {
    const attributes = Object.keys(filters);

    for (const attr of attributes) {
      const attrType = typeof filters[attr];

      if (attrType === "string" && filters[attr] === "") {
        // Remove empty string filters (e.g { "value": "" })
        delete filters[attr];
      } else if (attrType === "object") {
        // Filter out empty range filters (e.g. { "rangeField": { start: "", end: "" }})
        const fil = filters[attr];

        for (const key of Object.keys(fil)) {
          if (fil[key] === "") delete fil[key];
        }

        if (Object.keys(filters[attr]).length === 0) {
          delete filters[attr];
        }
      }
    }

    return filters;
  };

  /**
   * Build OpenSearch Query based on user facet filters
   * @param {Object} filters Object containing all key & values for all user selected facet filters
   * @returns Returns an array of queries for each non empty filter applied by user
   */
  const queryBuilder = (filters) => {
    const queries = [];

    filters = removeEmptyFilters(filters);

    for (const attr of Object.keys(filters)) {
      if (stringAttributes.includes(attr)) {
        queries.push(
          createStringQuery({ attrName: attr, value: filters[attr] })
        );
      } else if (numberAttributes.includes(attr)) {
        queries.push(createRangeQuery({ attrName: attr, ...filters[attr] }));
      }
    }

    return queries;
  };

  const handleAccessionChange = (e) => {
    const { value } = e.target;

    setFacetFilters({
      ...facetFilter,
      uniprot_accession: value,
    });
  };

  const handleGeneChange = (e) => {
    const { value } = e.target;

    setFacetFilters({
      ...facetFilter,
      "Gene Symbol": value,
    });
  };

  const handleNameChange = (e) => {
    const { value } = e.target;

    setFacetFilters({
      ...facetFilter,
      "Protein Name": value,
    });
  };

  const handleStartWSChange = (e) => {
    let inputValue = e.target.value;

    const updateFacet = facetFilter;

    if (updateFacet.saliva_abundance) {
      updateFacet.saliva_abundance = {
        ...updateFacet.saliva_abundance,
        start: inputValue,
      };
    } else {
      updateFacet.saliva_abundance = {
        start: inputValue,
      };
    }

    setFacetFilters({ ...updateFacet });
  };

  const handleEndWSChange = (e) => {
    const { value } = e.target;

    const updateFacet = facetFilter;

    if (updateFacet.saliva_abundance) {
      updateFacet.saliva_abundance = {
        ...updateFacet.saliva_abundance,
        end: value,
      };
    } else {
      updateFacet.saliva_abundance = {
        end: value,
      };
    }

    setFacetFilters({ ...updateFacet });
  };

  const handleStartParChange = (e) => {
    const { value } = e.target;

    const updateFacet = facetFilter;

    if (updateFacet.parotid_gland_abundance) {
      updateFacet.parotid_gland_abundance = {
        ...updateFacet.parotid_gland_abundance,
        start: value,
      };
    } else {
      updateFacet.parotid_gland_abundance = {
        start: value,
      };
    }

    setFacetFilters({ ...updateFacet });
  };

  const handleEndParChange = (e) => {
    const { value } = e.target;

    const updateFacet = facetFilter;

    if (updateFacet.parotid_gland_abundance) {
      updateFacet.parotid_gland_abundance = {
        ...updateFacet.parotid_gland_abundance,
        end: value,
      };
    } else {
      updateFacet.parotid_gland_abundance = {
        end: value,
      };
    }

    setFacetFilters({ ...updateFacet });
  };

  const handleStartSubChange = (e) => {
    const { value } = e.target;

    const updateFacet = facetFilter;

    if (updateFacet["sm/sl_abundance"]) {
      updateFacet["sm/sl_abundance"] = {
        ...updateFacet["sm/sl_abundance"],
        start: value,
      };
    } else {
      updateFacet["sm/sl_abundance"] = {
        start: value,
      };
    }

    setFacetFilters({ ...updateFacet });
  };

  const handleEndSubChange = (e) => {
    const { value } = e.target;

    const updateFacet = facetFilter;

    if (updateFacet["sm/sl_abundance"]) {
      updateFacet["sm/sl_abundance"] = {
        ...updateFacet["sm/sl_abundance"],
        end: value,
      };
    } else {
      updateFacet["sm/sl_abundance"] = {
        end: value,
      };
    }

    setFacetFilters({ ...updateFacet });
  };

  const handleStartBChange = (e) => {
    const { value } = e.target;

    const updateFacet = facetFilter;

    if (updateFacet["plasma_abundance"]) {
      updateFacet["plasma_abundance"] = {
        ...updateFacet["plasma_abundance"],
        start: value,
      };
    } else {
      updateFacet["plasma_abundance"] = {
        start: value,
      };
    }

    setFacetFilters({ ...updateFacet });
  };

  const handleEndBChange = (e) => {
    const { value } = e.target;

    const updateFacet = facetFilter;

    if (updateFacet["plasma_abundance"]) {
      updateFacet["plasma_abundance"] = {
        ...updateFacet["plasma_abundance"],
        end: value,
      };
    } else {
      updateFacet["plasma_abundance"] = {
        end: value,
      };
    }

    setFacetFilters({ ...updateFacet });
  };

  const handleStartMRNAChange = (e) => {
    const { value } = e.target;

    const updateFacet = facetFilter;

    if (updateFacet.mRNA) {
      updateFacet.mRNA = {
        ...updateFacet.mRNA,
        start: value,
      };
    } else {
      updateFacet.mRNA = {
        start: value,
      };
    }

    setFacetFilters({ ...updateFacet });
  };

  const handleEndMRNAChange = (e) => {
    const updateFacet = facetFilter;
    const { value } = e.target;

    if (updateFacet.mRNA) {
      updateFacet.mRNA = {
        ...updateFacet.mRNA,
        end: value,
      };
    } else {
      updateFacet.mRNA = {
        end: value,
      };
    }

    setFacetFilters({ ...updateFacet });
  };

  const filterIHC = (event) => {
    const { value } = event.target;
    const valIndex = IHCValues.indexOf(value);
    const updatedIHCArr = IHCArr;
    updatedIHCArr[valIndex] = !IHCArr[valIndex];
  };

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

  /** Reset all search filters */
  const resetFilters = () => {
    setFacetFilters({});
    setSearchText("");
    setSortedColumn(null);
    setOrFilterOn(false);
    setMsBExcludeOn(false);
    setOpArr([false, false]);
    setIHCArr([false, false, false, false]);
  };

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          display: "flex",
          paddingLeft: "0px !important",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#f9f8f7",
            width: "285px",
            overflow: "scroll",
            height: "auto",
          }}
        >
          <h1
            style={{
              color: "#1463B9",
              display: "center",
              textAlign: "center",
              paddingTop: "30px",
              fontSize: "25px",
            }}
          >
            Filters
          </h1>
          <Button
            variant="text"
            size="small"
            sx={{
              display: "block",
              marginBottom: "20px",
              marginX: "auto",
              textAlign: "center",
            }}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
          <FormGroup style={{ marginLeft: "18%" }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Typography color="common.black">And</Typography>
              <Switch
                checked={orFilterOn}
                inputProps={{ "aria-label": "ant design" }}
                onChange={(event) => setOrFilterOn(event.target.checked)}
              />
              <Typography color="common.black">Or</Typography>
            </Stack>
          </FormGroup>
          <div>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Accession
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
                  value={
                    facetFilter["uniprot_accession"]
                      ? facetFilter["uniprot_accession"]
                      : ""
                  }
                  onChange={handleAccessionChange}
                  name="accession"
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Gene Symbol
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
                  value={
                    facetFilter["Gene Symbol"] ? facetFilter["Gene Symbol"] : ""
                  }
                  onChange={handleGeneChange}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Protein Name
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
                  value={
                    facetFilter["Protein Name"]
                      ? facetFilter["Protein Name"]
                      : ""
                  }
                  onChange={handleNameChange}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Expert Opinion
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List
                  component="div"
                  disablePadding
                  sx={{ border: "1px groove" }}
                >
                  {opCount.map((child, key) => (
                    <FormGroup
                      key={key}
                      sx={{ ml: "10px" }}
                    >
                      {child.key === "Unsubstantiated" ? (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={opArr[0]}
                              onClick={(e) => {
                                const { checked } = e.target;

                                if (!checked) {
                                  delete facetFilter["expert_opinion"];
                                }

                                const updatedOpArr = [!opArr[0], opArr[1]];

                                setOpArr(updatedOpArr);

                                setFacetFilters({
                                  ...facetFilter,
                                  ...(checked && {
                                    expert_opinion: "Unsubstantiated",
                                  }), // Only pass when checked
                                });
                              }}
                            />
                          }
                          label={"US (" + child.doc_count + ")"}
                        />
                      ) : (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={opArr[1]}
                              onClick={(e) => {
                                const { checked } = e.target;

                                if (!checked) {
                                  delete facetFilter["expert_opinion"];
                                }

                                const updatedOpArr = [opArr[0], !opArr[1]];

                                setOpArr(updatedOpArr);

                                setFacetFilters({
                                  ...facetFilter,
                                  ...(checked && {
                                    expert_opinion: "Confirmed",
                                  }), // Only pass when checked
                                });
                              }}
                            />
                          }
                          label={"C (" + child.doc_count + ")"}
                        />
                      )}
                    </FormGroup>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  IHC
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List
                  component="div"
                  disablePadding
                  sx={{ border: "1px groove" }}
                >
                  {IHCCount.map((child, i) =>
                    child.key !== "?" ? (
                      <FormGroup
                        key={i}
                        sx={{ ml: "10px" }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                IHCArr[IHCValues.indexOf(child.key.trim())]
                              } // Set the checked attribute based on IHCArr
                              onChange={filterIHC}
                              value={child.key}
                              onClick={(e) => {
                                const { value, checked } = e.target;

                                console.log("> Value", value);

                                if (!checked) {
                                  delete facetFilter["IHC"];
                                }

                                setFacetFilters({
                                  ...facetFilter,
                                  ...(checked && {
                                    IHC: value === "" ? "NA" : value,
                                  }), // Only pass when checked
                                });
                              }}
                            />
                          }
                          label={
                            `${child.key === "" ? "NA" : child.key}` +
                            " (" +
                            child.doc_count +
                            ")"
                          }
                        />
                      </FormGroup>
                    ) : null
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Whole Saliva
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  label="Start..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  value={
                    facetFilter["saliva_abundance"] &&
                    facetFilter["saliva_abundance"].start
                      ? facetFilter["saliva_abundance"].start
                      : ""
                  }
                  onChange={handleStartWSChange}
                />
                <Typography
                  variant="p"
                  style={{
                    margin: "5px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  to
                </Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  label="End..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  value={
                    facetFilter["saliva_abundance"] &&
                    facetFilter["saliva_abundance"].end
                      ? facetFilter["saliva_abundance"].end
                      : ""
                  }
                  onChange={handleEndWSChange}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Parotid Glands
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  label="Start..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  value={
                    facetFilter["parotid_gland_abundance"] &&
                    facetFilter["parotid_gland_abundance"].start
                      ? facetFilter["parotid_gland_abundance"].start
                      : ""
                  }
                  onChange={handleStartParChange}
                />
                <Typography
                  variant="p"
                  style={{
                    margin: "5px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  to
                </Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  label="End..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  value={
                    facetFilter["parotid_gland_abundance"] &&
                    facetFilter["parotid_gland_abundance"].end
                      ? facetFilter["parotid_gland_abundance"].end
                      : ""
                  }
                  onChange={handleEndParChange}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  SM/SL Glands
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Start..."
                  type="number"
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  value={
                    facetFilter["sm/sl_abundance"] &&
                    facetFilter["sm/sl_abundance"].start
                      ? facetFilter["sm/sl_abundance"].start
                      : ""
                  }
                  onChange={handleStartSubChange}
                />
                <Typography
                  variant="p"
                  style={{
                    margin: "5px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  to
                </Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  label="End..."
                  type="number"
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  value={
                    facetFilter["sm/sl_abundance"] &&
                    facetFilter["sm/sl_abundance"].end
                      ? facetFilter["sm/sl_abundance"].end
                      : ""
                  }
                  onChange={handleEndSubChange}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  Blood
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup style={{ marginLeft: "2%" }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Typography color="common.black">Include</Typography>
                    <Switch
                      checked={msBExcludeOn}
                      inputProps={{
                        "aria-label": "ant design",
                      }}
                      onChange={(event) => {
                        setMsBExcludeOn(event.target.checked);
                      }}
                    />
                    <Typography color="common.black">Exclude</Typography>
                  </Stack>
                </FormGroup>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Start..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  type="number"
                  value={
                    facetFilter["plasma_abundance"] &&
                    facetFilter["plasma_abundance"].start
                      ? facetFilter["plasma_abundance"].start
                      : ""
                  }
                  onChange={handleStartBChange}
                />
                <Typography
                  variant="p"
                  style={{
                    margin: "5px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  to
                </Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  label="End..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  type="number"
                  value={
                    facetFilter["plasma_abundance"] &&
                    facetFilter["plasma_abundance"].end
                      ? facetFilter["plasma_abundance"].end
                      : ""
                  }
                  onChange={handleEndBChange}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography
                  sx={{
                    color: "#454545",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                  }}
                >
                  mRNA
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Start..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  value={
                    facetFilter["mRNA"] && facetFilter["mRNA"].start
                      ? facetFilter["mRNA"].start
                      : ""
                  }
                  onChange={handleStartMRNAChange}
                  type="number"
                />
                <Typography
                  variant="p"
                  style={{
                    margin: "5px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  to
                </Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  label="End..."
                  InputProps={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                  value={
                    facetFilter["mRNA"] && facetFilter["mRNA"].end
                      ? facetFilter["mRNA"].end
                      : ""
                  }
                  onChange={handleEndMRNAChange}
                  type="number"
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </Box>
        <Container
          maxWidth="false"
          id="table-container"
          sx={{
            marginTop: "30px",
            marginLeft: "20px",
            padding: "0px !important",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Box
              style={{
                display: "flex",
                // width: "100%",
                // maxWidth: "550px",
              }}
            >
              <TextField
                variant="outlined"
                size="small"
                label="Search..."
                value={searchText}
                onChange={(e) => handleGlobalSearch(e.target.value)}
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
                          clearSearchBar();
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
                  handleGlobalSearch(searchText);
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
              {rowData.length !== 0 && (
                <TextField
                  select
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: "10px",
                    },
                  }}
                  value={pageNum === 0 ? 1 : pageNum + 1}
                  sx={{ marginLeft: "10px", marginRight: "10px" }}
                  onChange={(event) => {
                    setPageNum(event.target.value - 1);
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
              )}
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
                onClick={setPrevPage}
                disabled={pageNum === 0}
                style={{
                  color: pageNum === 0 ? "#D3D3D3" : "#F6921E",
                  background: "white",
                  fontSize: "20px",
                  border: "none",
                  cursor: pageNum === 0 ? "default" : "pointer",
                  transition: pageNum === 0 ? "none" : "background 0.3s",
                  borderRadius: "5px",
                  marginRight: "15px",
                  pointerEvents: pageNum === 0 ? "none" : "auto",
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
                onClick={setNextPage}
                disabled={pageNum === Math.ceil(docCount / pageSize - 1)}
                style={{
                  color:
                    pageNum === Math.ceil(docCount / pageSize - 1)
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
          <FormControlLabel
            control={
              <NormalizationSwitch
                checked={normalizationSelected}
                onChange={handleToggleNormalization}
              />
            }
            label="Raw/Normalized ( log(x+1) )"
            sx={{
              marginLeft: "5px",
              marginRight: "5px",
              "& .MuiTypography-root": { fontFamily: "Lato" },
            }}
          />
          <Box>
            <div
              className="ag-theme-material ag-cell-wrap-text ag-theme-alpine saliva_table"
              style={{ height: 3200 }}
            >
              <AgGridReact
                className="ag-cell-wrap-text saliva_table"
                rowData={rowData}
                columnDefs={columns}
                ref={gridRef}
                defaultColDef={defColumnDefs}
                components={{
                  RedComponent,
                  GreenComponent,
                  IHCComponent,
                  opinionComponent,
                  proteinLinkComponent,
                  specificityComponent,
                  specificityScoreComponent,
                }}
                onSortChanged={onSortChanged}
                onGridReady={onGridReady}
                loadingOverlayComponent={loadingOverlayComponent}
                pagination={true}
                enableCellTextSelection={true}
                suppressPaginationPanel={true}
                paginationPageSize={pageSize}
                rowHeight={rowHeight}
                suppressDragLeaveHidesColumns
                suppressMovable
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
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
              <Button
                sx={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  textTransform: "unset",
                  color: "#F6921E",
                  background: "white",
                  fontSize: "20",
                  "&:hover": {
                    backgroundColor: "inherit", // Keeps the same background color on hover
                  },
                }}
                onClick={handleOpenLegend}
              >
                Show Legend
              </Button>
            </div>
            <Modal
              open={openLegend}
              onClose={handleCloseLegend}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "15%",
                  left: "50%",
                  transform: "translate(-50%, -15%)",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 2,
                  width: "60vw",
                  overflow: "scroll",
                  borderRadius: "16px",
                }}
              >
                <Typography
                  id="legend-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ textAlign: "center" }}
                >
                  Table Legend
                </Typography>
                <Legend />
              </Box>
            </Modal>
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default SalivaryProteinTable;
