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
import Divider from '@mui/material/Divider';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FontAwesome from 'react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import useExternalScripts from "./useExternalScripts"
import ProtvistaStructure from 'protvista-structure';
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
import { FaceSharp } from '@mui/icons-material';
import { line } from 'd3';

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
  const [data1,setData1] = useState("");
  const [p,setP] = useState("");
  const [o,setO] = useState("");
  const [fS,setFS] = useState("");
  const [v,setV] = useState("");
  const [j,setJ] = useState("");
  const [sS,setSS] = useState("");
  const [cError, setCError] = useState(false);
  const fetchPubMed = async()=>{
    let ids = [];

  
    for(let i = 0; i <data[0]["_source"]["Salivary Proteins"]["Cites"].length;i++){
        ids.push(data[0]["_source"]["Salivary Proteins"]["Cites"][i].split(':')[1]);
    }
    ids = ids.toString();

    let line = [];
    let journal = [];
    let volume = [];
    let line2 = [];
    
    const pubmedLink = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id='+ids+'&retmode=json&rettype=abstract&api_key=1b7c2864fec7f4749814a17559ed02608808';
    
    const response = await fetch(pubmedLink);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        setCError(true);
        throw new Error(message);
    }
    
    const temp = await response.json();
    setData1(JSON.stringify(temp["result"]));
        console.log(data[0]["_source"]["Salivary Proteins"]["Cites"][0].split(':')[1]);
        console.log(data1);
        for(let j = 0; j < data1.length;j++){

            let inputString = '';
            let inputString2 = '';
            if(data1[data1.result.uids].authors.length === 0){
                inputString = inputString.concat("No Author listed ");
            }
            else if(data1.result[data1.result.uids[j]].authors.length === 1){
                inputString = inputString.concat(JSON.stringify(data1.result[data1.result.uids[j]].authors[0].name).replace(/\"/g, ""));
            }
            else if(data1.result[data1.result.uids[j]].authors.length === 2){
                inputString = inputString.concat(JSON.stringify(data1.result[data1.result.uids[j]].authors[0].name).replace(/\"/g, "") +',' +JSON.stringify(data1.result[data1.result.uids[j]].authors[1].name).replace(/\"/g, ""));
            }
            else{
                inputString = inputString.concat(JSON.stringify(data1.result[data1.result.uids[j]].authors[0].name).replace(/\"/g, "") +', et al.');
            }
            inputString = inputString.concat(' ('+JSON.stringify(data1.result[data1.result.uids[j]].pubdate).replace(/\"/g, "").split(" ")[0]+') ' + JSON.stringify(data1.result[data1.result.uids[j]].title).replace(/\"/g, ""));
            line.push(inputString);
            journal.push(JSON.stringify(data1.result[data1.result.uids[j]].source).replace(/\"/g, "")+'. ');
            volume.push(JSON.stringify(data1.result[data1.result.uids[j]].volume).replace(/\"/g, ""));
            inputString2 = inputString2.concat('('+JSON.stringify(data1.result[data1.result.uids[j]].issue).replace(/\"/g, "")+'):'+JSON.stringify(data1.result[data1.result.uids[j]].pages).replace(/\"/g, ""));
            line2.push(inputString2);
        
        }
        setFS(line);
        setV(volume);
        setJ(journal);
        setSS(line2);
        setLoading(false);
  
    };
    

  
  const fetchProtein = async()=>{
    const response = await fetch(url);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const protein = await response.json();
    setData(protein);
  
    let p = [];
    let o = [];
    
    setP(p);
    setO(o);
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
    <Tabs>
    <TabList>
      <Tab>Protein</Tab>
      <Tab>Curation</Tab>
      <Tab></Tab>
    </TabList>

    <TabPanel>


    <div style={{margin:'20px'}}>
        <h2 style={{color:'black', marginBottom:'10px'}}>{data[0]["_source"]["Salivary Proteins"]["Protein Name"]}</h2>
        <Divider />
        <h2 style={{color:'black', marginBottom:'10px', fontWeight:'bold'}}>Names and Origin</h2>
            <Table sx={{minWidth:650}} aria-label="simple table" style={{border: "1px solid black"}}>
                <TableHead>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th}>Protein names</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}}>

                            {data[0]["_source"]["Salivary Proteins"]["Protein Name"]}
                            
                        </TableCell>
                    </TableRow>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th}>Alternative name(s):</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}}>

                            {data[0]["_source"]["Salivary Proteins"]["Also known as"]}
                            
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Genes</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}}>
                        
                            1. PRH1  <a style={{color:'/*#116988*/#0b5989'}} href='https://salivaryproteome.org/public/index.php/EntrezGene:5554'>EntrezGene:5554<FontAwesome className="super-crazy-colors" name="external-link" style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }} /></a>
                            <br></br>
                            <i class="cid-external-link"></i>
                            2. PRH2  <a style={{color:'/*#116988*/#0b5989'}} href='https://salivaryproteome.org/public/index.php/EntrezGene:5555'>EntrezGene:5555<FontAwesome className="super-crazy-colors" name="external-link" style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }} /></a></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Organism</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}}><a style={{color:'/*#116988*/#0b5989'}} href='http://salivaryproteome.org/public/index.php/Special:Ontology_Term/NEWT:9606'>	
