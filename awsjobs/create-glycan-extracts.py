# Import libraries
import json
import requests
import boto3
from botocore.exceptions import ClientError
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a requests session for reuse of connections
session = requests.Session()

# S3 client
s3_client = boto3.client('s3')

# Read all protein ids from protein_id csv file
def get_protein_ids(bucket_name, file_name):
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        return response['Body'].read().decode('utf-8').split(',')
    except (ClientError, Exception) as e:
        logger.exception(f"An error occurred while reading '{file_name}': {e}")
        return []
        
# Create glycan extract
def create_glycan_extract(uniprot_proteins_bucket, protein_id):
    glycan_extract = {}
    glycan_extract_name = f'glycan_extract_{protein_id}.json'
    glycan_extract_path = f'glycan_extracts/{glycan_extract_name}'
    glygen_protein_url = f'https://api.glygen.org/protein/detail/{protein_id}/'
    headers = {'accept':'application/json'}

    try:
        with session.post(glygen_protein_url, headers=headers) as response_glycan:
            if response_glycan.status_code == 200:
                protein_response = response_glycan.json()
                glycosylations = protein_response.get("glycosylation", [])

                # Glycan data
                if glycosylations:
                    glycan_arr = []
                    glytoucan_ac = glycosylations[0].get("glytoucan_ac", "")
                    mass = ''
                    glycan_image_s3_url = ''

                    if glytoucan_ac:
                        # Glycan mass
                        glycan_mass_url = f'https://api.glygen.org/glycan/detail/{glytoucan_ac}/'
                        response_glycan_mass = session.post(glycan_mass_url, headers=headers)
                    
                        if response_glycan_mass.status_code == 200:
                            glytoucans_response = response_glycan_mass.json()
                            mass = glytoucans_response.get("mass", "")

                        # Glycan image
                        glycan_image_name = f'glycan_{protein_id}.png'
                        glycan_image_url = f'https://api.glygen.org/glycan/image/{glytoucan_ac}'
                        response_glycan_image = session.post(glycan_image_url)
                    
                        if response_glycan_image.status_code == 200:
                            glycan_image_s3_url = f'https://{uniprot_proteins_bucket}.s3.amazonaws.com/images/{glycan_image_name}'
                            
                            #temp_image_path, _ = urllib.request.urlretrieve(glycan_image_url)
                            ## Upload the image to S3
                            #s3_client.upload_file(temp_image_path, uniprot_proteins_bucket, f'images/{glycan_image_name}')
                            #os.remove(temp_image_path)
                            #glycan_image_path = f'{uniprot_proteins_bucket}/images/{glycan_image_name}'

                    for glycosylation in glycosylations:
                        residue = glycosylation.get("residue", "")

                        if residue:
                            residue += str(glycosylation.get("start_pos", ""))

                        # Glycan object
                        glycan_obj = {
                            "glytoucan_accession": glytoucan_ac,
                            "type": glycosylation.get("type", ""),
                            "residue": residue,
                            "note": glycosylation.get("comment", ""),
                            "mass": mass,
                            "source": glycosylation.get("evidence", []),
                            "image": glycan_image_s3_url
                        }
                        glycan_arr.append(glycan_obj)

                    # Append to glycans extract
                    glycan_extract["glycans"] = glycan_arr

                    # Save glycan extract to S3 bucket
                    s3_client.put_object(Bucket=uniprot_proteins_bucket, Key=glycan_extract_path, Body=json.dumps(glycan_extract))
                    print(f"{glycan_extract_name} created successfully and saved to {uniprot_proteins_bucket}/{glycan_extract_path}")
                    return protein_id
                else:
                    logger.error(f"No Glycosylation data available for protein id {protein_id}\n")
                    return None
            else:
                logger.error(f"Failed to get glycan data for protein id {protein_id}: HTTP status code {response_glycan.status_code}")
                return None
    except Exception as e:
        logger.exception(f"An error occurred while processing protein ID {protein_id}: {str(e)}")
        return None
    
def main():
    # S3 info
    proteins_reference_bucket = 'proteins-reference'
    uniprot_proteins_bucket = 'uniprot-proteins'

    # Get all protein ids
    protein_ids = get_protein_ids(proteins_reference_bucket, 'protein_ids.csv')
    if not protein_ids:
        print("No protein ids found!")
        return
    
    total_files = len(protein_ids)
    processed_files = completed = failed = 0
    # Create glycan extracts
    with ThreadPoolExecutor() as executor:
        future_to_id = {executor.submit(create_glycan_extract, uniprot_proteins_bucket, protein_id): protein_id for protein_id in protein_ids}
        for future in as_completed(future_to_id):
            protein_id = future_to_id[future]
            try:
                data = future.result()
                if data:
                    completed +=1
                    print(f"Processing of Protein ID {protein_id} completed successfully.")
                else:
                    failed +=1
                    print(f"Processing of Protein ID {protein_id} failed.")
            except Exception as e:
                failed +=1
                logger.exception(f"An error occurred while processing Protein ID {protein_id}: {str(e)}")
                
            # Show stats after processing each Protein ID
            processed_files += 1
            print(f"\nTotal files processed:{processed_files}/{total_files}")
            print(f"Completed:{completed}\tFailed:{failed}\n")

if __name__ == "__main__":
    main()