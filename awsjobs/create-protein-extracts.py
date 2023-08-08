# Import libraries
import json
import boto3
import logging
from botocore.exceptions import ClientError
from concurrent.futures import ThreadPoolExecutor, as_completed

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# S3 client
s3_client = boto3.client('s3')

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

# Read uniprot file content
def read_uniprot_data(bucket_name, file_name):
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

def create_protein_extract(uniprot_data):
    proteins_extract = {}
        
    # ______________________________________________________________________________________________________________________________________________________
    # EXTRACT PRIMARY ACCESSION
    # ______________________________________________________________________________________________________________________________________________________
    
    # Uniprot accession
    primary_accession = uniprot_data.get("primaryAccession", "")

    # Add to proteins extract
    proteins_extract["primary_accession"] = primary_accession

    # ______________________________________________________________________________________________________________________________________________________
    # EXTRACT ENTRY AUDIT
    # ______________________________________________________________________________________________________________________________________________________

    # Audit dates
    first_public_dt = uniprot_data.get("entryAudit", {}).get("firstPublicDate", "")
    last_seq_updt_dt = uniprot_data.get("entryAudit", {}).get("lastSequenceUpdateDate", "")
    
    # Audit object
    audit_obj = {
        "first_public_date": first_public_dt,
        "last_sequence_update_date": last_seq_updt_dt
    }   
    
    # Add to proteins extract
    proteins_extract["entry_audit"] = audit_obj

    # ______________________________________________________________________________________________________________________________________________________
    # EXTRACT PROTEIN DESCRIPTION
    # ______________________________________________________________________________________________________________________________________________________
    
    # Protein names
    protein_reco_name = uniprot_data.get("proteinDescription", {}).get("recommendedName", {}).get("fullName", {}).get("value", "")
    protein_alt_names = uniprot_data.get("proteinDescription", {}).get("alternativeNames", [])
    protein_alt_names_arr = []

    for alt in protein_alt_names:
        alt_name = alt["fullName"]["value"]
        protein_alt_names_arr.append(alt_name)

    # Protein object
    protein_obj = {
        "protein_recommended_name": protein_reco_name,
        "protein_alternative_names": protein_alt_names_arr
    }

    # Add to proteins extract
    proteins_extract["proteins_description"] = protein_obj

    # ______________________________________________________________________________________________________________________________________________________
    # EXTRACT GENE 
    # ______________________________________________________________________________________________________________________________________________________
    
    # Cross reference
    cross_ref = uniprot_data.get("uniProtKBCrossReferences", {})
    
    # Gene Name/Id
    gene_names_arr = []
    gene_ids_arr = []
    
    for ref in cross_ref:
        if ref["database"] == "HGNC":
            if ref['properties'][0]['key'] == 'GeneName':
                gene_name = ref['properties'][0]['value']
                gene_names_arr.append(gene_name)
        if ref["database"] == "GeneID":
            gene_id = ref['id']
            gene_ids_arr.append(gene_id)
    
    # EnsemblG
    ensembl_g = ""
    for ref in cross_ref:
        if ref["database"] == "Ensembl":
            ensembl_gene_id = ref["properties"][1]["value"]
            ensembl_g = ensembl_gene_id.split('.')[0]
            break       

    # Gene object
    gene_obj = {
        "gene_ids": gene_ids_arr,
        "gene_names": gene_names_arr,
        "ensembl_g": ensembl_g
    }

    # Add to proteins extract
    proteins_extract["genes"] = gene_obj

    # ______________________________________________________________________________________________________________________________________________________
    # EXTRACT COMMENTS
    # ______________________________________________________________________________________________________________________________________________________

    # Comments
    if "comments" in uniprot_data:
        comments = uniprot_data["comments"]
        comment_type_filter = ["FUNCTION", "SUBCELLULAR LOCATION", "SUBUNIT", "SIMILARITY", "TISSUE SPECIFICITY", "PTM", "DOMAIN", "MASS SPECTROMETRY"]
        comments_arr = []
        
        # Filter comment type and get comment details
        for filter in comment_type_filter:
            comment_desc_arr = []
    
            for comment in comments:
                # Comment type
                comment_type = comment.get("commentType", '')
    
                # Comment description
                if comment_type == filter:
                    # MASS SPECTROMETRY
                    if(comment_type == 'MASS SPECTROMETRY'):
                        comment_value = comment.get("note", '')  
                        comment_evid = comment_text.get("evidences", [])
    
                        comment_desc_obj = {
                            "description": comment_value,
                            "evidences": comment_evid
                        }
                        comment_desc_arr.append(comment_desc_obj)
    
                    # SUBCELLULAR LOCATION
                    elif(comment_type == 'SUBCELLULAR LOCATION'):
                        if "note" in comment:
                            comment_text = comment["note"].get("texts", [{}])[0] 
                            comment_value = comment_text.get("value", '')
                            comment_evid = comment_text.get("evidences", [])
    
                            comment_desc_obj = {
                                "description": comment_value,
                                "evidences": comment_evid
                            }
                            comment_desc_arr.append(comment_desc_obj)     
                            
                        elif "subcellularLocations" in comment:
                            for loc in comment["subcellularLocations"]:
                                comment_text = loc["location"]
                                comment_value = comment_text.get("value", '')
                                comment_evid = comment_text.get("evidences", [])
    
                                comment_desc_obj = {
                                    "description": comment_value,
                                    "evidences": comment_evid
                                }
                                comment_desc_arr.append(comment_desc_obj)
    
                    # "FUNCTION", "SUBUNIT", "SIMILARITY", "TISSUE SPECIFICITY", "PTM", "DOMAIN"
                    else:
                        comment_text = comment.get("texts", [{}])[0]
                        comment_value = comment_text.get("value", '')   
                        comment_evid = comment_text.get("evidences", [])
    
                        comment_desc_obj = {
                            "description": comment_value,
                            "evidences": comment_evid
                        }
                        comment_desc_arr.append(comment_desc_obj)
    
            # Comment object  
            if comment_desc_arr:
                comment_obj = {
                    "comment_type": filter,
                    "comment_description": comment_desc_arr
                }
                comments_arr.append(comment_obj)
    else:
        comments_arr = []
        
    # Add to proteins extract
    proteins_extract["comments"] = comments_arr
    
    # ______________________________________________________________________________________________________________________________________________________
    # EXTRACT FEATURES
    # ______________________________________________________________________________________________________________________________________________________
    
    # Features
    if "features" in uniprot_data:
        features = uniprot_data["features"]
    
        # Feature/Comment map
        feature_map = {
            "FUNCTION": ["Binding site", "Active site", "Site", "DNA binding"],
            "SUBCELLULAR LOCATION": ["Topological domain", "Transmembrane", "Intramembrane"],
            "SUBUNIT": [],
            "SIMILARITY": [],
            "TISSUE SPECIFICITY": [],
            "PTM": ["Glycosylation", "Modified residue", "Chain", "Disulfide bond", "Signal", "Cross-link", "Initiator methionin", "Lipidation", "Peptide", "Propeptide", "Transit peptide"],
            "DOMAIN": ["Domain", "Region", "Repeat", "Compositional bias", "Motif", "Coiled coil", "Zinc finger"],
            "MASS SPECTROMETRY": []
        }
        features_arr = []
    
        # Map comment type
        for k,v in feature_map.items():
            feature_desc_arr = []
    
            for feature in features:
                # Feature type
                feature_type = feature.get("type", "")
    
                # Feature description
                if feature_type in v:
                    feature_id = feature.get("featureId", "")
                    feature_start_loc = feature.get("location", {}).get("start", {}).get("value", "")
                    feature_end_loc = feature.get("location", {}).get("end", {}).get("value", "")
                    feature_pos = f'{str(feature_start_loc)}-{str(feature_end_loc)}',
                    feature_desc = feature.get("description", ""),
                    feature_evid = feature.get("evidences", [])
    
                    feature_desc_obj = {
                        "type": feature_type,
                        "id": feature_id,
                        "description": feature_desc,
                        "position": feature_pos,
                        "evidences": feature_evid
                    }
                    feature_desc_arr.append(feature_desc_obj)
    
            # Feature object
            if feature_desc_arr:
                feature_obj = {
                    "comment_type": k,
                    "feature_description": feature_desc_arr
                }
                features_arr.append(feature_obj)
    else:
        features_arr = []

    # Add to proteins extract
    proteins_extract["features"] = features_arr

    # ______________________________________________________________________________________________________________________________________________________
    # EXTRACT KEYWORDS
    # ______________________________________________________________________________________________________________________________________________________

    # Keywords
    keywords = uniprot_data.get("keywords", {})
    keyword_arr = []

    # Keywords Id/Name
    for keyword in keywords:
        k_id = f'UniProt:{keyword["id"]}'
        k_name = keyword["name"]

        # Keyword object
        keyword_obj = {
            "id": k_id,
            "keyword": k_name
        }
        keyword_arr.append(keyword_obj)

    # Add to proteins extract
    proteins_extract["keywords"] = keyword_arr

    # ______________________________________________________________________________________________________________________________________________________
    # EXTRACT REFERENCES
    # ______________________________________________________________________________________________________________________________________________________

    # References
    references = uniprot_data.get("references", {})
    references_arr = []
    
    # Reference Database/Id
    for ref in references:
        if "citationCrossReferences" in ref["citation"]:
            database = ref["citation"]["citationCrossReferences"][0]["database"]
            id = ref["citation"]["citationCrossReferences"][0]["id"]

            # Reference object
            ref_obj = {
                "database": database,
                "id": id
            }
            references_arr.append(ref_obj)
    
    # Add to proteins extract
    proteins_extract["references"] = references_arr

    # ______________________________________________________________________________________________________________________________________________________
    # EXTRACT UNIPROT CROSS REFERENCES
    # ______________________________________________________________________________________________________________________________________________________

    # Cross references
    if "uniProtKBCrossReferences" in uniprot_data:
        cross_ref = uniprot_data['uniProtKBCrossReferences']
        cross_ref_arr = []
    
        # "Reactome", "KEGG"
        reference_desc_arr = []
        for ref in cross_ref:
            if ref["database"] in ["Reactome", "KEGG"]:
                reference_id = ref["id"]
                reference_evid = ref.get("evidences", [])        
                reference_val = ref["properties"][0]["value"] if ref["properties"][0]["value"] != '-' else ''
                reference_desc = (f"{ref['database']}:{reference_id} {reference_val}").rstrip()
                comment_type = "Pathways"
    
                # Reference object
                reference_desc_obj = {
                    "description": reference_desc,
                    "evidences": reference_evid                
                }
                reference_desc_arr.append(reference_desc_obj)
    
        # Cross reference object
        if reference_desc_arr:
            reference_obj = {
                "comment_type": comment_type,
                "comment_description": reference_desc_arr,
            }
            cross_ref_arr.append(reference_obj)
    
        # "GO"
        c_comp = []
        b_proc = []
        m_func = []
        for ref in cross_ref:
            if ref["database"] == "GO":
                reference_id = ref["id"]
                reference_evid = ref.get("evidences", [])
                reference_desc = f"{reference_id} {ref['properties'][0]['value'][2:]}"
                reference_desc_0 = ref['properties'][0]['value'][0]
    
                if reference_desc_0 == 'C':
                    c_comp.append({
                        "description": reference_desc,
                        "evidences": reference_evid
                    })
                    
                elif reference_desc_0 == 'P':
                    b_proc.append({
                        "description": reference_desc,
                        "evidences": reference_evid
                    })
    
                elif reference_desc_0 == 'F':
                    m_func.append({
                        "description": reference_desc,
                        "evidences": reference_evid
                    }) 
    
        # Cross reference object
        if c_comp:
            cross_ref_arr.append({
                "comment_type": "Cellular component",
                "comment_description": c_comp,
            })
    
        if b_proc:
            cross_ref_arr.append({
                "comment_type": "Biological process",
                "comment_description": b_proc,
            })
    
        if m_func:
            cross_ref_arr.append({
                "comment_type": "Molecular component",
                "comment_description": m_func,
            })
    else:
        cross_ref_arr = []

    # Add to proteins extract
    proteins_extract["cross_references"] = cross_ref_arr

    # ______________________________________________________________________________________________________________________________________________________
    # EXTRACT UNIPROT CROSS REFERENCE DATABASES
    # ______________________________________________________________________________________________________________________________________________________

    # Cross references
    cross_ref = uniprot_data.get("uniProtKBCrossReferences", {})
        
    # Cross reference databases
    database_arr = {
        "PDB": [],
        "AlphaFoldDB": [],
        "IntAct": [],
        "PeptideAtlas": [],
        "MassIVE": [],
        "PRIDE": [],
        "KEGG": [],
        "GeneCards": [],
        "Ensembl": []
    }
    
    # Cross reference database ids
    for k,v in database_arr.items():
        for ref in cross_ref:
            if ref["database"] == k:
                database_arr[ref["database"]].append(ref["id"])

    # Add to proteins extract
    proteins_extract["cross_reference_databases"] = database_arr

    # ______________________________________________________________________________________________________________________________________________________
    # EXTRACT SEQUENCE
    # ______________________________________________________________________________________________________________________________________________________

    # Sequence details
    sequence_val = uniprot_data.get("sequence", {}).get("value", "")
    sequence_len = uniprot_data.get("sequence", {}).get("length", "")
    sequence_mass = uniprot_data.get("sequence", {}).get("molWeight", "")
    
    # Reference sequence
    cross_ref = uniprot_data.get("uniProtKBCrossReferences", {})
    ref_seq_arr = []
        
    for ref in cross_ref:
        if ref["database"] == "RefSeq":
            ref_sequence = ref["id"]
            ref_seq_arr.append(ref_sequence)
    
    # Sequence object
    sequence_obj = {
        "value": sequence_val,
        "length": sequence_len,
        "mass": sequence_mass,
        "ref_seq": ref_seq_arr
    }

    # Add to proteins extract
    proteins_extract["sequence"] = sequence_obj

    # ______________________________________________________________________________________________________________________________________________________
    # EXTRACT UNIPARC ID
    # ______________________________________________________________________________________________________________________________________________________

    # Uniparc Id
    uniparc_id = uniprot_data.get("extraAttributes", {}).get("uniParcId", "")

    # Add to proteins extract
    proteins_extract["uniparc_id"] = uniparc_id
        
    return proteins_extract
    
