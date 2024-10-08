import requests
import pandas as pd
import argparse
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
        sequence = ''.join(fasta_data[1:])  # Join all sequence lines
        return sequence, len(sequence)
    else:
        print(f"Error fetching {accession}: Status code {response.status_code}")
        return None, None

def calculate_cleavage_abundance(peptide_count_over_cleavages, total_peptide_count_over_cleavages):
    """
    Calculate the cleavage abundance for a protein based on peptide count over cleavages.
    Cleavage abundance formula: (peptide count / peptide cleavages) / total peptide count over cleavages.
    """
    return peptide_count_over_cleavages / total_peptide_count_over_cleavages if total_peptide_count_over_cleavages > 0 else 0

def calculate_abundance(normalized_value, total_count_over_length):
    """
    Abundance formula: (peptide count / protein sequence length) / total count over length.
    """
    return normalized_value / total_count_over_length if total_count_over_length > 0 else 0

def parse_mztab(file_path):
    # Load mzTab file into an MzTab object
    mz_tab = mztab.MzTab(file_path)
    
    # Access the protein and peptide tables
    protein_df = mz_tab.protein_table
    peptide_df = mz_tab.spectrum_match_table
    
    # Ensure necessary columns are initialized
    protein_df['Sequence'] = None
    protein_df['Length'] = None
    protein_df['Peptide Count'] = 0
    protein_df['Normalized Value'] = 0.0
    protein_df['Peptide Count Over Cleavages'] = 0.0
    protein_df['Abundance'] = 0.0
    protein_df['Cleavage Abundance'] = 0.0

    total_peptide_count_over_cleavages = 0
    total_count_over_length = 0

    # Fetch the sequences, lengths, and peptide counts for each protein and calculate initial values
    for i, row in protein_df.iterrows():
        accession = row['accession']
        sequence, length = fetch_protein_sequence(accession)
        
        if sequence:
            # Count the number of matching peptides for this protein
            peptide_count = peptide_df[peptide_df['accession'] == accession].shape[0]
            
            protein_df.at[i, 'Sequence'] = sequence
            protein_df.at[i, 'Length'] = length
            protein_df.at[i, 'Peptide Count'] = peptide_count
            
            # Calculate normalized value (peptide count / sequence length)
            normalized_value = peptide_count / length if length > 0 else 0
            protein_df.at[i, 'Normalized Value'] = normalized_value
            total_count_over_length += normalized_value

            # Simulate trypsin cleavage and calculate peptide count over cleavages
            cleaved_peptides = cleave(sequence, expasy_rules['trypsin'])
            print(cleaved_peptides)
            num_cleavages = len(cleaved_peptides)
            
            peptide_count_over_cleavages = peptide_count / num_cleavages if num_cleavages > 0 else 0
            protein_df.at[i, 'Peptide Count Over Cleavages'] = peptide_count_over_cleavages
            total_peptide_count_over_cleavages += peptide_count_over_cleavages

    # Calculate Abundance and Cleavage Abundance for each protein
    for i, row in protein_df.iterrows():
        normalized_value = row['Normalized Value']
        peptide_count_over_cleavages = row['Peptide Count Over Cleavages']

        # Calculate abundance and cleavage abundance
        abundance = calculate_abundance(normalized_value, total_count_over_length)
        protein_df.at[i, 'Abundance'] = float(abundance)
        
        cleavage_abundance = calculate_cleavage_abundance(peptide_count_over_cleavages, total_peptide_count_over_cleavages)
        protein_df.at[i, 'Cleavage Abundance'] = float(cleavage_abundance)
    
    return protein_df, peptide_df

def main():
    # Setup argument parser
    parser = argparse.ArgumentParser(description="Parse an mzTab file and calculate abundance and cleavage abundance.")
    parser.add_argument('mztab_file', type=str, help="Path to the mzTab file")

    # Parse the command line arguments
    args = parser.parse_args()

    # Parse the mzTab file
    protein_df, peptide_df = parse_mztab(args.mztab_file)

    # Select relevant columns for protein table
    protein_columns = [
        'accession',  # Protein Accession Number
        'Peptide Count',  # Peptide Count for Each Protein
        'database',  # Database Name
        'best_search_engine_score[1]',  # Protein Score
        'search_engine',  # Search Engine
        'description',  # Protein Name
        'Sequence',  # Protein Sequence
        'Length',  # Protein Sequence Length
        'Abundance',  # Abundance
        'Cleavage Abundance'  # Cleavage Abundance
    ]
    protein_df_filtered = protein_df[protein_columns].reset_index(drop=True)

    # Select relevant columns for peptide table
    peptide_columns = [
        'search_engine_score[1]',  # Search Engine Score
        'charge',  # Charge
        'exp_mass_to_charge',  # mz ratio
        'sequence',  # Peptide Sequence
        'search_engine_score[1]',  # Peptide Score
        'accession'  # Add accession for mapping purposes
    ]

    peptide_df_filtered = peptide_df[peptide_columns].reset_index(drop=True)

    # Combine protein and respective peptides into one CSV
    combined_rows = []

    for i, protein_row in protein_df_filtered.iterrows():
        combined_rows.append(protein_row.to_dict())  # Add protein row as a dictionary

        # Get peptides related to this protein by accession
        accession = protein_row['accession']
        
        # Ensure we can compare 'accession' in both protein_df and peptide_df
        matching_peptides = peptide_df_filtered[peptide_df_filtered['accession'] == accession]
        matching_peptides = matching_peptides.reset_index(drop=True)  # Reset index on peptide table

        # Append peptide rows related to this protein
        for j, peptide_row in matching_peptides.iterrows():
            peptide_dict = peptide_row.to_dict()
            # Set 'database' and 'search_engine' columns to empty for peptide rows
            peptide_dict['database'] = ''
            peptide_dict['search_engine'] = ''
            combined_rows.append(peptide_dict)  # Convert peptide row to dictionary

    # Create a combined DataFrame
    combined_df = pd.DataFrame(combined_rows)

    # Save the combined DataFrame to a CSV
    combined_df.to_csv('combined_protein_peptide_table.csv', index=False)

    # Display the combined table
    print("Combined Protein and Peptide Table:")
    print(combined_df.head())

if __name__ == "__main__":
    main()
