import React, { Component } from 'react';
import Gene from '../components/gene_table';
import gene_chart from '../components/gene_chart.png';
import Chart from 'react-google-charts';
import main_feature from '../components/hero.jpeg'
import { useEffect, useState , useRef } from 'react';
import * as d3 from "d3"
import {
    select,
    line,
    curveCardinal,
    scaleLinear,
    axisBottom,
    axisLeft,
  } from "d3";
  import BarChart from '../components/barchart_d3.tsx';
  const datas = [
        [10, 30, 40, 20],
        [10, 40, 30, 20, 50, 10],
        [60, 30, 40, 20, 30]
    ];

    export const data = [
      {name:"Mark", value: 90},
      {name:"Robert", value: 12},
      {name:"Emily", value: 34},
      {name:"Marion", value: 53},
      {name:"Nicolas", value: 98},
      {name:"Mélanie", value: 23},
      {name:"Gabriel", value: 18},
      {name:"Jean", value: 104},
      {name:"Paul", value: 2},
  ];
const Interproscan = () => {
    

    return (
      <>
        <BarChart width={600} height={400} data={data} />
      <div style={{height: '40%',backgroundImage: `url(${main_feature})`}}>
        <h1 style={{color:'white',textAlign:'center',display:'left',marginLeft:'20px',marginBottom:'1rem'}} align="left">Multiple Sequence Alignment</h1>
        <p style={{textAlign:'left', color:'white',fontSize:'25px', paddingBottom:'15px', marginLeft:'20px',marginRight:'20px'}}>
            InterProScan is a piece of software that scans a range of protein signatures against your sequence. The service is provided by the European Bioinformatics Institute (EBI).
        </p>
      </div>
      <p style={{color:'black',textAlign:'left',marginTop:'20px',marginLeft:'20px'}}>Select application(s) to run:</p>
      <form style={{marginTop:'30px',marginLeft:'20px'}}>
          <table>
              <tr style={{marginBottom:'20px'}}>
                  <td>
                    <input type="checkbox" name="appl-TIGRFAM" value="appl-TIGRFAM" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>TIGRFAM</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-SFLD" value="appl-SFLD" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>SFLD</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-Phobius" value="appl-Phobius" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>Phobius</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-SignalP" value="appl-SignalP" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>SignalP</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-SignalP_EUK" value="appl-SignalP_EUK" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>SignalP_EUK</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-SignalP_GRAM_POSITIVE" value="appl-SignalP_GRAM_POSITIVE" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>SignalP_GRAM_POSITIVE</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-SignalP_GRAM_NEGATIVE" value="appl-SignalP_GRAM_NEGATIVEP" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>SignalP_GRAM_NEGATIVE</label>
                  </td>
              </tr>
              <tr style={{marginLeft:'20px',marginTop:'20px'}}>
                  <td>
                    <input type="checkbox" name="appl-SuperFamily" value="appl-SuperFamily" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>SuperFamily</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-Panther" value="appl-Panther" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>Panther</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-Gene3d" value="appl-Gene3d" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>Gene3d</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-HAMAP" value="appl-HAMAP" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>Hamap</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-PrositeProfiles" value="appl-PrositeProfiles" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>PrositeProfiles</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-PrositePatterns" value="appl-PrositePatterns" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>PrositePatterns</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-Coils" value="appl-Coils" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>Coils</label>
                  </td>
              </tr>
              <tr style={{marginLeft:'20px',marginTop:'20px'}}>
                  <td>
                    <input type="checkbox" name="appl-SMART" value="appl-SMART" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>SMART</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-CDD" value="appl-CDD" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>CDD</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-PRINTS" value="appl-PRINTS" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>PRINTS</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-PfamA" value="appl-PfamA" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>Pfam</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-MobiDBLite" value="appl-MobiDBLite" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>MobiDBLite</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-PIRSF" value="appl-PIRSF" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>PIRSF</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-TMHMM" value="appl-TMHMM" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>TMHMM</label>
                  </td>
              </tr>
              <tr style={{marginLeft:'20px',marginTop:'20px'}}>
                  <td>
                    <input type="checkbox" name="aappl-AntiFam" value="appl-AntiFam" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>AntiFam</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-FunFam" value="aappl-FunFam" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>FunFam</label>
                  </td>
                  <td>
                    <input type="checkbox" name="appl-PIRSR" value="appl-PIRSR" />
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>PIRSR</label>
                  </td>
              </tr>
          </table>
          <p style={{color:'black'}}>Enter or paste an amino acid sequence in the box below:</p>
          <textarea name="proteins" rows="10" style={{width:'97%'}}/>  
          <div style={{marginLeft:'auto', marginRight:'auto', width:'8em',marginTop:'2rem',marginBottom:'2rem'}}>
              <input type="submit" value="Submit" style={{width:'8em'}}></input>
              <input type="reset" value="Reset" style={{ width:'8em'}}></input>
          </div> 
      </form>
      </>
    );
  };
  
  export default Interproscan;
  