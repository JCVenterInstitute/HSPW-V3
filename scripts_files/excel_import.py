import requests
import pandas as pd
import argparse
import json
import os
import time
import re
from io import StringIO
from pyteomics import mztab
from pyteomics.parser import xcleave, expasy_rules
from urllib.parse import urlparse, parse_qs, urlencode


# Extract valid UniProt accession from a possibly malformed accession string
def clean_accession(accession):
    # Extract the first valid UniProt accession using a regex pattern
    match = re.match(r"([A-Z0-9]+)", accession)
    if match:
        return match.group(1)
    return None


# Fetch protein sequence and length from UniProt with rate-limiting handling
def fetch_protein_sequence(accession):
    """
    Fetch a single protein sequence and its length from the UniProt API using the accession number.
    """
    url = f"https://www.uniprot.org/uniprot/{accession}.fasta"
    response = requests.get(url)

    # Handle rate-limiting by UniProt
    while response.status_code == 429:
        print(f"Rate-limited while fetching {accession}. Retrying after 5 seconds...")
        time.sleep(5)
        response = requests.get(url)

    if response.status_code == 200:
        fasta_data = response.text.splitlines()
        sequence = "".join(
            fasta_data[1:]
        )  # Join all sequence lines (FASTA starts with a header)
        return sequence, len(sequence)
    else:
        print(f"Error fetching {accession}: Status code {response.status_code}")
        return None, None


POLLING_INTERVAL = 3
API_URL = "https://rest.uniprot.org"
session = requests.Session()


def check_response(response):
    try:
        response.raise_for_status()
    except requests.HTTPError:
        print(response.json())
        raise


# Function to submit the ID mapping job
def submit_id_mapping(from_db, to_db, ids):
    request = session.post(
        f"{API_URL}/idmapping/run",
        data={"from": from_db, "to": to_db, "ids": ",".join(ids)},
    )
    check_response(request)
    return request.json()["jobId"]


# Function to check if the job is ready
def check_id_mapping_results_ready(job_id):
    while True:
        request = session.get(f"{API_URL}/idmapping/status/{job_id}")
        check_response(request)
        j = request.json()
        if "jobStatus" in j:
            if j["jobStatus"] in ("NEW", "RUNNING"):
                print(f"Retrying in {POLLING_INTERVAL}s")
                time.sleep(POLLING_INTERVAL)
            else:
                raise Exception(f"Job status: {j['jobStatus']}")
        else:
            return bool(j["results"] or j["failedIds"])


# Function to get the result link once the job is complete
def get_id_mapping_results_link(job_id):
    url = f"{API_URL}/idmapping/details/{job_id}"
    request = session.get(url)
    check_response(request)
    return request.json()["redirectURL"]


# Function to retrieve the results of the ID mapping job
def get_id_mapping_results_search(url):
    parsed = urlparse(url)
    query = parse_qs(parsed.query)
    file_format = query["format"][0] if "format" in query else "json"

    if "size" in query:
        size = int(query["size"][0])
    else:
        size = 500
        query["size"] = size

    parsed = parsed._replace(query=urlencode(query, doseq=True))
    url = parsed.geturl()
    request = session.get(url)
    check_response(request)
    results = request.json() if file_format == "json" else []

    return results


# Main function to fetch UniParc IDs
def fetch_uniparc_ids(accessions):
    print(accessions)

    cleaned_accessions = [
        clean_accession(acc) for acc in accessions if clean_accession(acc)
    ]
    uparc_mapping = {}

    try:
        # Submit the batch job for ID mapping
        job_id = submit_id_mapping(
            from_db="UniProtKB_AC-ID", to_db="UniParc", ids=cleaned_accessions
        )
        print(f"Job submitted with ID: {job_id}")

        # Poll the status of the job until it's done
        if check_id_mapping_results_ready(job_id):
            # Get the results link
            result_link = get_id_mapping_results_link(job_id)
            print(f"Results available at: {result_link}")

            # Fetch and parse the results
            results = get_id_mapping_results_search(result_link)
            for item in results.get("results", []):
                uniprot_acc = item["from"]
                uparc_id = item["to"]["uniParcId"]
                uparc_mapping[uniprot_acc] = uparc_id  # Only store UniParc ID

            print(
                f"Successfully fetched UniParc IDs for {len(uparc_mapping)} accessions."
            )
        else:
            print("Error: No results found.")

    except Exception as e:
        print(f"Error fetching UniParc IDs: {str(e)}")
    return uparc_mapping  # Only returning the mapping of UniProt to UniParc IDs


