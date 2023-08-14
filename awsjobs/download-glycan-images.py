# Import libraries
import os
import requests
import boto3
from botocore.exceptions import ClientError
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
import urllib.request

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a requests session for reuse of connections
session = requests.Session()

# Initialize S3 client
s3_client = boto3.client("s3")

# Read all protein ids from protein_id csv file
def get_protein_ids(bucket_name, file_name):
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        return response['Body'].read().decode('utf-8').split(',')
    except (ClientError, Exception) as e:
        logger.exception(f"An error occurred while reading '{file_name}': {e}")
        return []

# Download glycan image
def download_glycan_image(bucket_name, folder_name, protein_id):
    glygen_protein_url = f'https://api.glygen.org/protein/detail/{protein_id}/'
    headers = {'accept':'application/json'}

    try:
        with session.post(glygen_protein_url, headers=headers) as response_glycan:
            if response_glycan.status_code == 200:
                protein_response = response_glycan.json()
                glycosylations = protein_response.get("glycosylation", [])

                # Glycan data
                if glycosylations:
                    glytoucan_ac = glycosylations[0].get("glytoucan_ac", "")
                    
                    if glytoucan_ac:
                        glycan_image_name = f'glycan_{protein_id}.png'
                        # Download image
                        glycan_image_url = f'https://api.glygen.org/glycan/image/{glytoucan_ac}'
                        temp_image_path, _ = urllib.request.urlretrieve(glycan_image_url)
    
                        # Save image to S3 bucket
                        s3_client.upload_file(temp_image_path, bucket_name, f'{folder_name}/{glycan_image_name}')
                        os.remove(temp_image_path)
                        print(f"{glycan_image_name} downloaded successfully and saved to {bucket_name}/{folder_name}/{glycan_image_name}")
                        return True
                    else:
                        logger.error(f"Glytoucan accession id not found for protein id {protein_id}\n")
                        return None
                else:
                    logger.error(f"No Glycosylation data available for protein id {protein_id}\n")
                    return None
            else:
                logger.error(f"Failed to download glycan image for protein id {protein_id}: HTTP status code {response_glycan.status_code}")
                return None
    except Exception as e:
        logger.exception(f"An error occurred while processing protein ID {protein_id}: {str(e)}")
        return None

def main():
    # S3 info
    proteins_reference_bucket = 'proteins-reference'
    uniprot_proteins_bucket = 'uniprot-proteins'
    glycan_images_folder = 'images'

    # Get all protein ids
    protein_ids = get_protein_ids(proteins_reference_bucket, 'protein_ids.csv')
    if not protein_ids:
        print("No protein ids found!")
        return

    total_files = len(protein_ids)
    processed_files = downloaded = failed = 0
    # Download glycan images
    with ThreadPoolExecutor() as executor:
        future_to_id = {executor.submit(download_glycan_image, uniprot_proteins_bucket, glycan_images_folder, protein_id): protein_id for protein_id in protein_ids}
        for future in as_completed(future_to_id):
            protein_id = future_to_id[future]
            try:
                data = future.result()
                if data:
                    downloaded += 1
                    print(f"Processing of Protein ID {protein_id} completed successfully.")
                else:
                    failed += 1
                    print(f"Processing of Protein ID {protein_id} failed.")
            except Exception as e:
                failed += 1
                logger.exception(f"An error occurred while processing Protein ID {protein_id}: {str(e)}")
                
            # Show stats after processing each Protein ID
            processed_files += 1
            print(f"\nTotal files downloaded: {processed_files}/{total_files}")
            print(f"Completed: {downloaded}\tFailed: {failed}\n")

if __name__ == "__main__":
    main()