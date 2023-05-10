import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Comment_Table from '../components/protein_detail_comment_table'
import { useEffect, useState } from 'react';
import './style.css';

import { useParams} from "react-router";
import ProtvistaUniprot from 'protvista-uniprot';
import BChart from '../components/TwoSidedBarChart';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
let i = 0;
export const options = {
    indexAxis: 'y',
    responsive: true,
    title: {
      display: true,
      text: 'Data Pasien Keluar Masuk',
      fontSize: 20,
    },
    legend: {
      position: 'bottom',
    },
    plugins:{
        tooltip: {
            callbacks: {
                label: function(context) {
                    let label = 0;
                    if(context.parsed.x){
                        label = Math.abs(context.parsed.x);
                    }
                    return label;
                }
            }
        }
    },
    scales: {
      xAxes: [{
        stacked: true,
        ticks: {
          callback: value => Math.abs(value)
        }
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          reverse: true,
        }
      },
      {
        type: 'category',
        position: 'right',
        offset: true,
        ticks: {
          reverse: true,
        },
        gridLines: {
          display: false
        }
      }]
    }
  };

  export const data= {
    labels: ['0-4', '5-9', '10-14', '15-19', '20+'],
    datasets: [{
        label: 'Pasien Masuk',
        data: [100, 90, 80, 70, 60000],
        backgroundColor: 'red',
      },
      {
        label: 'Pasien Keluar',
        data: [-100, -75, -60, -75, -70],
        backgroundColor: 'blue',
      },
    ]
  };


const th = {
    background: '#f2f2f2',
    textAlign:'center',
    border: "1px solid #aaa",
    fontWeight:'bold',
    fontSize:'20px',
    padding:'0.2em',
    maxWidth:'1000px',
};

const td = {
    border: "1px solid #aaa",
    fontSize:'18px',
    padding:'0.2em',
    fontSize:'18px',

};

const sequence="MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAViAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP";

