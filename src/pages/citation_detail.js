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
    const [ISSNNum, setISSNNum] = useState();
    const [journalTitle, setjournalTitle] = useState();
    const [authorName, setauthorName] = useState();
    const [year, setYear] = useState();
    const [ta, setTA] = useState();
    const [pgn, setPGN] = useState();
    const [journal, setJournal] = useState();
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
                    console.log('diu:'+xml1.getElementsByTagName('Article'));
                    if(xml1.getElementsByTagName('LastName').length === 1){
                        setauthorName(xml1.getElementsByTagName('LastName')[0].textContent+ ' ' + xml1.getElementsByTagName('Initials')[0].textContent)
                    }
                    else if(xml1.getElementsByTagName('LastName').length === 2){
                        setauthorName(xml1.getElementsByTagName('LastName')[0].textContent+ ' ' + xml1.getElementsByTagName('Initials')[0].textContent + ' and ' + xml1.getElementsByTagName('LastName')[1].textContent+ ' ' + xml1.getElementsByTagName('Initials')[1].textContent );
                    }
                    else if(xml1.getElementsByTagName('LastName').length >= 3){
                        setauthorName(xml1.getElementsByTagName('LastName')[0].textContent+ ' ' + xml1.getElementsByTagName('Initials')[0].textContent + ', et al.')
                    }
                    setJournal(xml1.getElementsByTagName('Volume')[0].textContent + '(' + xml1.getElementsByTagName('Issue')[0].textContent + ')')
                    setYear(xml1.getElementsByTagName('Year')[0].textContent);
                    setTA(xml1.getElementsByTagName('MedlineTA')[0].textContent);
                    setPGN(xml1.getElementsByTagName('MedlinePgn')[0].textContent);
                    setjournalTitle(xml1.getElementsByTagName('MedlineJournalInfo')[0].textContent);
                    setISSNNum(xml1.getElementsByTagName('ISSNLinking')[0].textContent);

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
                    console.log('diu:'+xml1.getElementsByTagName('LastName')[0].textContent);
                    if(xml1.getElementsByTagName('LastName').length === 1){
                        setauthorName(xml1.getElementsByTagName('LastName')[0].textContent+ ' ' + xml1.getElementsByTagName('Initials')[0].textContent)
                    }
                    else if(xml1.getElementsByTagName('LastName').length === 2){
                        setauthorName(xml1.getElementsByTagName('LastName')[0].textContent+ ' ' + xml1.getElementsByTagName('Initials')[0].textContent + ' and ' + xml1.getElementsByTagName('LastName')[1].textContent+ ' ' + xml1.getElementsByTagName('Initials')[1].textContent );
                    }
                    else if(xml1.getElementsByTagName('LastName').length >= 3){
                        setauthorName(xml1.getElementsByTagName('LastName')[0].textContent+ ' ' + xml1.getElementsByTagName('Initials')[0].textContent + ', et al.')
                    }
                    setJournal(xml1.getElementsByTagName('Volume')[0].textContent + '(' + xml1.getElementsByTagName('Issue')[0].textContent + ')')
                    setYear(xml1.getElementsByTagName('Year')[0].textContent);
                    setTA(xml1.getElementsByTagName('MedlineTA')[0].textContent);
                    setPGN(xml1.getElementsByTagName('MedlinePgn')[0].textContent);
                    setjournalTitle(xml1.getElementsByTagName('MedlineTA')[0].textContent);
                    setISSNNum(xml1.getElementsByTagName('ISSNLinking')[0].textContent);
                    
                
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
    
  },[]);

  if(isLoading === true){
    return <h2>Loading</h2>
  }
  return (
    <>
    <div style={{margin:'20px'}}>
        <h2 style={{color:'black', marginBottom:'20px'}}>
            {authorName} ({year}) {data[0]["_source"]["Title"]}. {journalTitle}. {journal}:{pgn}</h2>
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
                        <TableCell sx={td}>{journalTitle} (ISSN:{ISSNNum})</TableCell>
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