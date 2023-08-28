import React from "react";
import { StyledEngineProvider } from '@mui/material/styles';
import AgGrid from '../components/ag-grid.js'
import DonutChart from '../components/donutChart.js'
import BarChart from '../components/barChart.js'
import './style.css';
import { components } from "react-select";
import { default as ReactSelect } from "react-select";
import DonutChart_google from "../components/donutChart_google.tsx";
import BarChart_google from "../components/barChart_google.tsx";
import Filter from "../components/filter.js";
import main_feature from './page_main.png'

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const colourOptions = [
  { value: "ocean1", label: "Ocean" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "forest", label: "Forest" },
  { value: "slate", label: "Slate" },
  { value: "silver", label: "Silver" }
];

const Download = () => {


  return (
    <>
    <div style={{height: '40%', padding:'35px',backgroundImage: `url(${main_feature})`,backgroundPosition:'center',backgroundSize:'cover'}}>
      <h1 style={{color:'white',display:'left',marginLeft:'20px',marginBottom:'1rem'}} className="title" align="left">DATA DOWNLOAD</h1>
      <p style={{textAlign:'left', color:'white', paddingBottom:'15px', marginLeft:'20px',marginRight:'20px'}} className="head_text">Search and Download data in Zip, MzTab and Metadata Formats. *If you cite or display any content, or reference our organization, in any format Please follow these guidelines: Include a reference to a Primary publication: The Human Salivary Proteome Wiki: A Community Driven Research Platform  OR Include a reference to our website: SalivaryProteome.org</p>
    </div>
    <div className="rowC">
      <div className='sidebar'>
          <h2 style={{margin:'26px',color:'#1463B9',fontFamily:'Montserrat',fontSize:'20px',fontStyle:'normal',fontWeight:'700',lineHeight:'130%', textAlign:'center', alignItems:'center'}}>FILTER</h2>
        <Filter />
      </div>
      <div className="charts">
        <BarChart_google />
      </div><div className="charts1">
        <DonutChart_google />
      </div>
    </div>
    <AgGrid />
      </>

  );
};
  
export default Download;