import requests
import pandas as pd
from pyteomics import mztab
from pyteomics.parser import cleave, expasy_rules

def fetch_protein_sequence(accession):
    """
    Fetch the protein sequence and its length from the UniProt API using the accession number.
    """
    url = f"https://www.uniprot.org/uniprot/{accession}.fasta"
    response = requests.get(url)
    
    if response.status_code == 200:
        # Extract the sequence from the FASTA format
        fasta_data = response.text.splitlines()
        sequence = ''.join(fasta_data[1:])  # Join all sequence lines (FASTA starts with a header)
        return sequence, len(sequence)
    else:
        print(f"Error fetching {accession}: Status code {response.status_code}")
        return None, None

def calculate_cleavage_abundance(protein_sequence, cleaved_peptides, psm_df):
    """
    Calculate the total abundance for a protein based on cleaved peptides and spectrum match table.
    """
    total_abundance = 0
    for peptide in cleaved_peptides:
        # Find matching peptides in the PSM (spectrum match table)
        matching_psms = psm_df[psm_df['sequence'] == peptide]
        if not matching_psms.empty:
            total_abundance += matching_psms['search_engine_score[1]'].sum()  # Adjust column name as needed
    return total_abundance

def parse_mztab(file_path):
    # Load mzTab file into an MzTab object
    mz_tab = mztab.MzTab(file_path)
    
    # Access the protein table (already a DataFrame)
    protein_df = mz_tab.protein_table
    
    # Access the peptide (PSM) table
    peptide_df = mz_tab.spectrum_match_table
    
    # Create columns for the protein table
    protein_df['Sequence'] = None
    protein_df['Length'] = None
    protein_df['Cleavage Abundance'] = 0

    # Create the peptide table
    peptide_columns = ['search_engine_score[1]', 'charge', 'exp_mass_to_charge', 'sequence', 'accession', 'search_engine_score[1]']
    peptide_table = peptide_df[peptide_columns]
    
    # Fetch the sequences and lengths for each protein
    for i, row in protein_df.iterrows():
        accession = row['accession']  # Modify based on actual column name
        sequence, length = fetch_protein_sequence(accession)
        
        # Store the sequence and length in the DataFrame
        protein_df.at[i, 'Sequence'] = sequence
        protein_df.at[i, 'Length'] = length
        
        if sequence:
            # Simulate trypsin cleavage on the protein sequence
            cleaved_peptides = cleave(sequence, expasy_rules['trypsin'])
            
            # Calculate cleavage abundance by matching cleaved peptides to PSM table
            cleavage_abundance = calculate_cleavage_abundance(sequence, cleaved_peptides, peptide_df)
            protein_df.at[i, 'Cleavage Abundance'] = cleavage_abundance
    
    return protein_df, peptide_table

# Example usage
protein_df, peptide_table = parse_mztab('mzTabs/SILAC_CQI.mztab')

# Save the protein and peptide tables to CSV
protein_df.to_csv('protein_table_with_sequences_and_cleavage_abundance.csv', index=False)
peptide_table.to_csv('peptide_table.csv', index=False)

# Display the protein table with sequences and cleavage abundance
print("Protein Table with Sequences and Cleavage Abundance:")
print(protein_df.head())

# Display the peptide table
print("\nPeptide Table:")
print(peptide_table.head())
