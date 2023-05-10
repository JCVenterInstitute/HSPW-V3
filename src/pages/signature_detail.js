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

const Signature_detail = (props) => {
    const [message, setMessage] = useState("");
    const params = useParams();
    let url = 'http://localhost:8000/protein_signature/'+params['interproid'];

  const [isLoading, setLoading] = useState(true);
  const [data,setData] = useState("");
  const [pfam,setpFam] = useState("");
  let gene_id = 0;
  let interpro_link = "https://www.ebi.ac.uk/interpro/entry/InterPro/";
  console.log(url);
  const fetchSignature = async()=>{
    const response = await fetch(url);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const signature = await response.json();
    setData(signature);
    for(let i = 0; i < data[0]["_source"]["Signature"].length;i++){
        if(data[0]["_source"]["Signature"][i].includes('PFAM')){
            setpFam(data[0]["_source"]["Signature"][i]);
        }
    }
    setLoading(false);
  }

  useEffect(()=>{
    fetchSignature();
  });

  if(isLoading){
    return <h2>Loading</h2>
  }
  
  return (
    <>
    
    <div style={{margin:'20px'}}>
        <h2 style={{color:'black', marginBottom:'20px'}}>{data[0]["_source"]["Type"]+': '+data[0]["_source"]["Name"]}</h2>
        <TableContainer component={Paper} style={{padding:'10px'}}>
            <Table sx={{minWidth:650}} aria-label="simple table" style={{border: "1px solid black"}}>
                <TableHead>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th}>Abstract</TableCell>
                        <TableCell sx={td}>{data[0]["_source"]["Abstract"]}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell sx={th}>Signatures</TableCell>
                        <TableCell style={td}>
                                {setpFam ?(
                                    <><h2>Pfam:</h2><a href={'http://pfam-legacy.xfam.org/family/' + pfam.split(':')[1]}>{pfam}</a></>
                                ):(<></>)}
                                
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell sx={th}>GO Annotations</TableCell>
                        <TableCell sx={td}>{data[0]["_source"]["GO Annotations"]}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>References</TableCell>
                        <TableCell sx={td}>{data[0]["_source"]["ReferencesID"]}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Members</TableCell>
                        <TableCell sx={td}>View Protein Members</TableCell>
                    </TableRow>

                    <TableRow style={{border: "1px solid black"}}>
                        <TableCell style={th}>Link</TableCell>
                        <TableCell style={td}><a href={interpro_link + data[0]["_source"]["InterPro ID"]}>InterPro</a></TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
    </div>
    
    </>
  );
};
  
export default Signature_detail;