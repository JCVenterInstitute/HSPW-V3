import requests
import pandas as pd
import argparse
import json
import os
from pyteomics import mztab
from pyteomics.parser import cleave, expasy_rules

# Fetch protein sequence and length from uniprot
def fetch_protein_sequence(accession):
    url = f"https://www.uniprot.org/uniprot/{accession}.fasta"
    response = requests.get(url)
    
    if response.status_code == 200:
        fasta_data = response.text.splitlines()
        sequence = ''.join(fasta_data[1:])
        return sequence, len(sequence)
    else:
        print(f"Error fetching {accession}: Status code {response.status_code}")
        return None, None

def calculate_cleavage_abundance(peptide_count_over_cleavages, total_peptide_count_over_cleavages):
    return peptide_count_over_cleavages / total_peptide_count_over_cleavages if total_peptide_count_over_cleavages > 0 else 0

def calculate_abundance(normalized_value, total_count_over_length):
    return normalized_value / total_count_over_length if total_count_over_length > 0 else 0

def parse_mztab(file_path):
    mz_tab = mztab.MzTab(file_path)
    protein_df = mz_tab.protein_table
    peptide_df = mz_tab.spectrum_match_table

    protein_df['Sequence'] = None
    protein_df['Length'] = None
    protein_df['Peptide Count'] = 0
    protein_df['Normalized Value'] = 0.0
    protein_df['Peptide Count Over Cleavages'] = 0.0
    protein_df['Abundance'] = 0.0
    protein_df['Peptide Cleavages'] = 0
    protein_df['Cleavage Abundance'] = 0.0
    protein_df['Cleavage Sites'] = None

    total_peptide_count_over_cleavages = 0
    total_count_over_length = 0

    for i, row in protein_df.iterrows():
        accession = row['accession']
        sequence, length = fetch_protein_sequence(accession)
        
        if sequence:
            peptide_count = peptide_df[peptide_df['accession'] == accession].shape[0]
            
            protein_df.at[i, 'Sequence'] = sequence
            protein_df.at[i, 'Length'] = length
            protein_df.at[i, 'Peptide Count'] = peptide_count
            
            normalized_value = peptide_count / length if length > 0 else 0
            protein_df.at[i, 'Normalized Value'] = normalized_value
            total_count_over_length += normalized_value

            cleaved_peptides = cleave(sequence, expasy_rules['trypsin'])
            num_cleavages = len(cleaved_peptides)
            protein_df.at[i, 'Cleavage Sites'] = list(cleaved_peptides)
            protein_df.at[i, 'Peptide Cleavages'] = num_cleavages
            
            peptide_count_over_cleavages = peptide_count / num_cleavages if num_cleavages > 0 else 0
            protein_df.at[i, 'Peptide Count Over Cleavages'] = peptide_count_over_cleavages
            total_peptide_count_over_cleavages += peptide_count_over_cleavages

    for i, row in protein_df.iterrows():
        normalized_value = row['Normalized Value']
        peptide_count_over_cleavages = row['Peptide Count Over Cleavages']

        abundance = calculate_abundance(normalized_value, total_count_over_length)
        protein_df.at[i, 'Abundance'] = float(abundance)
        
        cleavage_abundance = calculate_cleavage_abundance(peptide_count_over_cleavages, total_peptide_count_over_cleavages)
        protein_df.at[i, 'Cleavage Abundance'] = float(cleavage_abundance)
    
    return protein_df, peptide_df

def generate_study_json(input_json, experiment_id_key, mztab_file, mz_tab):
    study = input_json.copy()
    
    study['experiment_id_key'] = experiment_id_key
    study['experiment_type'] = mz_tab.metadata.get('mzTab-type')
    study['experiment_short_title'] = mz_tab.metadata.get('description')
    study['sample_name'] = os.path.basename(mztab_file).split('.')[0]
    
    return study

def generate_study_protein(protein_df, experiment_id_key, total_protein_count, total_peptide_count):
    proteins = []
    
    for _, row in protein_df.iterrows():
        protein = {
            "experiment_id_key": experiment_id_key,
            "Uniprot_id": row['accession'],
            "protein_sequence": row['Sequence'],
            "protein_sequence_length": row['Length'],
            "abundance": row['Abundance'],
            "protein_name": row['description'],
            "protein_score": row['best_search_engine_score[1]'],
            "peptide_count": row['Peptide Count'],
            "experiment_protein_count": total_protein_count,
            "experiment_peptide_count": total_peptide_count,
            "cleavage_sites": row['Cleavage Sites'],
            "peptide_cleavages": row['Peptide Cleavages'],
            "abundance_cleavages": row['Cleavage Abundance'],
            "uparc": row['accession']  # Assuming uparc is stored in 'accession' field
        }
        proteins.append(protein)
    
    return proteins

def generate_study_peptide(peptide_df, experiment_id_key):
    peptides = []
    
    for _, row in peptide_df.iterrows():
        peptide = {
            "experiment_id_key": experiment_id_key,
            "uniprot_accession": row['accession'],
            "spectrum_number": row['spectra_ref'],
            "mass": row['exp_mass_to_charge'],
            "charge": row['charge'],
            "mz_ratio": row['calc_mass_to_charge'],
            "peptide_sequence": row['sequence'],
            "peptide_score": row['search_engine_score[1]'],
            "start_coord": row['start'],
            "end_coord": row['end']
        }
        peptides.append(peptide)
    
    return peptides

def save_json(data, file_path):
    with open(file_path, 'w') as json_file:
        json.dump(data, json_file, indent=4)

def main():
    parser = argparse.ArgumentParser(description="Parse mzTab, JSON file, and experiment ID to output study files.")
    parser.add_argument('mztab_file', type=str, help="Path to the mzTab file")
    parser.add_argument('json_file', type=str, help="Path to the input JSON file")
    parser.add_argument('experiment_id', type=int, help="Experiment ID")
    parser.add_argument('output_dir', type=str, help="Path to output directory")

    args = parser.parse_args()

    protein_df, peptide_df = parse_mztab(args.mztab_file)

    total_protein_count = protein_df.shape[0]
    total_peptide_count = peptide_df.shape[0]

    with open(args.json_file, 'r') as f:
        input_json = json.load(f)

    mz_tab = mztab.MzTab(args.mztab_file)

    study = generate_study_json(input_json, args.experiment_id, args.mztab_file, mz_tab)
    study_protein = generate_study_protein(protein_df, args.experiment_id, total_protein_count, total_peptide_count)
    study_peptide = generate_study_peptide(peptide_df, args.experiment_id)

    # output_dir = f'study_output_{args.experiment_id}'
    os.makedirs(args.output_dir, exist_ok=True)

    save_json(study, os.path.join(args.output_dir, 'study.json'))
    save_json(study_protein, os.path.join(args.output_dir, 'study_protein.json'))
    save_json(study_peptide, os.path.join(args.output_dir, 'study_peptide.json'))

if __name__ == "__main__":
    main()