const Protein_Detail = (props) => {
    const [message, setMessage] = useState("");
    const params = useParams();
    let url = 'http://localhost:8000/protein/'+params['proteinid'];
  
  const [isLoading, setLoading] = useState(true);
  const [data,setData] = useState("");
  const [p,setP] = useState("");
  const fetchProtein = async()=>{
    const response = await fetch(url);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const protein = await response.json();
    setData(protein);
    console.log('data: '+JSON.stringify(data));
    let p = [];
    for(let i = 0; i < data[0]["_source"]["Salivary Proteins"]["Feature"].length;i++){
        
        if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].database === "GO"){

            if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("IPI")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000353','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("EXP")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000269','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("IDA")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000314','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("IMP")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000315','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("IGI")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000316','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("IEP")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000270','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("HTP")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0006056','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("HDA")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0007005','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("HMP")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0007001','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("HGI")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0007003','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("HEP")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0007007','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("IBA")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000318','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("IBD")){
 
                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000319','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("IKR")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000320','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("IRD")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000321','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("ISS")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000250','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("ISO")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000266','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("ISA")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000247','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("ISM")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000255','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("IGC")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000317','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("RCA")){
 
                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000245','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("TAS")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000304','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("NAS")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000303','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("IC")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000305','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("ND")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0000307','evidence_reference':''});
            }
            else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[2]["value"].includes("IEA")){

                p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[1]["value"],
                'evidence_code':'ECO:0007669','evidence_reference':''});
            }
            else{
                console.log('');
            }
        }
        else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].database === "Reactome"){

            p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].id,'feature_key':'Pathway','description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].database + " " +data[0]["_source"]["Salivary Proteins"]["Feature"][i].id+" "+data[0]["_source"]["Salivary Proteins"]["Feature"][i].properties[0]["value"],
            'evidence_code':'','evidence_reference':''});
        }
        else{
            
            for(let j = 0; j<data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments.length;j++){

                if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType === 'INTERACTION'){
                    continue;
                }

                else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType === "SUBUNIT"){
                    p.push({'id':'','feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType,'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].value,
                    'evidence_code':'','evidence_reference':''});
                }

                else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType === "SUBCELLULAR LOCATION"){

                    for(let m = 0; m < data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].subcellularLocations.length;m++){
   
                        p.push({'id':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].subcellularLocations[m].location.id,'feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType,'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].subcellularLocations[m].location.value,
                        'evidence_code':'','evidence_reference':''});
                    }
                    
                }

                else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType === "PTM"){

                    let ref = []
                    for(let m = 0; m < data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].evidences.length;m++){
                      
                        ref.push(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].evidences[m].source+": "+data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].evidences[0].id);
                    }
                    p.push({'id':'','feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType,'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].value,
                        'evidence_code':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].evidences[0].evidenceCode,'evidence_reference':ref});
                    
                }

                else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType === "MASS SPECTROMETRY"){
                    for(let m = 0; m < data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].evidences.length;m++){
                        
                    }
                    p.push({'id':'','feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType,'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].note,
                        'evidence_code':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].evidences[0].evidenceCode,'evidence_reference':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].evidences[0].source+": "+data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].evidences[0].id});
                }

                else if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType === "SIMILARITY"){
 
                    for(let m = 0; m < data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts.length;m++){

                    }

                    p.push({'id':'','feature_key':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType,'description':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].value,'evidence_code':data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].evidences[0].evidenceCode,'evidence_reference':''});
                }

                /*
                
                if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType !== 'INTERACTION'){
                    console.log(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType);
                    console.log(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].value);
                    
                    if(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType == "PTM"){
                        console.log('hi123');
                        console.log(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].commentType);
                        console.log(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].value);
                        for(let o = 0; o < data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].evidences.length;o++){
                            console.log(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].evidences[o].evidenceCode);
                            console.log(data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].evidences[o].source+": "+data[0]["_source"]["Salivary Proteins"]["Feature"][i].comments[j].texts[0].evidences[0].id);
                        }
                    }
                    
                }*/
                
            }
        }
    }
    
    setP(p);
    setLoading(false);
  }

  useEffect(()=>{
    fetchProtein();
    
  });



  if(isLoading === true){
    return <h2>Loading</h2>
  }
  return (
    <>
    <div style={{margin:'20px'}}>
        <h2 style={{color:'black', marginBottom:'20px'}}>{data[0]["_source"]["Salivary Proteins"]["Protein Name"]}</h2>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold'}}>Names and Origin</h2>
        <TableContainer component={Paper} style={{padding:'10px'}}>
            <Table sx={{minWidth:650}} aria-label="simple table" style={{border: "1px solid black"}}>
                <TableHead>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th}>Protein names</TableCell>
                        <TableCell sx={td}>
                            <p style={{color:'black',textAlign:'left'}}>
                                <i>Official name:</i>
                            </p>

                            {data[0]["_source"]["Salivary Proteins"]["Protein Name"]}
                            <p style={{color:'black',textAlign:'left'}}><i>Alternative name(s):</i></p>

                            {data[0]["_source"]["Salivary Proteins"]["Also known as"]}
                            
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Genes</TableCell>
                        <TableCell sx={td}>
                            1. PRH1<a style={{color:'/*#116988*/#0b5989'}} href='https://salivaryproteome.org/public/index.php/EntrezGene:5554'>EntrezGene:5554</a>
                            <br></br>
                            2. PRH2<a style={{color:'/*#116988*/#0b5989'}} href='https://salivaryproteome.org/public/index.php/EntrezGene:5555'>EntrezGene:5555</a></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Organism</TableCell>
                        <TableCell sx={td}><a style={{color:'/*#116988*/#0b5989'}} href='http://salivaryproteome.org/public/index.php/Special:Ontology_Term/NEWT:9606'>	
