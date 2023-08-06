# Import libraries
import os
import requests
import boto3
from botocore.exceptions import ClientError
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import urllib.request

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
        content = response['Body'].read().decode('utf-8')
        protein_ids = content.split(',')
        return protein_ids
    except Exception as e:
        logger.exception(f"An error occurred while reading '{file_name}': {str(e)}")
        return None
        
# Create glycan extract and save it to S3 bucket
def create_glycan_extract(glycan_files_bucket, protein_id):
    glycans_extract = {}
    glycan_extract_name = f"glycan_extract_{protein_id}.json"
    # API request URL
    glygen_protein_url = f'https://api.glygen.org/protein/detail/{protein_id}/'
    headers = {
        'accept': 'application/json'
    }

    try:
        with session.post(glygen_protein_url, headers=headers) as response_glycan:
            if response_glycan.status_code == 200:
                protein_response = response_glycan.json()
                glycosylations = protein_response.get("glycosylation", [])

                # Glycan data
                if glycosylations:
                    glycan_arr = []

                    for glycosylation in glycosylations:
                        glytoucan_ac = glycosylation.get("glytoucan_ac", "")
                        mass = ''
                        glycan_image_path = ''
                        residue = glycosylation.get("residue", "")

                        if residue:
                            residue += str(glycosylation.get("start_pos", ""))

                        if glytoucan_ac:
                            # Glycan mass
                            glycan_mass_url = f'https://api.glygen.org/glycan/detail/{glytoucan_ac}/'
                            response_glycan_mass = session.post(glycan_mass_url, headers=headers)
                        
                            if response_glycan_mass.status_code == 200:
                                glytoucans_response = response_glycan_mass.json()
                                mass = glytoucans_response.get("mass", "")

                            # Glycan image
                            glycan_image_url = f'https://api.glygen.org/glycan/image/{glytoucan_ac}'
                            temp_image_path, _ = urllib.request.urlretrieve(glycan_image_url)

                            # Upload the image to S3
                            glycan_image_name = f'images/glycan_{protein_id}.png'
                            s3_client.upload_file(temp_image_path, glycan_files_bucket, glycan_image_name)
                            os.remove(temp_image_path)
                            glycan_image_path = f'{glycan_files_bucket}/{glycan_image_name}'

                        # Glycan object
                        glycan_obj = {
                            "glytoucan_accession": glytoucan_ac,
                            "type": glycosylation.get("type", ""),
                            "residue": residue,
                            "note": glycosylation.get("comment", ""),
                            "mass": mass,
                            "source": glycosylation.get("evidence", []),
                            "image": glycan_image_path
                        }
                        glycan_arr.append(glycan_obj)

                    # Append to glycans extract
                    glycans_extract["glycans"] = glycan_arr

                    # Save Glycan extract to S3
                    response_put = s3_client.put_object(
                        Bucket=glycan_files_bucket,
                        Key=glycan_extract_name,
                        Body=json.dumps(glycans_extract)
                    )
                    if response_put:
                        print(f"{glycan_extract_name} created successfully and saved to S3 bucket {glycan_files_bucket}")
                        return protein_id

                else:
                    print(f"No Glycosylation data available for protein id {protein_id}\n")
                    return None
            else:
                logger.error(f"Failed to get glycan data for protein id {protein_id}: HTTP status code {response_glycan.status_code}")
                return None
    except Exception as e:
        logger.exception(f"An error occurred while processing protein ID {protein_id}: {str(e)}")
        return None
    
def main():
    # S3 buckets
    protein_files_bucket = 'shuv-protein-reference-files'
    glycan_proteins_bucket = 'shuv-glycan-proteins'

    # Get all protein ids
    protein_ids = get_protein_ids(protein_files_bucket, 'protein_ids.csv')
    total_files = len(protein_ids)
    if not protein_ids:
        print("No protein ids found!")
        return

    processed_files = 0
    # Create Glycan extracts using multi-threading
    with ThreadPoolExecutor() as executor:
        future_to_id = {executor.submit(create_glycan_extract, glycan_proteins_bucket, id): id for id in protein_ids}
        for future in as_completed(future_to_id):
            id = future_to_id[future]
            try:
                data = future.result()
                if data:
                    processed_files += 1
                    print(f"Processing of protein ID {id} completed successfully.")
                    print(f"Total files processed: {processed_files}/{total_files}\n")
                else:
                    logger.error(f"Processing of protein ID {id} failed.")
            except Exception as e:
                logger.exception(f"An error occurred while processing protein ID {id}: {str(e)}")

if __name__ == "__main__":
    main()