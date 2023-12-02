import "./filter.css";
import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";

import { Link } from "react-router-dom";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

const DATA = [
  {
    feature_key: "Subcellular location",
    description: "Secreted",
    evidence_code: "",
    evidence_reference: "",
    variant: "",
    reported_by: "UniProt",
    edit_status: "",
  },
  {
    feature_key: "PTM",
    description:
      "An hexuronic acid was shown to be linked to Ser-33 in about 40% of the polypeptides. Neither the structure of the carbohydrate (whether glucuronic acid or an isomer of), nor the linkage (whether a glycoside or an ester) has been definitely established.",
    evidence_code: "ECO:0000269",
    evidence_reference: "PubMed:10858503",
    variant: "",
    reported_by: "UniProt",
    edit_status: "",
  },
  {
    feature_key: "PTM",
    description:
      "Proteolytically cleaved; PRP-2, PRP-1, PIF-S and Db-S yield PRP-4, PRP-3 (protein A), PIF-F and Db-F, respectively.",
    evidence_code: "ECO:0000269",
    evidence_reference: "PubMed:18463091",
    variant: "",
    reported_by: "UniProt",
    edit_status: "",
  },
  {
    feature_key: "Polymorphism",
    description:
      "Sequence shown is that of allele PRH2-2, also known as PR-2; Allele PRH2-1 is also known as PR-1 or protein C, and allele PRH2-3 as PR-1'. The PRH1-DB allele (about 16% of the population) has an insertion of 21 repeated amino acids compared to the more frequent PRH1-PIF allele (68%). In contrast to all other PRH1 and PRH2 alleles, the PRH1-PA allele (16%) is not proteolytically cleaved.",
    evidence_code: "",
    evidence_reference: "",
    variant: "",
    reported_by: "UniProt",
    edit_status: "",
  },
  {
    feature_key: "Pathway",
    description: "KEGG:hsa04970 Salivary secretion",
    evidence_code: "IPI",
    evidence_reference: "",
    variant: "",
    reported_by: "KEGG",
    edit_status: "",
  },
  {
    feature_key: "Function",
    description:
      "PRP's act as highly potent inhibitors of crystal growth of calcium phosphates. They provide a protective and reparative environment for dental enamel which is important for the integrity of the teeth.",
    evidence_code: "",
    evidence_reference: "",
    variant: "",
    reported_by: "UniProt",
    edit_status: "",
  },
  {
    feature_key: "Cellular component",
    description: "GO:0005615 extracellular space",
    evidence_code: "ECO:0000304",
    evidence_reference: "",
    variant: "",
    reported_by: "UniProt",
    edit_status: "",
  },
];

function LinkDescription(props: ICellRendererParams) {
  if (props.value.includes("GO")) {
    let id = props.value.substring(0, 11);
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={"https://www.ebi.ac.uk/QuickGO/term/" + id}
      >
        {props.value}
      </a>
    );
  } else if (props.value.includes("KEGG")) {
    let id = props.value.split(" ");
    id = id[0].split(":")[1];
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={"https://www.genome.jp/kegg-bin/show_pathway?" + id}
      >
        {props.value}
      </a>
    );
  } else if (props.value.includes("Reactome")) {
    let id = props.value.split(" ");

    id = id[1];
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={"http://www.reactome.org/content/detail/" + id}
      >
        {props.value}
      </a>
    );
  } else {
    return props.value;
  }
}

function LinkCode(props: ICellRendererParams) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={"https://www.ebi.ac.uk/QuickGO/term/" + props.value}
    >
      {props.value}
    </a>
  );
}

function LinkRef(props: ICellRendererParams) {
  if (props.value.includes("PubMed")) {
    let id = props.value.split(" ")[1];
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={"https://pubmed.ncbi.nlm.nih.gov/" + id}
      >
        {props.value}
      </a>
    );
  } else if (props.value.includes("UniProt")) {
    let id = props.value.split(":")[1];
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={"https://www.uniprot.org/uniprotkb/" + id}
      >
        {props.value}
      </a>
    );
  }
}

function App(props) {
  const [gridApi, setGridApi] = useState();
  const rowData = props.data;

  const columns = [
    {
      headerName: "Feature Key",
      field: "feature_key",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      maxWidth: 355,
      minWidth: 185,
      wrapText: true,
      autoHeight: true,
      cellStyle: { wordBreak: "break-word" },
    },
    {
      headerName: "Description",
      field: "description",
      cellRenderer: "LinkDescription",
      wrapText: true,
      maxWidth: 355,
      minWidth: 305,
      wrapText: true,
      autoHeight: true,
      cellStyle: { wordBreak: "break-word" },
    },
    {
      headerName: "Evidence Code",
      field: "evidence_code",
      cellRenderer: "LinkCode",
      wrapText: true,
      autoHeight: true,
      cellStyle: { wordBreak: "break-word" },
      minWidth: 165,
    },
    {
      headerName: "Evidence Reference",
      cellRenderer: "LinkRef",
      field: "evidence_reference",
      wrapText: true,
      minWidth: 195,
    },
  ];

  const defColumnDefs = {
    flex: 1,
    filter: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };

  const onGridReady = (params) => {
    setGridApi(params);
    expandFilters(params, "feature_key");
  };

  const expandFilters = (params, ...filters) => {
    const applyFilters = filters?.length > 0 ? filters : null;
    params.api.getToolPanelInstance("filters").expandFilters(applyFilters);
  };

  const applyQuickFilter = (e) => {
    const searchText = e.target.value;
    gridApi.api.setQuickFilter(searchText);
  };
  return (
    <div className="AppBox1">
      <div
        className="ag-theme-material ag-cell-wrap-text"
        style={{ height: 600 }}
      >
        <AgGridReact
          className="ag-cell-wrap-text"
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={defColumnDefs}
          frameworkComponents={{
            LinkDescription,
            LinkCode,
            LinkRef,
          }}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={50}
          sideBar={{
            position: "left",
            toolPanels: [
              {
                id: "columns",
                labelDefault: "Columns",
                labelKey: "columns",
                iconKey: "columns",
                toolPanel: "agColumnsToolPanel",
                toolPanelParams: {
                  suppressPivotMode: true,
                  suppressRowGroups: true,
                  suppressValues: true,
                  suppressColumnFilter: false,
                  suppressColumnSelectAll: false,
                },
              },
              {
                id: "filters",
                labelDefault: "Filters",
                labelKey: "filters",
                iconKey: "filter",
                toolPanel: "agFiltersToolPanel",
                toolPanelParams: {
                  suppressFilterSearch: false,
                },
              },
              {
                id: "QuickSearch",
                labelDefault: "Quick Search",
                labelKey: "QuickSearch",
                iconKey: "menu",
                toolPanel: () => (
                  <div>
                    <h4>Global Search</h4>
                    <input
                      placeholder="Search..."
                      type="search"
                      style={{
                        width: 190,
                        height: 35,
                        outline: "none",
                        border: "none",
                        borderBottom: `1px #181616 solid`,
                        padding: `0 5px`,
                      }}
                      onChange={applyQuickFilter}
                    />
                  </div>
                ),
              },
            ],
            defaultToolPanel: "filters",
            // position: "right",
          }}
        />
      </div>
    </div>
  );
}

export default App;
