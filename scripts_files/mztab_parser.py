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

def calculate_cleavage_abundance(peptide_count, num_cleavages, total_peptide_count_over_cleavages):
    """
    Calculate the cleavage abundance for a protein based on the number of cleavages.
    Cleavage abundance formula: (peptide count / peptide cleavages) / total peptide count over cleavages.
    """
    if total_peptide_count_over_cleavages > 0 and num_cleavages > 0:
        cleavage_abundance = (peptide_count / num_cleavages) / total_peptide_count_over_cleavages
    else:
        cleavage_abundance = 0

    return cleavage_abundance

def calculate_abundance(peptide_count, sequence_length, total_count_over_length):
    """
    Abundance formula: (peptide count / protein sequence length) / total count over length.
    """
    normalized_value = peptide_count / sequence_length
    return normalized_value / total_count_over_length if total_count_over_length != 0 else 0

def parse_mztab(file_path):
    # Load mzTab file into an MzTab object
    mz_tab = mztab.MzTab(file_path)
    
    # Access the protein table (already a DataFrame)
    protein_df = mz_tab.protein_table
    
    # Access the peptide (PSM) table
    peptide_df = mz_tab.spectrum_match_table
    
    # Ensure columns that will hold floating-point numbers are of type 'float64'
    protein_df['Sequence'] = None
    protein_df['Length'] = None
    protein_df['Peptide Count'] = 0
    protein_df['Normalized Value'] = 0.0  # Set as float
    protein_df['Abundance'] = 0.0  # Set as float
    protein_df['Cleavage Abundance'] = 0.0  # Set as float

    # Fetch the sequences and lengths for each protein and calculate normalized values
    for i, row in protein_df.iterrows():
        accession = row['accession']  # Modify based on actual column name
        sequence, length = fetch_protein_sequence(accession)
        
        if sequence:
            # Count the number of matching peptides for this protein
            peptide_count = peptide_df[peptide_df['accession'] == accession].shape[0]
            
            # Store the sequence, length, and peptide count in the DataFrame
            protein_df.at[i, 'Sequence'] = sequence
            protein_df.at[i, 'Length'] = length
            protein_df.at[i, 'Peptide Count'] = peptide_count
            
            # Calculate the normalized value (peptide count / sequence length)
            normalized_value = peptide_count / length if length > 0 else 0
            protein_df.at[i, 'Normalized Value'] = float(normalized_value)

    # Calculate total_count_over_length: sum of all normalized values (peptide count / sequence length)
    total_count_over_length = protein_df['Normalized Value'].sum()

    # Calculate total_peptide_count_over_cleavages for Cleavage Abundance
    total_peptide_count_over_cleavages = 0

    # Loop again to compute total peptide count over cleavages
    for i, row in protein_df.iterrows():
        sequence = row['Sequence']
        peptide_count = row['Peptide Count']

        if sequence and peptide_count > 0:
            # Simulate trypsin cleavage on the protein sequence
            cleaved_peptides = cleave(sequence, expasy_rules['trypsin'])
            num_cleavages = max(0, len(cleaved_peptides) - 1)  # Calculate the number of cleavages
            
            # Calculate and accumulate total peptide count over cleavages
            total_peptide_count_over_cleavages += peptide_count / num_cleavages if num_cleavages > 0 else 0

    # Calculate Abundance and Cleavage Abundance for each protein
    for i, row in protein_df.iterrows():
        accession = row['accession']
        sequence = row['Sequence']
        length = row['Length']
        peptide_count = row['Peptide Count']

        if sequence and length > 0:
            # Simulate trypsin cleavage on the protein sequence
            cleaved_peptides = cleave(sequence, expasy_rules['trypsin'])
            num_cleavages = max(0, len(cleaved_peptides) - 1)  # Calculate the number of cleavages
            
            # Calculate abundance for the protein using the corrected formula
            abundance = calculate_abundance(peptide_count, length, total_count_over_length)
            protein_df.at[i, 'Abundance'] = float(abundance)
            
            # Calculate cleavage abundance using the corrected formula
            print(peptide_count, '', num_cleavages)
            cleavage_abundance = calculate_cleavage_abundance(peptide_count, num_cleavages, total_peptide_count_over_cleavages)
            protein_df.at[i, 'Cleavage Abundance'] = float(cleavage_abundance)
    
    return protein_df, peptide_df

# Example usage
protein_df, peptide_df = parse_mztab('mzTabs/SILAC_CQI.mztab')

# Save the protein and peptide tables to CSV
protein_df.to_csv('protein_table_with_abundance_and_cleavage_abundance.csv', index=False)
peptide_df.to_csv('peptide_table.csv', index=False)

# Display the protein table with sequences, abundance, and cleavage abundance
print("Protein Table with Sequences, Abundance, and Cleavage Abundance:")
print(protein_df.head())

# Display the peptide table
print("\nPeptide Table:")
print(peptide_df.head())
