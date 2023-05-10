import "./filter.css";
import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { Link } from "react-router-dom";
import { rgb } from 'd3';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import CustomHeaderGroup from './customHeaderGroup.jsx';
import { TransitEnterexit, WorkRounded } from "@mui/icons-material";
import { ICellRendererParams } from "ag-grid-community";

const DATA = [{
    "uniprot_accession": "P02814",
    "gene_symbol": "SMR3B",
    "protein_name": "Submaxillary gland androgen-regulated protein 3B",
    "expert_opinion": "",
    "WS": 4034.84,
    "Par":1934.69,
    "Sub":6954.67,
    "B":"",
    "IHC": "?",
    "mRNA": 217144.9
  },{
    "uniprot_accession": "P15516",
    "gene_symbol": "HTN3",
    "protein_name": "Histatin-3",
    "expert_opinion": "",
    "WS": 63.53,
    "Par":35.53,
    "Sub":90.41,
    "B":"",
    "IHC": "high",
    "mRNA": 136053.4
  },
  {
    "uniprot_accession": "Q96DA0",
    "gene_symbol": "ZG16B",
    "protein_name": "Zymogen granule protein 16 homolog B",
    "expert_opinion": "",
    "WS": 2147.86,
    "Par":91,
    "Sub":606.94,
    "B":"",
    "IHC": "high",
    "mRNA": 63926.2
  },
  {
    "uniprot_accession": "P15515",
    "gene_symbol": "HTN1",
    "protein_name": "Histatin-1",
    "expert_opinion": "",
    "WS": 158.21,
    "Par":199.13,
    "Sub":689.49,
    "B":"",
    "IHC": "not detected",
    "mRNA": 48372.4
  },
  {
    "uniprot_accession": "P01036",
    "gene_symbol": "CST4",
    "protein_name": "Cystatin-S",
    "expert_opinion": "",
    "WS": 15114.49,
    "Par":231.75,
    "Sub":8950.85,
    "B":"",
    "IHC": "high",
    "mRNA": 29036.2
  },
  {
    "uniprot_accession": "P01037",
    "gene_symbol": "CST1",
    "protein_name": "Cystatin-SN",
    "expert_opinion": "",
    "WS": 9660.64,
    "Par":142.14,
    "Sub":7420.58,
    "B":"",
    "IHC": "medium",
    "mRNA": 28401.8
  },
  {
    "uniprot_accession": "Q8TAX7",
    "gene_symbol": "MUC7",
    "protein_name": "Mucin-7",
    "expert_opinion": "",
    "WS": 156.08,
    "Par":25.28,
    "Sub":465.28,
    "B":"",
    "IHC": "high",
    "mRNA": 26019.1
  },]

  const styles = { 
    transform: 'translate(0, 0)'
};

const styles1 = { 
    transform: 'translate(2, 0)' 
};
  function WSComponent(props: ICellRendererParams) {
    const d = props.value;
    if(d<10 || d === "low"){
        return ( 
            <svg width={18} height={18} style={{ stroke: 'black', alignItems: 'center' }}>
                <rect width={18} height={18} fill="rgb(180,250,180)"><title>Low</title></rect>
            </svg>
        );
    }
    else if(d<100 || d === "medium"){
        return (
            <svg width={18} height={18} style={{ stroke: 'black', alignItems: 'center' }}>
              <rect width={18} height={18} fill="rgb(70,170,70)"><title>Medium</title></rect>
            </svg>
        );
    }
    else if(d>100 || d === "high"){
        return(
            <svg width={18} height={18} style={{ stroke: 'black', alignItems: 'center' }}>
                <rect width={18} height={18} fill="rgb(0,100,0)"><title>High</title></rect>
            </svg>
        );
    }
    else if(d==="not detected" || d === 0){
        return(
            <svg width={18} height={18} style={{ stroke: 'black', alignItems: 'center' }}>
                <rect width={18} height={18} fill="rgb(255,255,255)"><title>Not uniquely observed</title></rect>
            </svg>
        );
    }
    else{
        return(
        <svg width={18} height={18} style={{ stroke: 'black', alignItems: 'center' }}>
            <defs>
                <pattern
                    id="stripe2"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                    x="0"
                    y="0"
                    width="4"
                    height="4"
                    viewBox="0 0 10 10">
                    <rect width={2} height={4} fill={rgb(220, 220, 220)} style={styles}></rect>
                    <rect width={2} height={4} fill={rgb(255, 255, 255)} style={styles1}></rect>
                </pattern>
            </defs>
            <rect width={18} height={18} style={{ fill: 'url(#stripe2)' }}><title>Data not available</title></rect>
        </svg>
        );
    }
  }