# Move files to completed/failed
def move_file_to(bucket_name, source_path, sink_path, file_name):
    try:
        s3_client.copy_object(Bucket=bucket_name, CopySource={'Bucket': bucket_name, 'Key': f'{source_path}/{file_name}'}, Key=f'{sink_path}/{file_name}')
        s3_client.delete_object(Bucket=bucket_name, Key=f'{source_path}/{file_name}')
        print(f'{file_name} moved to {bucket_name}/{sink_path}')
    except ClientError as e:
        logger.exception(f"An error occurred while moving the file {file_name}: {e}")

# Process protein files
def process_protein_files(uniprot_proteins_bucket, protein_id):
    uniprot_file_name = f'{protein_id}.json'
    protein_extract_name = f'protein_extract_{protein_id}.json'
    protein_extract_path = f'protein_extracts/{protein_extract_name}'
    
    # Get uniprot protein data
    uniprot_protein_data = read_uniprot_data(uniprot_proteins_bucket, f'uniprot_protein_files/{uniprot_file_name}')
    
    if uniprot_protein_data:
        print(f"Reading Uniprot protein file {uniprot_file_name} ...")
        
        # Create protein extract
        try:
            protein_extract = create_protein_extract(uniprot_protein_data)

            if protein_extract:
                response_put = s3_client.put_object(
                    Bucket=uniprot_proteins_bucket,
                    Key=protein_extract_path,
                    Body=json.dumps(protein_extract)
                )
                if response_put:
                    print(f'{protein_extract_name} created successfully and saved to {uniprot_proteins_bucket}/{protein_extract_path}')
                    move_file_to(uniprot_proteins_bucket, source_path='uniprot_protein_files', sink_path='uniprot_protein_files/completed', file_name=uniprot_file_name)
                    return True
        except Exception as e:
            logger.exception(f"An error occurred while processing file {uniprot_file_name}: {e}")
            move_file_to(uniprot_proteins_bucket, source_path='uniprot_protein_files', sink_path='uniprot_protein_files/failed', file_name=uniprot_file_name)
    
    return None
        
def main():
    # S3 info
    proteins_reference_bucket = 'proteins-reference'
    uniprot_proteins_bucket = 'uniprot-proteins'

    # Get all protein ids
    protein_ids = get_protein_ids(proteins_reference_bucket, 'protein_ids.csv')
    if protein_ids:
        total_files = len(protein_ids)
    else:
        print("No protein ids found!")
        return
    
    processed_files = 0
    completed = 0
    failed = 0
    # Create protein extracts
    for protein_id in protein_ids:
        try:
            protein_extract = process_protein_files(uniprot_proteins_bucket, protein_id)
            if protein_extract:
                completed +=1
                print(f"Processing of Protein ID {protein_id} completed successfully.")
            else:
                failed +=1
                logger.error(f"Processing of Protein ID {protein_id} failed.")
        except Exception as e:
            failed +=1
            logger.exception(f"An error occurred while processing Protein ID {protein_id}: {str(e)}")

        processed_files += 1
        print(f"\nTotal files processed: {processed_files}/{total_files}")
        print(f"Completed: {completed}\tFailed: {failed}\n")

if __name__ == "__main__":
    main()