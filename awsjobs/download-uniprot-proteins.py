# Import libraries
import os
import csv
import requests
import boto3
from botocore.exceptions import ClientError
import logging
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
    except Exception as e:
        logger.exception(f"An error occurred while reading '{file_name}': {str(e)}")
        return None

# Download a single file and save it to S3 bucket
def download_and_upload_file(protein_files_bucket, id):
    protein_file_url = f'https://www.uniprot.org/uniprotkb/{id}.json'
    uniprot_file_name = f'uniprot_source_files/{id}.json'
    
    try:
        response = requests.get(protein_file_url)
        if response.status_code == 200:
            json_content = response.content
            response = s3_client.put_object(
                Bucket=protein_files_bucket,
                Key=uniprot_file_name,
                Body=json_content
            )
            if response:
                print(f"Uniprot file {id}.json downloaded successfully to location {protein_files_bucket}/uniprot_source_files/")
            return id
        else:
            logger.error(f"Failed to download {protein_file_url}: HTTP status code {response.status_code}")
            return None
    except Exception as e:
        logger.exception(f"An error occurred while processing protein ID {id}: {str(e)}")
        return None

def main():
    # S3 buckets
    protein_files_bucket = 'shuv-protein-reference-files'
    
    # Get all protein ids
    protein_ids = get_protein_ids(protein_files_bucket, 'protein_ids.csv')
    total_files = len(protein_ids)
    if protein_ids is None:
        print("No protein ids found!")
        return
    
    downloaded_files = 0
    # Download and upload files using multi-threading
    with ThreadPoolExecutor() as executor:
        future_to_id = {executor.submit(download_and_upload_file, protein_files_bucket, id): id for id in protein_ids}
        for future in as_completed(future_to_id):
            id = future_to_id[future]
            try:
                data = future.result()
                if data:
                    downloaded_files += 1
                    print(f"Processing of protein ID {id} completed successfully.")
                    print(f"Total files downloaded: {downloaded_files}/{total_files}\n")
                else:
                    logger.error(f"Processing of protein ID {id} failed.")
            except Exception as e:
                logger.exception(f"An error occurred while processing protein ID {id}: {str(e)}")

if __name__ == "__main__":
    main()