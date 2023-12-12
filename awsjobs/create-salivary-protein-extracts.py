# Import libraries
import json
import boto3
from botocore.exceptions import ClientError
import logging
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# S3 client
s3_client = boto3.client('s3')

# S3 bucket
proteins_reference_bucket = 'proteins-reference'

# Atlas data 
# RNA Tissue
rna_s3_path = f"s3://{proteins_reference_bucket}/rna_tissue_consensus.tsv"
rna_tissue_df = pd.read_csv(rna_s3_path, sep='\t', header=0)

# Normal Tissue
normal_s3_path = f"s3://{proteins_reference_bucket}/normal_tissue.tsv"
normal_tissue_df = pd.read_csv(normal_s3_path, sep='\t', header=0)
normal_tissue_df = normal_tissue_df[normal_tissue_df['Level'] != 'Not detected']
normal_tissue_df = normal_tissue_df.groupby(['Gene', 'Gene name', 'Tissue'], as_index=False).agg(','.join)

# Read all protein ids from protein_id csv file
def get_protein_ids(bucket_name, file_name):
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        return response['Body'].read().decode('utf-8').split(',')
    except (ClientError, Exception) as e:
        logger.exception(f"An error occurred while reading '{file_name}': {e}")
        return []

# Read protein extract file content
def read_extract_data(bucket_name, file_name):
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        return json.loads(response['Body'].read().decode('utf-8'))
    except (ClientError, Exception) as e:
        logger.exception(f"An error occurred while reading '{file_name}': {e}")
        return None
    
