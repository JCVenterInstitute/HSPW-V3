import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';

import { useParams} from "react-router";

const th = {
    background: '#f2f2f2',
    textAlign:'center',
    border: "1px solid #aaa",
    fontWeight:'bold',
    fontSize:'20px',
    padding:'0.2em'
};

const td = {
    border: "1px solid #aaa",
    fontSize:'18px',
    padding:'0.2em',
    fontSize:'18px'
};

const Gene_detail = (props) => {
    const [message, setMessage] = useState(true);
    const params = useParams();
    
    let url = 'http://localhost:8000/genes/'+params['geneid'];

  const [isLoading, setLoading] = useState(true);
  const [data,setData] = useState("");
  let gene_id = 0;
  let gene_link = "https://www.ncbi.nlm.nih.gov/gene/";
  const fetchGenes = async()=>{
    const response = await fetch(url);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const genes = await response.json();
    setData(genes);
    setMessage(false);
  }

  const [proteinName, setProteinName] = useState("");
  const fetchProtein = async()=>{
    let p = [];
    data[0]["_source"]["Gene Products"].map(async (item)=> await fetch('https://rest.uniprot.org/uniprotkb/'+item+'.json')
    .then((res)=>res.json())
    .then((proteinName)=>{if(proteinName["proteinDescription"]["recommendedName"]["fullName"]["value"] !== undefined){
        console.log('123:'+proteinName.proteinDescription.recommendedName.fullName.value);
        p.push(proteinName["proteinDescription"]["recommendedName"]["fullName"]["value"]);
        console.log(p);
        setProteinName(p);
    }
    else{
        console.log(proteinName);
        p.push(proteinName["proteinDescription"]["submissionNames"]["fullName"]["value"]);
        setProteinName(p);
    }})
    .catch((error)=>console.log(error)));
    
    setLoading(false);
  }

  useEffect(()=>{
    fetchGenes();
    if(message === false){
        fetchProtein();
    }
  });

  if(isLoading === true){
    return <h2>Loading</h2>
  }
  
  return (
    <>
    
    <div style={{margin:'20px'}}>
        <h2 style={{color:'black', marginBottom:'20px'}}>EntrezGene:{data[0]["_source"]["GeneID"]}</h2>
        <TableContainer component={Paper} style={{padding:'10px'}}>
            <Table sx={{minWidth:650}} aria-label="simple table" style={{border: "1px solid black"}}>
                <TableHead>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th}>Aliases</TableCell>
                        <TableCell sx={td}>{data[0]["_source"]["Aliases"]}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Organism</TableCell>
                        <TableCell sx={td}><a style={{color:'/*#116988*/#0b5989'}} href='http://salivaryproteome.org/public/index.php/Special:Ontology_Term/NEWT:9606'>Homo sapiens</a></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Taxonomic lineage</TableCell>
                        <TableCell sx={td}>Eukaryota {'>'} Opisthokonta {'>'} Metazoa {'>'} Eumetazoa {'>'} Bilateria {'>'} Deuterostomia {'>'} Chordata {'>'} Craniata {'>'} Vertebrata {'>'} Gnathostomata {'>'} Teleostomi {'>'} Euteleostomi {'>'} Sarcopterygii {'>'} Dipnotetrapodomorpha {'>'} Tetrapoda {'>'} Amniota {'>'} Mammalia {'>'} Theria {'>'} Eutheria {'>'} Boreoeutheria {'>'} Euarchontoglires {'>'} Primates {'>'} Haplorrhini {'>'} Simiiformes {'>'} Catarrhini {'>'} Hominoidea {'>'} Hominidae {'>'} Homininae {'>'} Homo</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Chromosome location</TableCell>
                        <TableCell sx={td}>{data[0]["_source"]["Location"]}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Summary</TableCell>
                        <TableCell sx={td}>{data[0]["_source"]["Summary"]}</TableCell>
                    </TableRow>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th}>Gene products</TableCell>
                        <TableCell style={td}>
                            <Table>
                                <TableHead>
                                    <TableRow style={{border: "1px solid black"}}>
                                        <TableCell style={{border: "1px solid black"}}><a style={{color: '#116988'}} href='https://salivaryproteome.org/public/index.php/Property:Has_accession_number'>Accession Number</a></TableCell>
                                        <TableCell style={{border: "1px solid black"}}><a style={{color: '#116988'}} href='https://salivaryproteome.org/public/index.php/Property:Known_officially_as'>Protein Name</a></TableCell>
                                        <TableCell style={{border: "1px solid black", color: '#116988'}}>Link</TableCell>
                                    </TableRow>

                                    {data[0]["_source"]["Gene Products"].map((value,i,arr)=>{return <TableRow style={{border: "1px solid black"}}><TableCell style={{border: "1px solid black"}}>{value}</TableCell><TableCell style={{border: "1px solid black"}}>{proteinName[1]}</TableCell><TableCell style={{border: "1px solid black"}}><a href='https://salivaryproteome.org/public/index.php/HSPW:PDE8DF3'>HSPW:PDE8DF3</a></TableCell></TableRow>})}
                                        

                                </TableHead>
                            </Table>
                        </TableCell>
                    </TableRow>
                    <TableRow style={{border: "1px solid black"}}>
                        <TableCell style={th}>Link</TableCell>
                        <TableCell style={td}><a href={gene_link + data[0]["_source"]["GeneID"]}>Entrez Gene</a></TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
    </div>
    
    </>
  );
};
  
export default Gene_detail;