# Calculate cleavage abundance
def calculate_cleavage_abundance(
    peptide_count_over_cleavages, total_peptide_count_over_cleavages
):
    return (
        peptide_count_over_cleavages / total_peptide_count_over_cleavages
        if total_peptide_count_over_cleavages > 0
        else 0
    )


# Calculate abundance
def calculate_abundance(normalized_value, total_count_over_length):
    return (
        normalized_value / total_count_over_length if total_count_over_length > 0 else 0
    )

# Split input csv into 4 seperate csvs
def split_csv(csv):
    seperate = csv.split("\n,")
    return seperate

# Count number of trailing commas due to differing amount of headers in each csv 
def count_trailing_commas(header):
    num_of_commas = header.count(',')
    trailing_commas = num_of_commas - header.rstrip(',').count(',')
    return trailing_commas

# Recombine csv that was further split whilst removing trailing commas
def recombine_csv_array(csv_array):
    recombined_csv = ""
    
    for x in csv_array:
        recombined_csv += x + "\n"
    
    return recombined_csv

def rename_csv_headers(csv):
    

# Clean csv by splitting input csv into 4 useable csvs 
def clean_csv(csv):
    cleansed_csv = csv.split('\n')

    
    if cleansed_csv[0].startswith(','):
        cleansed_csv.pop(0)

    trailing_commas = count_trailing_commas(cleansed_csv[0])
    if trailing_commas > 0:
        cleansed_csv = [string[:-trailing_commas] for string in cleansed_csv]
        
    return recombine_csv_array(cleansed_csv)


# Parse mzTab file or csv file
def parse_experiment(file_path, csv):
    mz_tab, protein_df, peptide_df, metadata_df = None

    if csv:
        split_array = split_csv(csv_string)
        protein_df = pd.read_csv(StringIO(clean_csv(split_array[2])))
        peptide_df = pd.read_csv(StringIO(clean_csv(split_array[3])))
    else:
        mz_tab = mztab.MzTab(file_path)
        protein_df = mz_tab.protein_table
        peptide_df = mz_tab.spectrum_match_table

    # Add columns to protein DataFrame
    protein_df["Sequence"] = None
    protein_df["Length"] = None
    protein_df["Peptide Count"] = 0
    protein_df["Normalized Value"] = 0.0
    protein_df["Peptide Count Over Cleavages"] = 0.0
    protein_df["Abundance"] = 0.0
    protein_df["Peptide Cleavages"] = 0
    protein_df["Cleavage Abundance"] = 0.0
    protein_df["UniParc"] = None

    total_peptide_count_over_cleavages = 0
    total_count_over_length = 0

    # Fetch sequences, calculate values
    for i, row in protein_df.iterrows():
        raw_accession = row.get("accession")
        accession = clean_accession(raw_accession)

        if accession:
            sequence, length = fetch_protein_sequence(accession)
            if sequence:
                peptide_count = peptide_df[
                    peptide_df["accession"] == raw_accession
                ].shape[0]

                # Store sequence and calculate peptide counts and cleavages
                protein_df.at[i, "Sequence"] = sequence
                protein_df.at[i, "Length"] = length
                protein_df.at[i, "Peptide Count"] = peptide_count

                normalized_value = peptide_count / length if length > 0 else 0
                protein_df.at[i, "Normalized Value"] = normalized_value
                total_count_over_length += normalized_value

                # Peptide cleaving is a regex with exceptions, those exceptions are not automatically included
                # https://pyteomics.readthedocs.io/en/latest/api/parser.html#pyteomics.parser.expasy_rules
                cleaved_peptides = xcleave(
                    sequence,
                    expasy_rules["trypsin"],
                    exception=expasy_rules["trypsin_exception"],
                )
                # cleaved peptides return the petides but we want the number of cleavages so we subtract 1 from the length
                num_cleavages = len(cleaved_peptides) - 1
                protein_df.at[i, "Peptide Cleavages"] = num_cleavages

                peptide_count_over_cleavages = (
                    peptide_count / num_cleavages if num_cleavages > 0 else 0
                )
                protein_df.at[i, "Peptide Count Over Cleavages"] = (
                    peptide_count_over_cleavages
                )
                total_peptide_count_over_cleavages += peptide_count_over_cleavages
            else:
                print(f"Skipping accession {accession} due to sequence fetch failure.")
                #  TODO: track failed/skipped accessions
        else:
            print(f"Skipping invalid accession: {raw_accession}")
            #  TODO: track failed/skipped accessions

    # Fetch UniParc IDs for all cleaned accessions
    accessions = (
        protein_df["accession"].dropna().apply(clean_accession).dropna().tolist()
    )
    uniparc_mapping = fetch_uniparc_ids(accessions)

    # Assign UniParc IDs to the protein DataFrame
    for i, row in protein_df.iterrows():
        accession = clean_accession(row.get("accession"))
        protein_df.at[i, "UniParc"] = uniparc_mapping.get(accession, None)

    # Calculate abundance and cleavage abundance
    for i, row in protein_df.iterrows():
        normalized_value = row["Normalized Value"]
        peptide_count_over_cleavages = row["Peptide Count Over Cleavages"]

        abundance = calculate_abundance(normalized_value, total_count_over_length)
        protein_df.at[i, "Abundance"] = float(abundance)

        cleavage_abundance = calculate_cleavage_abundance(
            peptide_count_over_cleavages, total_peptide_count_over_cleavages
        )
        protein_df.at[i, "Cleavage Abundance"] = float(cleavage_abundance)

    return mz_tab, protein_df, peptide_df


