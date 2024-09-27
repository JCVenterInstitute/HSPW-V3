import requests
import pandas as pd
from pyteomics import mztab

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

def parse_mztab(file_path):
    # Load mzTab file into an MzTab object
    mz_tab = mztab.MzTab(file_path)
    
    # Access the protein table (already a DataFrame)
    protein_df = mz_tab.protein_table
    
    # Access the peptide table (if available and already a DataFrame)
    peptide_df = mz_tab.peptide_table if hasattr(mz_tab, 'peptide_table') else None

    # Create a new column to store the protein sequences and lengths
    protein_df['Sequence'] = None
    protein_df['Length'] = None

    # Fetch the sequences and lengths for each protein
    for i, row in protein_df.iterrows():
        accession = row['accession']  # Modify based on actual column name
        sequence, length = fetch_protein_sequence(accession)
        
        # Store the sequence and length in the DataFrame
        protein_df.at[i, 'Sequence'] = sequence
        protein_df.at[i, 'Length'] = length
    
    return protein_df, peptide_df

# Example usage
protein_df, peptide_df = parse_mztab('SILAC_CQI.mztab')

# Save the protein table to CSV
protein_df.to_csv('protein_table_with_sequences.csv', index=False)

# If peptide table exists, save it to CSV
if peptide_df is not None:
    peptide_df.to_csv('peptide_table.csv', index=False)

# Display the tables
print("Protein Table with Sequences:")
print(protein_df.head())