# Create salivary proteins extract
def create_salivary_protein_extract(protein_extract, glycan_extract):
    data = []
    salivary_protein_extract = {}

    # ______________________________________________________________________________________________________________________________________________________
    # ADD PROTEINS, GLYCANS, ATLAS
    # ______________________________________________________________________________________________________________________________________________________

    # Add "UNIPROT ACCESSION"

    # Add "GENE SYMBOL"
    # Get gene data
    gene_symbol = ''
    gene_ids = protein_extract["genes"].get("gene_ids", [])
    gene_names = protein_extract["genes"].get("gene_names", [])
    
    if len(gene_ids) > 0 and (len(gene_ids) == len(gene_names)):
        for g in range(len(gene_ids)):
            gene_symbol += f'{gene_ids[g]}; {gene_names[g]}'

    # Add "PROTEIN NAME"
    # Add "PROTEIN ALTERNATE NAMES"
    # Add "EXPERT OPINION"
    # Add "PROTEIN SEQUENCE LENGTH"
    # Add "PROTEIN SEQUENCE"
    # Add "REFERENCE SEQUENCE"
    # Add "MASS"
    # Add "PRIMARY GENE NAMES"
    # Add "PROTEIN NAMES"
    # Add "DATABASES" --PDB, AlphaFoldDB, IntAct, PeptideAtlas, MassIVE, PRIDE, Ensembl, KEGG, GeneCards
    # Add "ENSEMBL_G"
    # Add "GLYGEN"
    # Add "CREATED ON"
    # Add "LAST MODIFIED"
    # Add "UNIPARC ID"
    # Add "PLASMA ABUNDANCE"
    # Add "EV ABUNDANCE"
    
    # Add "CITES"
    # Get reference citation data
    citation_arr = []
    citations = protein_extract.get("references", [])

    for citation in citations:
        cite = f'{citation["database"]}:{citation["id"]}'
        citation_arr.append(cite)

    # Add "KEYWORDS"
    # Add "IHC"
    protein_ensembl_g = protein_extract["genes"]["ensembl_g"]
    ihc_level = ''
    if protein_ensembl_g:
        # Filter the DataFrame based on the gene name
        filtered_df = normal_tissue_df[(normal_tissue_df['Gene'] == protein_ensembl_g) & (normal_tissue_df['Tissue'] == 'salivary gland')]
        
        if not filtered_df.empty:
            ihc_level = ','.join(filtered_df['Level'])
        
    # Add "ATLAS"
    atlas_rna_tissues_arr = []
    protein_ensembl_g = protein_extract["genes"]["ensembl_g"]

    if protein_ensembl_g:
        # Filter the DataFrame based on the gene name
        result_rna_df = rna_tissue_df[rna_tissue_df['Gene'] == protein_ensembl_g]
        result_normal_df = normal_tissue_df[normal_tissue_df['Gene'] == protein_ensembl_g]
        
        # Create the JSON object array
        for _, row in result_rna_df.iterrows():
            normal_tissue = result_normal_df[result_normal_df['Tissue'] == row['Tissue']]
            
            atlas_rna_tissues_obj = {
                "tissue": row['Tissue'],
                "nx": str(row['nTPM']),
                "score": ','.join(normal_tissue['Level']),
                "enriched": ','.join(normal_tissue['Reliability'])
            }
            atlas_rna_tissues_arr.append(atlas_rna_tissues_obj)
    
    # Add ANNOTATIONS
    if ("comments" in protein_extract) and ("cross_references" in protein_extract) and ("features" in protein_extract):
        # Get proteins data
        comm = protein_extract["comments"]
        cr_ref = protein_extract["cross_references"]
        feat = protein_extract["features"]
        
        annotation_arr = []
        #comm = comm.extend(cr_ref)
    
        # Annotation object (include all comments)
        for c in comm:
            feat_obj = {}
    
            # Map features with comments
            for f in feat:
                if c["comment_type"] == f["comment_type"]:
                    feat_obj = f.get("feature_description", {})
                    ann_obj = {
                        "annotation_type": c["comment_type"],
                        "annotation_description": c["comment_description"],
                        "features": feat_obj
                    }
                    annotation_arr.append(ann_obj)
    
            if not feat_obj:
                ann_obj = {
                    "annotation_type": c["comment_type"],
                    "annotation_description": c["comment_description"],
                    "features": []
                }
                annotation_arr.append(ann_obj)
    
        for cr in cr_ref:
            ann_obj = {
                "annotation_type": cr["comment_type"],
                "annotation_description": cr["comment_description"],
                "features": []
            }
            annotation_arr.append(ann_obj)
    
        # Annotation object (include all features even if comments not present)
        for f in feat:
            feat_obj = {}
            match = False
            for ann in annotation_arr:
                if f["comment_type"] != ann["annotation_type"]:
                    feat_obj = f.get("feature_description", {})
                else:
                    match = True
                    feat_obj = {}
                    break
    
            if match == False:
                ann_obj = {
                    "annotation_type": f["comment_type"],
                    "annotation_description": [],
                    "features": feat_obj
                }
                annotation_arr.append(ann_obj)
    else:
        annotation_arr = []

    #Add "GLYCANS"
    if glycan_extract:
        glycans = glycan_extract["glycans"]
    else:
        glycans = []

    # ______________________________________________________________________________________________________________________________________________________
    # SALIVARY PROTEINS
    # ______________________________________________________________________________________________________________________________________________________

    # Salivary proteins object
    salivary_protein_obj = {
        "id": protein_extract["primary_accession"],
        "salivary_proteins": {
            "uniprot_accession": protein_extract["primary_accession"],
            "status": protein_extract["status"],
            "gene_symbol": gene_symbol,
            "protein_name": protein_extract["proteins_description"]["protein_recommended_name"],
            "protein_alternate_names": protein_extract["proteins_description"]["protein_alternative_names"],
            "expert_opinion": "",
            "protein_sequence_length": protein_extract["sequence"]["length"],
            "protein_sequence": protein_extract["sequence"]["value"],
            "reference_sequence": protein_extract["sequence"]["ref_seq"],
            "mass": protein_extract["sequence"]["mass"],
            "primary_gene_names": protein_extract["genes"]["gene_names"],
            "protein_names": protein_extract["proteins_description"]["protein_alternative_names"],
            "p_db": protein_extract["cross_reference_databases"]["PDB"],
            "alpha_fold_db": protein_extract["cross_reference_databases"]["AlphaFoldDB"],
            "intact": protein_extract["cross_reference_databases"]["IntAct"],
            "peptide_atlas": protein_extract["cross_reference_databases"]["PeptideAtlas"],
            "massive": protein_extract["cross_reference_databases"]["MassIVE"],
            "pride": protein_extract["cross_reference_databases"]["PRIDE"],
            "ensembl": protein_extract["cross_reference_databases"]["Ensembl"],
            "ensembl_g": protein_extract["genes"]["ensembl_g"],
            "kegg": protein_extract["cross_reference_databases"]["KEGG"],
            "gene_cards": protein_extract["cross_reference_databases"]["GeneCards"],
            "glygen": protein_extract["primary_accession"],
            "created_on": protein_extract["entry_audit"]["first_public_date"],
            "last_modified": protein_extract["entry_audit"]["last_sequence_update_date"],
            "uniparc_id": protein_extract["uniparc_id"],
            "plasma_abundance": "",
            "ev_abundance": "",
            "cites": citation_arr,
            "keywords": protein_extract["keywords"],
            "ihc": ihc_level,
            "atlas": atlas_rna_tissues_arr,
            "annotations": annotation_arr,
            "glycans": glycans
        }
    }
    
    data.append(salivary_protein_obj)
    salivary_protein_extract["data"] = data
    return salivary_protein_extract
    
