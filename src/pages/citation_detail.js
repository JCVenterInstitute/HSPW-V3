import React, { useEffect,useState }  from 'react';
import Table from '@mui/material/Table';
import XMLParser from 'react-xml-parser';
import { parse } from 'fast-xml-parser';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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

const Citation_detail = (props) => {
    const [xml, setXML] = useState("");
    const [abstract, setAbstract] = useState("");
    const [affi,setaffi] = useState("");
    const [keyword,setKeyWord] = useState();
    const [isLoadingT, setLoadingT] = useState(true);
    const fetchAbstract = async()=>{
        const response = await fetch('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id='+params['citationid']+'&retmode=xml&rettype=abstract&api_key=1b7c2864fec7f4749814a17559ed02608808')
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.text();
        const parser = new DOMParser();
        const xml1 = parser.parseFromString(data, 'text/xml');
        if(Object.keys(xml1.getElementsByTagName('AbstractText')).length === 0 && Object.keys(xml1.getElementsByTagName('Affiliation')).length === 0){
            setAbstract('');
            setaffi(' ');
            xml1.getElementsByTagName('MeshHeading')

                    let list = xml1.getElementsByTagName('MeshHeading');

                    let b = [];
                    let c = '';
                    for(let i = 0; i < list.length;i++){
                        for(let j = 0; j < list[i].childNodes.length;j++){
                            let string = list[i].childNodes[j].textContent;
                            if(j===0){
                                c = string;
                            }
                            else{
                                c = c.concat('/'+string);
                            }
                        }
                        b.push(c);
                    }
                    setKeyWord(b.toString());
        }
        else{
            setAbstract(xml1.getElementsByTagName('AbstractText')[0].textContent);    
            setaffi(xml1.getElementsByTagName('Affiliation')[0].textContent);
            xml1.getElementsByTagName('MeshHeading')

                    let list = xml1.getElementsByTagName('MeshHeading');

                    let b = [];
                    let c = '';
                    for(let i = 0; i < list.length;i++){
                        for(let j = 0; j < list[i].childNodes.length;j++){
                            let string = list[i].childNodes[j].textContent;
                            if(j===0){
                                c = string;
                            }
                            else{
                                c = c.concat('/'+string);
                            }
                        }
                        b.push(c);
                    }
                    setKeyWord(b.toString());
                    
                
        }
    }
    
    const [message, setMessage] = useState("");
    const params = useParams();
    let url = 'http://localhost:8000/citation/'+params['citationid'];

  const [isLoading, setLoading] = useState(true);
  const [data,setData] = useState("");
  let interpro_link = "https://pubmed.ncbi.nlm.nih.gov/";
  console.log(url);
  const fetchSignature = async()=>{
    const response = await fetch(url);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const signature = await response.json();
    setData(signature);

    setLoading(false);
  }

  useEffect(()=>{
    fetchAbstract();
    fetchSignature();
    
  });

  if(isLoading === true){
    return <h2>Loading</h2>
  }
  return (
    <>
    <div style={{margin:'20px'}}>
        <h2 style={{color:'black', marginBottom:'20px'}}>van Es JH, et al. (1999) Identification of APC2, a homologue of the adenomatous polyposis coli tumour suppressor. Curr. Biol. 9(2):105-8</h2>
        <TableContainer component={Paper} style={{padding:'10px'}}>
            <Table sx={{minWidth:650}} aria-label="simple table" style={{border: "1px solid black"}}>
                <TableHead>
                    <TableRow sx={{border: "1px solid black"}}>
                        <TableCell sx={th}>Title</TableCell>
                        <TableCell sx={td}>{data[0]["_source"]["Title"]}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell sx={th}>Abstract</TableCell>
                        {abstract ?<TableCell sx={td}>{abstract}</TableCell>
                                  :<TableCell sx={td}>No Abstract Available</TableCell>
                        }
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Authors</TableCell>
                        <TableCell sx={td}>{data[0]["_source"]["Authors"]}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Author Affiliation</TableCell>
                        <TableCell sx={td}>{affi}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Journal</TableCell>
                        <TableCell sx={td}>Curr. Biol. (ISSN:0960-9822)</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>Publication Date</TableCell>
                        <TableCell sx={td}>{data[0]["_source"]["Date of Publication"]}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={th}>MeSH Keywords</TableCell>
                        <TableCell sx={td}>{keyword}</TableCell>
                    </TableRow>
                    <TableRow style={{border: "1px solid black"}}>
                        <TableCell style={th}>Link</TableCell>
                        <TableCell style={td}><a href={interpro_link+ data[0]["_source"]["CitationID"]}>PubMed</a></TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
    </div>
    </>
  );
};
  
export default Citation_detail;