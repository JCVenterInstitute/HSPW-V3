# Import libraries
import json
import boto3
from botocore.exceptions import ClientError
import logging
import pandas as pd

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# S3 client
s3_client = boto3.client('s3')

# Atlas data
s3_path = "s3://shuv-protein-reference-files/rna_tissue_consensus.tsv"
df = pd.read_csv(s3_path, sep='\t', header=0)

# Read all protein ids from protein_id csv file
def get_protein_ids(bucket_name, file_name):
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        content = response['Body'].read().decode('utf-8')
        protein_ids = content.split(',')
        return protein_ids
    except ClientError as e:
        logger.exception(f"An error occurred while reading '{file_name}': {e}")
        return []
    except Exception as e:
        logger.exception(f"An unexpected error occurred: {e}")
        return []

# Read protein extract file content
def read_extract_data(bucket_name, file_name):
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        json_data = json.loads(response['Body'].read().decode('utf-8'))
        return json_data
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            logger.exception(f"Uniprot file {file_name} does not exist!")
        else:
            logger.exception(f"An error occurred while reading the file {file_name} from location {bucket_name}/uniprot_source_files: {e}")
        return None
    except Exception as e:
        logger.exception("An unexpected error occurred:", e)
        return None
    
# Create salivary proteins extract
def create_salivary_protein_extract(protein_extract, glycan_extract):#, atlas_extract):
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
    
    # Add "ATLAS"
    atlas_gene_tissues = []
    protein_ensembl_g = protein_extract["genes"]["ensembl_g"]
    #protein_gene_name = protein_extract["genes"].get("gene_names", [])

    if protein_ensembl_g:
        # Filter the DataFrame based on the gene name
        result_df = df[df['Gene'] == protein_ensembl_g]
        
        # Create the JSON object array
        json_array = []
        for _, row in result_df.iterrows():
            json_obj = {
                "tissue": row['Tissue'],
                "nx": str(row['nTPM']),
                "score": "",
                "enriched": ""
            }
            json_array.append(json_obj)
        
        json_string = json.dumps(json_array)
    
    #if protein_ensembl_g and protein_gene_name:
    #    atlas_ensembl_g = atlas_extract["genes"].get(protein_ensembl_g, {})
    #    atlas_gene_tissues = atlas_ensembl_g.get(protein_gene_name[0], [])
    
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

    # ______________________________________________________________________________________________________________________________________________________
    # SALIVARY PROTEINS
    # ______________________________________________________________________________________________________________________________________________________

    # Salivary proteins object
    salivary_protein_obj = {
        "uniprot_accession": protein_extract["primary_accession"],
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
        "ihc": "",
        "atlas": json_string, #atlas_gene_tissues,
        "annotations": annotation_arr,
        "glycans": glycan_extract["glycans"]
    }
    salivary_protein_extract["salivary_proteins"] = salivary_protein_obj
    return salivary_protein_extract
    
# Move files to completed/failed
def move_file_to(bucket_name, folder_name, file_name):
    try:
        source_key = file_name
        destination_key = f'{folder_name}/{file_name}'
        s3_client.copy_object(Bucket=bucket_name, CopySource={'Bucket': bucket_name, 'Key': source_key}, Key=destination_key)
        s3_client.delete_object(Bucket=bucket_name, Key=source_key)
        print(f"Moved {file_name} to {bucket_name}/{folder_name}")
    except ClientError as e:
        logger.exception(f"An error occurred while moving {file_name}: {e}")

# Process salivary proteins 
def process_salivary_protein_file(protein_files_bucket, protein_id):
    # S3 buckets
    uniprot_proteins_bucket = 'shuv-uniprot-proteins'
    glycan_proteins_bucket = 'shuv-glycan-proteins'
    salivary_proteins_bucket = 'shuv-salivary-proteins'

    # Read protein extract
    protein_extract_name = f"protein_extract_{protein_id}.json"
    print(f"Reading protein extract {protein_extract_name}...")
    protein_extract = read_extract_data(uniprot_proteins_bucket, protein_extract_name)
    
    # Read glycan extract
    glycan_extract_name = f"glycan_extract_{protein_id}.json"
    print(f"Reading glycan extract {glycan_extract_name}...")
    glycan_extract = read_extract_data(glycan_proteins_bucket, glycan_extract_name)
    
    # Read atlas extract
    #atlas_extract_name = f"atlas_extract.json"
    #print(f"Reading atlas extract {atlas_extract_name}...")
    #atlas_extract = read_extract_data(protein_files_bucket, atlas_extract_name)
    
    if protein_extract and glycan_extract: #and atlas_extract:
        # Create salivary protein extract
        salivary_protein_extract_name = f"salivary_protein_extract_{protein_id}.json"
        print(f"Creating salivary protein extract {salivary_protein_extract_name}...")

        try:
            salivary_protein_extract = create_salivary_protein_extract(protein_extract, glycan_extract)#, atlas_extract)
        
            if salivary_protein_extract:
                print(f"Salivary protein extract {salivary_protein_extract_name} created succesfully!")
                
                # Upload salivary protein extract to S3
                response = s3_client.put_object(
                    Bucket=salivary_proteins_bucket,
                    Key=salivary_protein_extract_name,
                    Body=json.dumps(salivary_protein_extract)
                )
                if response:
                    print(f"Saved {salivary_protein_extract_name} to S3 Bucket {salivary_proteins_bucket}")
                    move_file_to(uniprot_proteins_bucket, 'completed', salivary_protein_extract_name)
                    return True
        except Exception as e:
            logger.exception(f"An error occurred while processing file {salivary_protein_extract_name}: {e}")
            move_file_to(uniprot_proteins_bucket, 'failed', salivary_protein_extract_name)

    return False

def main():
    # S3 bucket
    protein_files_bucket = 'shuv-protein-reference-files'
    
    # Get all protein ids
    protein_ids = get_protein_ids(protein_files_bucket, 'protein_ids.csv')

    total_files = len(protein_ids)
    processed_files = 0
    completed = 0
    failed = 0
    
    # Create salivary protein extracts
    for protein_id in protein_ids:
        try:
            salivary_protein_extract = process_salivary_protein_file(protein_files_bucket, protein_id)
            if salivary_protein_extract:
                completed +=1
                print(f"Processing of protein ID {protein_id} completed successfully.")
            else:
                failed +=1
                logger.error(f"Processing of protein ID {protein_id} failed.")
        except Exception as e:
            failed +=1
            logger.exception(f"An error occurred while processing protein ID {protein_id}: {str(e)}")

        processed_files += 1
        print(f"Total files processed: {processed_files}/{total_files}")
        print(f"Completed: {completed}\tFailed: {failed}\n")
        
if __name__ == "__main__":
    main()