Homo sapiens</a></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Taxonomy</TableCell>
                        <TableCell sx={td}>Eukaryota {'>'} Opisthokonta {'>'} Metazoa {'>'} Eumetazoa {'>'} Bilateria {'>'} Deuterostomia {'>'} Chordata {'>'} Craniata {'>'} Vertebrata {'>'} Gnathostomata {'>'} Teleostomi {'>'} Euteleostomi {'>'} Sarcopterygii {'>'} Dipnotetrapodomorpha {'>'} Tetrapoda {'>'} Amniota {'>'} Mammalia {'>'} Theria {'>'} Eutheria {'>'} Boreoeutheria {'>'} Euarchontoglires {'>'} Primates {'>'} Haplorrhini {'>'} Simiiformes {'>'} Catarrhini {'>'} Hominoidea {'>'} Hominidae {'>'} Homininae {'>'} Homo</TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Sequence Attributes</h2>
        <Table style={{width:'80%'}}>
            <TableHead>
                <TableRow>
                    <TableCell style={{borderBottom: "2px solid #116988"}}><a style={{color: '#116988'}} href='https://salivaryproteome.org/public/index.php/Property:Has_accession_number'>Identifier</a></TableCell>
                    <TableCell style={{borderBottom: "2px solid #116988"}}><a style={{color: '#116988'}} href='https://salivaryproteome.org/public/index.php/Property:Known_officially_as'>Name</a></TableCell>
                    <TableCell style={{borderBottom: "2px solid #116988"}}><a style={{color: '#116988'}} href='https://salivaryproteome.org/public/index.php/Property:Known_officially_as'>Aliases</a></TableCell>
                    <TableCell style={{borderBottom: "2px solid #116988"}}><a style={{color: '#116988'}} href='https://salivaryproteome.org/public/index.php/Property:Known_officially_as'>Sequence length</a></TableCell>
                    <TableCell style={{borderBottom: "2px solid #116988"}}><a style={{color: '#116988'}} href='https://salivaryproteome.org/public/index.php/Property:Known_officially_as'>Molecular mass</a></TableCell>
                    <TableCell style={{borderBottom: "2px solid #116988"}}><a style={{color: '#116988'}} href='https://salivaryproteome.org/public/index.php/Property:Known_officially_as'>Sequence</a></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>{data[0]["_id"]}</TableCell>
                    <TableCell>Canonical sequence	</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{data[0]["_source"]["Salivary Proteins"]["protein_sequence_length"]}</TableCell>
                    <TableCell>{data[0]["_source"]["Salivary Proteins"]["Mass"]}</TableCell>
                    <TableCell><a style={{color: '#116988'}} href='https://salivaryproteome.org/public/index.php/HSPW:PE90567/1'>HSPW:PE90567/1
