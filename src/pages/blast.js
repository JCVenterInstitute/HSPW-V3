import React, { Component,useRef, useEffect } from 'react';
import Gene from '../components/gene_table';
import gene_chart from '../components/gene_chart.png';
import Chart from 'react-google-charts';
import main_feature from '../components/hero.jpeg'
import { Element } from 'react-faux-dom';
import * as d3 from "d3";
import BChart from '../components/TwoSidedBarChart'




const Blast = () => {

  return (
    <>
    <BChart />
    <div style={{height: '40%',backgroundImage: `url(${main_feature})`}}>
      <h1 style={{color:'white',textAlign:'center',display:'left',marginLeft:'20px',marginBottom:'1rem'}} align="left">Protein similarity search (BLAST)</h1>
      <p style={{textAlign:'left', color:'white',fontSize:'25px', paddingBottom:'15px', marginLeft:'20px',marginRight:'20px'}}>
        The Basic Local Alignment Search Tool (BLAST) finds regions of local similarity between sequences. Position Specific Iterative BLAST (PSI-BLAST) performs an iterative sequence similarity search which can detect more distant evolutionary relationships. This service is provided by the European Bioinformatics Institute (EBI).
      </p>
    </div>
    <form style={{marginTop:'30px',marginLeft:'20px'}}>
        <table>
            <tr style={{marginBottom:'20px'}}>
                <td>
                    <label style={{marginLeft:'20px',marginBottom:'20px'}}>Database: </label>
                    <select id="database" name="database">
                        <option value="uniprotkb">UniProt Knowledgebase (The UniProt Knowledgebase includes UniProtKB/Swiss-Prot and UniProtKB/TrEMBL)</option>
                        <option value="uniprotkb_swissprot">UniProtKB/Swiss-Prot (The manually annotated section of UniProtKB)</option>
                        <option value="uniprotkb_swissprotsv">UniProtKB/Swiss-Prot isoforms (The manually annotated isoforms of UniProtKB/Swiss-Prot)</option>
                        <option value="uniprotkb_trembl">UniProtKB/TrEMBL (The automatically annotated section of UniProtKB)</option>
                        <option value="uniprotkb_refprotswissprot">UniProtKB Reference Proteomes plus Swiss-Prot</option>
                        <option value="uniprotkb_archaea">UniProtKB Archaea</option>
                        <option value="uniprotkb_arthropoda">UniProtKB Arthropoda</option>
                        <option value="uniprotkb_bacteria">UniProtKB Bacteria</option>
                        <option value="uniprotkb_complete_microbial_proteomes">UniProtKB Complete Microbial Proteomes</option>
                        <option value="uniprotkb_eukaryota">UniProtKB Eukaryota</option>
                        <option value="uniprotkb_fungi">UniProtKB Fungi</option>
                        <option value="uniprotkb_human">UniProtKB Human</option>
                        <option value="uniprotkb_mammals">UniProtKB Mammals</option>
                        <option value="uniprotkb_reference_proteomes">UniProtKB Reference Proteomes</option>
                        <option value="uniprotkb_rodents">UniProtKB Rodents</option>
                        <option value="uniprotkb_vertebrates">UniProtKB Vertebrates</option>
                        <option value="uniprotkb_viridiplantae">UniProtKB Viridiplantae</option>
                        <option value="uniprotkb_viruses">UniProtKB Viruses</option>
                        <option value="uniprotkb_enzyme">UniProtKB Enzyme</option>
                        <option value="uniprotkb_covid19">UniProtKB COVID-19</option>
                        <option value="uniref100">UniProt Clusters 100% (UniRef100)</option>
                        <option value="uniref90">UniProt Clusters 90% (UniRef90)</option>
                        <option value="uniref50">UniProt Clusters 50% (UniRef50)</option>
                        <option value="epo">EPO Patent Protein Sequences</option>
                        <option value="jpo">JPO Patent Protein Sequences</option>
                        <option value="kipo">KIPO Patent Protein Sequences</option>
                        <option value="uspto">USPTO Patent Protein Sequences</option>
                        <option value="nrpl1">NR Patent Proteins Level-1</option>
                        <option value="nrpl2">NR Patent Proteins Level-2</option>
                        <option value="pdb">Protein Structure Sequences (PDBe protein structure sequences)</option>
                        <option value="afdb">AlphaFold DB</option>
                        <option value="uniprotkb_pdb">UniProtKB PDB</option>
                        <option value="ensembl_covid/Sars_cov_2.ASM985889v3.pep.all">EnsemblCOVID19 protein sequences</option>
                        <option value="enzymeportal">Enzyme Portal (Sequences from enzyme reports from UniProtKB, PDBe, ChEMBL, ChEBI, REACTOME, Rhea and IntEnz)</option>
                        <option value="uniparc">UniProt Archive (Sequences from the UniProt Archive UniParc)</option>
                        <option value="intact">IntAct (Sequences from IntAct interactors)</option>
                        <option value="imgthlapro">IPD-IMGT/HLA (Immuno Polymorphism Database-International Immunogenetics project/Human Leucocyte Antigen)</option>
                        <option value="ipdkirpro">IPD-KIR (Immuno Polymorphism Database-Killer-cell Immunoglobulin-like Receptors)</option>
                        <option value="ipdnhkirpro">IPD-NHKIR (Immuno Polymorphism Database-Killer-cell Immunoglobulin-like Receptors)</option>
                        <option value="ipdmhcpro">IPD-MHC (Immuno Polymorphism Database-Major Histocompatibility Complex)</option>
                        <option value="mpro">MEROPS-MPRO (Sequences from the MEROPS scan dataset)</option>
                        <option value="mpep">MEROPS-MPEP (Sequences from the peptidase or inhibitor domain sequence only)</option>
                        <option value="mp">MEROPS-MP (Sequences from the full MEROPS collection)</option>
                        <option value="chembl">ChEMBL (Sequences from a manually curated database of bioactive molecules with drug-like properties)</option>
                    </select>
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

export default Blast;