Homo sapiens</a></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Taxonomy</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}}>Eukaryota {'>'} Opisthokonta {'>'} Metazoa {'>'} Eumetazoa {'>'} Bilateria {'>'} Deuterostomia {'>'} Chordata {'>'} Craniata {'>'} Vertebrata {'>'} Gnathostomata {'>'} Teleostomi {'>'} Euteleostomi {'>'} Sarcopterygii {'>'} Dipnotetrapodomorpha {'>'} Tetrapoda {'>'} Amniota {'>'} Mammalia {'>'} Theria {'>'} Eutheria {'>'} Boreoeutheria {'>'} Euarchontoglires {'>'} Primates {'>'} Haplorrhini {'>'} Simiiformes {'>'} Catarrhini {'>'} Hominoidea {'>'} Hominidae {'>'} Homininae {'>'} Homo</TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Sequence Attributes</h2>
        <Divider />
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
                    <TableCell>Canonical sequence</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{data[0]["_source"]["Salivary Proteins"]["protein_sequence_length"]}</TableCell>
                    <TableCell>{data[0]["_source"]["Salivary Proteins"]["Mass"]}</TableCell>
                    <TableCell><a style={{color: '#116988'}} href='https://salivaryproteome.org/public/index.php/HSPW:PE90567/1'>HSPW:PE90567/1
</a></TableCell>
                </TableRow>
            </TableHead>
        </Table>

        {/*
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Go Annotations</h2>
        <Divider style={{'margin-bottom':'10px'}}/>
        <p style={{ 'display': 'inline','color':'black','font-size':'0.9rem' }}>
            The Gene Ontology (GO) describes knowledge of the biological domain with respect to three aspects: 1. Molecular function 2. Biological process 3. Cellular component
        </p>
        <br style={{'margin-bottom':'5px'}}></br>
        <p style={{ 'display': 'inline','color':'black','font-size':'0.9rem' }}>
            A variety of groups, including UniProtKB curators, use GO terms to annotate gene products in a computationally tractable manner. UniProt lists the annotated GO terms in the 'Function' section; the GO terms from the 'Cellular component' category can also be seen in 'Subcellular location' section. The project that made the annotation is shown as the 'Source', and a click on this label will display the supporting type of evidence. When available, a link to the relevant publications is provided.
        </p>
        <Comment_Table data={p}/>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>PTM/Processing</h2>
        <Divider style={{'margin-bottom':'10px'}}/>
        <p style={{ 'display': 'inline','color':'black','font-size':'0.9rem' }}>This section describes post-translational modifications (PTMs) and/or processing events.</p>
        <Comment_Table data={o}/>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Features</h2>
        <Divider sx={{'marginBottom': "10px"}}/>
  */}