</a></TableCell>
                </TableRow>
            </TableHead>
        </Table>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Comments</h2>
        <Comment_Table data={p}/>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Features</h2>
        <protvista-uniprot accession={data[0]["_id"]} />
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Glycans</h2>
        <p style={{color:'black', marginBottom:'20px', marginTop:'20px',fontSize:'1 6px',textAlign:'left'}}>There are currently no glycans associated with the protein.</p>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Expression</h2>
        <p style={{color:'black', marginBottom:'20px', marginTop:'20px',fontSize:'16px',textAlign:'left'}}>
            Abundance and localization of gene products based on both RNA and immunohistochemistry data from the <a href='http://www.proteinatlas.org/ENSG00000134551'>Human Protein Atlas</a>. Click on the tissue names to view primary data.
        </p>
        <div style={{marginLeft:'15%'}}>
            <BChart data={data[0]["_source"]["Salivary Proteins"]["Atlas"]} gene_id={data[0]["_source"]["Salivary Proteins"]["EnsemblG"]}/>
        </div>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Proteomics</h2>
        <Table style={{width:'80%'}}>
            <TableHead>
                <TableRow>
                    <TableCell style={{borderBottom: "2px solid #116988"}}>Tissue ID</TableCell>
                    <TableCell style={{borderBottom: "2px solid #116988"}}>Tissue Term</TableCell>
                    <TableCell style={{borderBottom: "2px solid #116988"}}>Disease State</TableCell>
                    <TableCell style={{borderBottom: "2px solid #116988"}}>Isoform</TableCell>
                    <TableCell style={{borderBottom: "2px solid #116988"}}>Experiment Count</TableCell>
                    <TableCell style={{borderBottom: "2px solid #116988"}}>Peptide Count</TableCell>
                    <TableCell style={{borderBottom: "2px solid #116988"}}>Abundance Score</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><a href='https://salivaryproteome.org/community/index.php/Special:Ontology_Term/BTO:0001202'>BTO:0001202</a></TableCell>
                    <TableCell>Saliva</TableCell>
                    <TableCell>Disease free<br></br>Sjogren's Syndrome<br></br>COVID-19</TableCell>
                    <TableCell>50<br></br>2<br></br>8</TableCell>
                    <TableCell>133<br></br>2870<br></br>24</TableCell>
                    <TableCell>430.74<br></br>1008.23<br></br>0</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><a href='https://salivaryproteome.org/community/index.php/Special:Ontology_Term/BTO:0001316'>BTO:0001316</a></TableCell>
                    <TableCell>Submandibular gland</TableCell>
                    <TableCell>Disease free</TableCell>
                    <TableCell>49</TableCell>
                    <TableCell>2442</TableCell>
                    <TableCell>13513.97</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><a href='https://salivaryproteome.org/community/index.php/Special:Ontology_Term/BTO:0001315'>BTO:0001315</a></TableCell>
                    <TableCell>Sublingual gland</TableCell>
                    <TableCell>Disease free</TableCell>
                    <TableCell>49</TableCell>
                    <TableCell>2442</TableCell>
                    <TableCell>14,385.84</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><a href='https://salivaryproteome.org/community/index.php/Special:Ontology_Term/BTO:0001004'>BTO:0001004</a></TableCell>
                    <TableCell>Parotid gland</TableCell>
                    <TableCell>Disease free</TableCell>
                    <TableCell>56</TableCell>
                    <TableCell>1208</TableCell>
                    <TableCell>3,127.74</TableCell>
                </TableRow>
            </TableHead>
        </Table>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Cross References</h2>
        <TableContainer component={Paper} style={{padding:'10px'}}>
            <Table sx={{minWidth:650}} aria-label="simple table" style={{border: "1px solid black"}}>
                <TableHead>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th}>RefSeq</TableCell>
                        <TableCell sx={td} style={{maxWidth:'100%'}}>
                            <p style={{color:'black',textAlign:'left',fontSize:'18px'}}>
                                {data[0]["_source"]["Salivary Proteins"]["RefSeq"].map(value=>{return <div key={value}><a href={'https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=protein&id='+value}>{value}</a></div>})}
                            </p>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>PeptideAtlas</TableCell>
                        <TableCell sx={td}>
                            <a href={'https://db.systemsbiology.net/sbeams/cgi/PeptideAtlas/Search?action=GO&search_key=' + data[0]["_source"]["Salivary Proteins"]["PeptideAtlas"]}>{data[0]["_source"]["Salivary Proteins"]["PeptideAtlas"].split(';')}</a>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Ensembl</TableCell>
                        <TableCell sx={td} style={{maxWidth:'100%'}}>
                            <p style={{color:'black',textAlign:'left',fontSize:'18px'}}>
                                {data[0]["_source"]["Salivary Proteins"]["Ensembl"].map(value=>{return <div key={value}><a href={'http://www.ensembl.org/id/'+value}>{value}</a></div>})}
                                <a href={'http://www.ensembl.org/id/' + data[0]["_source"]["Salivary Proteins"]["EnsemblG"]}>{data[0]["_source"]["Salivary Proteins"]["EnsemblG"]}</a>
                           </p>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>GeneCards</TableCell>
                        <TableCell sx={td}>
                        {data[0]["_source"]["Salivary Proteins"]["GeneCards"].map(value=>{return <div key={value}><a href={'https://www.genecards.org/cgi-bin/carddisp.pl?gene='+value}>{value}</a></div>})}
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
    </div>
    </>
  );
};
  
export default Protein_Detail;
<><script src="https://d3js.org/d3.v4.min.js" charset="utf-8" defer></script><script src="https://cdn.jsdelivr.net/npm/protvista-uniprot@latest/dist/protvista-uniprot.js"></script></>
window.customElements.define('protvista-uniprot', ProtvistaUniprot);