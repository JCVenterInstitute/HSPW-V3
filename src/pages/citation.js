import React, { Component } from 'react';
import Citation from '../components/citation_table';
import gene_chart from '../components/gene_chart.png';
import Chart from 'react-google-charts';
import main_feature from '../components/hero.jpeg'
import { Element } from 'react-faux-dom';
import * as d3 from 'd3';

const citation = () => {
  
  return (
    <>
    <div style={{height: '40%',backgroundImage: `url(${main_feature})`}}>
      <h1 style={{color:'white',textAlign:'center',display:'left',marginLeft:'20px',marginBottom:'1rem'}} align="left">Citation</h1>
      <p style={{textAlign:'left', color:'white',fontSize:'25px', paddingBottom:'15px', marginLeft:'20px',marginRight:'20px'}}>PubMed is a service of the U.S. National Library of Medicine that includes over 17 million citations from MEDLINE and other life science journals for biomedical articles back to the 1950s. PubMed includes links to full text articles and other related resources.</p>
    </div>
    <h2 style={{textAlign:'center',marginTop:'10px'}}>PubMed Citations</h2>
    <Citation />
    
    </>
  );
};

export default citation;