function LinkComponent(props: ICellRendererParams) {
    const d = props.value;
    console.log('123');
    if(d<<10){
        return ( 
            <svg width={18} height={18} style={{ stroke: 'black', alignItems: 'center' }}>
              <rect width={18} height={18} fill="rgb(250,180,180)"><title>Low</title></rect>
            </svg>
        );
    }
    else if(d<<100){
        return (
            <svg width={18} height={18} style={{ stroke: 'black', alignItems: 'center' }}>
              <rect width={18} height={18} fill="rgb(190,70,70)"><title>Medium</title></rect>
            </svg>
        );
    }
    else if(d>100){
        return(
            <svg width={18} height={18} style={{ stroke: 'black', alignItems: 'center' }}>
                <rect width={18} height={18} fill="rgb(100,0,0)"><title>High</title></rect>
            </svg>
        );
    }
  }

function App() {
  
  const [gridApi, setGridApi] = useState();
  const rowData = DATA;




  const columns = [
    {
      headerName: "UniProt  Accession",
      field: "uniprot_accession",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      minWidth:'215',
      cellStyle:{'word-break': 'break-word'}
    },
    { headerName: "Gene Symbol",minWidth:'145', field: "gene_symbol",wrapText: true,autoHeight: true,cellStyle:{'word-break': 'break-word'}},
    { headerName: "Protein Name",minWidth:'145', field: "protein_name",wrapText: true,autoHeight: true,cellStyle:{'word-break': 'break-word'} },
    { headerName: "Expert Opinion",minWidth:'155', field: "expert_opinion",autoHeight: true,wrapText: true,maxWidth:'155' },
    { headerName: "MS", headerGroupComponent: CustomHeaderGroup,
      children:[
        {
            field:'WS',
            minWidth:'90',cellRenderer: "WSComponent"
        },
        {
            field:'Par',
            minWidth:'90',cellRenderer: "WSComponent"
        },
        {
            field:'Sub',
            minWidth:'90',cellRenderer: "WSComponent"
        },
        {
            field:'B',
            minWidth:'90',cellRenderer: "LinkComponent"
        }
      ],autoHeight: true,wrapText: true,cellStyle: {textAlign: 'center'}
      },
      {
        headerName:"IHC",
        field:"IHC",
        minWidth:'100',autoHeight: true,wrapText: true,cellRenderer: "WSComponent"
      },
      {
        headerName:"mRNA",
        field:"mRNA",
        minWidth:'110',autoHeight: true,wrapText: true,cellRenderer: "WSComponent"
      }
];

  const defColumnDefs = { flex: 1, filter: true,resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    headerStyle:{'word-break': 'break-word'},
    initialWidth: 200,
    headerComponentParams: {
        template:
          '<div class="ag-cell-label-container" role="presentation">' +
          '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
          '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
          '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
          '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
          '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
          '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
          '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
          '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
          '  </div>' +
          '</div>',
      }, };

  const onGridReady = (params) => {
    setGridApi(params);
    expandFilters(params, "gene");
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
      <h2 align="center" className="text">Salivary Protein</h2>
      <div className="ag-theme-material ag-cell-wrap-text" style={{ height: 600 }}>
        <AgGridReact
          className="ag-cell-wrap-text"
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={defColumnDefs}
          frameworkComponents={{
            LinkComponent,WSComponent
          }}
          onGridReady={onGridReady}
          pagination= {true}
          paginationPageSize= {50}
          sideBar={{
            position: 'left',
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
            defaultToolPanel: 'filters'
            // position: "right",
          }}
        />
      </div>
    </div>
  );
}

export default App;