<protvista-uniprot accession="P04908" config={{
  "categories": [
    {
      "name": 'string',
      "label": 'string',
      "trackType": 'protvista-track|protvista-variation-graph|protvista-variation',
      "adapter": 'protvista-feature-adapter|protvista-structure-adapter|protvista-proteomics-adapter|protvista-variation-adapter',
      "url": 'string',
      "tracks": [
        {
          "name": 'string',
          "label": 'string',
          "filter": 'string',
          "trackType": "protvista-track|protvista-variation-graph|protvista-variation",
          "tooltip": 'string'
        }
      ]
    }
  ]
}}></protvista-uniprot>


        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Glycans</h2>
        <Divider />
        <p style={{color:'black', marginBottom:'20px', marginTop:'20px',fontSize:'0.875rem',textAlign:'left'}}>There are currently no glycans associated with the protein.</p>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Expression</h2>
        <Divider />
        <p style={{color:'black', marginBottom:'20px', marginTop:'20px',fontSize:'0.875rem',textAlign:'left'}}>
            Abundance and localization of gene products based on both RNA and immunohistochemistry data from the <a href={'http://www.proteinatlas.org/'+data[0]["_source"]["Salivary Proteins"]["EnsemblG"]}>Human Protein Atlas<FontAwesome className="super-crazy-colors" name="external-link" style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }} /></a>. Click on the tissue names to view primary data.
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
        <Divider sx={{'marginBottom':'10px'}}/>
            <Table sx={{maxWidth:'60%', border: 1,tableLayout:'fixed'}} aria-label="simple table" style={{border: "1px solid black"}}>
                <TableHead>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th}>RefSeq</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}} style={{maxWidth:'100%'}}>

                                {data[0]["_source"]["Salivary Proteins"]["RefSeq"].map((value,i,arr)=>{return <><a href={'https://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=protein&id=' + value}>{value}<FontAwesome className="super-crazy-colors" name="external-link" style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }} /></a><span>{i != (arr.length - 1) ? ', ' : ''}</span></>})}

                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>PeptideAtlas</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}}>
                            <a href={'https://db.systemsbiology.net/sbeams/cgi/PeptideAtlas/Search?action=GO&search_key=' + data[0]["_source"]["Salivary Proteins"]["PeptideAtlas"]}>{data[0]["_source"]["Salivary Proteins"]["PeptideAtlas"].split(';')}<FontAwesome className="super-crazy-colors" name="external-link" style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }} /></a>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Ensembl</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}} style={{maxWidth:'100%'}}>

                                {data[0]["_source"]["Salivary Proteins"]["Ensembl"].map((value,i,arr)=>{return <><a href={'http://www.ensembl.org/id/' + value}>{value}<FontAwesome className="super-crazy-colors" name="external-link" style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }} /></a><span>{i != (arr.length - 1) ? ', ' : ''}</span></>})}
                                <a href={'http://www.ensembl.org/id/' + data[0]["_source"]["Salivary Proteins"]["EnsemblG"]}>, {data[0]["_source"]["Salivary Proteins"]["EnsemblG"]}<FontAwesome className="super-crazy-colors" name="external-link" style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }} /></a>

                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>GeneCards</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}}>
                        {data[0]["_source"]["Salivary Proteins"]["GeneCards"].map((value,i,arr)=>{return <><a href={'https://www.genecards.org/cgi-bin/carddisp.pl?gene=' + value}>{value}<FontAwesome className="super-crazy-colors" name="external-link" style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }} /></a><span>{i != (arr.length - 1) ? ', ' : ''}</span></>})}
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>

        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Keywords</h2>
        <Divider sx={{'marginBottom':'10px'}}/>
        <Table sx={{maxWidth:'60%', border: 1,tableLayout:'fixed'}} aria-label="simple table" style={{border: "1px solid black"}}>
            <TableRow sx={{border: "1px solid black"}}>
                <TableCell sx={{'fontSize': '0.875rem'}} style={{maxWidth:'100%'}}>

                    {data[0]["_source"]["Salivary Proteins"]["keyword"].map((value,i,arr)=>{return <><a href={'https://www.uniprot.org/keywords/' + value.id.split(":")[1]}>{value.keyword}<FontAwesome className="super-crazy-colors" name="external-link" style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }} /></a><span>{i != (arr.length - 1) ? ', ' : ''}</span></>})}
                    
                </TableCell>
            </TableRow>
        </Table>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>References</h2>
        <Divider sx={{'marginBottom':'10px'}}/>
        <Table sx={{minWidth:650, border: 1,width:'90%'}} aria-label="simple table">
            <TableRow sx={{border: "1px solid black"}}>
                <TableCell sx={{'fontSize': '0.875rem'}} style={{maxWidth:'100%'}}>
                {data[0]["_source"]["Salivary Proteins"]["Cites"].map((value,i)=>{return <><div key={value}><h3 style={{ 'display': 'inline' }}>{i + 1}. </h3><p style={{ 'display': 'inline','color':'black','font-size':'0.875rem' }}>{fS[i]}<i>{j[i]}</i><b>{v[i]}</b>{sS[i]}</p><a href={'https://pubmed.ncbi.nlm.nih.gov/' + value}>  [{value}<FontAwesome className="super-crazy-colors" name="external-link" style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }} />]</a></div></>})}
                </TableCell>
            </TableRow>
        </Table>
        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Entry Information</h2>
        <Divider sx={{'marginBottom':'10px'}}/>
        <Table sx={{maxWidth:'20%', border: 1,tableLayout:'fixed'}} aria-label="simple table" style={{border: "1px solid black"}}>
                <TableHead>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th} style={{maxWidth:'20%'}}>Created On</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}} style={{maxWidth:'100%'}}>
                            {data[0]["_source"]["Salivary Proteins"]["Date of creation"]}
                        </TableCell>
                    </TableRow>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th} style={{maxWidth:'20%'}}>Last Modified On</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}} style={{maxWidth:'100%'}}>
                            {data[0]["_source"]["Salivary Proteins"]["Date of last modification"]}
                        </TableCell>
                    </TableRow>
                </TableHead>
        </Table>
    </div>
    </TabPanel>
    <TabPanel>
        <div style={{marginLeft:'10px', marginBottom:'15px'}}>
        <h2 style={{color:'#2b6384', marginBottom:'10px'}}>{data[0]["_source"]["Salivary Proteins"]["Protein Name"]}</h2>
        <Divider />

        <h2 style={{color:'black', marginBottom:'20px', fontWeight:'bold',marginTop:'20px'}}>Protein Status</h2>
        <Divider sx={{'marginBottom':'10px'}}/>

        <Table sx={{maxWidth:'20%', border: 1,tableLayout:'fixed'}} aria-label="simple table" style={{border: "1px solid black"}}>
                <TableHead>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th} style={{maxWidth:'20%',textAlign:'center'}}>Salivary gland origin</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}} style={{maxWidth:'100%',border:'1px'}}>
                            Unsubstantiated
                        </TableCell>
                    </TableRow>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th} style={{maxWidth:'20%'}}>Abundance level</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}} style={{maxWidth:'100%',border:'1px'}}>
                            
                        </TableCell>
                    </TableRow>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th} style={{maxWidth:'20%'}}>Curator</TableCell>
                        <TableCell sx={{'fontSize': '0.875rem'}} style={{maxWidth:'100%',border:'1px'}}>
                        127.0.0.1
                        </TableCell>
                    </TableRow>
                </TableHead>
        </Table>
        </div>
    </TabPanel>
    </Tabs>
    </>
  );
};
  
export default Protein_Detail;
<><script src="https://d3js.org/d3.v4.min.js" charset="utf-8" defer></script><script src="https://cdn.jsdelivr.net/npm/protvista-uniprot@latest/dist/protvista-uniprot.js"></script></>
window.customElements.define('protvista-uniprot', ProtvistaUniprot);
window.customElements.define('protvista-structure',ProtvistaStructure);