# Generate study JSON
def generate_study_json(input_json, experiment_id_key, mztab_file, mz_tab):
    if input_json is None:
        study = {}
    else:
        study = input_json.copy()

    study["experiment_id_key"] = experiment_id_key
    study["experiment_type"] = mz_tab.metadata.get("mzTab-type", "unknown")
    study["experiment_short_title"] = mz_tab.metadata.get("description", "unknown")
    study["sample_name"] = os.path.basename(mztab_file).split(".")[0]

    return study


# Generate study protein JSON
def generate_study_protein(
    protein_df,
    experiment_id_key,
    uparc_mapping,
    total_protein_count,
    total_peptide_count,
):
    proteins = []

    for _, row in protein_df.iterrows():
        cleaned_accession = clean_accession(row["accession"])
        uparc_id = uparc_mapping.get(
            cleaned_accession, None
        )  # Get UniParc ID, or None if not found

        protein = {
            "experiment_id_key": experiment_id_key,
            "Uniprot_id": cleaned_accession,
            # "protein_sequence": row['Sequence'],
            "protein_sequence_length": row["Length"],
            "abundance": row["Abundance"],
            "protein_name": row.get("description", "unknown"),
            "protein_score": row.get("best_search_engine_score[1]", "unknown"),
            "peptide_count": row["Peptide Count"],
            "experiment_protein_count": total_protein_count,
            "experiment_peptide_count": total_peptide_count,
            "peptide_cleavages": row["Peptide Cleavages"],
            "abundance_cleavages": row["Cleavage Abundance"],
            "uparc": uparc_id,
        }
        proteins.append(protein)

    return proteins


# Generate study peptide JSON
def generate_study_peptide(peptide_df, experiment_id_key):
    peptides = []

    for _, row in peptide_df.iterrows():
        spectra_ref = row.get("spectra_ref", "unknown")
        spectra_numb = re.search(r"scan=(\d+)", spectra_ref)

        peptide = {
            "experiment_id_key": experiment_id_key,
            "uniprot_accession": row["accession"],
            "spectrum_number": spectra_numb.group(1),
            "mass": row.get("exp_mass_to_charge", "unknown"),
            "charge": row.get("charge", "unknown"),
            "mz_ratio": row.get("calc_mass_to_charge", "unknown"),
            "peptide_sequence": row["sequence"],
            "peptide_score": row.get("search_engine_score[1]", "unknown"),
            "start_coord": row.get("start", "unknown"),
            "end_coord": row.get("end", "unknown"),
        }
        peptides.append(peptide)

    return peptides


# Save JSON data
def save_json(data, file_path):
    with open(file_path, "w") as json_file:
        json.dump(data, json_file, indent=4)


def main():
    parser = argparse.ArgumentParser(
        description="Parse mzTab, JSON file, and experiment ID to output study files."
    )
    parser.add_argument("file", type=str, help="Path to the experiment file")
    parser.add_argument("experiment_id", type=int, help="Experiment ID")
    parser.add_argument("output_dir", type=str, help="Path to output directory")
    parser.add_argument(
        "--json_file",
        type=str,
        default=None,
        help=" Optional path to the input JSON file",
    )

    args = parser.parse_args()
    if(args.file.split('.')[-1].lower() == "csv"):
        csv_string = open(args.file, 'r', encoding='utf-8').read()
        sample_ids = [row.split(',')[0] for row in csv_string.split("Sample ID")[1].strip().split('\n')[2:] if row.strip() and row.split(',')[0]]
        for sample_id in sample_ids:
            sample_csv = csv_string.split("Sample ID")
            sample_csv[1] = [row for i, row in enumerate(sample_csv[1].split('\n')) if i < 2 or i == len(sample_csv[1].split('\n')) or row.startswith(sample_id) ]

    mz_tab, protein_df, peptide_df = parse_experiment(args.file)

main()