# Move files to completed/failed
def move_file(bucket_name, source_path, sink_path, file_name):
    try:
        s3_client.copy_object(Bucket=bucket_name, CopySource={'Bucket': bucket_name, 'Key': f'{source_path}/{file_name}'}, Key=f'{sink_path}/{file_name}')
        s3_client.delete_object(Bucket=bucket_name, Key=f'{source_path}/{file_name}')
        print(f'{file_name} moved to {bucket_name}/{sink_path}')
    except ClientError as e:
        logger.exception(f"An error occurred while moving the file {file_name}: {e}")

# Process salivary proteins 
def process_salivary_protein_file(uniprot_proteins_bucket, salivary_proteins_bucket, protein_id):
    protein_extract_name = f'protein_extract_{protein_id}.json'
    glycan_extract_name = f'glycan_extract_{protein_id}.json'
    salivary_protein_extract_name = f'salivary_protein_extract_{protein_id}.json'
    salivary_protein_extract_path = f'salivary_protein_extracts/{salivary_protein_extract_name}'
    
    try:
        # Read protein extract
        print(f'Reading protein extract {protein_extract_name}...')
        protein_extract = read_extract_data(uniprot_proteins_bucket, f'protein_extracts/{protein_extract_name}')
        if not protein_extract:
            print(f'Protein data not found for Protein Id {protein_id}!')
        # Read glycan extract
        print(f'Reading glycan extract {glycan_extract_name}...\n')
        glycan_extract = read_extract_data(uniprot_proteins_bucket, f'glycan_extracts/{glycan_extract_name}')
        if not glycan_extract:
            print(f'Glycan data not found for Protein Id {protein_id}!')
    
        if protein_extract:
            print(f"Creating salivary protein extract {salivary_protein_extract_name}...")
            # Create salivary protein extract
            salivary_protein_extract = create_salivary_protein_extract(protein_extract, glycan_extract)
    
            if salivary_protein_extract:
                # Save to S3 bucket
                s3_client.put_object(Bucket=salivary_proteins_bucket, Key=salivary_protein_extract_path, Body=json.dumps(salivary_protein_extract))
                print(f"{salivary_protein_extract_name} created successfully and saved to {salivary_proteins_bucket}/{salivary_protein_extract_path}")
                # Move protein/glycan extract to completed
                #move_file(uniprot_proteins_bucket, 'protein_extracts', 'protein_extracts/completed', protein_extract_name)
                #move_file(uniprot_proteins_bucket, 'glycan_extracts', 'glycan_extracts/completed', glycan_extract_name)
                return True
        else:
            logger.error(f'File not found for Protein ID {protein_id}: protein_extract/glycan_extract')
    except Exception as e:
        logger.exception(f"An error occurred while processing file {salivary_protein_extract_name}: {e}")

        
    # Move protein/glycan extract to failed
    #move_file(uniprot_proteins_bucket, 'protein_extracts', 'protein_extracts/failed', protein_extract_name)
    #move_file(uniprot_proteins_bucket, 'glycan_extracts', 'glycan_extracts/failed', glycan_extract_name)
    return False

def main():
    # S3 info
    proteins_reference_bucket = 'proteins-reference'
    uniprot_proteins_bucket = 'uniprot-proteins'
    salivary_proteins_bucket = 'hspw-dev-opensearch-upload'
    
    # Get all protein ids
    protein_ids = get_protein_ids(proteins_reference_bucket, 'protein_ids.csv')
    if not protein_ids:
        print("No protein ids found!")
        return
    
    total_files = len(protein_ids)
    processed_files = completed = failed = 0
    # Create salivary protein extracts with multi-threading
    with ThreadPoolExecutor() as executor:
        future_to_id = {executor.submit(process_salivary_protein_file, uniprot_proteins_bucket, salivary_proteins_bucket, protein_id): protein_id for protein_id in protein_ids}
        for future in as_completed(future_to_id):
            protein_id = future_to_id[future]
            try:
                data = future.result()
                if data:
                    completed += 1
                    print(f"Processing of Protein ID {protein_id} completed successfully.")
                else:
                    failed += 1
                    print(f"Processing of Protein ID {protein_id} failed.")
            except Exception as e:
                failed += 1
                logger.exception(f"An error occurred while processing Protein ID {protein_id}: {str(e)}")
                
            # Show stats after processing each Protein ID
            processed_files += 1
            print(f"\nTotal files processed: {processed_files}/{total_files}")
            print(f"Completed:{completed}\tFailed:{failed}\n")
      
if __name__ == "__main__":
    main()